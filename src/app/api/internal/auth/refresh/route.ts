import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { env } from "@/env/server";

export async function POST() {
  try {
    const store = await cookies();
    const refreshToken = store.get("refreshToken")?.value || store.get("_rt")?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { message: "No refresh token found" },
        { status: 401 }
      );
    }

    const apiUrl = env.API_BASE_URL || "https://api.staging.open-profile.hng14.com";
    
    const res = await fetch(`${apiUrl}/api/v1/auth/refresh-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        cookie: (() => {
          const rawCookies = store.getAll();
          const normalizedCookies = new Map<string, string>();
          for (const c of rawCookies) {
            let name = c.name;
            if (name === "_at") name = "accessToken";
            if (name === "_rt") name = "refreshToken";
            if (!normalizedCookies.has(name) || (c.name === "accessToken" || c.name === "refreshToken")) {
              normalizedCookies.set(name, c.value);
            }
          }
          return Array.from(normalizedCookies.entries())
            .map(([k, v]) => `${k}=${v}`)
            .join("; ");
        })(),
      },
      body: JSON.stringify({ refreshToken }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      // If refresh fails, clear cookies so the user is truly logged out
      store.delete("accessToken");
      store.delete("refreshToken");
      store.delete("_at");
      store.delete("_rt");
      store.delete("auth");
      return NextResponse.json(data, { status: res.status });
    }

    let accessToken = data.accessToken || data.data?.accessToken;
    let newRefreshToken = data.refreshToken || data.data?.refreshToken;

    const setCookies = res.headers.getSetCookie?.() || [];
    for (const cookie of setCookies) {
      if (cookie.startsWith("accessToken=") || cookie.startsWith("_at=")) {
        const fullValue = cookie.split(";")[0];
        accessToken = fullValue.substring(fullValue.indexOf("=") + 1);
      }
      if (cookie.startsWith("refreshToken=") || cookie.startsWith("_rt=")) {
        const fullValue = cookie.split(";")[0];
        newRefreshToken = fullValue.substring(fullValue.indexOf("=") + 1);
      }
    }

    // Do not spread tokens into the JSON response body to avoid leaking them to the client (CR6)
    delete data.accessToken;
    delete data.refreshToken;
    if (data.data) {
      delete data.data.accessToken;
      delete data.data.refreshToken;
    }

    const response = NextResponse.json({ success: true, ...data });

    if (accessToken) {
      store.set("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 15 * 60, // 15 mins
      });
      store.set("auth", "1", {
        path: "/",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60,
      });
    }

    if (newRefreshToken) {
      store.set("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 7 * 24 * 60 * 60, // 7 days
      });
    }

    return response;
  } catch (err) {
    console.error("[Next API] Refresh token error:", err);
    return NextResponse.json(
      { message: "Internal server error during refresh" },
      { status: 500 }
    );
  }
}

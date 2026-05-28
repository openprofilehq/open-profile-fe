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
        cookie: store.getAll().map(c => {
          let name = c.name;
          if (name === "_at") name = "accessToken";
          if (name === "_rt") name = "refreshToken";
          return `${name}=${c.value}`;
        }).join("; "),
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
      if (cookie.startsWith("accessToken=")) {
        accessToken = cookie.split(";")[0].split("=")[1];
      }
      if (cookie.startsWith("refreshToken=")) {
        newRefreshToken = cookie.split(";")[0].split("=")[1];
      }
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

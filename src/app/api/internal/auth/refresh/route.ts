import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { env } from "@/env/server";
import { parseSetCookie } from "@/lib/cookie-utils";

export async function POST() {
  try {
    const store = await cookies();
    const refreshToken =
      store.get("refreshToken")?.value || store.get("_rt")?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { message: "No refresh token found" },
        { status: 401 }
      );
    }

    const apiUrl =
      env.API_BASE_URL || "https://api.staging.open-profile.hng14.com";

    const res = await fetch(`${apiUrl}/api/v1/auth/refresh-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        cookie: store
          .getAll()
          .map((c) => {
            let name = c.name;
            if (name === "_at") name = "accessToken";
            if (name === "_rt") name = "refreshToken";
            return `${name}=${c.value}`;
          })
          .join("; "),
      },
      body: JSON.stringify({ refreshToken }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const response = NextResponse.json(data, { status: res.status });
      // Clear all auth cookies on the response
      for (const name of [
        "accessToken",
        "refreshToken",
        "_at",
        "_rt",
        "auth",
      ]) {
        response.cookies.delete(name);
        // Also expire any domain-scoped copies
        if (env.COOKIE_DOMAIN) {
          response.headers.append(
            "Set-Cookie",
            `${name}=; Domain=${env.COOKIE_DOMAIN}; Path=/; Max-Age=0; HttpOnly; SameSite=Lax`
          );
        }
      }
      return response;
    }

    // Do not spread tokens into the JSON response body
    delete data.accessToken;
    delete data.refreshToken;
    if (data.data) {
      delete data.data.accessToken;
      delete data.data.refreshToken;
    }

    const response = NextResponse.json({ success: true, ...data });

    // Use parseSetCookie + response.cookies.set() — same approach as the proxy,
    // so cookies land on the FE domain without a domain attribute.
    const setCookies = res.headers.getSetCookie?.() || [];
    let gotAccessToken = false;

    for (const cookieStr of setCookies) {
      const { name, value, cookieOptions } = parseSetCookie(cookieStr);
      delete cookieOptions.domain;
      response.cookies.set(name, value, cookieOptions);
      if (name === "accessToken") gotAccessToken = true;

      // Expire any old domain-scoped copy of this cookie
      if (env.COOKIE_DOMAIN) {
        response.headers.append(
          "Set-Cookie",
          `${name}=; Domain=${env.COOKIE_DOMAIN}; Path=/; Max-Age=0; HttpOnly; SameSite=Lax`
        );
      }
    }

    if (gotAccessToken) {
      response.cookies.set("auth", "1", {
        path: "/",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60,
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

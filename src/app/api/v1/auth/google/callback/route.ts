import { type NextRequest, NextResponse } from "next/server";
import { env } from "@/env/server";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const accessToken = searchParams.get("accessToken");
  const refreshToken = searchParams.get("refreshToken");

  if (accessToken && refreshToken) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  const code = searchParams.get("code");
  if (!code) {
    return NextResponse.redirect(
      new URL("/login?error=missing_code", request.url)
    );
  }

  const callbackUrl = new URL(
    `${env.API_BASE_URL}/api/v1/auth/google/callback`
  );
  callbackUrl.searchParams.set("code", code);

  const res = await fetch(callbackUrl, { redirect: "manual" });

  const response = NextResponse.redirect(new URL("/dashboard", request.url));

  const setCookies = res.headers.getSetCookie?.() || [];
  for (const cookieStr of setCookies) {
    let safeCookie = cookieStr.replace(/;\s*domain=[^;]+/i, '');
    if (process.env.NODE_ENV !== "production") {
      safeCookie = safeCookie.replace(/;\s*secure/i, '');
    }
    response.headers.append("set-cookie", safeCookie);
  }

  return response;
}

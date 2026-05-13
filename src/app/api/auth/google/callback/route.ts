import { type NextRequest, NextResponse } from "next/server";
import { env } from "@/env/server";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  // Some backends redirect with tokens directly in query params, but we rely on backend cookies now.
  const accessToken = searchParams.get("accessToken");
  const refreshToken = searchParams.get("refreshToken");

  if (accessToken && refreshToken) {
    // If we transition to pure backend cookies, the backend should set them before this redirect.
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Otherwise, exchange the code with the backend
  const code = searchParams.get("code");
  if (!code) {
    return NextResponse.redirect(
      new URL("/login?error=missing_code", request.url)
    );
  }

  const callbackUrl = new URL(`${env.API_BASE_URL}/api/auth/google/callback`);
  callbackUrl.searchParams.set("code", code);

  // External fetch doesn't share cookies unless we handle it,
  // but usually the backend callback endpoint sets cookies in the Response it returns to the USER'S browser.
  // If this server function is a PROXY, we need to handle cookie forwarding.

  const res = await fetch(callbackUrl, { redirect: "manual" });

  // If the backend sets cookies, they will be in the response headers.
  // A standard redirect would pass them back if we return a response with those headers.

  const response = NextResponse.redirect(new URL("/dashboard", request.url));

  // Forward Set-Cookie headers from backend to browser
  const setCookie = res.headers.get("set-cookie");
  if (setCookie) {
    response.headers.set("set-cookie", setCookie);
  }

  return response;
}

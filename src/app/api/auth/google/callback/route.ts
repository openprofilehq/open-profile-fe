import { type NextRequest, NextResponse } from "next/server";
import { createSession } from "@/lib/session";
import { extractTokensFromResponse } from "@/lib/api";
import { env } from "@/env/server";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  // Some backends redirect with tokens directly in query params
  const accessToken = searchParams.get("accessToken");
  const refreshToken = searchParams.get("refreshToken");

  if (accessToken && refreshToken) {
    await createSession({ accessToken, refreshToken });
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

  const res = await fetch(callbackUrl, { redirect: "manual" });

  const tokens = extractTokensFromResponse(res.headers);
  if (tokens.accessToken && tokens.refreshToken) {
    await createSession({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.redirect(
    new URL("/login?error=google_auth_failed", request.url)
  );
}

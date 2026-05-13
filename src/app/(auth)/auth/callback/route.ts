import { type NextRequest, NextResponse } from "next/server";
import { createSession } from "@/lib/session";

/**
 * GET /auth/callback?accessToken=<jwt>&refreshToken=<jwt>
 *
 * Requires the backend FRONTEND_URL to point here so it redirects with
 * accessToken and refreshToken as query params after Google OAuth.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const accessToken = searchParams.get("accessToken");
  const refreshToken = searchParams.get("refreshToken");

  if (!accessToken || !refreshToken) {
    return NextResponse.redirect(
      new URL("/login?error=missing_tokens", request.url)
    );
  }

  await createSession({ accessToken, refreshToken });
  return NextResponse.redirect(new URL("/dashboard", request.url));
}

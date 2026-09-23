import { NextResponse, type NextProxy } from "next/server";
import { env } from "@/env/server";

const SECURITY_HEADERS: Record<string, string> = {
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
};

export const proxy: NextProxy = (request) => {
  const requestId = request.headers.get("x-request-id") ?? crypto.randomUUID();
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-request-id", requestId);

  let anonymousIdToSet: string | null = null;
  if (
    !request.cookies.has("anonymous_id") &&
    !request.cookies.has("accessToken")
  ) {
    anonymousIdToSet = crypto.randomUUID();
    const existingCookie = request.headers.get("cookie");
    requestHeaders.set(
      "cookie",
      existingCookie
        ? `${existingCookie}; anonymous_id=${anonymousIdToSet}`
        : `anonymous_id=${anonymousIdToSet}`
    );
  }

  const response = NextResponse.next({ request: { headers: requestHeaders } });

  if (anonymousIdToSet) {
    response.cookies.set("anonymous_id", anonymousIdToSet, {
      path: "/",
      sameSite: "lax",
      httpOnly: true,
      maxAge: 365 * 24 * 60 * 60, // 1 year
      ...(env.COOKIE_DOMAIN ? { domain: env.COOKIE_DOMAIN } : {}),
    });
  }

  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    response.headers.set(key, value);
  }
  response.headers.set("x-request-id", requestId);

  return response;
};

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico|woff|woff2|ttf|eot)$).*)",
  ],
};

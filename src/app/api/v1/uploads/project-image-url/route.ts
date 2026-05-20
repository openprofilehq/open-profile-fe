import { NextRequest, NextResponse } from "next/server";
import { env } from "@/env/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const apiUrl = `${env.API_BASE_URL}/api/v1/uploads/project-image-url`;

    // Forward auth cookies and Authorization header when present so upstream
    // can authenticate this request (the signed upload URL is typically
    // behind an authenticated endpoint).
    const outgoingHeaders: Record<string, string> = {
      "Content-Type": "application/json",
    };
    const incomingCookie = request.headers.get("cookie");
    if (incomingCookie) outgoingHeaders["cookie"] = incomingCookie;
    const incomingAuth = request.headers.get("authorization");
    if (incomingAuth) outgoingHeaders["authorization"] = incomingAuth;

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: outgoingHeaders,
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(15_000),
    });

    const text = await response.text();
    const contentType = response.headers.get("content-type") || "application/json";

    return new NextResponse(text, {
      status: response.status,
      headers: {
        "content-type": contentType,
      },
    });
  } catch (err) {
    return NextResponse.json(
      { message: "Upload URL service unavailable" },
      { status: 502 }
    );
  }
}

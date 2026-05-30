import { type NextRequest, NextResponse } from "next/server";
import { env } from "@/env/server";
import { parseSetCookie } from "@/lib/cookie-utils";
import { cookies } from "next/headers";

/**
 * Catch-all proxy: forwards all /api/v1/* requests to the upstream API,
 * copying request/response cookies so SameSite=Strict cookies work from localhost.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return proxyRequest(request, await params);
}
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return proxyRequest(request, await params);
}
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return proxyRequest(request, await params);
}
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return proxyRequest(request, await params);
}
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return proxyRequest(request, await params);
}

async function proxyRequest(
  request: NextRequest,
  { path }: { path: string[] }
) {
  const upstreamUrl = new URL(`${env.API_BASE_URL}/api/v1/${path.join("/")}`);
  request.nextUrl.searchParams.forEach((v, k) =>
    upstreamUrl.searchParams.set(k, v)
  );

  const store = await cookies();
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
  const cookieHeader = Array.from(normalizedCookies.entries())
    .map(([k, v]) => `${k}=${v}`)
    .join("; ");

  const contentType = request.headers.get("content-type") ?? "";
  const body =
    request.method === "GET" || request.method === "DELETE"
      ? undefined
      : await request.arrayBuffer();

  let upstream: Response;
  try {
    upstream = await fetch(upstreamUrl, {
      method: request.method,
      headers: {
        ...(contentType ? { "content-type": contentType } : {}),
        ...(cookieHeader ? { cookie: cookieHeader } : {}),
      },
      body: body && body.byteLength > 0 ? body : undefined,
      signal: AbortSignal.timeout(60_000),
    });
  } catch (error) {
    console.error("[API Proxy] upstream error:", (error as Error).message);
    return NextResponse.json(
      { message: "Upstream request failed." },
      { status: 502 }
    );
  }

  const data = await upstream.arrayBuffer();
  const response = new NextResponse(data, {
    status: upstream.status,
    headers: {
      "content-type":
        upstream.headers.get("content-type") ?? "application/json",
    },
  });

  // Forward Set-Cookie headers properly using getSetCookie() to prevent comma-merging
  const setCookies = upstream.headers.getSetCookie?.() || [];
  let loginSuccess = false;
  for (const cookieStr of setCookies) {
    const { name, value, cookieOptions } = parseSetCookie(cookieStr);
    delete cookieOptions.domain;

    let finalName = name;
    if (name === "_at") finalName = "accessToken";
    if (name === "_rt") finalName = "refreshToken";

    response.cookies.set(finalName, value, cookieOptions);
    if (finalName === "accessToken") loginSuccess = true;
  }

  if (loginSuccess) {
    response.cookies.set("auth", "1", {
      path: "/",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });
  }

  const excludedHeaders = [
    "set-cookie",
    "content-encoding",
    "content-length",
    "transfer-encoding",
    "content-type",
  ];
  upstream.headers.forEach((value, key) => {
    if (!excludedHeaders.includes(key.toLowerCase())) {
      response.headers.append(key, value);
    }
  });

  return response;
}

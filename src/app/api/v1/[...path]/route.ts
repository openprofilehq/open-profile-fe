import { type NextRequest, NextResponse } from "next/server";
import { env } from "@/env/server";

/**
 * Catch-all proxy: forwards all /api/v1/* requests to the upstream API,
 * copying request/response cookies so SameSite=Strict cookies work from localhost.
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return proxyRequest(request, await params);
}
export async function POST(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return proxyRequest(request, await params);
}
export async function PUT(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return proxyRequest(request, await params);
}
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return proxyRequest(request, await params);
}
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return proxyRequest(request, await params);
}

async function proxyRequest(request: NextRequest, { path }: { path: string[] }) {
  const upstreamUrl = new URL(`${env.API_BASE_URL}/api/v1/${path.join("/")}`);
  request.nextUrl.searchParams.forEach((v, k) => upstreamUrl.searchParams.set(k, v));

  const { cookies } = await import("next/headers");
  const store = await cookies();
  const cookieHeader = store.getAll().map((c) => `${c.name}=${c.value}`).join("; ");

  const contentType = request.headers.get("content-type") ?? "";
  const body = request.method === "GET" || request.method === "DELETE" ? undefined : await request.arrayBuffer();

  const upstream = await fetch(upstreamUrl, {
    method: request.method,
    headers: {
      ...(contentType ? { "content-type": contentType } : {}),
      ...(cookieHeader ? { cookie: cookieHeader } : {}),
    },
    body: body && body.byteLength > 0 ? body : undefined,
  });

  const data = await upstream.arrayBuffer();
  const response = new NextResponse(data, {
    status: upstream.status,
    headers: { "content-type": upstream.headers.get("content-type") ?? "application/json" },
  });

  function parseSetCookie(cookieStr: string) {
    const parts = cookieStr.split(';');
    const [nameValue, ...options] = parts;
    const [name, ...valueParts] = nameValue.split('=');
    const value = valueParts.join('=');
    
    const cookieOptions: Record<string, unknown> = {};
    for (const opt of options) {
      const [optName, optVal] = opt.trim().split('=');
      const key = optName.toLowerCase();
      if (key === 'max-age') cookieOptions.maxAge = parseInt(optVal);
      if (key === 'path') cookieOptions.path = optVal;
      // Ignore domain to allow the browser to set it to the frontend domain
      // if (key === 'domain') cookieOptions.domain = optVal;
      if (key === 'secure') cookieOptions.secure = process.env.NODE_ENV === "production";
      if (key === 'httponly') cookieOptions.httpOnly = true;
      if (key === 'samesite') cookieOptions.sameSite = optVal.toLowerCase() as 'lax' | 'strict' | 'none';
    }
    return { name: name.trim(), value: value.trim(), cookieOptions };
  }

  // Forward Set-Cookie headers properly using getSetCookie() to prevent comma-merging
  const setCookies = upstream.headers.getSetCookie?.() || [];
  for (const cookieStr of setCookies) {
    const { name, value, cookieOptions } = parseSetCookie(cookieStr);
    response.cookies.set(name, value, cookieOptions);
  }

  upstream.headers.forEach((value, key) => {
    if (key.toLowerCase() !== "set-cookie") {
      response.headers.append(key, value);
    }
  });

  return response;
}

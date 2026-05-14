import { type NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { env } from "@/env/server";

async function handler(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const upstream = new URL(`/api/${path.join("/")}`, env.API_BASE_URL);

  // Forward query params
  request.nextUrl.searchParams.forEach((value, key) => {
    upstream.searchParams.set(key, value);
  });

  const store = await cookies();
  const cookieHeader = store
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  const headers = new Headers();
  headers.set(
    "content-type",
    request.headers.get("content-type") ?? "application/json"
  );
  if (cookieHeader) headers.set("cookie", cookieHeader);

  const body =
    request.method !== "GET" && request.method !== "HEAD"
      ? await request.text()
      : undefined;

  const res = await fetch(upstream, {
    method: request.method,
    headers,
    body,
  });

  const data = await res.text();

  const response = new NextResponse(data, {
    status: res.status,
    headers: {
      "content-type": res.headers.get("content-type") ?? "application/json",
    },
  });

  // Forward any set-cookie headers from backend
  res.headers.forEach((value, key) => {
    if (key.toLowerCase() === "set-cookie") {
      response.headers.append("set-cookie", value);
    }
  });

  return response;
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;

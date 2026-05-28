import { type NextRequest, NextResponse } from "next/server";
import { env } from "@/env/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();

    const upstreamUrl = `${env.API_BASE_URL}/api/v1/auth/login`;
    // console.log(`[Login Proxy] Attempting to connect to: ${upstreamUrl}`);

    const upstream = await fetch(upstreamUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    });

    const data = await upstream.json();
    const response = NextResponse.json(data, { status: upstream.status });

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
  } catch (error) {
    const err = error as Error;
    console.error("[Login Proxy] Network/Fetch Error:", err.message);
    return NextResponse.json(
      { 
        message: "The proxy failed to connect to the backend server. The backend might be offline.", 
        error: err.message 
      }, 
      { status: 502 }
    );
  }
}

import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { accessToken, refreshToken, action } = body;

    const response = NextResponse.json({ success: true });
    const store = await cookies();

    if (action === "logout") {
      store.delete("accessToken");
      store.delete("refreshToken");
      store.delete("_at");
      store.delete("_rt");
      store.delete("auth");
      return response;
    }

    if (accessToken) {
      store.set("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 15 * 60, // 15 mins matching standard access token
      });
      store.set("auth", "1", {
        path: "/",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60, // 7 days (ui state maxes out at refresh token lifespan)
      });
    }

    if (refreshToken) {
      store.set("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 7 * 24 * 60 * 60, // 7 days
      });
    }

    return response;
  } catch (_err) {
    return NextResponse.json(
      { success: false, message: "Invalid request" },
      { status: 400 }
    );
  }
}

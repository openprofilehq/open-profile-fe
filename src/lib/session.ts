import "server-only";
import { cookies } from "next/headers";

const COOKIE_NAME = "session_v2";
const EXPIRES_IN = 7 * 24 * 60 * 60 * 1000; // 7 days

export type SessionData = {
  accessToken: string;
  refreshToken: string;
};

export async function createSession(data: SessionData) {
  const store = await cookies();
  store.set(COOKIE_NAME, JSON.stringify(data), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: new Date(Date.now() + EXPIRES_IN),
    path: "/",
  });
}

export async function deleteSession() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export async function getSession(): Promise<SessionData | null> {
  const store = await cookies();
  const raw = store.get(COOKIE_NAME)?.value;
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SessionData;
  } catch {
    return null;
  }
}

export function decrypt(token: string) {
  // TODO: implement actual decryption/verification
  return { userId: token };
}

"use server";

import { cookies } from "next/headers";
import { env } from "@/env/server";
import { parseSetCookie } from "@/lib/cookie-utils";

export async function syncCookiesAction(cookieStrings: string[]) {
  if (!cookieStrings || cookieStrings.length === 0) return;

  const store = await cookies();
  for (const cookieStr of cookieStrings) {
    if (!cookieStr) continue;
    const { name, value, cookieOptions } = parseSetCookie(cookieStr);
    if (!name) continue;

    if (env.COOKIE_DOMAIN) {
      cookieOptions.domain = env.COOKIE_DOMAIN;
    } else {
      delete cookieOptions.domain;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    store.set(name, value, cookieOptions as any);
  }
}

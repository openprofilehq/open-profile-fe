"use client";

import { useEffect, useRef } from "react";
import { syncCookiesAction } from "@/app/actions/cookie";

interface CookieRelayProps {
  setCookies?: string[];
}

export default function CookieRelay({ setCookies }: CookieRelayProps) {
  const syncedRef = useRef(false);

  useEffect(() => {
    if (syncedRef.current || !setCookies || setCookies.length === 0) return;
    syncedRef.current = true;

    // Immediately set non-HttpOnly cookies via document.cookie if feasible
    for (const cookieStr of setCookies) {
      if (!/httponly/i.test(cookieStr)) {
        try {
          document.cookie = cookieStr;
        } catch {
          // ignore any parsing/document errors
        }
      }
    }

    // Call server action to relay all cookies (including HttpOnly) via HTTP headers
    syncCookiesAction(setCookies).catch(() => undefined);
  }, [setCookies]);

  return null;
}

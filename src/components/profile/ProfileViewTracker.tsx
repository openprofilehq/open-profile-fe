"use client";

import { useEffect, useRef } from "react";
import { recordProfileView } from "@/api/events/events.service";

export default function ProfileViewTracker({ username }: { username: string }) {
  const sentRef = useRef(false);

  useEffect(() => {
    if (sentRef.current) return;
    sentRef.current = true;

    const params = new URLSearchParams(window.location.search);

    recordProfileView({
      username,
      src: params.get("src") ?? undefined,
      referrerSearchId: params.get("referrerSearchId") ?? undefined,
      referrer: document.referrer || undefined,
    }).catch(() => undefined);
  }, [username]);

  return null;
}

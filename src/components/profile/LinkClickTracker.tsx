"use client";

import { useEffect } from "react";
import { recordLinkClick } from "@/api/events/events.service";

export const LINK_CLICK_ATTRIBUTE = "data-op-link";

export default function LinkClickTracker({ username }: { username: string }) {
  useEffect(() => {
    function handleClick(event: MouseEvent) {
      const target = event.target as HTMLElement | null;
      const anchor = target?.closest?.(`[${LINK_CLICK_ATTRIBUTE}]`);
      const linkUrl = anchor?.getAttribute(LINK_CLICK_ATTRIBUTE);

      if (!linkUrl) return;

      recordLinkClick({ username, linkUrl }).catch(() => undefined);
    }

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [username]);

  return null;
}

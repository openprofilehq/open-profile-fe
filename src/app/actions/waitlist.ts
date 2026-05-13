"use server";

import { apiFetch } from "@/lib/api";

function extractError(data: Record<string, unknown>, fallback: string): string {
  const msg = data.message;
  if (Array.isArray(msg)) {
    return msg
      .map((m) =>
        typeof m === "object" && m !== null
          ? ((m as Record<string, unknown>).error ?? JSON.stringify(m))
          : String(m)
      )
      .join(" ");
  }
  if (typeof msg === "string") return msg;
  if (typeof data.error === "string") return data.error;
  return fallback;
}

export type WaitlistActionState =
  | { error?: string; success?: boolean }
  | undefined;

export async function joinWaitlistAction(
  _prev: WaitlistActionState,
  formData: FormData
): Promise<WaitlistActionState> {
  const email = formData.get("email") as string;

  if (!email) return { error: "Email is required." };

  const res = await apiFetch("/api/waitlist", {
    method: "POST",
    body: { email },
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    return { error: extractError(data, "Failed to join waitlist.") };
  }

  return { success: true };
}

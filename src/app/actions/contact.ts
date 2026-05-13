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

export type ContactActionState = { error?: string; success?: boolean } | undefined;

export async function contactAction(
  _prev: ContactActionState,
  formData: FormData
): Promise<ContactActionState> {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const industry = formData.get("industry") as string;
  const message = formData.get("message") as string;

  if (!name || !email || !message)
    return { error: "Please fill in all required fields." };

  const res = await apiFetch("/api/contact", {
    method: "POST",
    body: { name, email, industry: industry || undefined, message },
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    return { error: extractError(data, "Failed to send message. Please try again.") };
  }

  return { success: true };
}
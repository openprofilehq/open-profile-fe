"use server";
import { createSession, deleteSession } from "@/lib/session";
import { apiFetch, extractTokensFromResponse } from "@/lib/api";
import { redirect } from "next/navigation";

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

export type AuthState = { error?: string; redirectTo?: string } | undefined;
export type AuthAction = {
  status?: string;
  resetToken?: string;
  error?: string;
  redirectTo?: string;
  success?: boolean;
};

/** Called by AuthForm after a successful client-side login/signup mutation */
export async function createSessionAction(tokens: {
  accessToken: string;
  refreshToken: string;
}) {
  await createSession(tokens);
}

export async function deleteSessionAction() {
  await deleteSession();
  redirect("/login");
}

export async function forgotPassword(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = formData.get("email") as string;
  if (!email) return { error: "Email is required." };

  const res = await apiFetch("/api/auth/forgot-password", {
    method: "POST",
    body: { email },
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    return { error: extractError(data, "Failed to send reset email.") };
  }

  return {
    redirectTo: `/forgot-password/verify?email=${encodeURIComponent(email)}`,
  };
}

export async function verifyResetOtp(
  _prev: AuthState,
  formData: FormData
): Promise<AuthAction> {
  const email = formData.get("email") as string;
  const otp = formData.get("otp") as string;

  if (!email || !otp)
    return { status: "error", error: "Missing email or code." };

  const res = await apiFetch("/api/auth/verify-reset-otp", {
    method: "POST",
    body: { email, otp },
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    return {
      status: "error",
      error: extractError(data, "Verification failed."),
    };
  }
  const data = await res.json();

  return {
    status: "success",
    resetToken: data.resetToken,
    redirectTo: `/forgot-password/reset?token=${encodeURIComponent(data.resetToken)}&email=${encodeURIComponent(email)}`,
  };
}

export async function resetPassword(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const resetToken = formData.get("resetToken") as string;
  const newPassword = formData.get("newPassword") as string;

  if (!resetToken || !newPassword) return { error: "Missing required fields." };

  const res = await apiFetch("/api/auth/reset-password", {
    method: "POST",
    body: { resetToken, newPassword },
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    return { error: extractError(data, "Password reset failed.") };
  }

  return { redirectTo: "/forgot-password/success" };
}

export async function resendOtp(
  _prev: AuthState,
  formData: FormData
): Promise<AuthAction> {
  const email = formData.get("email") as string;
  if (!email) return { error: "Email is required." };

  const res = await apiFetch("/api/auth/resend-otp", {
    method: "POST",
    body: { email },
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    return { error: extractError(data, "Failed to resend OTP.") };
  }

  return res.json();
}

export async function verifyEmailOtp(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = formData.get("email") as string;
  const otp = formData.get("otp") as string;

  if (!email || !otp) return { error: "Missing email or code." };

  const res = await apiFetch("/api/auth/verify-otp", {
    method: "POST",
    body: { email, otp },
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    return { error: extractError(data, "Verification failed.") };
  }

  return { redirectTo: "/verify-email/success" };
}

export async function logout() {
  await apiFetch("/api/auth/logout", { method: "POST" }).catch(() => {});
  await deleteSession();
  redirect("/login");
}

export async function refreshToken() {
  const { getSession } = await import("@/lib/session");
  const session = await getSession();

  if (!session?.refreshToken) return { error: "No refresh token available." };

  const res = await apiFetch("/api/auth/refresh", {
    method: "POST",
    body: { refreshToken: session.refreshToken },
  });

  if (!res.ok) return { error: "Session expired." };

  const { accessToken, refreshToken: newRefreshToken } = await res.json();
  await createSession({ accessToken, refreshToken: newRefreshToken });
  return { success: true };
}

// Keep for Google OAuth callback
export { extractTokensFromResponse };

"use server";
import { createSession, deleteSession } from "@/lib/session";
import { apiFetch, extractTokensFromResponse } from "@/lib/api";

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

export async function emailSignup(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const fullName = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!fullName || !email || !password)
    return { error: "All fields are required." };

  const res = await apiFetch("/api/auth/register", {
    method: "POST",
    body: { fullName, email, password },
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    console.error(
      "[signup] status:",
      res.status,
      "body:",
      JSON.stringify(data)
    );
    return { error: extractError(data, "Signup failed.") };
  }

  return { redirectTo: `/verify-email?email=${encodeURIComponent(email)}` };
}

export async function emailLogin(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) return { error: "Email and password are required." };

  const res = await apiFetch("/api/auth/login", {
    method: "POST",
    body: { email, password },
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    return { error: extractError(data, "Invalid credentials.") };
  }

  const data = await res.json().catch(() => ({}));

  // tokens may be in the body or in Set-Cookie headers
  let { accessToken, refreshToken } = extractTokensFromResponse(res.headers);
  if (!accessToken)
    accessToken =
      data.accessToken ?? data.access_token ?? data.data?.accessToken;
  if (!refreshToken)
    refreshToken =
      data.refreshToken ?? data.refresh_token ?? data.data?.refreshToken;

  if (!accessToken || !refreshToken) {
    return {
      error: "Login succeeded but no session was returned. Please try again.",
    };
  }
  await createSession({ accessToken, refreshToken });

  return { redirectTo: "/dashboard" };
}

export async function logout() {
  await apiFetch("/api/auth/logout", { method: "POST" });
  await deleteSession();
  return { redirectTo: "/login" };
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

export async function getCurrentUser() {
  const res = await apiFetch("/api/auth/me");
  if (!res.ok) return null;
  return await res.json();
}

export async function refreshToken() {
  const { getSession, createSession } = await import("@/lib/session");
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

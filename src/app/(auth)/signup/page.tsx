import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign up",
  description: "Create your OpenProfile and claim your username.",
  robots: { index: false, follow: false },
};

import { AuthForm } from "@/components/auth/AuthForm";
import { env } from "@/env/client";

export default function SignupPage() {
  return (
    <AuthForm
      mode="signup"
      googleAuthUrl={`${env.NEXT_PUBLIC_API_URL ?? ""}/api/v1/auth/google`}
    />
  );
}

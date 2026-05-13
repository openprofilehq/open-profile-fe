import { AuthForm } from "@/components/auth/AuthForm";
import { emailLogin } from "@/app/actions/auth";
import { env } from "@/env/client";

export default function LoginPage() {
  return (
    <AuthForm
      mode="login"
      action={emailLogin}
      googleAuthUrl={`${env.NEXT_PUBLIC_API_URL ?? ""}/api/auth/google`}
    />
  );
}

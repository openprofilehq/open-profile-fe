import { AuthForm } from "@/components/auth/AuthForm";
import { emailSignup } from "@/app/actions/auth";
import { env } from "@/env/client";

export default function SignupPage() {
  return (
    <AuthForm
      mode="signup"
      action={emailSignup}
      googleAuthUrl={`${env.NEXT_PUBLIC_API_URL ?? ""}/api/auth/google`}
    />
  );
}

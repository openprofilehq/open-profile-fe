import { BsPatchCheck } from "react-icons/bs";
import Link from "next/link";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/button";

export default function ResetPasswordSuccessPage() {
  return (
    <AuthLayout>
      <div className="flex flex-col items-center gap-5 py-4">
        <BsPatchCheck size={80} className="text-[#087583]" />

        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#050505]">
            Password Reset Successful
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Your password has been reset. You can now sign in with your new
            password.
          </p>
        </div>

        <Button
          asChild
          className="w-full h-11 bg-[#087583] hover:bg-[#065E69] text-white font-semibold rounded-lg shadow-none border-0"
        >
          <Link href="/login">Continue</Link>
        </Button>
      </div>
    </AuthLayout>
  );
}

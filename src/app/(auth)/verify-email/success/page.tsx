import { BadgeCheck } from "lucide-react";
import Link from "next/link";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/button";

export default function VerifySuccessPage() {
  return (
    <AuthLayout>
      <div className="flex flex-col items-center gap-5 py-4">
        <BadgeCheck size={80} className="text-link-hover-text" />

        <div className="text-center">
          <h1 className="text-primary-text text-2xl font-bold">
            Email Verified Successfully
          </h1>
          <p className="text-secondary-text mt-2 text-sm">
            Your email has been verified. You can now set up your profile.
          </p>
        </div>

        <Button
          asChild
          className="bg-brand-hover-bg h-11 w-full rounded-lg border-0 font-semibold text-white shadow-none hover:bg-[#065E69]"
        >
          <Link href="/create-profile">Continue</Link>
        </Button>
      </div>
    </AuthLayout>
  );
}

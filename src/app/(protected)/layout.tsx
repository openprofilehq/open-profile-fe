"use client";
import { getCurrentUserOption } from "@/api/auth/auth.options";
import {
  claimInviteApi,
  PENDING_INVITE_STORAGE_KEY,
} from "@/api/invites/invites.service";
import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";

function readPendingInviteToken() {
  try {
    const token = sessionStorage.getItem(PENDING_INVITE_STORAGE_KEY);
    sessionStorage.removeItem(PENDING_INVITE_STORAGE_KEY);
    return token;
  } catch {
    return null;
  }
}

function FullPageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Image
        src="/favicon.ico"
        alt="Loading..."
        width={48}
        height={48}
        className="animate-pulse"
      />
    </div>
  );
}

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: user, isLoading, isError } = useQuery(getCurrentUserOption());
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!user) return;
    const inviteToken = readPendingInviteToken();
    if (inviteToken) {
      claimInviteApi(inviteToken).catch(() => undefined);
    }
  }, [user]);

  useEffect(() => {
    if (isLoading) return;

    if (isError || !user) {
      router.replace(`/login?returnTo=${encodeURIComponent(pathname)}`);
      return;
    }

    if (!user.onboardingComplete && pathname !== "/create-profile") {
      router.replace(
        `/create-profile?returnTo=${encodeURIComponent(pathname)}`
      );
    }
  }, [isLoading, isError, user, pathname, router]);

  if (isLoading) return <FullPageLoader />;
  if (isError || !user) return <FullPageLoader />;
  if (!user.onboardingComplete && pathname !== "/create-profile")
    return <FullPageLoader />;

  return <>{children}</>;
}

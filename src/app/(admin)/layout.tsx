"use client";

import { useEffect } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getCurrentUserOption } from "@/api/auth/auth.options";
import { USER_ROLES } from "@/api/auth/auth.type";
import { ROUTES } from "@/constants/routes";

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

export default function AdminGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: user, isLoading, isError } = useQuery(getCurrentUserOption());
  const router = useRouter();
  const pathname = usePathname();

  const isAdmin = user?.role === USER_ROLES.admin;

  useEffect(() => {
    if (isLoading) return;

    if (isError || !user) {
      router.replace(`/login?returnTo=${encodeURIComponent(pathname)}`);
      return;
    }

    if (!isAdmin) {
      router.replace(ROUTES.dashboard.home);
    }
  }, [isLoading, isError, user, isAdmin, pathname, router]);

  if (isLoading || isError || !user || !isAdmin) return <FullPageLoader />;

  return <>{children}</>;
}

"use client";
import { userQueryOptions } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import Image from "next/image";

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

const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
  const { data: user, isLoading } = useQuery(userQueryOptions);
  const router = useRouter();
  const pathname = usePathname();

  const redirect = (url: string) => {
    setTimeout(() => router.replace(url), 300);
  };

  if (isLoading) return <FullPageLoader />;

  if (!user) {
    void redirect(`/login?redirect=${encodeURIComponent(pathname)}`);
    return <FullPageLoader />;
  }

  if (user && !user.onboardingComplete && pathname !== "/create-profile") {
    void redirect(`/create-profile?redirect=${encodeURIComponent(pathname)}`);
    return <FullPageLoader />;
  }

  return <>{children}</>;
};

export default ProtectedLayout;
"use client";

import Image from "next/image";
import Link from "next/link";
import { LogOut, X } from "lucide-react";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { userQueryOptions, logoutOption } from "@/api/auth/auth.options";
import { toast } from "sonner";
import { isApiError } from "@/api/base";
import { getInitials } from "@/utils/avatar";
import { ThemeToggle } from "@/components/shared/ThemeToggle";

export default function AdminTopbar() {
  const { data: user } = useQuery(userQueryOptions);
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);

  const displayName = user?.fullName?.trim() || user?.email?.trim() || "Admin";
  const initials = getInitials(displayName, { fallback: "A" });

  const logoutMutation = useMutation({
    ...logoutOption,
    onSuccess: () => {
      queryClient.clear();
      window.location.href = "/login";
    },
    onError: (err) =>
      toast.error(isApiError(err) ? err.message : "Logout failed."),
  });

  const isLogoutPending = logoutMutation.isPending;

  return (
    <>
      <header className="bg-card border-tertiary-b sticky top-0 z-40 border-b">
        <div className="flex h-16 items-center justify-between gap-4 px-4 md:px-8 lg:px-10">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Image
                src="/logo.svg"
                alt="Open Profile"
                width={180}
                height={40}
                className="h-auto w-32 shrink-0 cursor-pointer dark:hidden"
              />
              <Image
                src="/logo-dark.svg"
                alt="Open Profile"
                width={180}
                height={40}
                className="hidden h-auto w-32 shrink-0 cursor-pointer dark:block"
              />
            </Link>
            <span className="bg-brand-hover-bg text-inverse-text rounded-full px-2.5 py-0.5 text-xs font-semibold">
              Admin
            </span>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <div className="flex items-center gap-2">
              <div className="bg-brand-hover-bg text-inverse-text flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold">
                {initials}
              </div>
              <span className="text-primary-text hidden max-w-[160px] truncate text-sm font-medium md:block">
                {displayName}
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-tertiary-b text-negative-text hover:bg-negative-subtle-bg flex items-center gap-1.5 rounded-[8px] text-sm font-medium"
              onClick={() => setModalOpen(true)}
            >
              <LogOut size={14} aria-hidden="true" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm"
          onClick={() => {
            if (!isLogoutPending) setModalOpen(false);
          }}
        >
          <div
            className="bg-card w-full max-w-sm rounded-2xl p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-primary-text text-base font-semibold">
                Log out
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                disabled={isLogoutPending}
                className="text-tertiary-text hover:bg-hover-bg rounded-full p-1 transition-colors disabled:pointer-events-none disabled:opacity-40"
              >
                <X size={16} />
              </button>
            </div>
            <p className="text-secondary-text mb-6 text-sm">
              Are you sure you want to log out?
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="border-tertiary-b text-primary-text hover:bg-hover-bg flex-1 rounded-[10px] text-sm font-semibold"
                onClick={() => setModalOpen(false)}
                disabled={isLogoutPending}
              >
                Cancel
              </Button>
              <Button
                className="bg-negative-bg hover:bg-negative-hover-bg flex-1 rounded-[10px] text-sm font-semibold text-white active:scale-95"
                onClick={() => logoutMutation.mutate()}
                disabled={isLogoutPending}
              >
                {isLogoutPending ? "Logging out…" : "Logout"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

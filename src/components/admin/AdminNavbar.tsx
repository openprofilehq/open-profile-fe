"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, LogIn, Menu, X } from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { userQueryOptions, logoutOption } from "@/api/auth/auth.options";
import { getInitials } from "@/utils/avatar";
import { toast } from "sonner";
import { isApiError } from "@/api/base";

const adminNavLinks = [
  { label: "Dashboard", href: ROUTES.admin.home },
  { label: "User Lookup", href: ROUTES.admin.userLookup },
  { label: "Feature Flags", href: ROUTES.admin.featureFlags },
];

export default function AdminNavbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const { data: user } = useQuery(userQueryOptions);
  const queryClient = useQueryClient();

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

  return (
    <header className="bg-card relative">
      <div className="mx-auto flex h-14 max-w-screen-2xl items-center justify-between px-4 md:px-6">
        <Link href={ROUTES.admin.home} className="shrink-0">
          <Image
            src="/logo.svg"
            alt="Open Profile"
            width={160}
            height={36}
            className="h-auto w-32 dark:hidden"
          />
          <Image
            src="/logo-dark.svg"
            alt="Open Profile"
            width={160}
            height={36}
            className="hidden h-auto w-32 dark:block"
          />
        </Link>

        <nav
          aria-label="Admin navigation"
          className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-7 md:flex"
        >
          {adminNavLinks.map(({ label, href }) => {
            const isActive =
              href === ROUTES.admin.home
                ? pathname === ROUTES.admin.home
                : pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "text-sm font-medium transition-colors",
                  isActive
                    ? "text-link-hover-text"
                    : "text-secondary-text hover:text-primary-text"
                )}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href={ROUTES.dashboard.home}
            className="text-secondary-text hover:text-primary-text hidden items-center gap-1.5 text-sm font-medium transition-colors md:flex"
          >
            <LayoutDashboard size={15} aria-hidden="true" />
            My dashboard
          </Link>

          <button
            onClick={() => logoutMutation.mutate()}
            disabled={logoutMutation.isPending}
            className="text-secondary-text hover:text-primary-text hidden items-center gap-1.5 text-sm font-medium transition-colors disabled:opacity-50 md:flex"
          >
            <LogIn size={15} className="rotate-180" aria-hidden="true" />
            {logoutMutation.isPending ? "Logging out…" : "Logout"}
          </button>

          <div className="bg-brand-hover-bg text-inverse-text flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold">
            {initials}
          </div>

          <button
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="text-primary-text md:hidden"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="bg-card border-tertiary-b absolute top-full right-0 left-0 z-50 border-b shadow-lg md:hidden"
          >
            <nav className="flex flex-col px-4 py-2">
              {adminNavLinks.map(({ label, href }) => {
                const isActive =
                  href === ROUTES.admin.home
                    ? pathname === ROUTES.admin.home
                    : pathname === href || pathname.startsWith(`${href}/`);
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMenuOpen(false)}
                    className={cn(
                      "py-3 text-sm font-medium transition-colors",
                      isActive
                        ? "text-link-hover-text"
                        : "text-primary-text hover:text-link-hover-text"
                    )}
                  >
                    {label}
                  </Link>
                );
              })}
            </nav>

            <div className="px-4 pt-2 pb-4">
              <Link
                href={ROUTES.dashboard.home}
                onClick={() => setMenuOpen(false)}
                className="border-tertiary-b text-primary-text hover:text-link-hover-text mb-3 flex w-full items-center justify-center gap-1.5 rounded-lg border py-3 text-sm font-medium transition-colors"
              >
                <LayoutDashboard size={15} aria-hidden="true" />
                My dashboard
              </Link>

              <button
                onClick={() => logoutMutation.mutate()}
                disabled={logoutMutation.isPending}
                className="border-negative-text text-negative-text hover:bg-negative-subtle-bg flex w-full items-center justify-center rounded-lg border py-3 text-sm font-medium transition-colors disabled:opacity-50"
              >
                {logoutMutation.isPending ? "Logging out…" : "Log out"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

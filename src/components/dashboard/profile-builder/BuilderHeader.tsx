"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

type BuilderHeaderProps = {
  username?: string;
};

export default function BuilderHeader({ username }: BuilderHeaderProps) {
  const pathname = usePathname();

  const navLinks = [
    { label: "Home", href: "/dashboard" },
    { label: "Profile Builder", href: "/dashboard/profile-builder" },
    { label: "Settings", href: "/dashboard/settings" },
  ];

  function handlePublish() {
    toast.success("Profile published successfully.");
  }

  return (
    <header className="border-tertiary-b bg-card sticky top-0 z-40 w-full border-b px-6 py-2 select-none">
      <div className="mx-auto flex items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="flex items-center transition-transform active:scale-95"
          >
            <Image
              src="/logomark.svg"
              alt="Open Profile"
              width={40}
              height={40}
              className="border-tertiary-b h-10 w-10 rounded-full border bg-white object-contain"
              priority
            />
          </Link>

          <div className="hidden items-center gap-2 lg:flex">
            <span className="text-sm font-semibold text-[#050505]">
              @{username ?? "username"}
            </span>
            <span className="rounded-full bg-[#E5F4F6] px-2.5 py-1 text-xs font-bold text-[#087583]">
              Free
            </span>
          </div>
        </div>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => {
            const isActive =
              pathname === link.href ||
              (link.href === "/dashboard/profile-builder" &&
                pathname === "/dashboard/canvas");

            return (
              <Link
                key={link.label}
                href={link.href}
                className={`hover:text-link-hover-text relative py-1 text-base font-medium transition-all duration-200 ${
                  isActive ? "text-link-hover-text" : "text-tertiary-text"
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="bg-link-hover-text absolute bottom-0 left-0 h-0.5 w-full rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-4">
          <button
            className="text-primary-text hover:bg-hover-bg flex h-10 w-10 items-center justify-center rounded-full transition-colors active:scale-95"
            aria-label="Search"
          >
            <Search size={20} />
          </button>

          <Button
            type="button"
            onClick={handlePublish}
            className="bg-brand-hover-bg hover:bg-brand h-10 rounded-[10px] px-6 text-sm font-semibold text-white transition-all active:scale-95"
          >
            Publish
          </Button>
        </div>
      </div>
    </header>
  );
}

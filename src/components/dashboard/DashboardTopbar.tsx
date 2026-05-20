"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardTopbar() {
  const pathname = usePathname();

  const navLinks = [
    { label: "Home", href: "/dashboard" },
    { label: "Profile Builder", href: "/dashboard/profile-builder" },
    { label: "Settings", href: "/dashboard/settings" },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-[#EDEDED] bg-white">
      <div className="flex h-19 items-center justify-between px-4 md:px-8">
        <div className="flex items-center gap-2">
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
        </div>

        {/* Center Nav Links */}
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname?.startsWith(link.href);

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
                  <span className="bg-link-hover-text absolute bottom-0 left-0 h-[2px] w-full rounded-full" />
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

          <Button className="border-brand-b bg-brand-light-subtle-bg text-link-hover-text hidden h-10 rounded-[10px] border px-5 text-sm font-semibold shadow-none transition-all hover:bg-white active:scale-95 md:flex">
            Upgrade
          </Button>

          <Button className="bg-brand-hover-bg hover:bg-brand h-10 rounded-[10px] px-6 text-sm font-semibold text-white transition-all active:scale-95">
            Publish
          </Button>
        </div>
      </div>
    </header>
  );
}

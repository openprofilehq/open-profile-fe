"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BuilderHeader() {
  const pathname = usePathname();

  const navLinks = [
    { label: "Home", href: "/dashboard" },
    { label: "Profile Builder", href: "/dashboard/profile-builder" },
    { label: "Settings", href: "/dashboard/settings" },
  ];

  return (
    <header className="border-tertiary-b bg-white sticky top-0 z-40 w-full shrink-0 border-b px-4 py-2 select-none md:px-6">
      <div className="relative mx-auto flex h-12 items-center justify-between">

        {/* Logo */}
        <Link
          href="/dashboard"
          className="flex items-center transition-transform active:scale-95"
        >
          <Image
            src="/logomark.svg"
            alt="Open Profile"
            width={36}
            height={36}
            className="border-tertiary-b h-9 w-9 rounded-full border bg-white object-contain md:h-10 md:w-10"
            priority
          />
        </Link>

        {/* Center Nav — hidden on mobile, centered absolutely on md+ */}
        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 md:flex">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`py-1 text-base font-medium transition-colors duration-200 hover:text-[#087583] ${
                  isActive ? "text-[#087583]" : "text-[#888]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 md:gap-4">
          <button
            className="text-primary-text hover:bg-hover-bg flex h-9 w-9 items-center justify-center rounded-full transition-colors active:scale-95 md:h-10 md:w-10"
            aria-label="Search"
          >
            <Search size={18} />
          </button>

          <Button className="border-brand-b bg-brand-light-subtle-bg text-[#087583] hidden h-9 rounded-[10px] border px-4 text-sm font-semibold shadow-none transition-all hover:bg-white active:scale-95 sm:flex md:h-10 md:px-5">
            Upgrade
          </Button>

          <Button className="bg-[#087583] hover:bg-[#065e69] h-9 rounded-[10px] px-4 text-sm font-semibold text-white transition-all active:scale-95 md:h-10 md:px-6">
            Publish
          </Button>
        </div>
      </div>
    </header>
  );
}
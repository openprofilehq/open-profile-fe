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
    <header className="sticky top-0 z-40 w-full border-b border-[#EDEDED] bg-white px-6 py-4 select-none">
      <div className="mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="flex items-center transition-transform active:scale-95"
          >
            <Image
              src="/favicon.ico"
              alt="Open Profile"
              width={40}
              height={40}
              className="h-10 w-10 rounded-full border border-[#EDEDED] bg-white object-contain"
              priority
            />
          </Link>
        </div>

        {/* Center Nav Links */}
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`relative py-1 text-base font-medium transition-all duration-200 hover:text-[#087583] ${
                  isActive ? "text-[#087583]" : "text-[#747474]"
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 h-[2px] w-full rounded-full bg-[#087583]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Action Controls */}
        <div className="flex items-center gap-4">
          <button
            className="flex h-10 w-10 items-center justify-center rounded-full text-[#050505] transition-colors hover:bg-[#F5F5F5] active:scale-95"
            aria-label="Search"
          >
            <Search size={20} />
          </button>

          <Button
            variant="outline"
            className="h-10 rounded-[10px] border-[#EDEDED] px-5 text-sm font-semibold text-[#050505] transition-all hover:bg-[#F5F5F5]"
          >
            Upgrade
          </Button>

          <Button className="h-10 rounded-[10px] bg-[#087583] px-6 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#065e69] active:scale-95">
            Publish
          </Button>
        </div>
      </div>
    </header>
  );
}

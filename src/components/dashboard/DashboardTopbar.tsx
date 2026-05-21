"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

import { ROUTES } from "@/constants/routes";

type DashboardTopbarProps = {
  onOpenSidebar: () => void;
};

const navLinks = [
  { label: "Home", href: ROUTES.dashboard.home },
  { label: "Profile Builder", href: ROUTES.dashboard.profileBuilder },
  { label: "Settings", href: ROUTES.dashboard.settings.home },
];

export default function DashboardTopbar({
  onOpenSidebar,
}: DashboardTopbarProps) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-[#EDEDED] bg-white">
      <div className="flex h-19 items-center justify-between gap-8 px-4 md:px-10 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onOpenSidebar}
            aria-label="Open dashboard menu"
            className="rounded-[8px] border border-[#EDEDED] p-2 text-[#050505] lg:hidden"
          >
            <Menu size={22} />
          </button>

          <Image
            src="/logo.svg"
            alt="Open Profile"
            width={180}
            height={40}
            className="h-auto w-36 shrink-0 sm:w-40"
          />
        </div>

        <nav className="hidden items-center gap-4 lg:flex">
          {navLinks.map(({ label, href }) => {
            const isActive =
              href === ROUTES.dashboard.home
                ? pathname === ROUTES.dashboard.home
                : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`relative pb-1 text-sm font-semibold transition-colors ${
                  isActive
                    ? "text-[#087583] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-[#087583]"
                    : "text-[#050505] hover:text-[#087583]"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-3 md:gap-4">
          <button className="text-[#050505]" aria-label="Search">
            <Search size={24} />
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

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { House, FileText, Settings, Headphones, LogOut } from "lucide-react";
import { logout } from "@/app/actions/auth";
import type { CSSProperties } from "react";

const TOPBAR_HEIGHT = "76px";

const navItems = [
  {
    label: "Home",
    href: "/dashboard",
    icon: House,
  },
  {
    label: "Profile Builder",
    href: "/dashboard/profile-builder",
    icon: FileText,
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
  {
    label: "Help and Support",
    href: "/dashboard/help",
    icon: Headphones,
  },
];

export default function DashboardSidebar() {
  const pathname = usePathname();

  const handleLogout = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    logout();
  };

  return (
    <aside
      style={
        {
          "--topbar-height": TOPBAR_HEIGHT,
        } as CSSProperties
      }
      className="sticky top-[var(--topbar-height)] hidden h-[calc(100vh-var(--topbar-height))] w-[280px] shrink-0 border-r border-[#EDEDED] bg-white lg:flex lg:flex-col"
    >
      <nav className="flex flex-1 flex-col gap-2 p-3 pt-6">
        {navItems.map((item) => {
          const Icon = item.icon;

          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 rounded-[10px] px-4 py-4 text-[18px] font-medium transition-colors ${
                isActive
                  ? "bg-[#087583] text-white"
                  : "text-[#050505] hover:bg-[#F5F5F5]"
              }`}
            >
              <Icon size={22} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div
        className="flex cursor-pointer items-center gap-3 px-6 py-6 text-[#D92D20] opacity-70"
        onClick={handleLogout}
      >
        <LogOut size={22} />
        <span className="text-[18px]">Logout</span>
      </div>
    </aside>
  );
}

"use client";

import Link from "next/link";
import { House, FileText, Settings, Headphones, LogOut } from "lucide-react";

const navItems = [
  {
    label: "Home",
    href: "/dashboard",
    icon: House,
    active: true,
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
  return (
    <aside className="hidden min-h-[calc(100vh-76px)] w-[250px] border-r border-[#EDEDED] bg-white md:flex md:flex-col">
      <nav className="flex flex-1 flex-col gap-2 p-3 pt-6">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 rounded-[10px] px-4 py-4 text-[18px] font-medium transition-colors ${
                item.active
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

      <button className="flex items-center gap-3 px-6 py-6 text-[#D92D20]">
        <LogOut size={22} />
        <span className="text-[18px]">Logout</span>
      </button>
    </aside>
  );
}

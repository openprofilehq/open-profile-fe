"use client";

import Link from "next/link";
import { FileText, Headphones, House, LogOut, Settings } from "lucide-react";

const navItems = [
  { label: "Home", href: "/dashboard", icon: House },
  {
    label: "Profile Builder",
    href: "/dashboard/profile-builder",
    icon: FileText,
  },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
  { label: "Help", href: "/dashboard/help", icon: Headphones },
];

export default function MobileDashboardNav() {
  return (
    <nav className="fixed right-0 bottom-0 left-0 z-50 flex items-center justify-between border-t border-[#EDEDED] bg-white px-4 py-3 lg:hidden">
      {navItems.map((item) => {
        const Icon = item.icon;

        return (
          <Link
            key={item.label}
            href={item.href}
            className="flex flex-col items-center gap-1 text-[11px] font-medium text-[#050505]"
          >
            <Icon size={20} />
            <span>{item.label}</span>
          </Link>
        );
      })}

      <button className="flex flex-col items-center gap-1 text-[11px] font-medium text-[#D92D20]">
        <LogOut size={20} />
        <span>Logout</span>
      </button>
    </nav>
  );
}

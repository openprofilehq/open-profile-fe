"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { House, FileText, Settings, Headphones, LogOut } from "lucide-react";
import type { CSSProperties } from "react";
import { logoutOption } from "@/api/auth/auth.options";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { isApiError } from "@/api/base";
import { Button } from "../ui/button";

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
  const router = useRouter();

  const handleLogout = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    logoutMutation.mutate();
  };

  const logoutMutation = useMutation({
    ...logoutOption,
    onSuccess: () => {
      sessionStorage.removeItem("resetToken");
      router.push("/login");
    },
    onError: (err) =>
      toast.error(isApiError(err) ? err.message : "Logout failed."),
  });

  return (
    <aside
      style={
        {
          "--topbar-height": TOPBAR_HEIGHT,
        } as CSSProperties
      }
      className="top-(--topbar-height)] sticky hidden h-[calc(100vh-var(--topbar-height))] w-70 shrink-0 border-r border-[#EDEDED] bg-white lg:flex lg:flex-col"
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

      <Button
        type="button"
        size="lg"
        variant="logout"
        disabled={logoutMutation.isPending}
        onClick={handleLogout}
      >
        <LogOut size={22} />
        <span className="text-[18px]">Logout</span>
      </Button>
    </aside>
  );
}

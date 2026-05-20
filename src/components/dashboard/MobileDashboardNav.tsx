"use client";

import Link from "next/link";
import { FileText, Headphones, House, LogOut, Settings } from "lucide-react";
import { CSSProperties } from "react";
import { Button } from "../ui/button";
import { usePathname, useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { logoutOption } from "@/api/auth/auth.options";
import { toast } from "sonner";
import { isApiError } from "@/api/base";
import { ROUTES } from "@/constants/routes";

const navItems = [
  { label: "Home", href: ROUTES.dashboard, icon: House },
  {
    label: "Profile Builder",
    href: ROUTES.profileBuilder,
    icon: FileText,
  },
  { label: "Settings", href: ROUTES.settings, icon: Settings },
  { label: "Help", href: ROUTES.help, icon: Headphones },
];

const TOPBAR_HEIGHT = "76px";

export default function MobileDashboardNav() {
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
      className="sticky top-(--topbar-height) right-0 bottom-0 left-0 z-50 flex h-[calc(100vh-var(--topbar-height))] w-22.5 shrink-0 flex-col border-t border-[#EDEDED] bg-white px-4 py-3 lg:hidden"
    >
      <nav className="flex flex-1 flex-col gap-5">
        {navItems.map((item) => {
          const Icon = item.icon;

          const isActive =
            item.href === ROUTES.dashboard
              ? pathname === ROUTES.dashboard
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center gap-1 rounded-md p-3 text-[11px] font-medium ${
                isActive ? "bg-brand text-white" : "text-[#050505]"
              }`}
            >
              <Icon size={20} />
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
        <LogOut size={20} />
      </Button>
    </aside>
  );
}

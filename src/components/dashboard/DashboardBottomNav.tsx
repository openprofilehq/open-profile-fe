"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, ChartNoAxesCombined, House, PanelsTopLeft } from "lucide-react";
import { ROUTES } from "@/constants/routes";

const bottomNavLinks = [
  {
    label: "Home",
    href: ROUTES.dashboard.home,
    icon: House,
  },
  {
    label: "Builder",
    href: ROUTES.dashboard.profileBuilder,
    icon: PanelsTopLeft,
  },
  {
    label: "Insights",
    href: ROUTES.dashboard.insights,
    icon: ChartNoAxesCombined,
  },
  {
    label: "Alerts",
    icon: Bell,
  },
];

export default function DashboardBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Mobile dashboard navigation"
      className="bg-card border-tertiary-b fixed right-0 bottom-0 left-0 z-40 flex h-16 items-stretch border-t lg:hidden"
    >
      {bottomNavLinks.map(({ label, href, icon: Icon }) => {
        const isActive =
          href === ROUTES.dashboard.home
            ? pathname === ROUTES.dashboard.home
            : href
              ? pathname === href || pathname.startsWith(`${href}/`)
              : false;

        const itemClassName = `flex flex-1 flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition-colors ${
          isActive
            ? "text-link-hover-text"
            : href
              ? "text-secondary-text"
              : "text-tertiary-text"
        }`;

        if (!href) {
          return (
            <span
              key={label}
              aria-disabled="true"
              title="Coming soon"
              className={`${itemClassName} cursor-default`}
            >
              <Icon aria-hidden="true" size={20} strokeWidth={2} />
              <span>{label}</span>
            </span>
          );
        }

        return (
          <Link
            key={label}
            href={href}
            aria-current={isActive ? "page" : undefined}
            className={itemClassName}
          >
            <Icon aria-hidden="true" size={20} strokeWidth={2} />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

"use client";

import { ReactNode } from "react";
// import DashboardSidebar from "./DashboardSidebar";
import DashboardTopbar from "./DashboardTopbar";

type DashboardLayoutProps = {
  children: ReactNode;
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const setSidebarOpen = true;

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <DashboardTopbar onOpenSidebar={() => setSidebarOpen} />

      <div className="flex">
        {/* <DashboardSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        /> */}
        <main className="min-w-0 flex-1 overflow-x-hidden p-3">{children}</main>
      </div>
    </div>
  );
}

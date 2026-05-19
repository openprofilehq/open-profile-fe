import { ReactNode } from "react";
import DashboardSidebar from "./DashboardSidebar";
import DashboardTopbar from "./DashboardTopbar";
import MobileDashboardNav from "./MobileDashboardNav";

type DashboardLayoutProps = {
  children: ReactNode;
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <DashboardTopbar />

      <div className="flex">
        <DashboardSidebar />
        <main className="min-w-0 flex-1 overflow-x-hidden p-6 pb-32 md:px-8 md:py-10 md:pb-40 lg:pr-10 lg:pl-10">
          {children}
        </main>
      </div>
      <MobileDashboardNav />
    </div>
  );
}

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
        <main className="flex-1 p-6 pb-24 md:p-10">{children}</main>
      </div>
      <MobileDashboardNav />
    </div>
  );
}

import { ReactNode } from "react";
import DashboardSidebar from "./DashboardSidebar";
import DashboardTopbar from "./DashboardTopbar";

type DashboardLayoutProps = {
  children: ReactNode;
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <DashboardTopbar />

      <div className="flex">
        <DashboardSidebar />

        <main className="flex-1 p-6 md:p-10">{children}</main>
      </div>
    </div>
  );
}

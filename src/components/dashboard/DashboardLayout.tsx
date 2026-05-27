import { ReactNode } from "react";
import DashboardTopbar from "./DashboardTopbar";

type DashboardLayoutProps = {
  children: ReactNode;
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <DashboardTopbar />
      <main className="min-w-0 flex-1 overflow-x-hidden p-6 md:px-8 md:py-10 lg:px-10">
        {children}
      </main>
    </div>
  );
}
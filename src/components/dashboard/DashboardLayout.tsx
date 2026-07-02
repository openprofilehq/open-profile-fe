import { ReactNode } from "react";
import DashboardTopbar from "./DashboardTopbar";
import DashboardBottomNav from "./DashboardBottomNav";
import { ProfileBuilderPublishStateProvider } from "./profile-builder/profile-builder-publish-state";

type DashboardLayoutProps = {
  children: ReactNode;
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <ProfileBuilderPublishStateProvider>
      <div className="min-h-screen bg-[#FAFAFA]">
        <DashboardTopbar />
        <main className="min-w-0 flex-1 overflow-x-hidden px-4 py-5 pb-24 sm:px-5 md:px-6 md:py-8 md:pb-8 lg:px-8">
          {children}
        </main>
        <DashboardBottomNav />
      </div>
    </ProfileBuilderPublishStateProvider>
  );
}

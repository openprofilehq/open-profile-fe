import DashboardLayout from "@/components/dashboard/DashboardLayout";
import ProfileBuilderContent from "@/components/dashboard/profile-builder/ProfileBuilderContent";
import { Suspense } from "react";

export default function ProfileBuilderPage() {
  return (
    <DashboardLayout>
      <Suspense fallback={<div>Loading...</div>}>
        <ProfileBuilderContent />
      </Suspense>
    </DashboardLayout>
  );
}

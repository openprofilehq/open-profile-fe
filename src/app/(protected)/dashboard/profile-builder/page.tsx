import ProfileBuilderContent from "@/components/dashboard/profile-builder/ProfileBuilderContent";
import { Suspense } from "react";

export default function ProfileBuilderPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProfileBuilderContent />
    </Suspense>
  );
}

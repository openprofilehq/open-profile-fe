import ProfileBuilderContent from "@/components/dashboard/profile-builder/ProfileBuilderContent";
import { ProfileBuilderPublishStateProvider } from "@/components/dashboard/profile-builder/profile-builder-publish-state";
import { Suspense } from "react";

export default function CanvasPage() {
  return (
    <ProfileBuilderPublishStateProvider>
      <Suspense fallback={<div>Loading...</div>}>
        <ProfileBuilderContent />
      </Suspense>
    </ProfileBuilderPublishStateProvider>
  );
}

"use client";

import DefaultDashboardView from "@/components/dashboard/templates/DefaultDashboardView";
import TemplatePreviewLayout from "@/components/dashboard/templates/TemplatePreviewLayout";
import { DashboardProfileResponse } from "@/api/profile/profile.type";

export default function DefaultTemplatePreviewPage() {
  const dummyProfile: DashboardProfileResponse = {
    username: "johnsmith",
    fullName: "John Smith",
    bio: "I'm a designer and developer. I build things for the web.",
    photoUrl: "/profile-preview/avatar.png",
    templateType: "Default",
    themeSettings: null,
    isPublished: true,
    hasUnpublishedChanges: false,
    ctaLabel: null,
    ctaUrl: null,
    components: [],
  };

  return (
    <TemplatePreviewLayout templateName="Default">
      <DefaultDashboardView profile={dummyProfile} />
    </TemplatePreviewLayout>
  );
}

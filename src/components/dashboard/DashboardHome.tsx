"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import ProfileOverviewCard from "./ProfileOverviewCard";

import DefaultDashboardView from "./templates/DefaultDashboardView";
import CreatorDashboardView from "./templates/CreatorDashboardView";
import PortfolioDashboardView from "./templates/PortfolioDashboardView";
import ProfessionalDashboardView from "./templates/ProfessionalDashboardView";
import TemplateAppearanceProvider from "./templates/TemplateAppearanceProvider";

import {
  dashboardProfileOption,
  profileContentOption,
  profileAppearanceOption,
} from "@/api/profile/profile.options";
import { TemplateType } from "@/api/profile/profile.type";

export default function DashboardHome() {
  const [previewTemplate, setPreviewTemplate] = useState<TemplateType | null>(
    null
  );

  const dashboardProfile = useQuery(dashboardProfileOption());
  const profileContent = useQuery(profileContentOption());
  const profileAppearance = useQuery(profileAppearanceOption());

  const appearance =
    profileAppearance.data?.appearance ?? profileAppearance.data?.data ?? null;
  const profile = dashboardProfile.data;
  const content = profileContent.data;
  const isProfileLoading = dashboardProfile.isPending;
  const isContentLoading = profileContent.isPending;

  // Determine active template
  // 1. Preview template (from TemplateSelectionModal) takes absolute priority
  // 2. Appearance API (if backend returns it there)
  // 3. Draft Content themeSettings (where we explicitly save it via upsertDraft)
  // 4. Profile templateType (legacy top-level field)
  const themeSettings = (content as Record<string, unknown>)?.themeSettings as
    | Record<string, unknown>
    | undefined;
  const rawTemplate =
    previewTemplate ||
    profileAppearance.data?.appearance?.template ||
    themeSettings?.template ||
    profile?.templateType;

  const activeTemplateMap: Record<
    string,
    "portfolio" | "professional" | "creator" | "default"
  > = {
    portfolio: "portfolio",
    professional: "professional",
    creator: "creator",
    default: "default",
  };

  const activeTemplate =
    typeof rawTemplate === "string"
      ? activeTemplateMap[rawTemplate.toLowerCase()] || "default"
      : "default";

  return (
    <TemplateAppearanceProvider appearance={appearance}>
      <div className="mx-auto grid w-full max-w-[1180px] grid-cols-1 gap-6 overflow-x-hidden xl:grid-cols-[0.8fr_1.2fr]">
        <div className="flex flex-col gap-4">
          <ProfileOverviewCard
            profile={profile}
            isLoading={isProfileLoading}
            onPreviewChange={setPreviewTemplate}
            previewTemplate={previewTemplate}
          />
        </div>

        <div className="flex flex-col gap-6">
          {activeTemplate === "portfolio" ? (
            <PortfolioDashboardView
              profile={profile}
              content={content}
              appearance={appearance}
              isLoadingProfile={isProfileLoading}
              isLoadingContent={isContentLoading}
            />
          ) : activeTemplate === "professional" ? (
            <ProfessionalDashboardView
              profile={profile}
              content={content}
              appearance={appearance}
              isLoadingProfile={isProfileLoading}
              isLoadingContent={isContentLoading}
            />
          ) : activeTemplate === "creator" ? (
            <CreatorDashboardView
              profile={profile}
              content={content}
              appearance={appearance}
              isLoadingProfile={isProfileLoading}
              isLoadingContent={isContentLoading}
            />
          ) : (
            <DefaultDashboardView
              profile={profile}
              content={content}
              appearance={appearance}
              isLoadingProfile={isProfileLoading}
              isLoadingContent={isContentLoading}
            />
          )}
        </div>
      </div>
    </TemplateAppearanceProvider>
  );
}

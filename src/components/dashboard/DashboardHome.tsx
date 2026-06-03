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
  // 1. Preview template from TemplateSelectionModal takes priority
  // 2. Appearance API
  // 3. Draft content themeSettings
  // 4. Profile templateType fallback
  const themeSettings = (content as Record<string, unknown>)?.themeSettings as
    | Record<string, unknown>
    | undefined;

  const rawTemplate =
    previewTemplate ||
    profileAppearance.data?.appearance?.template ||
    profileAppearance.data?.data?.template ||
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
    <div className="mx-auto grid w-full max-w-[1360px] grid-cols-1 gap-5 overflow-x-hidden xl:grid-cols-[0.75fr_1.25fr] 2xl:max-w-[1480px]">
      <div className="flex min-w-0 flex-col gap-4">
        <ProfileOverviewCard
          profile={profile}
          isLoading={isProfileLoading}
          onPreviewChange={setPreviewTemplate}
          previewTemplate={previewTemplate}
        />
      </div>

      <TemplateAppearanceProvider
        appearance={appearance}
        className="flex min-w-0 flex-col gap-5"
      >
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
      </TemplateAppearanceProvider>
    </div>
  );
}

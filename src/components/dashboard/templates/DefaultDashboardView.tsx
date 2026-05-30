import React from "react";
import ProfileSummaryCard from "../ProfileSummaryCard";
import FeaturedLinks from "../FeaturedLinks";
import HighlightCard from "../HighlightCard";
import SelectedProject from "../help/SelectedProject";
import YourCTA from "../help/YourCTA";
import {
  DashboardProfileResponse,
  ProfileAppearanceSettings,
  ProfileContentResponse,
} from "@/api/profile/profile.type";
import TemplateAppearanceProvider from "./TemplateAppearanceProvider";

type Props = {
  profile?: DashboardProfileResponse;
  content?: ProfileContentResponse;
  isLoadingProfile?: boolean;
  isLoadingContent?: boolean;
  appearance?: ProfileAppearanceSettings | null;
};

export default function DefaultDashboardView({
  profile,
  content,
  isLoadingProfile,
  isLoadingContent,
  appearance,
}: Props) {
  return (
    <TemplateAppearanceProvider
      appearance={appearance}
      className="bg-primary-bg flex min-h-full flex-col rounded-[24px] p-6 sm:p-8"
    >
      <div
        className="flex flex-col"
        style={{ gap: "var(--template-spacing, 24px)" }}
      >
        <ProfileSummaryCard profile={profile} isLoading={isLoadingProfile} />
        <FeaturedLinks content={content} isLoading={isLoadingContent} />
        <HighlightCard profile={profile} />
        <SelectedProject content={content} />
        <YourCTA content={content} />
      </div>
    </TemplateAppearanceProvider>
  );
}

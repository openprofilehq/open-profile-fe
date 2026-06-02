import React from "react";
import ProfileSummaryCard from "../ProfileSummaryCard";
import FeaturedLinks from "../FeaturedLinks";
// import HighlightCard from "../HighlightCard";
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
    <TemplateAppearanceProvider appearance={appearance}>
      <div
        className="flex flex-col gap-6"
        style={{ gap: "var(--op-spacing, 1.5rem)" }}
      >
        <ProfileSummaryCard profile={profile} isLoading={isLoadingProfile} />
        <FeaturedLinks content={content} isLoading={isLoadingContent} />
        {/* <HighlightCard details={content?.content} /> */}
        <SelectedProject content={content} />
        <YourCTA content={content} />
      </div>
    </TemplateAppearanceProvider>
  );
}

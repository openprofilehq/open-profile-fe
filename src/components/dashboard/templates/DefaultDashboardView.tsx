import React from "react";
import ProfileSummaryCard from "../ProfileSummaryCard";
import FeaturedLinks from "../FeaturedLinks";
import HighlightCard from "../HighlightCard";
import SelectedProject from "../help/SelectedProject";
import YourCTA from "../help/YourCTA";
import { DashboardProfileResponse, ProfileContentResponse } from "@/api/profile/profile.type";

type Props = {
  profile?: DashboardProfileResponse;
  content?: ProfileContentResponse;
  isLoadingProfile?: boolean;
  isLoadingContent?: boolean;
};

export default function DefaultDashboardView({ profile, content, isLoadingProfile, isLoadingContent }: Props) {
  return (
    <>
      <ProfileSummaryCard profile={profile} isLoading={isLoadingProfile} />
      <FeaturedLinks content={content} isLoading={isLoadingContent} />
      <HighlightCard profile={profile} />
      <SelectedProject content={content} />
      <YourCTA content={content} />
    </>
  );
}

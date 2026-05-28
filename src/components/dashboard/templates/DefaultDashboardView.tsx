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

export default function DefaultDashboardView({ profile }: Props) {
  return (
    <>
      <ProfileSummaryCard />
      <FeaturedLinks />
      <HighlightCard profile={profile as unknown as Record<string, unknown>} />
      <SelectedProject />
      <YourCTA />
    </>
  );
}

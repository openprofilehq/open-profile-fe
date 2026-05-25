"use client";

import { useQuery } from "@tanstack/react-query";

import FeaturedLinks from "./FeaturedLinks";
import SelectedProject from "./help/SelectedProject";
import YourCTA from "./help/YourCTA";
// import HighlightCard from "./HighlightCard";
import ProfileOverviewCard from "./ProfileOverviewCard";
import ProfileSummaryCard from "./ProfileSummaryCard";

import {
  dashboardProfileOption,
  profileContentOption,
} from "@/api/profile/profile.options";

export default function DashboardHome() {
  const dashboardProfile = useQuery(dashboardProfileOption());
  const profileContent = useQuery(profileContentOption());

  const profile = dashboardProfile.data;
  const content = profileContent.data;
  const isProfileLoading = dashboardProfile.isPending;
  const isContentLoading = profileContent.isPending;

  return (
    <div className="mx-auto grid w-full max-w-[1180px] grid-cols-1 gap-6 overflow-x-hidden xl:grid-cols-[0.8fr_1.2fr]">
      <div className="flex flex-col gap-4">
        <ProfileOverviewCard profile={profile} isLoading={isProfileLoading} />
      </div>

      <div className="flex flex-col gap-6">
        <ProfileSummaryCard profile={profile} isLoading={isProfileLoading} />
        <FeaturedLinks content={content} isLoading={isContentLoading} />
        {/* <HighlightCard profile={profile} /> */}
        <SelectedProject content={content} isLoading={isContentLoading} />
        <YourCTA content={content} isLoading={isContentLoading} />
      </div>
    </div>
  );
}

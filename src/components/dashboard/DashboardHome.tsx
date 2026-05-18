"use client";

import { useQuery } from "@tanstack/react-query";

import FeaturedLinks from "./FeaturedLinks";
import SelectedProject from "./help/SelectedProject";
import YourCTA from "./help/YourCTA";
import HighlightCard from "./HighlightCard";
import ProfileOverviewCard from "./ProfileOverviewCard";
import ProfileSummaryCard from "./ProfileSummaryCard";

import { dashboardProfileOption } from "@/api/profile/profile.options";

export default function DashboardHome() {
  const dashboardProfile = useQuery(dashboardProfileOption());

  const profile = dashboardProfile.data;

  return (
    <div className="mx-auto grid w-full max-w-295 grid-cols-1 gap-6 xl:grid-cols-[0.8fr_1.2fr]">
      <div className="flex flex-col gap-4">
        <ProfileOverviewCard profile={profile} />
      </div>

      <div className="flex flex-col gap-6">
        <ProfileSummaryCard profile={profile} />
        <FeaturedLinks />
        <HighlightCard />
        <SelectedProject />
        <YourCTA />
      </div>
    </div>
  );
}

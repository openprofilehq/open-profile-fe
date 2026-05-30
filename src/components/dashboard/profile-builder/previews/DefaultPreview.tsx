import React from "react";
import type { Section, ProfilePreview } from "../types";
import { sectionsToContent } from "../builder.utils";
import ProfileSummaryCard from "../../ProfileSummaryCard";
import FeaturedLinks from "../../FeaturedLinks";
import HighlightCard from "../../HighlightCard";
import SelectedProject from "../../help/SelectedProject";
import YourCTA from "../../help/YourCTA";
import type {
  DashboardProfileResponse,
  ProfileContentResponse,
} from "@/api/profile/profile.type";

interface DefaultPreviewProps {
  sections: Section[];
  profile?: ProfilePreview | null;
}

export default function DefaultPreview({
  sections,
  profile,
}: DefaultPreviewProps) {
  // Map the local builder sections back into the API content format
  const mappedContent = {
    content: sectionsToContent(sections),
  } as unknown as ProfileContentResponse;

  return (
    <div
      className="mx-auto flex w-full max-w-4xl flex-col py-8 pt-12"
      style={{ gap: "var(--op-spacing, 24px)" }}
    >
      <ProfileSummaryCard
        profile={profile as unknown as DashboardProfileResponse}
      />
      <FeaturedLinks content={mappedContent} />
      <HighlightCard profile={profile as unknown as DashboardProfileResponse} />
      <SelectedProject content={mappedContent} />
      <YourCTA content={mappedContent} />
    </div>
  );
}

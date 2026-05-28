import React from "react";
import { DashboardProfileResponse, ProfileContentResponse } from "@/api/profile/profile.type";

type Props = {
  profile?: DashboardProfileResponse;
  content?: ProfileContentResponse;
  isLoadingProfile?: boolean;
  isLoadingContent?: boolean;
};

export default function CreatorDashboardView(_props: Props) {
  return (
    <div className="flex w-full flex-col items-center justify-center p-12 text-center border-2 border-dashed border-border rounded-xl">
      <h2 className="text-2xl font-bold text-primary-text mb-2">Creator Template</h2>
      <p className="text-secondary-text">Pending new design...</p>
    </div>
  );
}

"use client";


import { ArrowLeft, Eye } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import ProfessionalDashboardView from "@/components/dashboard/templates/ProfessionalDashboardView";
import { DashboardProfileResponse, ProfileContentResponse } from "@/api/profile/profile.type";

export default function ProfessionalTemplatePreviewPage() {
  const handleClose = () => {
    window.close();
    setTimeout(() => {
      window.location.href = ROUTES.dashboard.profileBuilder;
    }, 100);
  };

  const dummyProfile: DashboardProfileResponse = {
    username: "johnsmith",
    fullName: "John Smith",
    bio: "Product Designer helping early-stage startups build meaningful, trustworthy experiences. Previously at Linear and Loom",
    photoUrl: "/profile-preview/avatar.png",
    templateType: "Professional",
    themeSettings: null,
    isPublished: true,
    hasUnpublishedChanges: false,
    ctaLabel: null,
    ctaUrl: null,
    components: [],
  };

  const dummyContent: ProfileContentResponse = {
    profileId: "123",
    bio: null,
    photoUrl: null,
    source: "draft",
    updatedAt: new Date().toISOString(),
    content: null,
  };

  return (
    <div className="flex min-h-screen flex-col bg-secondary-bg pb-24 font-sans text-primary-text antialiased">
      {/* Floating Preview Banner */}
      <div className="sticky top-0 z-50 w-full border-b border-inverse-b bg-inverse-bg/95 px-4 py-3 text-inverse-text shadow-md backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 rounded-full bg-brand-hover-bg px-2 py-0.5 text-xs font-bold tracking-wider text-white uppercase">
              <Eye size={12} /> Preview
            </span>
            <p className="text-sm font-medium text-neutral-300">
              Viewing{" "}
              <span className="font-bold text-white">Professional Template</span>.
            </p>
          </div>
          <button
            onClick={handleClose}
            className="flex items-center gap-1.5 rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-neutral-700"
          >
            <ArrowLeft size={13} />
            Close Preview
          </button>
        </div>
      </div>

      {/* RENDER THE ACTUAL TEMPLATE WITH DUMMY DATA */}
      <div className="mx-auto w-full max-w-5xl px-4 sm:px-6">
        <div className="w-full">
          <ProfessionalDashboardView profile={dummyProfile} content={dummyContent} />
        </div>
      </div>
    </div>
  );
}

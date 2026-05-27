"use client";
import { ChevronRight, Eye, Link2, Pencil, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getDisplayUrl, getProfileUrl } from "@/utils/profile";
import { Skeleton } from "../ui/skeleton";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userQueryOptions } from "@/api/auth/auth.options";
import { useState } from "react";
import { TemplateSelectionModal, TemplateType } from "./TemplateSelectionModal";
import {
  upsertDraft,
  updateProfileAppearance,
} from "@/api/profile/profile.service";
import { toast } from "sonner";
import { DashboardProfileResponse } from "@/api/profile/profile.type";

const actions = [
  {
    title: "Manage links",
    description: "Update your links",
    icon: Link2,
    href: "/dashboard/profile-builder?section=links",
  },
  {
    title: "Your portfolio",
    description: "Add your portfolio",
    icon: Link2,
    href: "/dashboard/profile-builder?section=projects",
  },
  {
    title: "Customize your profile",
    description: "Adjust font, color, spacing and appearance",
    icon: Palette,
    // href: "/dashboard/profile-builder",
    href: "/coming-soon",
  },
];

type Props = {
  profile?: DashboardProfileResponse;
  isLoading?: boolean;
};

export default function ProfileOverviewCard({ profile, isLoading }: Props) {
  const { data: user } = useQuery(userQueryOptions);
  const publicProfileUrl = getProfileUrl(profile?.username);
  const queryClient = useQueryClient();

  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [selectedTemplateOverride, setSelectedTemplateOverride] =
    useState<TemplateType | null>(null);

  // Derive the active template from local override state, falling back to the profile's templateType
  const activeTemplate: TemplateType =
    selectedTemplateOverride ??
    (profile?.templateType === "creator"
      ? "Creator"
      : profile?.templateType === "portfolio"
        ? "Portfolio"
        : "Professional");

  const { mutate: doSaveTemplate, isPending: isSavingTemplate } = useMutation({
    mutationFn: async (templateType: TemplateType) => {
      const template = templateType.toLowerCase();

      // Define cohesive appearance settings for each template variant to provide immediate, wow factor aesthetics
      let accentColour = "#087583";
      let font: "inter" | "lato" | "poppins" | "playfair" | "roboto" = "inter";
      let cornerStyle: "sharp" | "rounded" | "pill" = "rounded";
      let spacing = 20;
      let theme: "light" | "dark" = "light";

      if (template === "creator") {
        accentColour = "#D97706";
        font = "lato";
        cornerStyle = "pill";
        spacing = 24;
        theme = "dark";
      } else if (template === "portfolio") {
        accentColour = "#4F46E5";
        font = "inter";
        cornerStyle = "sharp";
        spacing = 16;
        theme = "light";
      }

      const apiCornerStyle: "sharp" | "medium" | "round" =
        cornerStyle === "sharp"
          ? "sharp"
          : cornerStyle === "pill"
            ? "round"
            : "medium";

      const appearanceRes = await updateProfileAppearance({
        template,
        accentColour,
        font,
        cornerStyle: apiCornerStyle,
        spacing,
        theme,
      });

      // 2. Sync theme settings to the draft state ONLY if live appearance succeeds
      await upsertDraft({
        themeSettings: {
          template,
          accentColour,
          font,
          borderRadius:
            cornerStyle === "sharp" ? 0 : cornerStyle === "pill" ? 16 : 8,
        },
      });

      return { appearanceRes, templateType };
    },
    onSuccess: (data) => {
      setSelectedTemplateOverride(data.templateType);
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Template saved successfully.");
      setIsTemplateModalOpen(false);
    },
    onError: () => {
      toast.error("Failed to save template.");
    },
  });

  const handleSelectTemplate = (template: TemplateType) => {
    doSaveTemplate(template);
  };

  return (
    <>
      <section className="rounded-[12px] border border-[#EDEDED] bg-white p-4">
        <p className="text-sm text-[#454545] uppercase">Profile Overview</p>

        <div className="mt-3 rounded-[10px] bg-[#FAFAFA] p-4">
          {isLoading ? (
            <Skeleton className="h-8" />
          ) : (
            <h1 className="text-2xl font-bold">
              Welcome, {user?.fullName ?? "User"}
            </h1>
          )}
          <p className="mt-3 max-w-[390px] text-[#454545]">
            Your profile is live and ready to share. Manage your public page,
            update key sections, and keep things current from one place
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild className="bg-[#087583] hover:bg-[#065e69]">
              <a
                href={publicProfileUrl || "#"}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Eye size={16} />
                View Profile
              </a>
            </Button>

            <Button asChild variant="outline">
              <Link href="/dashboard/profile-builder">
                <Pencil size={16} />
                Edit
              </Link>
            </Button>

            <Button
              variant="outline"
              onClick={() => setIsTemplateModalOpen(true)}
            >
              <Palette size={16} className="mr-2" />
              Choose Template
            </Button>
          </div>
        </div>
      </section>

      {isTemplateModalOpen && (
        <TemplateSelectionModal
          isOpen={isTemplateModalOpen}
          onClose={() => setIsTemplateModalOpen(false)}
          selectedTemplate={activeTemplate}
          onSelectTemplate={handleSelectTemplate}
          isSaving={isSavingTemplate}
        />
      )}

      {actions.map((item) => {
        const Icon = item.icon;

        return (
          <Link
            key={item.title}
            href={item.href}
            aria-label={item.title}
            className="flex w-full items-center justify-between rounded-[12px] border border-[#EDEDED] bg-white p-5 text-left"
          >
            <div className="flex items-start gap-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-[8px] border border-[#EDEDED]">
                <Icon size={16} />
              </span>

              <div>
                <h2 className="text-lg font-bold">{item.title}</h2>
                <p className="mt-1 text-[#454545]">{item.description}</p>
              </div>
            </div>

            <ChevronRight size={22} />
          </Link>
        );
      })}

      <section className="rounded-[12px] border border-[#EDEDED] bg-white p-4">
        <div className="bg-[#FAFAFA] p-3">
          <p className="text-sm text-[#454545] uppercase">Page Details</p>

          <div className="mt-4 flex justify-between text-sm">
            <span className="text-[#454545]">Public URL</span>
            {isLoading ? (
              <Skeleton className="h-4 w-40" />
            ) : publicProfileUrl ? (
              <a
                href={publicProfileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-right break-all text-[#087583] hover:underline"
              >
                {getDisplayUrl(publicProfileUrl)}
              </a>
            ) : (
              <span className="text-right break-all">
                Profile URL not available
              </span>
            )}
          </div>

          {/* <div className="mt-3 flex justify-between text-sm">
            <span className="text-[#454545]">Template</span>
            <span>Creator Template</span>
          </div> */}
        </div>
      </section>
    </>
  );
}

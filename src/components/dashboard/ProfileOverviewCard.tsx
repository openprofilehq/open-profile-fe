"use client";
import { ChevronRight, Eye, Link2, Pencil, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getDisplayUrl, getProfileUrl } from "@/utils/profile";
import { Skeleton } from "../ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { userQueryOptions } from "@/api/auth/auth.options";
import { TemplateSelectionModal } from "./TemplateSelectionModal";
import {
  DashboardProfileResponse,
  TemplateType,
} from "@/api/profile/profile.type";
import {
  profileAppearanceOption,
  profileContentOption,
} from "@/api/profile/profile.options";

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
  onPreviewChange?: (template: TemplateType | null) => void;
  previewTemplate?: TemplateType | null;
};

export default function ProfileOverviewCard({
  profile,
  isLoading,
  onPreviewChange,
  previewTemplate,
}: Props) {
  const { data: user } = useQuery(userQueryOptions);
  const { data: appearanceData } = useQuery(profileAppearanceOption());
  const { data: contentData } = useQuery(profileContentOption());
  const publicProfileUrl = getProfileUrl(profile?.username);

  // Derive the active template
  const themeSettings = (contentData as Record<string, unknown>)
    ?.themeSettings as Record<string, unknown> | undefined;
  const rawTemplate =
    previewTemplate ||
    appearanceData?.appearance?.template ||
    themeSettings?.template ||
    profile?.templateType;

  const activeTemplate: TemplateType =
    typeof rawTemplate === "string" && rawTemplate.toLowerCase() === "creator"
      ? "Creator"
      : typeof rawTemplate === "string" &&
          rawTemplate.toLowerCase() === "portfolio"
        ? "Portfolio"
        : typeof rawTemplate === "string" &&
            rawTemplate.toLowerCase() === "default"
          ? "Default"
          : "Default";

  return (
    <>
      <section className="border-border bg-background rounded-[12px] border p-4">
        <p className="text-secondary-text text-sm uppercase">
          Profile Overview
        </p>

        <div className="bg-secondary-bg mt-3 rounded-[10px] p-4">
          {isLoading ? (
            <Skeleton className="h-8" />
          ) : (
            <h1 className="text-2xl font-bold">
              Welcome, {profile?.fullName ?? user?.fullName ?? "User"}
            </h1>
          )}
          <p className="text-secondary-text mt-3 max-w-[390px]">
            Your profile is live and ready to share. Manage your public page,
            update key sections, and keep things current from one place
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button
              asChild
              className="bg-brand-hover-bg hover:bg-button-brand-bg"
            >
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

            <TemplateSelectionModal
              initialTemplate={activeTemplate}
              onPreviewChange={onPreviewChange}
              trigger={
                <Button variant="outline">
                  <Palette size={16} className="mr-2" />
                  Choose Template
                </Button>
              }
            />
          </div>
        </div>
      </section>

      {actions.map((item) => {
        const Icon = item.icon;

        return (
          <Link
            key={item.title}
            href={item.href}
            aria-label={item.title}
            className="border-border bg-background flex w-full items-center justify-between rounded-[12px] border p-5 text-left"
          >
            <div className="flex items-start gap-3">
              <span className="border-border flex h-7 w-7 items-center justify-center rounded-[8px] border">
                <Icon size={16} />
              </span>

              <div>
                <h2 className="text-lg font-bold">{item.title}</h2>
                <p className="text-secondary-text mt-1">{item.description}</p>
              </div>
            </div>

            <ChevronRight size={22} />
          </Link>
        );
      })}

      <section className="border-border bg-background rounded-[12px] border p-4">
        <div className="bg-secondary-bg p-3">
          <p className="text-secondary-text text-sm uppercase">Page Details</p>

          <div className="mt-4 flex justify-between text-sm">
            <span className="text-secondary-text">Public URL</span>
            {isLoading ? (
              <Skeleton className="h-4 w-40" />
            ) : publicProfileUrl ? (
              <a
                href={publicProfileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-hover-bg text-right break-all hover:underline"
                suppressHydrationWarning
              >
                {getDisplayUrl(publicProfileUrl)}
              </a>
            ) : (
              <span className="text-right break-all">
                Profile URL not available
              </span>
            )}
          </div>

          <div className="mt-3 flex justify-between text-sm">
            <span className="text-secondary-text">Template</span>
            {isLoading ? (
              <Skeleton className="h-4 w-24" />
            ) : (
              <span className="text-right">{activeTemplate} Template</span>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

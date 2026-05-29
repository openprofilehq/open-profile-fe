import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Eye, EyeOff, Trash2, MessageSquare } from "lucide-react";
import { getImageUrl } from "@/utils/profile";
import type { Section, ProfilePreview } from "../types";
import {
  XIcon,
  InstagramIcon,
  LinkedInIcon,
  GithubIcon,
  YoutubeIcon,
  FacebookIcon,
  DribbbleIcon,
  GlobeIcon,
} from "@/components/icons/BrandIcons";

interface CreatorPreviewProps {
  sections: Section[];
  profile?: ProfilePreview | null;
  selectedSectionId?: string | null;
  onToggleSectionVisibility: (id: string) => void;
  onRemoveSection: (id: string) => void;
}

const getIconForUrl = (url: string = "") => {
  const lowerUrl = url.toLowerCase();
  if (lowerUrl.includes("twitter.com") || lowerUrl.includes("x.com"))
    return XIcon;
  if (lowerUrl.includes("instagram.com")) return InstagramIcon;
  if (lowerUrl.includes("linkedin.com")) return LinkedInIcon;
  if (lowerUrl.includes("github.com")) return GithubIcon;
  if (lowerUrl.includes("youtube.com")) return YoutubeIcon;
  if (lowerUrl.includes("facebook.com")) return FacebookIcon;
  if (lowerUrl.includes("dribbble.com")) return DribbbleIcon;
  return GlobeIcon;
};

export default function CreatorPreview({
  sections,
  profile,
  selectedSectionId,
  onToggleSectionVisibility,
  onRemoveSection,
}: CreatorPreviewProps) {
  const [activeTab, setActiveTab] = useState<"projects" | "links" | "about">(
    "projects"
  );

  useEffect(() => {
    if (selectedSectionId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (selectedSectionId === "projects") setActiveTab("projects");
      else if (selectedSectionId === "links") setActiveTab("links");
      else if (selectedSectionId === "bio") setActiveTab("about");
    }
  }, [selectedSectionId]);

  const visibleSections = sections.filter((section) => section.visible);

  const bioSection = sections.find((s) => s.type === "bio");
  const linksSection = sections.find((s) => s.type === "links");
  const ctaSection = sections.find((s) => s.type === "experience");
  const bioSectionId = bioSection?.id ?? "bio";

  // Filter links for the header social row in Creator layout
  const allLinks = linksSection?.links || [];
  const socialLinks = allLinks
    .filter((link) => {
      const url = (link.url || "").toLowerCase();
      return (
        url.includes("twitter") ||
        url.includes("x.com") ||
        url.includes("linkedin") ||
        url.includes("instagram") ||
        url.includes("facebook") ||
        url.includes("youtube") ||
        url.includes("whatsapp")
      );
    })
    .slice(0, 4);

  return (
    <div className="flex w-full flex-col">
      {/* CREATOR HEADER (Bio Section) */}
      {(!selectedSectionId ||
        selectedSectionId === bioSectionId ||
        selectedSectionId === ctaSection?.id) && (
        <div className="relative mt-8 flex w-full flex-col items-center gap-4 p-6 text-center">
          {bioSection && (
            <div className="border-border bg-background absolute top-2 right-2 z-10 flex w-24 items-center justify-between gap-3 rounded-[10px] border p-3 shadow-none select-none">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleSectionVisibility(bioSection.id);
                }}
                className="text-secondary-text transition-opacity hover:opacity-80"
              >
                {bioSection.visible ? (
                  <Eye size={18} strokeWidth={2} />
                ) : (
                  <EyeOff size={18} strokeWidth={2} />
                )}
              </button>
              <button
                disabled
                className="text-secondary-text cursor-not-allowed opacity-50"
              >
                <Trash2 size={18} strokeWidth={2} />
              </button>
            </div>
          )}

          <div className="border-border bg-secondary-bg relative h-24 w-24 shrink-0 overflow-hidden rounded-full border">
            {getImageUrl(profile?.photoUrl) ? (
              <Image
                src={getImageUrl(profile?.photoUrl) || ""}
                alt={profile?.fullName ?? "Profile avatar"}
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              <div className="text-brand-text flex h-full items-center justify-center text-3xl font-bold">
                {(profile?.fullName || "M").charAt(0).toUpperCase()}
              </div>
            )}
            <div className="border-background absolute right-[6px] bottom-[6px] h-4 w-4 rounded-full border-2 bg-green-400" />
          </div>

          <div className="flex flex-col items-center">
            <h1 className="text-primary-text flex items-center gap-2 text-2xl font-bold tracking-tight sm:text-3xl">
              {profile?.fullName || "Micaela Robinson"}
              <svg
                className="text-brand-hover-bg h-5 w-5"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15l-4-4 1.41-1.41L11 14.17l6.59-6.59L19 9l-8 8z" />
              </svg>
            </h1>
            <p className="text-secondary-text mt-1 text-[15px]">
              openprofile.app/{profile?.username || "micaela"}
            </p>
          </div>

          {socialLinks.length > 0 && (
            <div className="mt-2 flex items-center gap-4">
              {socialLinks.map((link, i) => {
                const Icon = getIconForUrl(link.url);
                return (
                  <div
                    key={i}
                    className="text-secondary-text transition-colors"
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                );
              })}
            </div>
          )}

          {ctaSection && ctaSection.visible && (
            <div className="group relative mt-4">
              <div className="border-border bg-background absolute -top-12 -right-12 z-10 flex items-center gap-2 rounded-[10px] border p-2 opacity-0 shadow-sm transition-opacity group-hover:opacity-100">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleSectionVisibility(ctaSection.id);
                  }}
                  className="text-secondary-text p-1 transition-opacity hover:opacity-80"
                >
                  {ctaSection.visible ? (
                    <Eye size={16} />
                  ) : (
                    <EyeOff size={16} />
                  )}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveSection(ctaSection.id);
                  }}
                  className="text-negative-text p-1 transition-opacity hover:opacity-80"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="bg-brand-hover-bg hover:bg-button-brand-bg inline-flex h-10 items-center justify-center gap-2 rounded-md px-6 text-sm font-semibold text-white shadow-sm transition-all"
              >
                <MessageSquare size={16} />
                {ctaSection.buttonText || "Let's Collaborate"}
              </a>
            </div>
          )}
        </div>
      )}

      {/* CREATOR TABS */}
      {(!selectedSectionId ||
        ["projects", "links", "bio"].includes(selectedSectionId)) && (
        <>
          <div className="border-border mt-8 flex items-center justify-center gap-8 border-b">
            <button
              onClick={() => setActiveTab("projects")}
              className={`relative pb-3 text-[15px] font-semibold transition-colors ${activeTab === "projects" ? "text-brand-hover-bg" : "text-secondary-text hover:text-primary-text"}`}
            >
              Projects
              {activeTab === "projects" && (
                <span className="bg-brand-hover-bg absolute right-0 bottom-[-1px] left-0 h-[2px]" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("links")}
              className={`relative pb-3 text-[15px] font-semibold transition-colors ${activeTab === "links" ? "text-brand-hover-bg" : "text-secondary-text hover:text-primary-text"}`}
            >
              Links
              {activeTab === "links" && (
                <span className="bg-brand-hover-bg absolute right-0 bottom-[-1px] left-0 h-[2px]" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("about")}
              className={`relative pb-3 text-[15px] font-semibold transition-colors ${activeTab === "about" ? "text-brand-hover-bg" : "text-secondary-text hover:text-primary-text"}`}
            >
              About
              {activeTab === "about" && (
                <span className="bg-brand-hover-bg absolute right-0 bottom-[-1px] left-0 h-[2px]" />
              )}
            </button>
          </div>

          <div className="mt-8 w-full">
            {/* CREATOR TAB CONTENT */}
            {visibleSections.map((section) => {
              if (
                selectedSectionId &&
                selectedSectionId !== section.id &&
                selectedSectionId !== bioSectionId &&
                section.id !== ctaSection?.id
              )
                return null;

              // Projects Tab
              if (section.type === "projects" && activeTab === "projects") {
                return (
                  <div key={section.id} className="relative w-full">
                    <div className="border-border bg-background absolute -top-12 right-0 z-10 flex w-24 items-center justify-between gap-3 rounded-[10px] border p-3 shadow-none select-none">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleSectionVisibility(section.id);
                        }}
                        className="text-secondary-text hover:opacity-80"
                      >
                        {section.visible ? (
                          <Eye size={18} />
                        ) : (
                          <EyeOff size={18} />
                        )}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveSection(section.id);
                        }}
                        className="text-negative-text hover:opacity-80"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                    {section.projects && section.projects.length > 0 ? (
                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        {section.projects.map((project) => (
                          <div
                            key={project.id}
                            className="border-border bg-background flex flex-col overflow-hidden rounded-2xl border transition-shadow"
                          >
                            <div className="bg-secondary-bg relative h-[160px] w-full shrink-0">
                              {getImageUrl(project.imageSrc) ? (
                                <Image
                                  src={getImageUrl(project.imageSrc)!}
                                  alt={project.title}
                                  fill
                                  className="object-cover"
                                  unoptimized
                                />
                              ) : (
                                <div className="h-full w-full bg-neutral-200" />
                              )}
                            </div>
                            <div className="flex flex-col p-5">
                              <h3 className="text-primary-text text-[16px] font-bold">
                                {project.title}
                              </h3>
                              {project.description && (
                                <p className="text-secondary-text mt-2 line-clamp-2 text-[13px]">
                                  {project.description}
                                </p>
                              )}
                              {project.url && (
                                <span className="text-brand-hover-bg mt-4 inline-flex items-center gap-1.5 text-[13px] font-bold">
                                  {project.buttonText || "View Project"}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-tertiary-text border-border rounded-xl border border-dashed py-8 text-center text-sm">
                        No projects added yet.
                      </p>
                    )}
                  </div>
                );
              }

              // Links Tab
              if (section.type === "links" && activeTab === "links") {
                return (
                  <div
                    key={section.id}
                    className="relative mx-auto flex w-full max-w-xl flex-col gap-4"
                  >
                    <div className="border-border bg-background absolute -top-12 right-0 z-10 flex w-24 items-center justify-between gap-3 rounded-[10px] border p-3 shadow-none select-none">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleSectionVisibility(section.id);
                        }}
                        className="text-secondary-text hover:opacity-80"
                      >
                        {section.visible ? (
                          <Eye size={18} />
                        ) : (
                          <EyeOff size={18} />
                        )}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveSection(section.id);
                        }}
                        className="text-negative-text hover:opacity-80"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                    {allLinks.length > 0 ? (
                      allLinks.map((link) => {
                        const Icon = getIconForUrl(link.url);
                        const isWebsite =
                          !link.url?.includes("twitter") &&
                          !link.url?.includes("instagram") &&
                          !link.url?.includes("linkedin") &&
                          !link.url?.includes("facebook") &&
                          !link.url?.includes("youtube") &&
                          !link.url?.includes("github");
                        const subtitle = isWebsite
                          ? link.url
                              ?.replace(/^https?:\/\/(www\.)?/, "")
                              ?.replace(/\/$/, "")
                          : `@${profile?.username}`;
                        return (
                          <div
                            key={link.id}
                            className="border-border bg-background flex items-center justify-between rounded-2xl border p-4 sm:px-6"
                          >
                            <div className="flex items-center gap-4">
                              <div className="bg-brand-light-subtle-bg text-brand-hover-bg flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
                                <Icon className="h-5 w-5" />
                              </div>
                              <div className="flex flex-col">
                                <span className="text-primary-text text-[15px] font-bold">
                                  {link.title}
                                </span>
                                <span className="text-tertiary-text text-[13px]">
                                  {subtitle}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-tertiary-text border-border rounded-xl border border-dashed py-8 text-center text-sm">
                        No links added yet.
                      </p>
                    )}
                  </div>
                );
              }

              // About Tab
              if (section.type === "bio" && activeTab === "about") {
                return (
                  <div
                    key={section.id}
                    className="border-border bg-background mx-auto max-w-2xl rounded-3xl border p-8 sm:p-10"
                  >
                    <p className="text-secondary-text text-center text-[15px] leading-relaxed whitespace-pre-wrap">
                      {section.bio ||
                        "Write a little bit about yourself here..."}
                    </p>
                  </div>
                );
              }

              return null;
            })}
          </div>
        </>
      )}
    </div>
  );
}

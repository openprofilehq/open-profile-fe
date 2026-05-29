import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Eye, EyeOff, Trash2, MessageSquare, ArrowRight, MoreHorizontal, ExternalLink } from "lucide-react";
import { getImageUrl, sanitizeUrl } from "@/utils/profile";
import type { Section, ProfilePreview } from "../types";
import { TemplateLinkCard, getLinkIcon } from "../../shared/TemplateLinkCard";


interface CreatorPreviewProps {
  sections: Section[];
  profile?: ProfilePreview | null;
  selectedSectionId?: string | null;
  onToggleSectionVisibility: (id: string) => void;
  onRemoveSection: (id: string) => void;
}

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

  const renderControls = (section?: Section, isBio: boolean = false) => {
    if (!section) return null;
    return (
      <div className="group/menu absolute -top-12 right-0 z-50">
        <button className="text-tertiary-text hover:text-primary-text hover:bg-hover-bg flex h-8 w-8 cursor-pointer items-center justify-center rounded-[8px] transition-colors">
          <MoreHorizontal size={18} />
        </button>
        
        <div className="border-border bg-background absolute top-full right-0 mt-2 flex w-40 flex-col overflow-hidden rounded-xl border opacity-0 shadow-lg transition-all invisible group-hover/menu:visible group-hover/menu:opacity-100">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleSectionVisibility(section.id);
            }}
            className="text-secondary-text hover:bg-hover-bg hover:text-primary-text flex w-full items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors"
          >
            {section.visible ? (
              <><EyeOff size={16} /> Hide Section</>
            ) : (
              <><Eye size={16} /> Show Section</>
            )}
          </button>
          <button
            onClick={(e) => {
              if (!isBio) {
                e.stopPropagation();
                onRemoveSection(section.id);
              }
            }}
            disabled={isBio}
            className={`flex w-full items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors ${isBio ? 'text-negative-text opacity-50 cursor-not-allowed' : 'text-negative-text hover:bg-negative-bg/20'}`}
          >
            <Trash2 size={16} /> Delete
          </button>
        </div>
      </div>
    );
  };

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
        <div className="relative mt-6 flex w-full flex-col items-center gap-4 p-6 text-center">
          {renderControls(bioSection, true)}

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
              <div className="text-brand-text flex h-full items-center justify-center text-[40px] font-bold">
                {(profile?.fullName || "M").charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <div className="flex flex-col items-center">
            <h1 className="text-primary-text flex items-center gap-2 text-2xl font-bold tracking-tight sm:text-3xl">
              {profile?.fullName || "Micaela Robinson"}
            </h1>
            <p className="text-secondary-text mt-1 text-[15px]">
              openprofile.app/{profile?.username || "micaela"}
            </p>
          </div>

          {socialLinks.length > 0 && (
            <div className="mt-2 flex items-center gap-4">
              {socialLinks.map((link, i) => {
                return (
                  <div
                    key={i}
                    className="text-secondary-text transition-colors"
                  >
                    {getLinkIcon((link.url || "") + " " + (link.title || link.label || ""))}
                  </div>
                );
              })}
            </div>
          )}

          {ctaSection && ctaSection.visible && (
            <div className="group relative mt-4">
              <div className="group/menu absolute -top-8 left-1/2 z-50 -translate-x-1/2 opacity-0 transition-opacity group-hover:opacity-100">
                <button className="text-tertiary-text hover:text-primary-text hover:bg-hover-bg flex h-8 w-8 cursor-pointer items-center justify-center rounded-[8px] transition-colors">
                  <MoreHorizontal size={16} />
                </button>
                
                <div className="border-border bg-background absolute top-full left-1/2 mt-2 flex w-36 -translate-x-1/2 flex-col overflow-hidden rounded-xl border opacity-0 shadow-lg transition-all invisible group-hover/menu:visible group-hover/menu:opacity-100">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleSectionVisibility(ctaSection.id);
                    }}
                    className="text-secondary-text hover:bg-hover-bg hover:text-primary-text flex w-full items-center gap-3 px-3 py-2 text-[13px] font-medium transition-colors"
                  >
                    {ctaSection.visible ? (
                      <><EyeOff size={14} /> Hide</>
                    ) : (
                      <><Eye size={14} /> Show</>
                    )}
                  </button>
                  <button
                    onClick={(e) => {
                      if (ctaSection.type !== "bio") {
                        e.stopPropagation();
                        onRemoveSection(ctaSection.id);
                      }
                    }}
                    disabled={ctaSection.type === "bio"}
                    className={`flex w-full items-center gap-3 px-3 py-2 text-[13px] font-medium transition-colors ${ctaSection.type === 'bio' ? 'text-negative-text opacity-50 cursor-not-allowed' : 'text-negative-text hover:bg-negative-bg/20'}`}
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
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
                <span className="bg-brand-hover-bg absolute right-0 -bottom-px left-0 h-[2px]" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("links")}
              className={`relative pb-3 text-[15px] font-semibold transition-colors ${activeTab === "links" ? "text-brand-hover-bg" : "text-secondary-text hover:text-primary-text"}`}
            >
              Links
              {activeTab === "links" && (
                <span className="bg-brand-hover-bg absolute right-0 -bottom-px left-0 h-[2px]" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("about")}
              className={`relative pb-3 text-[15px] font-semibold transition-colors ${activeTab === "about" ? "text-brand-hover-bg" : "text-secondary-text hover:text-primary-text"}`}
            >
              About
              {activeTab === "about" && (
                <span className="bg-brand-hover-bg absolute right-0 -bottom-px left-0 h-[2px]" />
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
                    {renderControls(section)}
                    {section.projects && section.projects.length > 0 ? (
                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        {section.projects.map((project) => (
                          <div
                            key={project.id}
                            className="border-border bg-background flex flex-col overflow-hidden rounded-[12px] border transition-shadow"
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
                    className="relative mx-auto flex w-full flex-col gap-4"
                  >
                    {renderControls(section)}
                    {allLinks.length > 0 ? (
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 w-full">
                        {allLinks.map((link) => (
                          <TemplateLinkCard
                            key={link.id}
                            id={link.id}
                            title={link.title || link.label || ""}
                            url={link.url ? sanitizeUrl(link.url) : "#"}
                          />
                        ))}
                      </div>
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
                    className="border-border mx-auto max-w-2xl rounded-3xl border p-8 sm:p-10"
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

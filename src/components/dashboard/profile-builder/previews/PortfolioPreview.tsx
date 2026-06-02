import React from "react";
import Image from "next/image";
import {
  ArrowRight,
  Rocket,
  Eye,
  EyeOff,
  Trash2,
  MoreHorizontal,
} from "lucide-react";
import {
  getImageUrl,
  sanitizeUrl,
  isProjectHighlighted,
  getSectionStyle,
} from "@/utils/profile";
import type { Section, ProfilePreview } from "../types";
import { TemplateLinkCard } from "../../shared/TemplateLinkCard";
import HighlightPreviewCard from "./HighlightPreviewCard";

interface PortfolioPreviewProps {
  sections: Section[];
  profile?: ProfilePreview | null;
  selectedSectionId?: string | null;
  onToggleSectionVisibility: (id: string) => void;
  onRemoveSection: (id: string) => void;
}

export default function PortfolioPreview({
  sections,
  profile,
  selectedSectionId: _selectedSectionId,
  onToggleSectionVisibility,
  onRemoveSection,
}: PortfolioPreviewProps) {
  const bioSection = sections.find((s) => s.type === "bio");
  const linksSection = sections.find((s) => s.type === "links");
  const projectsSection = sections.find((s) => s.type === "projects");
  const ctaSection = sections.find((s) => s.type === "experience");

  const renderControls = (section?: Section, isBio: boolean = false) => {
    if (!section) return null;
    return (
      <div className="group/menu absolute -top-12 right-0 z-50">
        <button className="text-tertiary-text hover:text-primary-text hover:bg-hover-bg flex h-8 w-8 cursor-pointer items-center justify-center rounded-[8px] transition-colors">
          <MoreHorizontal size={18} />
        </button>

        <div className="border-border bg-background invisible absolute top-full right-0 mt-2 flex w-40 flex-col overflow-hidden rounded-xl border opacity-0 shadow-lg transition-all group-hover/menu:visible group-hover/menu:opacity-100">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleSectionVisibility(section.id);
            }}
            className="text-secondary-text hover:bg-hover-bg hover:text-primary-text flex w-full items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors"
          >
            {section.visible ? (
              <>
                <EyeOff size={16} /> Hide Section
              </>
            ) : (
              <>
                <Eye size={16} /> Show Section
              </>
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
            className={`flex w-full items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors ${isBio ? "text-negative-text cursor-not-allowed opacity-50" : "text-negative-text hover:bg-negative-bg/20"}`}
          >
            <Trash2 size={16} /> Delete
          </button>
        </div>
      </div>
    );
  };

  return (
    <div
      className="text-primary-text mx-auto flex w-full max-w-5xl flex-col py-8 pt-6"
      style={{ gap: "var(--op-spacing, 2rem)" }}
    >
      {/* HEADER SECTION (Bio) */}
      <div
        className={`group relative transition-opacity duration-200 ${!bioSection?.visible ? "opacity-50 grayscale" : ""}`}
        style={getSectionStyle(bioSection)}
      >
        {renderControls(bioSection, true)}

        <header className="hover:border-border hover:bg-background/50 relative mb-8 flex w-full flex-col justify-between gap-6 rounded-2xl border border-transparent p-6 transition-colors sm:flex-row sm:items-start">
          <div className="flex flex-col gap-6">
            <div className="border-border bg-secondary-bg relative h-24 w-24 shrink-0 overflow-hidden rounded-full border shadow-sm">
              {profile?.photoUrl ? (
                <Image
                  src={getImageUrl(profile.photoUrl)}
                  alt={profile?.fullName || "User"}
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <div className="bg-brand-subtle-bg text-brand-hover-bg flex h-full w-full items-center justify-center text-[40px] font-bold">
                  {(profile?.fullName || "John Smith").charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <h1 className="text-primary-text text-[26px] leading-tight font-bold tracking-tight">
                  {profile?.fullName || "John Smith"}
                </h1>
              </div>
              <p className="text-secondary-text mt-1 text-[14px]">
                openprofile.app/{profile?.username || "johnsmith"}
              </p>
            </div>
          </div>
        </header>

        <section className="mt-8 px-6">
          <p className="text-secondary-text max-w-3xl text-[15px] leading-relaxed whitespace-pre-wrap">
            {bioSection?.bio || "Write a little bit about yourself here..."}
          </p>
        </section>
      </div>

      {/* LINKS SECTION */}
      {linksSection && (
        <section
          className={`group hover:border-border hover:bg-background/50 relative w-full rounded-2xl border border-transparent p-6 transition-colors ${!linksSection.visible ? "opacity-50 grayscale" : ""}`}
          style={(() => {
            const { gap: _gap, ...rest } = getSectionStyle(linksSection);
            return rest;
          })()}
        >
          {renderControls(linksSection)}

          <h2 className="text-tertiary-text mb-4 text-[13px]">
            {linksSection.subtitle || "Links"}
          </h2>
          {linksSection.links && linksSection.links.length > 0 ? (
            <div
              className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
              style={{
                gap: linksSection.gap ? `${linksSection.gap}px` : undefined,
              }}
            >
              {linksSection.links.map((link) => (
                <TemplateLinkCard
                  key={link.id}
                  id={link.id}
                  title={link.title || link.label || ""}
                  url={sanitizeUrl(link.url || "")}
                />
              ))}
            </div>
          ) : (
            <p className="text-tertiary-text border-border rounded-xl border border-dashed py-4 text-center text-sm">
              No links added yet.
            </p>
          )}
        </section>
      )}

      {/* PROJECTS SECTION */}
      {projectsSection &&
        (() => {
          const projectsToRender = projectsSection.projects || [];
          const highlightedProject =
            projectsToRender.find(isProjectHighlighted);
          const remainingProjects = projectsToRender.filter(
            (p) => p.id !== highlightedProject?.id
          );

          return (
            <div className="flex flex-col gap-6">
              <HighlightPreviewCard projectsSection={projectsSection} />
              <section
                className={`group hover:border-border hover:bg-background/50 relative w-full rounded-2xl border border-transparent p-6 transition-colors ${!projectsSection.visible ? "opacity-50 grayscale" : ""}`}
                style={(() => {
                  const { gap: _gap, ...rest } =
                    getSectionStyle(projectsSection);
                  return rest;
                })()}
              >
                {renderControls(projectsSection)}

                <h2 className="text-tertiary-text mb-6 text-[13px]">
                  {projectsSection.subtitle || "Featured Projects"}
                </h2>
                {remainingProjects.length > 0 ? (
                  <div
                    className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
                    style={{
                      gap: projectsSection.gap
                        ? `${projectsSection.gap}px`
                        : undefined,
                    }}
                  >
                    {remainingProjects.map((project, idx) => {
                      const numberStr = String(idx + 1).padStart(2, "0");
                      return (
                        <div
                          key={project.id}
                          className="group/proj border-border bg-background flex flex-col overflow-hidden rounded-[12px] border shadow-sm transition-shadow hover:shadow-md"
                        >
                          <div className="bg-secondary-bg border-border relative aspect-16/10 w-full overflow-hidden border-b">
                            {getImageUrl(project.imageSrc) ? (
                              <Image
                                src={getImageUrl(project.imageSrc) || ""}
                                alt={project.title || "Project"}
                                fill
                                className="object-cover transition-transform duration-500 group-hover/proj:scale-[1.02]"
                                unoptimized
                              />
                            ) : (
                              <div className="h-full w-full bg-neutral-200 transition-transform duration-500 group-hover/proj:scale-[1.02]" />
                            )}
                          </div>

                          <div className="flex flex-col p-6">
                            <div className="mb-1 flex items-start gap-2">
                              <span className="text-primary-text text-[16px] font-bold">
                                {numberStr}
                              </span>
                              <h3 className="text-primary-text text-[16px] font-bold">
                                {project.title}
                              </h3>
                            </div>

                            {project.description && (
                              <p className="text-secondary-text mb-6 ml-6 line-clamp-2 text-[13px]">
                                {project.description}
                              </p>
                            )}

                            {project.url && (
                              <a
                                href={sanitizeUrl(project.url)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-brand-hover-bg mt-auto ml-6 inline-flex items-center gap-1.5 text-[13px] font-bold hover:underline"
                              >
                                {project.buttonText || "View Project"}
                                <ArrowRight size={14} strokeWidth={2.5} />
                              </a>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-tertiary-text border-border rounded-xl border border-dashed py-4 text-center text-sm">
                    No projects added yet.
                  </p>
                )}
              </section>
            </div>
          );
        })()}

      {/* CTA SECTION */}
      {ctaSection && (
        <section
          className={`group hover:border-border hover:bg-background/50 relative w-full rounded-2xl border border-transparent p-6 transition-colors ${!ctaSection.visible ? "opacity-50 grayscale" : ""}`}
          style={getSectionStyle(ctaSection)}
        >
          {renderControls(ctaSection)}

          <div className="flex flex-col justify-between gap-6 py-4 md:flex-row md:items-center">
            <div className="flex items-center gap-4">
              <div className="bg-brand-hover-bg flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white shadow-sm">
                <Rocket size={24} strokeWidth={2} />
              </div>
              <div className="flex flex-col">
                <h3 className="text-primary-text text-[16px] font-bold">
                  {ctaSection.title || "Interested in working together?"}
                </h3>
                <p className="text-secondary-text mt-0.5 text-[13px]">
                  {ctaSection.subtitle ||
                    "I am currently available for freelance project"}
                </p>
              </div>
            </div>
            <a
              href={sanitizeUrl(ctaSection.url)}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-brand-hover-bg hover:bg-button-brand-bg inline-flex h-10 items-center justify-center rounded-md px-6 text-[14px] font-bold whitespace-nowrap text-white shadow-sm transition-all active:scale-95"
            >
              {ctaSection.buttonText || "Let's Connect"}
            </a>
          </div>
        </section>
      )}
    </div>
  );
}

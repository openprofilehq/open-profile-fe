import React from "react";
import Image from "next/image";
import {
  ExternalLink,
  ChevronRight,
  MessageSquare,
  ImageIcon,
  Eye,
  EyeOff,
  Trash2,
  MoreHorizontal,
} from "lucide-react";
import {
  getImageUrl,
  sanitizeUrl,
  getSectionStyle,
  isProjectHighlighted,
} from "@/utils/profile";
import type { Section, ProfilePreview } from "../types";
import HighlightPreviewCard from "./HighlightPreviewCard";

interface DefaultPreviewProps {
  sections: Section[];
  profile?: ProfilePreview | null;
  selectedSectionId?: string | null;
  onToggleSectionVisibility: (id: string) => void;
  onRemoveSection: (id: string) => void;
}

export default function DefaultPreview({
  sections,
  profile,
  selectedSectionId: _selectedSectionId,
  onToggleSectionVisibility,
  onRemoveSection,
}: DefaultPreviewProps) {
  const bioSection = sections.find((s) => s.type === "bio");
  const linksSection = sections.find((s) => s.type === "links");
  const projectsSection = sections.find((s) => s.type === "projects");
  const ctaSection = sections.find(
    (s) => s.type === "experience" || s.type === "cta"
  );

  const projectsToRender = projectsSection?.projects || [];

  const highlightedProject = projectsToRender.find(isProjectHighlighted);
  const remainingProjects = projectsToRender.filter(
    (p) => p.id !== highlightedProject?.id
  );

  const rawPhotoUrl = profile?.photoUrl;
  const profileImageUrl = rawPhotoUrl
    ? rawPhotoUrl.startsWith("/profile-preview/")
      ? rawPhotoUrl
      : getImageUrl(rawPhotoUrl)
    : null;

  const renderControls = (section?: Section, isBio: boolean = false) => {
    if (!section) return null;
    return (
      <div className="group/menu absolute top-4 right-4 z-50">
        <button className="text-tertiary-text hover:text-primary-text hover:bg-hover-bg bg-background/80 border-border/50 flex h-8 w-8 cursor-pointer items-center justify-center rounded-[8px] border backdrop-blur-sm transition-colors">
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
                <EyeOff size={16} /> Hide
              </>
            ) : (
              <>
                <Eye size={16} /> Show
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
      className="text-primary-text mx-auto flex w-full max-w-4xl flex-col py-8 pt-6"
      style={{ gap: "var(--op-spacing, 1.5rem)" }}
    >
      {/* BIO / SUMMARY CARD */}
      <div
        className={`group relative transition-opacity duration-200 ${!bioSection?.visible ? "opacity-50 grayscale" : ""}`}
      >
        {renderControls(bioSection, true)}
        <section
          className="border-border bg-background flex flex-col gap-5 rounded-[12px] border p-6 pr-14 shadow-sm md:flex-row md:items-start"
          style={getSectionStyle(bioSection)}
        >
          {profileImageUrl ? (
            <Image
              src={profileImageUrl}
              alt={profile?.fullName ?? "Profile avatar"}
              width={96}
              height={96}
              unoptimized
              className="h-24 w-24 shrink-0 rounded-full object-cover"
            />
          ) : (
            <div className="bg-brand-subtle-bg text-brand-hover-bg flex h-24 w-24 shrink-0 items-center justify-center rounded-full text-3xl font-bold">
              {profile?.fullName?.charAt(0).toUpperCase() ?? "U"}
            </div>
          )}

          <div className="min-w-0 flex-1">
            <h2 className="text-3xl font-bold break-all">
              {profile?.fullName ?? "No Name"}
            </h2>
            <p className="text-primary-text mt-4 max-w-[650px] text-xl leading-8 break-all whitespace-pre-wrap">
              {bioSection?.bio || profile?.bio || "No bio added yet."}
            </p>
          </div>
        </section>
      </div>

      {/* LINKS CARD */}
      {linksSection && (
        <div
          className={`group relative transition-opacity duration-200 ${!linksSection.visible ? "opacity-50 grayscale" : ""}`}
        >
          {renderControls(linksSection)}
          <section
            className="border-border bg-background rounded-[12px] border p-6 pr-14 shadow-sm"
            style={getSectionStyle(linksSection)}
          >
            <h2 className="text-2xl font-bold">
              {linksSection.subtitle || "Featured Links"}
            </h2>

            {linksSection.links && linksSection.links.length > 0 ? (
              <div className="mt-6 flex flex-col gap-4">
                {linksSection.links.map((item, index) => {
                  const displayImg = getImageUrl(item.imageSrc);
                  return (
                    <a
                      key={item.id ?? index}
                      href={sanitizeUrl(item.url || "")}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="border-border hover:border-brand-hover-bg/30 flex items-center justify-between rounded-[18px] border p-4 no-underline transition-colors"
                    >
                      <div className="flex items-center gap-5">
                        <span className="border-border bg-secondary-bg flex h-14 w-14 items-center justify-center overflow-hidden rounded-[12px] border">
                          {displayImg ? (
                            <Image
                              src={displayImg}
                              alt={item.title ?? "Link"}
                              width={56}
                              height={56}
                              className="object-cover"
                              unoptimized
                            />
                          ) : item.iconSrc ? (
                            <Image
                              src={item.iconSrc}
                              alt={item.title ?? "Link"}
                              width={24}
                              height={24}
                              unoptimized
                            />
                          ) : (
                            <ImageIcon
                              className="text-tertiary-text"
                              size={24}
                            />
                          )}
                        </span>
                        <div className="min-w-0">
                          <h3 className="text-primary-text font-bold break-all">
                            {item.title}
                          </h3>
                          <p className="text-tertiary-text text-sm break-all">
                            {item.url}
                          </p>
                        </div>
                      </div>
                      <span className="border-border bg-secondary-bg group-hover:text-brand-hover-bg flex h-10 w-10 items-center justify-center rounded-full border transition-colors">
                        <ExternalLink
                          className="text-tertiary-text"
                          size={20}
                        />
                      </span>
                    </a>
                  );
                })}
              </div>
            ) : (
              <span className="text-secondary-text mt-4 flex items-center justify-between text-sm">
                No links added yet
              </span>
            )}
          </section>
        </div>
      )}

      {/* HIGHLIGHT CARD */}
      <HighlightPreviewCard projectsSection={projectsSection} />

      {/* PROJECTS CARD */}
      {projectsSection && (
        <div
          className={`group relative transition-opacity duration-200 ${!projectsSection.visible ? "opacity-50 grayscale" : ""}`}
        >
          {renderControls(projectsSection)}
          <section className="border-border bg-background w-full rounded-[12px] border shadow-sm">
            <h2 className="p-4 pr-14 text-2xl font-bold">
              {projectsSection.subtitle || "Selected Projects"}
            </h2>

            {(() => {
              return remainingProjects.length > 0 ? (
                <div
                  className={`grid gap-6 p-6 ${
                    projectsSection.layout === "1"
                      ? "grid-cols-1"
                      : projectsSection.layout === "3"
                        ? "grid-cols-1 sm:grid-cols-2"
                        : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
                  }`}
                >
                  {remainingProjects.map((project, index) => {
                    const hasUrl = Boolean(project.url);
                    const rawImageSrc = (project as { imageSrc?: string })
                      .imageSrc;
                    const displayImg = rawImageSrc
                      ? rawImageSrc.startsWith("/profile-preview/")
                        ? rawImageSrc
                        : getImageUrl(rawImageSrc)
                      : null;

                    const card = (
                      <div
                        className={`group flex ${projectsSection.layout === "1" ? "flex-col sm:flex-row sm:items-center" : "flex-col"} gap-4`}
                      >
                        <div
                          className={`border-border bg-secondary-bg relative shrink-0 overflow-hidden rounded-[8px] border shadow-sm ${
                            projectsSection.layout === "1"
                              ? "aspect-video w-full sm:w-[280px]"
                              : "aspect-video w-full"
                          }`}
                        >
                          {displayImg ? (
                            <Image
                              src={displayImg}
                              alt={project.title ?? "Project preview"}
                              fill
                              className="object-cover transition-transform duration-300 group-hover:scale-105"
                              unoptimized
                            />
                          ) : (
                            <div className="text-tertiary-text flex h-full w-full items-center justify-center bg-neutral-200 text-sm">
                              No image
                            </div>
                          )}
                        </div>
                        <div className="flex min-w-0 flex-1 flex-col gap-1">
                          <h3 className="text-primary-text font-bold break-all">
                            {project.title}
                          </h3>
                          {project.description && (
                            <p className="text-secondary-text line-clamp-2 text-sm break-all">
                              {project.description}
                            </p>
                          )}
                          {hasUrl && projectsSection.layout !== "1" && (
                            <span className="text-brand-hover-bg mt-1 flex items-center gap-1 text-sm font-semibold group-hover:underline">
                              {(project as { buttonText?: string })
                                .buttonText || "View project"}{" "}
                              <ExternalLink size={14} />
                            </span>
                          )}
                        </div>

                        {/* BUTTON FOR LAYOUT 1 */}
                        {projectsSection.layout === "1" && (
                          <div className="mt-4 shrink-0 sm:mt-0 sm:ml-6">
                            <span className="text-brand-hover-bg flex items-center gap-1 text-sm font-bold hover:underline">
                              {(project as { buttonText?: string })
                                .buttonText || "View project"}
                              <ChevronRight size={16} />
                            </span>
                          </div>
                        )}
                      </div>
                    );

                    return hasUrl ? (
                      <a
                        key={project.id || index}
                        href={sanitizeUrl(project.url)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block no-underline"
                      >
                        {card}
                      </a>
                    ) : (
                      <div
                        key={project.id || index}
                        className="block no-underline"
                      >
                        {card}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <span className="text-secondary-text flex items-center justify-between p-4 text-sm">
                  Add your projects
                </span>
              );
            })()}
          </section>
        </div>
      )}

      {/* CTA CARD */}
      {ctaSection && (
        <div
          className={`group relative transition-opacity duration-200 ${!ctaSection.visible ? "opacity-50 grayscale" : ""}`}
        >
          {renderControls(ctaSection)}
          <section className="border-border bg-background relative w-full rounded-[12px] border p-16 pt-12 shadow-sm">
            <div className="flex flex-col items-center gap-4">
              <span className="inline-flex items-center gap-2 rounded-md border p-2 text-sm font-medium">
                <MessageSquare size={12} />
              </span>
              <h4 className="text-center text-2xl font-bold break-all">
                {ctaSection.title || "Your CTA"}
              </h4>

              {ctaSection.title || ctaSection.url ? (
                <a
                  href={sanitizeUrl(ctaSection.url || "#")}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    if (!ctaSection.url) e.preventDefault();
                  }}
                  className="bg-brand-hover-bg hover:bg-button-brand-bg inline-flex h-11 items-center rounded-xl px-8 text-sm font-bold text-white transition-colors"
                >
                  {ctaSection.buttonText || "Visit"}
                </a>
              ) : (
                <span className="text-brand-hover-bg flex cursor-pointer items-center gap-1 text-sm font-semibold hover:underline">
                  Add your CTA <ChevronRight size={14} />
                </span>
              )}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

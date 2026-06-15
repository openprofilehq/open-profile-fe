import React from "react";
import Image from "next/image";
import { ExternalLink, ChevronRight } from "lucide-react";
import {
  getImageUrl,
  sanitizeUrl,
  getSectionStyle,
  isProjectHighlighted,
} from "@/utils/profile";
import type { Section, ProfilePreview, SavedLink, ProjectItem } from "../types";
import { getFontClass } from "../../templates/TemplateAppearanceProvider";
import { getLinkIcon } from "../../shared/TemplateLinkCard";
import HighlightPreviewCard from "./HighlightPreviewCard";
import PreviewSectionControls from "./PreviewSectionControls";

interface DefaultPreviewProps {
  sections: Section[];
  profile?: ProfilePreview | null;
  selectedSectionId?: string | null;
  onToggleSectionVisibility: (id: string) => void;
  onRemoveSection: (id: string) => void;
  onSelectSection: (id: string) => void;
}

export default function DefaultPreview({
  sections,
  profile,
  selectedSectionId: _selectedSectionId,
  onToggleSectionVisibility,
  onRemoveSection,
  onSelectSection,
}: DefaultPreviewProps) {
  const rawPhotoUrl = profile?.photoUrl;
  const profileImageUrl = rawPhotoUrl
    ? rawPhotoUrl.startsWith("/profile-preview/")
      ? rawPhotoUrl
      : getImageUrl(rawPhotoUrl)
    : null;

  const visibleSections = sections.filter(
    (section) => section.type === "bio" || section.visible
  );

  const handleSelectSection = (
    event: React.MouseEvent<HTMLElement>,
    section: Section
  ) => {
    event.preventDefault();
    onSelectSection(section.id);
  };

  const handleSectionKeyDown = (
    event: React.KeyboardEvent<HTMLElement>,
    section: Section
  ) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    if (event.target !== event.currentTarget) return;

    event.preventDefault();
    onSelectSection(section.id);
  };

  const renderControls = (
    section?: Section,
    positionClass = "top-4 right-4",
    hoverTarget: "section" | "cta" = "section"
  ) => (
    <PreviewSectionControls
      section={section}
      positionClass={positionClass}
      hoverTarget={hoverTarget}
      onToggleSectionVisibility={onToggleSectionVisibility}
      onRemoveSection={onRemoveSection}
    />
  );

  return (
    <div
      className="text-primary-text mx-auto flex w-full max-w-4xl flex-col py-12"
      style={{ gap: "var(--op-spacing, 1.5rem)" }}
    >
      {visibleSections.map((section) => {
        if (section.type === "bio") {
          return (
            <div
              key={section.id}
              role="button"
              tabIndex={0}
              onClick={(event) => handleSelectSection(event, section)}
              onKeyDown={(event) => handleSectionKeyDown(event, section)}
              className={`group relative cursor-pointer transition-opacity duration-200 ${section.font ? getFontClass(section.font) : ""}`}
            >
              <section
                className="border-border bg-background flex flex-col gap-5 rounded-[12px] border p-6 pr-14 shadow-sm md:flex-row md:items-start"
                style={getSectionStyle(section)}
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
                    {section.bio || profile?.bio || "No bio added yet."}
                  </p>
                </div>
              </section>
            </div>
          );
        }

        if (section.type === "links") {
          return (
            <div
              key={section.id}
              role="button"
              tabIndex={0}
              onClick={(event) => handleSelectSection(event, section)}
              onKeyDown={(event) => handleSectionKeyDown(event, section)}
              className={`group relative cursor-pointer transition-opacity duration-200 ${!section.visible ? "opacity-50 grayscale" : ""} ${section.font ? getFontClass(section.font) : ""}`}
            >
              {renderControls(section)}
              <section
                className="border-border bg-background rounded-[12px] border p-6 pr-14 shadow-sm"
                style={(() => {
                  const { gap: _gap, ...rest } = getSectionStyle(section);
                  return rest;
                })()}
              >
                <h2 className="text-2xl font-bold">
                  {section.subtitle || "Featured Links"}
                </h2>

                {section.links && section.links.length > 0 ? (
                  <div
                    className="mt-6 flex flex-col gap-4"
                    style={{
                      gap: section.gap ? `${section.gap}px` : undefined,
                    }}
                  >
                    {section.links.map((item: SavedLink, index: number) => {
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
                                  src={getImageUrl(item.iconSrc)}
                                  alt={item.title ?? "Link"}
                                  width={24}
                                  height={24}
                                  unoptimized
                                />
                              ) : (
                                <span className="text-brand-hover-bg">
                                  {getLinkIcon(
                                    (item.url || "") + " " + (item.title || "")
                                  )}
                                </span>
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
          );
        }

        if (section.type === "projects") {
          const projectsToRender = section.projects || [];
          const highlightedProject =
            projectsToRender.find(isProjectHighlighted);
          const remainingProjects = projectsToRender.filter(
            (p: { id?: string | number }) => p.id !== highlightedProject?.id
          );

          return (
            <div
              key={section.id}
              role="button"
              tabIndex={0}
              onClick={(event) => handleSelectSection(event, section)}
              onKeyDown={(event) => handleSectionKeyDown(event, section)}
              className="group relative flex cursor-pointer flex-col gap-6"
            >
              {renderControls(section)}
              {/* HIGHLIGHT CARD */}
              <HighlightPreviewCard projectsSection={section} />

              <div
                className={`group relative transition-opacity duration-200 ${!section.visible ? "opacity-50 grayscale" : ""} ${section.font ? getFontClass(section.font) : ""}`}
              >
                <section
                  className="border-border bg-background w-full rounded-[12px] border shadow-sm"
                  style={getSectionStyle(section)}
                >
                  <div className="flex flex-col p-4 pr-14">
                    {section.title && (
                      <h2 className="text-2xl font-bold">{section.title}</h2>
                    )}
                    {(section.subtitle || !section.title) && (
                      <p className="text-tertiary-text mt-1 text-[15px]">
                        {section.subtitle || "Selected Projects"}
                      </p>
                    )}
                  </div>

                  {(() => {
                    return remainingProjects.length > 0 ? (
                      <div
                        className={`grid gap-6 p-6 ${
                          section.layout === "1"
                            ? "grid-cols-1"
                            : section.layout === "3" || section.layout === "4"
                              ? "grid-cols-1 xl:grid-cols-2"
                              : "grid-cols-1 sm:grid-cols-2 md:grid-cols-2"
                        }`}
                        style={{
                          gap: section.gap ? `${section.gap}px` : undefined,
                        }}
                      >
                        {remainingProjects.map(
                          (project: ProjectItem, index: number) => {
                            const layoutType = section.layout || "2";
                            const hasUrl = Boolean(project.url);
                            const rawImageSrc = (
                              project as { imageSrc?: string }
                            ).imageSrc;
                            const displayImg = rawImageSrc
                              ? rawImageSrc.startsWith("/profile-preview/")
                                ? rawImageSrc
                                : getImageUrl(rawImageSrc)
                              : null;

                            const card = (
                              <div
                                className={`group flex h-full rounded-[12px] p-4 ${
                                  layoutType === "1" || layoutType === "2"
                                    ? "flex-col"
                                    : layoutType === "3"
                                      ? "flex-col sm:flex-row sm:items-center"
                                      : "flex-col sm:flex-row-reverse sm:items-center"
                                } gap-4`}
                              >
                                <div
                                  className={`border-border bg-secondary-bg relative shrink-0 overflow-hidden rounded-[8px] border shadow-sm ${
                                    layoutType === "1" || layoutType === "2"
                                      ? "aspect-video w-full"
                                      : "h-24 w-full sm:h-24 sm:w-24"
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
                                <div
                                  className={`flex min-w-0 flex-1 flex-col items-start gap-1 ${
                                    layoutType === "3" || layoutType === "4"
                                      ? "justify-center"
                                      : ""
                                  }`}
                                >
                                  <h3 className="text-primary-text font-bold break-all">
                                    {project.title}
                                  </h3>
                                  {project.description && (
                                    <p className="text-secondary-text line-clamp-2 text-sm break-all">
                                      {project.description}
                                    </p>
                                  )}
                                  {hasUrl && (
                                    <span className="text-brand-hover-bg mt-2 flex items-center gap-1 text-sm font-semibold group-hover:underline">
                                      {(project as { buttonText?: string })
                                        .buttonText || "View project"}{" "}
                                      <ExternalLink size={14} />
                                    </span>
                                  )}
                                </div>
                              </div>
                            );

                            return hasUrl ? (
                              <a
                                key={project.id || index}
                                href={sanitizeUrl(project.url)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block h-full no-underline"
                              >
                                {card}
                              </a>
                            ) : (
                              <div
                                key={project.id || index}
                                className="block h-full no-underline"
                              >
                                {card}
                              </div>
                            );
                          }
                        )}
                      </div>
                    ) : (
                      <span className="text-secondary-text flex items-center justify-between p-4 text-sm">
                        Add your projects
                      </span>
                    );
                  })()}
                </section>
              </div>
            </div>
          );
        }

        if (section.type === "experience") {
          return (
            <div
              key={section.id}
              role="button"
              tabIndex={0}
              onClick={(event) => handleSelectSection(event, section)}
              onKeyDown={(event) => handleSectionKeyDown(event, section)}
              className={`group relative cursor-pointer transition-opacity duration-200 ${!section.visible ? "opacity-50 grayscale" : ""} ${section.font ? getFontClass(section.font) : ""}`}
            >
              {renderControls(section)}
              <section
                className="border-border bg-background relative w-full rounded-[12px] border p-16 pt-12 shadow-sm"
                style={getSectionStyle(section)}
              >
                <div
                  className={`flex flex-col gap-4 ${section.layout === "2" ? "items-start text-left" : section.layout === "3" ? "items-end text-right" : "items-center text-center"}`}
                  style={{
                    gap: section.gap ? `${section.gap}px` : undefined,
                  }}
                >
                  {section.iconSrc && (
                    <span className="inline-flex items-center gap-2 p-2 font-medium">
                      <div
                        className="bg-brand-hover-bg h-8 w-8"
                        style={{
                          maskImage: `url(${section.iconSrc})`,
                          WebkitMaskImage: `url(${section.iconSrc})`,
                          maskSize: "contain",
                          WebkitMaskSize: "contain",
                          maskRepeat: "no-repeat",
                          WebkitMaskRepeat: "no-repeat",
                          maskPosition: "center",
                          WebkitMaskPosition: "center",
                        }}
                      />
                    </span>
                  )}
                  <div
                    className={`flex flex-col gap-2 ${section.layout === "2" ? "items-start text-left" : section.layout === "3" ? "items-end text-right" : "items-center text-center"}`}
                  >
                    <h4 className="text-2xl font-bold break-all">
                      {section.title || "Your CTA"}
                    </h4>
                    {section.subtitle && (
                      <p className="text-secondary-text text-[15px] break-all whitespace-pre-wrap">
                        {section.subtitle}
                      </p>
                    )}
                  </div>
                  {section.title || section.url ? (
                    <a
                      href={sanitizeUrl(section.url || "#")}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => {
                        if (!section.url) e.preventDefault();
                      }}
                      className="op-brand-fill bg-brand-hover-bg hover:bg-button-brand-bg inline-flex h-11 items-center rounded-xl px-8 text-sm font-bold text-white transition-colors"
                    >
                      {section.buttonText || "Visit"}
                    </a>
                  ) : (
                    <span className="text-brand-hover-bg flex cursor-pointer items-center gap-1 text-sm font-semibold hover:underline">
                      Add your CTA <ChevronRight size={14} />
                    </span>
                  )}
                </div>
              </section>
            </div>
          );
        }

        return null;
      })}
    </div>
  );
}

import React from "react";
import Image from "next/image";
import {
  Mail,
  Link as LinkIcon,
  ArrowRight,
  Eye,
  EyeOff,
  Trash2,
} from "lucide-react";
import {
  getImageUrl,
  sanitizeUrl,
  getDisplayProfileUrl,
} from "@/utils/profile";
import type { Section, ProfilePreview } from "../types";

interface ProfessionalPreviewProps {
  sections: Section[];
  profile?: ProfilePreview | null;
  selectedSectionId?: string | null;
  onToggleSectionVisibility: (id: string) => void;
  onRemoveSection: (id: string) => void;
}

export default function ProfessionalPreview({
  sections,
  profile,
  selectedSectionId,
  onToggleSectionVisibility,
  onRemoveSection,
}: ProfessionalPreviewProps) {
  const bioSection = sections.find((s) => s.type === "bio");
  const linksSection = sections.find((s) => s.type === "links");
  const projectsSection = sections.find((s) => s.type === "projects");
  const ctaSection = sections.find((s) => s.type === "experience");
  const bioSectionId = bioSection?.id ?? "bio";

  const sectionStyle = (section: Section): React.CSSProperties => ({
    ...(section.bgColor && { backgroundColor: section.bgColor }),
    ...(section.textColor && { color: section.textColor }),
    ...(section.padding != null && { padding: section.padding }),
    ...(section.paddingTop != null && { paddingTop: section.paddingTop }),
    ...(section.paddingBottom != null && {
      paddingBottom: section.paddingBottom,
    }),
    ...(section.gap != null && { gap: section.gap }),
  });

  return (
    <div
      className="text-primary-text mx-auto flex w-full max-w-4xl flex-col py-8 pt-12"
      style={{ gap: "calc(var(--op-spacing, 24px) * 2)" }}
    >
      {/* HEADER SECTION (Bio) */}
      {bioSection?.visible && (
        <div
          className={`group relative transition-opacity duration-200 ${selectedSectionId && selectedSectionId !== bioSectionId ? "opacity-50" : ""}`}
          style={sectionStyle(bioSection)}
        >
          {bioSection && (
            <div className="border-border bg-background absolute -top-12 right-0 z-10 flex w-24 items-center justify-between gap-3 rounded-[10px] border p-3 shadow-none select-none">
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

          <header
            className="hover:border-border hover:bg-background/50 relative flex w-full flex-col justify-between rounded-2xl border border-transparent transition-colors sm:flex-row sm:items-start"
            style={{
              gap: "var(--op-spacing, 24px)",
              padding: "var(--op-spacing, 24px)",
            }}
          >
            <div
              className="flex items-center"
              style={{ gap: "var(--op-spacing, 24px)" }}
            >
              <div className="border-border bg-secondary-bg relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-full border">
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
                {/* Online indicator dot */}
                <div className="border-background absolute right-1 bottom-1 h-3.5 w-3.5 rounded-full border-2 bg-green-500" />
              </div>

              <div className="flex flex-col">
                <h1 className="text-primary-text text-[28px] leading-tight font-bold tracking-tight">
                  {profile?.fullName || "Micaela Robinson"}
                </h1>
                <p className="text-secondary-text mt-1 text-[15px]">
                  {getDisplayProfileUrl(profile?.username || "micaela")}
                </p>
              </div>
            </div>

            {ctaSection?.visible && ctaSection?.url && (
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="border-brand-hover-bg bg-brand-hover-bg/5 text-brand-hover-bg hover:bg-brand-hover-bg/10 inline-flex h-9 items-center justify-center gap-2 rounded-md border px-4 text-sm font-semibold transition-colors"
              >
                {ctaSection.iconSrc ? (
                  <Image
                    src={ctaSection.iconSrc}
                    alt=""
                    width={16}
                    height={16}
                    className="object-contain"
                  />
                ) : (
                  <Mail size={16} />
                )}
                {ctaSection.buttonText || "Email"}
              </a>
            )}
          </header>

          <section style={{ paddingInline: "var(--op-spacing, 24px)" }}>
            <p className="text-secondary-text max-w-2xl text-[16px] leading-relaxed whitespace-pre-wrap">
              {bioSection?.bio || "Write a little bit about yourself here..."}
            </p>
          </section>
        </div>
      )}

      {/* LINKS SECTION */}
      {linksSection?.visible && (
        <section
          className={`group hover:border-border hover:bg-background/50 relative w-full rounded-2xl border border-transparent transition-colors ${selectedSectionId && selectedSectionId !== linksSection.id ? "opacity-50" : ""}`}
          style={{
            padding: "var(--op-spacing, 24px)",
            ...sectionStyle(linksSection),
          }}
        >
          <div className="border-border bg-background absolute -top-12 right-0 z-10 flex w-24 items-center justify-between gap-3 rounded-[10px] border p-3 shadow-none select-none">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleSectionVisibility(linksSection.id);
              }}
              className="text-secondary-text hover:opacity-80"
            >
              {linksSection.visible ? (
                <Eye size={18} strokeWidth={2} />
              ) : (
                <EyeOff size={18} strokeWidth={2} />
              )}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemoveSection(linksSection.id);
              }}
              className="text-negative-text hover:opacity-80"
            >
              <Trash2 size={18} strokeWidth={2} />
            </button>
          </div>

          <h2 className="text-tertiary-text mb-4 text-[13px]">
            {linksSection.subtitle || "Links"}
          </h2>
          <div className="flex flex-col">
            {linksSection.links && linksSection.links.length > 0 ? (
              linksSection.links.map((link, idx) => {
                const displayUrl =
                  link.url
                    ?.replace(/^https?:\/\/(www\.)?/, "")
                    ?.replace(/\/$/, "") || "link";
                return (
                  <a
                    key={link.id}
                    href={sanitizeUrl(link.url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group/link hover:bg-hover-bg flex items-center justify-between py-4 transition-colors ${
                      idx === 0
                        ? "border-border border-y"
                        : "border-border border-b"
                    }`}
                  >
                    <span className="text-primary-text text-[15px] font-bold">
                      {link.title || link.label}
                    </span>
                    <span className="text-secondary-text group-hover/link:text-brand-hover-bg flex items-center gap-2 text-[14px] transition-colors">
                      {displayUrl}
                      <LinkIcon size={14} />
                    </span>
                  </a>
                );
              })
            ) : (
              <p className="text-tertiary-text border-border rounded-xl border border-dashed py-4 text-center text-sm">
                No links added yet.
              </p>
            )}
          </div>
        </section>
      )}

      {/* PROJECTS SECTION */}
      {projectsSection?.visible && (
        <section
          className={`group hover:border-border hover:bg-background/50 relative w-full rounded-2xl border border-transparent transition-colors ${selectedSectionId && selectedSectionId !== projectsSection.id ? "opacity-50" : ""}`}
          style={{
            padding: "var(--op-spacing, 24px)",
            ...sectionStyle(projectsSection),
          }}
        >
          <div className="border-border bg-background absolute -top-12 right-0 z-10 flex w-24 items-center justify-between gap-3 rounded-[10px] border p-3 shadow-none select-none">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleSectionVisibility(projectsSection.id);
              }}
              className="text-secondary-text hover:opacity-80"
            >
              {projectsSection.visible ? (
                <Eye size={18} strokeWidth={2} />
              ) : (
                <EyeOff size={18} strokeWidth={2} />
              )}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemoveSection(projectsSection.id);
              }}
              className="text-negative-text hover:opacity-80"
            >
              <Trash2 size={18} strokeWidth={2} />
            </button>
          </div>

          <h2 className="text-tertiary-text mb-4 text-[13px]">
            {projectsSection.subtitle || "Selected Work"}
          </h2>
          {projectsSection.projects && projectsSection.projects.length > 0 ? (
            <div
              className={`grid ${projectsSection.layout === "1" ? "grid-cols-1" : projectsSection.layout === "3" || projectsSection.layout === "4" ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1 sm:grid-cols-2"}`}
              style={{ gap: "var(--op-spacing, 24px)" }}
            >
              {projectsSection.projects.map((project) => {
                const layoutType = projectsSection.layout || "1";
                const img = getImageUrl(project.imageSrc);
                return (
                  <div
                    key={project.id}
                    className={`border-border bg-background flex rounded-xl border shadow-sm transition-shadow hover:shadow-md ${
                      layoutType === "4"
                        ? "flex-col sm:flex-row-reverse sm:items-start"
                        : layoutType === "3"
                          ? "flex-col sm:flex-row sm:items-start"
                          : layoutType === "2"
                            ? "flex-col"
                            : "flex-col items-start sm:flex-row sm:items-center"
                    }`}
                    style={{ padding: "var(--op-spacing, 24px)" }}
                  >
                    {layoutType !== "1" && (
                      <div
                        className={`bg-secondary-bg border-border relative shrink-0 overflow-hidden rounded-lg border ${layoutType === "2" ? "mb-4 aspect-video w-full" : "mb-4 h-[100px] w-full sm:mb-0 sm:w-[120px]"} ${layoutType === "3" ? "sm:mr-4" : ""} ${layoutType === "4" ? "sm:ml-4" : ""}`}
                      >
                        {img ? (
                          <Image
                            src={img}
                            alt={project.title || ""}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        ) : (
                          <div className="h-full w-full bg-neutral-200" />
                        )}
                      </div>
                    )}
                    {layoutType === "1" && (
                      <div className="bg-secondary-bg border-border relative mb-4 h-[80px] w-full shrink-0 overflow-hidden rounded-lg border sm:mb-0 sm:w-[120px]">
                        {img ? (
                          <Image
                            src={img}
                            alt={project.title || ""}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        ) : (
                          <div className="h-full w-full bg-neutral-200" />
                        )}
                      </div>
                    )}
                    <div
                      className={`flex min-w-0 flex-1 flex-col ${layoutType === "1" ? "sm:ml-6" : ""}`}
                    >
                      <h3 className="text-primary-text text-[15px] font-bold">
                        {project.title}
                      </h3>
                      {project.description && (
                        <p className="text-secondary-text mt-1 line-clamp-2 text-[13px]">
                          {project.description}
                        </p>
                      )}
                      <span className="text-brand-hover-bg mt-3 inline-flex items-center gap-1 text-[13px] font-bold">
                        {project.url
                          ? project.buttonText || "View Project"
                          : "Edit project"}
                        <ArrowRight size={14} strokeWidth={2.5} />
                      </span>
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
      )}

      {/* CTA SECTION */}
      {ctaSection?.visible && (
        <section
          className={`group hover:border-border hover:bg-background/50 relative w-full rounded-2xl border border-transparent transition-colors ${selectedSectionId && selectedSectionId !== ctaSection.id ? "opacity-50" : ""}`}
          style={{
            padding: "var(--op-spacing, 24px)",
            ...sectionStyle(ctaSection),
          }}
        >
          <div className="border-border bg-background absolute -top-12 right-0 z-10 flex w-24 items-center justify-between gap-3 rounded-[10px] border p-3 shadow-none select-none">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleSectionVisibility(ctaSection.id);
              }}
              className="text-secondary-text hover:opacity-80"
            >
              {ctaSection.visible ? (
                <Eye size={18} strokeWidth={2} />
              ) : (
                <EyeOff size={18} strokeWidth={2} />
              )}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemoveSection(ctaSection.id);
              }}
              className="text-negative-text hover:opacity-80"
            >
              <Trash2 size={18} strokeWidth={2} />
            </button>
          </div>

          {ctaSection.layout === "2" ? (
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h3 className="text-primary-text text-[16px] font-bold">
                  {ctaSection.title || "Open to new projects."}
                </h3>
                <p className="text-secondary-text mt-0.5 text-[13px]">
                  {ctaSection.subtitle ||
                    "Have an idea or product you're building?"}
                </p>
              </div>
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="bg-brand-hover-bg inline-flex h-10 shrink-0 items-center justify-center rounded-md px-6 text-sm font-bold text-white shadow-sm"
              >
                {ctaSection.buttonText || "Work with me"}
              </a>
            </div>
          ) : ctaSection.layout === "3" ? (
            <div className="flex justify-center">
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="bg-brand-hover-bg inline-flex h-10 items-center justify-center rounded-md px-8 text-sm font-bold text-white shadow-sm"
              >
                {ctaSection.buttonText || "Work with me"}
              </a>
            </div>
          ) : (
            <>
              <h2 className="text-primary-text text-[24px] font-bold tracking-tight">
                {ctaSection.title || "Open to new projects."}
              </h2>
              <p className="text-secondary-text mt-2 mb-6 max-w-[500px] text-[15px]">
                {ctaSection.subtitle ||
                  "Have an idea or product you're building?"}
              </p>
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="bg-brand-hover-bg inline-flex h-10 items-center justify-center rounded-md px-6 text-sm font-bold text-white shadow-sm transition-all"
              >
                {ctaSection.buttonText || "Work with me"}
              </a>
            </>
          )}
        </section>
      )}
    </div>
  );
}

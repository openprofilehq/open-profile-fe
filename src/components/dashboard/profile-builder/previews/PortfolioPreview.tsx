import React from "react";
import Image from "next/image";
import {
  Mail,
  Globe,
  ExternalLink,
  ArrowRight,
  Eye,
  EyeOff,
  Trash2,
} from "lucide-react";
import {
  XIcon,
  InstagramIcon,
  LinkedInIcon,
  GithubIcon,
  YoutubeIcon,
} from "@/components/icons/BrandIcons";
import {
  getImageUrl,
  sanitizeUrl,
  getDisplayProfileUrl,
} from "@/utils/profile";
import type { Section, ProfilePreview } from "../types";

interface PortfolioPreviewProps {
  sections: Section[];
  profile?: ProfilePreview | null;
  selectedSectionId?: string | null;
  onToggleSectionVisibility: (id: string) => void;
  onRemoveSection: (id: string) => void;
}

const getLinkIcon = (title: string = "") => {
  const t = title.toLowerCase();
  if (t.includes("instagram"))
    return <InstagramIcon style={{ fontSize: 18 }} />;
  if (t.includes("twitter") || t === "x")
    return <XIcon style={{ fontSize: 18 }} />;
  if (t.includes("linkedin")) return <LinkedInIcon style={{ fontSize: 18 }} />;
  if (t.includes("github")) return <GithubIcon style={{ fontSize: 18 }} />;
  if (t.includes("youtube")) return <YoutubeIcon style={{ fontSize: 18 }} />;
  return <Globe size={18} />;
};

export default function PortfolioPreview({
  sections,
  profile,
  selectedSectionId,
  onToggleSectionVisibility,
  onRemoveSection,
}: PortfolioPreviewProps) {
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
      className="text-primary-text mx-auto flex w-full max-w-5xl flex-col py-8 pt-12"
      style={{ gap: "calc(var(--op-spacing, 24px) * 2)" }}
    >
      {/* HEADER SECTION (Bio) */}
      {bioSection?.visible && (
        <div
          className={`group relative transition-opacity duration-200 ${selectedSectionId && selectedSectionId !== bioSectionId ? "opacity-50" : ""}`}
          style={sectionStyle(bioSection)}
        >
          {bioSection && (
            <div className="border-border bg-background absolute -top-12 right-0 z-10 flex w-24 items-center justify-between gap-3 rounded-[10px] border p-3 opacity-0 shadow-none transition-opacity select-none group-hover:opacity-100">
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
              className="flex flex-col"
              style={{ gap: "var(--op-spacing, 24px)" }}
            >
              <div className="border-border bg-secondary-bg relative h-[80px] w-[80px] shrink-0 overflow-hidden rounded-full border">
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
              </div>

              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <h1 className="text-primary-text text-[26px] leading-tight font-bold tracking-tight">
                    {profile?.fullName || "John Smith"}
                  </h1>
                </div>
                <p className="text-secondary-text mt-1 text-[14px]">
                  {getDisplayProfileUrl(profile?.username || "johnsmith")}
                </p>
              </div>
            </div>

            {ctaSection?.visible && ctaSection?.url && (
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="border-brand-hover-bg bg-background text-brand-hover-bg hover:bg-brand-hover-bg/5 inline-flex h-9 items-center justify-center gap-2 rounded-md border px-4 text-[13px] font-semibold transition-colors"
              >
                {ctaSection.iconSrc ? (
                  <div
                    className="bg-brand-hover-bg h-4 w-4"
                    style={{
                      maskImage: `url(${ctaSection.iconSrc})`,
                      WebkitMaskImage: `url(${ctaSection.iconSrc})`,
                      maskSize: "contain",
                      WebkitMaskSize: "contain",
                      maskRepeat: "no-repeat",
                      WebkitMaskRepeat: "no-repeat",
                      maskPosition: "center",
                      WebkitMaskPosition: "center",
                    }}
                  />
                ) : (
                  <Mail size={16} />
                )}
                {ctaSection.buttonText || "Email"}
              </a>
            )}
          </header>

          <section style={{ paddingInline: "var(--op-spacing, 24px)" }}>
            <p className="text-secondary-text max-w-3xl text-[15px] leading-relaxed whitespace-pre-wrap">
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
          <div className="border-border bg-background absolute -top-12 right-0 z-10 flex w-24 items-center justify-between gap-3 rounded-[10px] border p-3 opacity-0 shadow-none transition-opacity select-none group-hover:opacity-100">
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
          {linksSection.links && linksSection.links.length > 0 ? (
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
              style={{ gap: "var(--op-spacing, 24px)" }}
            >
              {linksSection.links.map((link) => (
                <a
                  key={link.id}
                  href={sanitizeUrl(link.url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/link border-border bg-background hover:border-brand-hover-bg/30 flex items-center justify-between rounded-xl border shadow-sm transition-all hover:shadow-md"
                  style={{ padding: "var(--op-spacing, 24px)" }}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-primary-text group-hover/link:text-brand-hover-bg transition-colors">
                      {getLinkIcon(link.title || link.label || "")}
                    </div>
                    <span className="text-primary-text text-[14px] font-medium">
                      {link.title || link.label}
                    </span>
                  </div>
                  <ExternalLink
                    size={14}
                    className="text-tertiary-text group-hover/link:text-brand-hover-bg transition-colors"
                  />
                </a>
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
      {projectsSection?.visible && (
        <section
          className={`group hover:border-border hover:bg-background/50 relative w-full rounded-2xl border border-transparent transition-colors ${selectedSectionId && selectedSectionId !== projectsSection.id ? "opacity-50" : ""}`}
          style={{
            padding: "var(--op-spacing, 24px)",
            ...sectionStyle(projectsSection),
          }}
        >
          <div className="border-border bg-background absolute -top-12 right-0 z-10 flex w-24 items-center justify-between gap-3 rounded-[10px] border p-3 opacity-0 shadow-none transition-opacity select-none group-hover:opacity-100">
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

          <h2 className="text-tertiary-text mb-6 text-[13px]">
            {projectsSection.subtitle || "Featured Projects"}
          </h2>
          {projectsSection.projects && projectsSection.projects.length > 0 ? (
            <div
              className={`grid ${projectsSection.layout === "1" ? "grid-cols-1" : projectsSection.layout === "3" || projectsSection.layout === "4" ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"}`}
              style={{ gap: "var(--op-spacing, 24px)" }}
            >
              {projectsSection.projects.map((project) => {
                const layoutType = projectsSection.layout || "2";
                const img = getImageUrl(project.imageSrc);
                return (
                  <div
                    key={project.id}
                    className={`border-border bg-background flex rounded-2xl border shadow-sm transition-shadow hover:shadow-md ${
                      layoutType === "4"
                        ? "flex-col sm:flex-row-reverse sm:items-start"
                        : layoutType === "3"
                          ? "flex-col sm:flex-row sm:items-start"
                          : layoutType === "1"
                            ? "flex-col items-start sm:flex-row sm:items-center"
                            : "flex-col overflow-hidden"
                    }`}
                  >
                    <div
                      className={`bg-secondary-bg border-border relative shrink-0 overflow-hidden ${
                        layoutType === "2"
                          ? "aspect-video w-full border-b"
                          : layoutType === "1"
                            ? "h-[80px] w-full border-b sm:h-full sm:w-[120px] sm:border-r sm:border-b-0"
                            : "h-[100px] w-full border-b sm:aspect-square sm:h-auto sm:w-[120px] sm:border-r sm:border-b-0"
                      }`}
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
                    <div
                      className="flex flex-col"
                      style={{ padding: "var(--op-spacing, 24px)" }}
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
          <div className="border-border bg-background absolute -top-12 right-0 z-10 flex w-24 items-center justify-between gap-3 rounded-[10px] border p-3 opacity-0 shadow-none transition-opacity select-none group-hover:opacity-100">
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

          <div
            className={`flex flex-col ${ctaSection.layout === "2" ? "items-start text-left" : ctaSection.layout === "3" ? "items-end text-right" : "items-center text-center"}`}
          >
            {ctaSection.iconSrc && (
              <div className="mb-6 flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-transparent">
                <div
                  className="bg-brand-hover-bg h-8 w-8"
                  style={{
                    maskImage: `url(${ctaSection.iconSrc})`,
                    WebkitMaskImage: `url(${ctaSection.iconSrc})`,
                    maskSize: "contain",
                    WebkitMaskSize: "contain",
                    maskRepeat: "no-repeat",
                    WebkitMaskRepeat: "no-repeat",
                    maskPosition: "center",
                    WebkitMaskPosition: "center",
                  }}
                />
              </div>
            )}
            <h2 className="text-primary-text text-[28px] font-bold tracking-tight">
              {ctaSection.title || "Interested in working together?"}
            </h2>
            <p className="text-secondary-text mt-3 mb-8 max-w-[600px] text-[16px] leading-relaxed">
              {ctaSection.subtitle ||
                "I am currently available for freelance project"}
            </p>
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="bg-brand-hover-bg hover:bg-button-brand-bg inline-flex h-12 items-center justify-center rounded-xl px-8 text-[15px] font-bold text-white shadow-sm transition-all"
            >
              {ctaSection.buttonText || "Let's Connect"}
            </a>
          </div>
        </section>
      )}
    </div>
  );
}

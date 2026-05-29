import React from "react";
import Image from "next/image";
import {
  BadgeCheck,
  Mail,
  Globe,
  ExternalLink,
  ArrowRight,
  Rocket,
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
import { getImageUrl, sanitizeUrl } from "@/utils/profile";
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

  return (
    <div
      className="text-primary-text mx-auto flex w-full max-w-5xl flex-col py-8 pt-12"
      style={{ gap: "calc(var(--op-spacing, 24px) * 2)" }}
    >
      {/* HEADER SECTION (Bio) */}
      {bioSection?.visible && (
        <div
          className={`group relative transition-opacity duration-200 ${selectedSectionId && selectedSectionId !== bioSectionId ? "opacity-50" : ""}`}
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
                {/* Online indicator dot */}
                <div className="border-background absolute right-1 bottom-1 h-4 w-4 rounded-full border-[3px] bg-green-500" />
              </div>

              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <h1 className="text-primary-text text-[26px] leading-tight font-bold tracking-tight">
                    {profile?.fullName || "John Smith"}
                  </h1>
                  <BadgeCheck
                    className="text-brand-hover-bg"
                    size={20}
                    fill="currentColor"
                    stroke="var(--background)"
                    strokeWidth={1.5}
                  />
                </div>
                <p className="text-secondary-text mt-1 text-[14px]">
                  openprofile.app/{profile?.username || "johnsmith"}
                </p>
              </div>
            </div>

            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="border-brand-hover-bg bg-background text-brand-hover-bg hover:bg-brand-hover-bg/5 inline-flex h-9 items-center justify-center gap-2 rounded-md border px-4 text-[13px] font-semibold transition-colors"
            >
              <Mail size={16} />
              Email
            </a>
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
          style={{ padding: "var(--op-spacing, 24px)" }}
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
          style={{ padding: "var(--op-spacing, 24px)" }}
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

          <h2 className="text-tertiary-text mb-6 text-[13px]">
            {projectsSection.subtitle || "Featured Projects"}
          </h2>
          {projectsSection.projects && projectsSection.projects.length > 0 ? (
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
              style={{ gap: "var(--op-spacing, 24px)" }}
            >
              {projectsSection.projects.map((project, idx) => {
                const numberStr = String(idx + 1).padStart(2, "0");
                return (
                  <div
                    key={project.id}
                    className="group/proj border-border bg-background flex flex-col overflow-hidden rounded-2xl border shadow-sm transition-shadow hover:shadow-md"
                  >
                    <div className="bg-secondary-bg border-border relative aspect-16/10 w-full overflow-hidden border-b">
                      {getImageUrl(project.imageSrc) ? (
                        <Image
                          src={getImageUrl(project.imageSrc)!}
                          alt={project.title || "Project"}
                          fill
                          className="object-cover transition-transform duration-500 group-hover/proj:scale-[1.02]"
                          unoptimized
                        />
                      ) : (
                        <div className="h-full w-full bg-neutral-200 transition-transform duration-500 group-hover/proj:scale-[1.02]" />
                      )}
                    </div>

                    <div
                      className="flex flex-col"
                      style={{ padding: "var(--op-spacing, 24px)" }}
                    >
                      <div className="mb-1 flex items-start gap-2">
                        <span className="text-primary-text text-[16px] font-bold">
                          {numberStr}
                        </span>
                        <h3 className="text-primary-text text-[16px] font-bold">
                          {project.title}
                        </h3>
                      </div>

                      <span className="text-tertiary-text mb-3 ml-6 text-[11px]">
                        Product Design
                      </span>

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
      )}

      {/* CTA SECTION */}
      {ctaSection?.visible && (
        <section
          className={`group hover:border-border hover:bg-background/50 relative w-full rounded-2xl border border-transparent transition-colors ${selectedSectionId && selectedSectionId !== ctaSection.id ? "opacity-50" : ""}`}
          style={{ padding: "var(--op-spacing, 24px)" }}
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

          <div
            className="flex flex-col justify-between md:flex-row md:items-center"
            style={{
              gap: "var(--op-spacing, 24px)",
              paddingBlock: "calc(var(--op-spacing, 24px) * 0.5)",
            }}
          >
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

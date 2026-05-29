import React from "react";
import Image from "next/image";
import {
  Mail,
  Link as LinkIcon,
  ArrowRight,
  Eye,
  EyeOff,
  Trash2,
  MoreHorizontal,
  ExternalLink,
} from "lucide-react";
import { getImageUrl, sanitizeUrl } from "@/utils/profile";
import type { Section, ProfilePreview } from "../types";
import { TemplateLinkCard } from "../../shared/TemplateLinkCard";

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

  return (
    <div className="text-primary-text mx-auto flex w-full max-w-4xl flex-col py-8 pt-6">
      {/* HEADER SECTION (Bio) */}
      <div
        className="group relative mb-12 transition-opacity duration-200"
      >
        {renderControls(bioSection, true)}

        <header className="hover:border-border hover:bg-background/50 relative flex w-full flex-col justify-between gap-6 rounded-2xl border border-transparent p-6 transition-colors sm:flex-row sm:items-start">
          <div className="flex items-center gap-6">
            <div className="border-border bg-secondary-bg relative h-24 w-24 shrink-0 overflow-hidden rounded-full border shadow-sm">
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

            <div className="flex flex-col">
              <h1 className="text-primary-text text-[28px] leading-tight font-bold tracking-tight">
                {profile?.fullName || "Micaela Robinson"}
              </h1>
              <p className="text-secondary-text mt-1 text-[15px]">
                openprofile.app/{profile?.username || "micaela"}
              </p>
            </div>
          </div>

          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="border-brand-hover-bg bg-brand-hover-bg/5 text-brand-hover-bg hover:bg-brand-hover-bg/10 inline-flex h-9 items-center justify-center gap-2 rounded-md border px-4 text-sm font-semibold transition-colors"
          >
            <Mail size={16} />
            Email
          </a>
        </header>

        <section className="mt-6 px-6">
          <p className="text-secondary-text max-w-2xl text-[16px] leading-relaxed whitespace-pre-wrap">
            {bioSection?.bio || "Write a little bit about yourself here..."}
          </p>
        </section>
      </div>

      {/* LINKS SECTION */}
      {linksSection && (
        <section
          className="group hover:border-border hover:bg-background/50 relative mb-16 w-full rounded-2xl border border-transparent p-6 transition-colors"
        >
          {renderControls(linksSection)}

          <h2 className="text-tertiary-text mb-4 text-[13px]">
            {linksSection.subtitle || "Links"}
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {linksSection.links && linksSection.links.length > 0 ? (
              linksSection.links.map((link) => (
                <TemplateLinkCard
                  key={link.id}
                  id={link.id}
                  title={link.title || link.label || ""}
                  url={sanitizeUrl(link.url || "")}
                />
              ))
            ) : (
              <p className="text-tertiary-text border-border rounded-xl border border-dashed py-4 text-center text-sm">
                No links added yet.
              </p>
            )}
          </div>
        </section>
      )}

      {/* PROJECTS SECTION */}
      {projectsSection && (
        <section
          className="group hover:border-border hover:bg-background/50 relative mb-16 w-full rounded-2xl border border-transparent p-6 transition-colors"
        >
          {renderControls(projectsSection)}

          <h2 className="text-tertiary-text mb-4 text-[13px]">
            {projectsSection.subtitle || "Selected Work"}
          </h2>
          <div className="flex flex-col gap-4">
            {projectsSection.projects && projectsSection.projects.length > 0 ? (
              projectsSection.projects.map((project) => (
                <div
                  key={project.id}
                  className="border-border bg-background flex flex-col items-start rounded-[12px] border p-4 shadow-sm transition-shadow hover:shadow-md sm:flex-row sm:items-center"
                >
                  <div className="bg-secondary-bg border-border relative mb-4 h-[80px] w-full shrink-0 overflow-hidden rounded-lg border sm:mb-0 sm:w-[120px]">
                    {getImageUrl(project.imageSrc) ? (
                      <Image
                        src={getImageUrl(project.imageSrc)!}
                        alt={project.title || "Project"}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="h-full w-full bg-neutral-200" />
                    )}
                  </div>
                  <div className="flex w-full flex-col sm:ml-6">
                    <h3 className="text-primary-text text-[16px] font-bold">
                      {project.title}
                    </h3>
                    {project.description && (
                      <p className="text-secondary-text mt-1 line-clamp-2 text-[13px]">
                        {project.description}
                      </p>
                    )}
                    {project.url && (
                      <a
                        href={sanitizeUrl(project.url)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-brand-hover-bg mt-3 inline-flex items-center gap-1.5 text-[13px] font-bold hover:underline"
                      >
                        {project.buttonText || "View Project"}
                        <ArrowRight size={14} strokeWidth={2.5} />
                      </a>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-tertiary-text border-border rounded-xl border border-dashed py-4 text-center text-sm">
                No projects added yet.
              </p>
            )}
          </div>
        </section>
      )}

      {/* CTA SECTION */}
      {ctaSection && (
        <section
          className="group hover:border-border hover:bg-background/50 relative mb-16 w-full rounded-2xl border border-transparent p-6 transition-colors"
        >
          {renderControls(ctaSection)}

          <h2 className="text-primary-text text-[24px] font-bold tracking-tight">
            {ctaSection.title || "Open to new projects."}
          </h2>
          <p className="text-secondary-text mt-2 mb-6 max-w-[500px] text-[15px]">
            {ctaSection.subtitle || "Have an idea or product you're building?"}
          </p>
          <a
            href={sanitizeUrl(ctaSection.url)}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-brand-hover-bg hover:bg-button-brand-bg inline-flex h-10 items-center justify-center rounded-md px-6 text-sm font-bold text-white shadow-sm transition-all active:scale-95"
          >
            {ctaSection.buttonText || "Work with me"}
          </a>
        </section>
      )}
    </div>
  );
}

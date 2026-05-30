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
import { getImageUrl, sanitizeUrl } from "@/utils/profile";
import type { Section, ProfilePreview } from "../types";

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
  const ctaSection = sections.find((s) => s.type === "experience");
  const _bioSectionId = bioSection?.id ?? "bio";



  const profileImageUrl = getImageUrl(profile?.photoUrl);

  const renderControls = (section?: Section, isBio: boolean = false) => {
    if (!section) return null;
    return (
      <div className="group/menu absolute right-4 top-4 z-50">
        <button className="text-tertiary-text hover:text-primary-text hover:bg-hover-bg flex h-8 w-8 cursor-pointer items-center justify-center rounded-[8px] bg-background/80 backdrop-blur-sm transition-colors border border-border/50">
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
              <><EyeOff size={16} /> Hide</>
            ) : (
              <><Eye size={16} /> Show</>
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
    <div className="text-primary-text mx-auto flex w-full max-w-4xl flex-col gap-6 py-8 pt-6">
      
      {/* BIO / SUMMARY CARD */}
      <div className={`group relative transition-opacity duration-200 ${!bioSection?.visible ? "opacity-50 grayscale" : ""}`}>
        {renderControls(bioSection, true)}
        <section className="flex flex-col gap-5 rounded-[12px] border border-border bg-background p-6 md:flex-row md:items-start shadow-sm pr-14">
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
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-brand-subtle-bg text-3xl font-bold text-brand-hover-bg">
              {profile?.fullName?.charAt(0).toUpperCase() ?? "U"}
            </div>
          )}

          <div className="min-w-0 flex-1">
            <h2 className="text-3xl font-bold break-all">
              {profile?.fullName ?? "No Name"}
            </h2>
            <p className="mt-4 max-w-[650px] break-all text-xl leading-8 text-primary-text whitespace-pre-wrap">
              {bioSection?.bio || profile?.bio || "No bio added yet."}
            </p>
          </div>
        </section>
      </div>

      {/* LINKS CARD */}
      {linksSection && (
        <div className={`group relative transition-opacity duration-200 ${!linksSection.visible ? "opacity-50 grayscale" : ""}`}>
          {renderControls(linksSection)}
          <section className="rounded-[12px] border border-border bg-background p-6 shadow-sm pr-14">
            <h2 className="text-2xl font-bold">{linksSection.subtitle || "Featured Links"}</h2>

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
                      className="flex items-center justify-between rounded-[18px] border border-border p-4 no-underline hover:border-brand-hover-bg/30 transition-colors"
                    >
                      <div className="flex items-center gap-5">
                        <span className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-[12px] border border-border bg-secondary-bg">
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
                            <ImageIcon className="text-tertiary-text" size={24} />
                          )}
                        </span>
                        <div className="min-w-0">
                          <h3 className="font-bold text-primary-text break-all">{item.title}</h3>
                          <p className="text-sm text-tertiary-text break-all">{item.url}</p>
                        </div>
                      </div>
                      <span className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-secondary-bg group-hover:text-brand-hover-bg transition-colors">
                        <ExternalLink className="text-tertiary-text" size={20} />
                      </span>
                    </a>
                  );
                })}
              </div>
            ) : (
              <span className="mt-4 flex items-center justify-between text-sm text-secondary-text">
                No links added yet
              </span>
            )}
          </section>
        </div>
      )}

      {/* HIGHLIGHT CARD (Fake, mapped from bio image if exists) */}
      {profileImageUrl && (
        <section className="rounded-[12px] border border-border bg-background p-6 shadow-sm">
          <h2 className="text-2xl font-bold">Highlight</h2>

          <div className="mt-6 flex flex-col gap-8 rounded-[28px] border border-border p-6 md:flex-row md:items-center">
            <div className="flex flex-1 justify-center bg-secondary-bg p-10">
              <Image
                src={profileImageUrl}
                alt={profile?.fullName ?? "Profile image"}
                width={260}
                height={180}
                className="h-auto w-full max-w-[260px] rounded-[12px] object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-2xl font-bold break-all">
                {profile?.fullName ?? "No title yet"}
              </h3>
              <p className="mt-4 break-all text-lg text-secondary-text">
                {bioSection?.bio || profile?.bio || "No bio added yet."}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* PROJECTS CARD */}
      {projectsSection && (
        <div className={`group relative transition-opacity duration-200 ${!projectsSection.visible ? "opacity-50 grayscale" : ""}`}>
          {renderControls(projectsSection)}
          <section className="w-full rounded-[12px] border border-border bg-background shadow-sm">
            <h2 className="p-4 pr-14 text-2xl font-bold">{projectsSection.subtitle || "Selected Projects"}</h2>
            
            {projectsSection.projects && projectsSection.projects.length > 0 ? (
              <div className={`grid gap-6 p-6 ${
                projectsSection.layout === "1" ? "grid-cols-1" :
                projectsSection.layout === "3" ? "grid-cols-1 sm:grid-cols-2" :
                projectsSection.layout === "4" ? "grid-cols-1 sm:grid-cols-2" :
                "grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
              }`}>
                {projectsSection.projects.map((project, index) => {
                  const hasUrl = Boolean(project.url);
                  const displayImg = getImageUrl(project.imageSrc);
                  
                  const layoutType = projectsSection.layout || "2";

                  const card = (
                    <div className={`flex group rounded-[12px] border border-border bg-background p-4 shadow-sm transition-shadow hover:shadow-md hover:border-brand-hover-bg/30 ${
                      layoutType === "1" ? "flex-col sm:flex-row sm:items-center justify-between" :
                      layoutType === "3" ? "flex-col sm:flex-row sm:items-start" :
                      layoutType === "4" ? "flex-col sm:flex-row-reverse sm:items-start" :
                      "flex-col" // Layout 2
                    }`}>
                      {/* IMAGE */}
                      {layoutType !== "1" && (
                        <div className={`relative shrink-0 overflow-hidden rounded-lg border border-border bg-secondary-bg mb-4 ${
                          layoutType === "2" ? "w-full aspect-video" : "w-full h-[120px] sm:mb-0 sm:w-[140px]"
                        } ${layoutType === "3" ? "sm:mr-5" : ""} ${layoutType === "4" ? "sm:ml-5" : ""}`}>
                          {displayImg ? (
                            <Image
                              src={displayImg}
                              alt={project.title ?? "Project"}
                              className="object-cover"
                              fill
                              unoptimized
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-xs text-tertiary-text">
                              No image
                            </div>
                          )}
                        </div>
                      )}
                      
                      {/* CONTENT */}
                      <div className="flex flex-col items-start min-w-0 flex-1">
                        <h5 className="text-xl font-bold text-primary-text break-all">
                          {project.title}
                        </h5>
                        <p className={`text-secondary-text break-all mt-1 ${layoutType === "1" ? "line-clamp-1" : "line-clamp-2"}`}>
                          {project.description}
                        </p>
                        {layoutType !== "1" && (
                          <span className="mt-3 flex items-center gap-1 text-sm font-semibold text-brand-hover-bg hover:underline">
                            {hasUrl ? "View project" : "Edit project"}
                            <ChevronRight size={16} />
                          </span>
                        )}
                      </div>
                      
                      {/* BUTTON FOR LAYOUT 1 */}
                      {layoutType === "1" && (
                        <div className="mt-4 sm:mt-0 sm:ml-6 shrink-0">
                          <span className="flex items-center gap-1 text-sm font-bold text-brand-hover-bg hover:underline">
                            {hasUrl ? "View project" : "Edit project"}
                            <ChevronRight size={16} />
                          </span>
                        </div>
                      )}
                    </div>
                  );

                  return hasUrl ? (
                    <a
                      key={project.id ?? index}
                      href={sanitizeUrl(project.url || "")}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="no-underline"
                    >
                      {card}
                    </a>
                  ) : (
                    <div key={project.id ?? index} className="no-underline">
                      {card}
                    </div>
                  );
                })}
              </div>
            ) : (
              <span className="flex items-center justify-between p-4 text-sm text-secondary-text">
                No projects added yet
              </span>
            )}
          </section>
        </div>
      )}

      {/* CTA CARD */}
      {ctaSection && (
        <div className={`group relative transition-opacity duration-200 ${!ctaSection.visible ? "opacity-50 grayscale" : ""}`}>
          {renderControls(ctaSection)}
          <section className="w-full rounded-[12px] border border-border bg-background p-16 pt-12 shadow-sm relative">
            <div className="flex flex-col items-center gap-4">
              <span className="inline-flex items-center gap-2 rounded-md border p-2 text-sm font-medium">
                <MessageSquare size={12} />
              </span>
              <h4 className="text-2xl font-bold text-center break-all">
                {ctaSection.title || "Your CTA"}
              </h4>
              
              {ctaSection.title || ctaSection.url ? (
                <a
                  href={sanitizeUrl(ctaSection.url || "#")}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => { if (!ctaSection.url) e.preventDefault(); }}
                  className="inline-flex h-11 items-center rounded-xl bg-brand-hover-bg px-8 text-sm font-bold text-white hover:bg-button-brand-bg transition-colors"
                >
                  {ctaSection.buttonText || "Visit"}
                </a>
              ) : (
                <span className="flex items-center gap-1 text-sm font-semibold text-brand-hover-bg cursor-pointer hover:underline">
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

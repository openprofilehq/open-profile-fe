import React from "react";
import Image from "next/image";
import { ArrowRight, ExternalLink } from "lucide-react";

import {
  DashboardProfileResponse,
  ProfileContentResponse,
  LinkItem,
  ProjectItem,
  ProfileAppearanceSettings,
} from "@/api/profile/profile.type";
import { getImageUrl, isProjectHighlighted } from "@/utils/profile";
import { TemplateFooter } from "./TemplateFooter";
// import HighlightCard from "../HighlightCard";

type Props = {
  profile?: DashboardProfileResponse;
  content?: ProfileContentResponse;
  isLoadingProfile?: boolean;
  isLoadingContent?: boolean;
  appearance?: ProfileAppearanceSettings | null;
  isPreview?: boolean;
};

const DEFAULT_LINKS = [
  { id: "link-1", title: "Portfolio", url: "https://john.studio" },
  { id: "link-2", title: "Twitter", url: "https://twitter.com/johnsmith" },
  { id: "link-3", title: "GitHub", url: "https://github.com/johnsmith" },
] as LinkItem[];

const DEFAULT_PROJECTS = [
  {
    id: "proj-1",
    title: "Atlas - Onboarding kit for SaaS",
    description: "A complete design system and onboarding flow",
    buttonText: "View Project",
    url: "#",
    imageSrc: "/profile-preview/feature1.jpg",
  },
  {
    id: "proj-2",
    title: "Field - Mobile Journaling app",
    description: "A calm journaling experience with a custom typography stack.",
    buttonText: "View Project",
    url: "#",
    imageSrc: "/profile-preview/feature2.jpg",
  },
  {
    id: "proj-3",
    title: "Northwind Analytics",
    description: "Dashboard rework for a B2B analytics products.",
    buttonText: "View Project",
    url: "#",
    imageSrc: "/profile-preview/feature3.jpg",
  },
] as ProjectItem[];

export default function ProfessionalDashboardView({
  profile,
  content,
  isPreview,
}: Props) {
  const name = profile?.fullName ?? profile?.username ?? "John Smith";
  const username = profile?.username ?? "johnsmith";

  const details = content?.content;
  const bio =
    profile?.bio ??
    details?.bio?.content ??
    "Product Designer helping early-stage startups build meaningful, trustworthy experiences. Previously at Linear and Loom";

  const rawLinks = (details?.links?.items ?? []) as LinkItem[];
  const links = rawLinks.length > 0 ? rawLinks : isPreview ? DEFAULT_LINKS : [];

  const rawProjects = (details?.projects?.items ?? []) as ProjectItem[];
  const projects =
    rawProjects.length > 0 ? rawProjects : isPreview ? DEFAULT_PROJECTS : [];

  const cta = details?.cta;

  const rawPhotoSrc = profile?.photoUrl;
  const photoSrc = rawPhotoSrc
    ? rawPhotoSrc.startsWith("/profile-preview/")
      ? rawPhotoSrc
      : getImageUrl(rawPhotoSrc)
    : null;

  return (
    <div className="text-primary-text bg-secondary-bg flex w-full flex-col font-sans antialiased">
      <div
        className="mx-auto flex w-full max-w-5xl flex-col px-6 pt-8 pb-16 sm:pb-24"
        style={{ gap: "var(--op-spacing, 2rem)" }}
      >
        {/* HEADER SECTION */}
        <header className="flex w-full flex-col justify-between gap-6 sm:flex-row sm:items-start">
          <div className="flex items-center gap-6">
            <div className="border-border bg-secondary-bg relative h-24 w-24 shrink-0 overflow-hidden rounded-full border shadow-sm">
              {photoSrc ? (
                <Image
                  src={photoSrc}
                  alt={name}
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <div className="bg-brand-subtle-bg text-brand-hover-bg flex h-full w-full items-center justify-center text-[40px] font-bold">
                  {name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            <div className="flex flex-col">
              <h1 className="text-primary-text text-[28px] leading-tight font-bold tracking-tight">
                {name}
              </h1>
              <p className="text-secondary-text mt-1 text-[15px]">
                openprofile.app/{username}
              </p>
            </div>
          </div>
        </header>

        {/* BIO SECTION */}
        <section>
          <p className="text-secondary-text max-w-2xl text-[16px] leading-relaxed">
            {bio}
          </p>
        </section>

        {/* LINKS SECTION */}
        {details?.links?.visible !== false && (
          <section className="w-full">
            <h2 className="text-tertiary-text mb-4 text-[13px]">Links</h2>
            {links.length > 0 ? (
              <div className="border-border flex flex-col border-t">
                {links.map((link, idx) => (
                  <a
                    key={link.id ?? idx}
                    href={link.url || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group border-border hover:bg-hover-bg/30 flex items-center justify-between border-b py-4 transition-colors"
                  >
                    <span className="text-primary-text group-hover:text-brand-hover-bg text-[15px] font-bold transition-colors">
                      {link.title || link.label}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="text-secondary-text text-[14px]">
                        {(() => {
                          try {
                            return link.url
                              ? new URL(
                                  link.url.startsWith("http")
                                    ? link.url
                                    : `https://${link.url}`
                                ).hostname.replace("www.", "")
                              : "";
                          } catch {
                            return link.url || "";
                          }
                        })()}
                      </span>
                      <ExternalLink
                        size={16}
                        className="text-tertiary-text group-hover:text-brand-hover-bg transition-colors"
                      />
                    </div>
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-tertiary-text border-border rounded-xl border border-dashed py-4 text-center text-sm">
                Add your links
              </p>
            )}
          </section>
        )}

        {/* PROJECTS SECTION */}
        {details?.projects?.visible !== false &&
          (() => {
            const highlightedProject = projects.find(isProjectHighlighted);
            const remainingProjects = projects.filter(
              (p) => p.id !== highlightedProject?.id
            );

            return (
              <div className="flex w-full flex-col gap-10">
                {/* <HighlightCard details={content?.content} /> */}
                <section className="w-full">
                  <h2 className="text-tertiary-text mb-4 text-[13px]">
                    {details?.projects?.sectionTitle || "Selected Work"}
                  </h2>
                  {remainingProjects.length > 0 ? (
                    <div className="flex flex-col gap-4">
                      {remainingProjects.map((project) => {
                        const projectUrl =
                          project.url ||
                          (project as { repoUrl?: string }).repoUrl;
                        return (
                          <div
                            key={project.id}
                            className="border-border bg-background flex flex-col items-start rounded-[12px] border p-4 shadow-sm transition-shadow hover:shadow-md sm:flex-row sm:items-center"
                          >
                            <div className="bg-secondary-bg border-border relative mb-4 h-[80px] w-full shrink-0 overflow-hidden rounded-lg border sm:mb-0 sm:w-[120px]">
                              {project.imageSrc ? (
                                <Image
                                  src={
                                    project.imageSrc.startsWith(
                                      "/profile-preview/"
                                    )
                                      ? project.imageSrc
                                      : getImageUrl(project.imageSrc) || ""
                                  }
                                  alt={project.title || "Project"}
                                  fill
                                  className="object-cover"
                                  unoptimized
                                />
                              ) : (
                                <div className="text-tertiary-text flex h-full w-full items-center justify-center bg-neutral-200 text-xs">
                                  No image
                                </div>
                              )}
                            </div>

                            <div className="flex w-full flex-col sm:ml-6">
                              <h3 className="text-primary-text text-[16px] font-bold">
                                {project.title}
                              </h3>
                              {project.description && (
                                <p className="text-secondary-text mt-1 text-[13px]">
                                  {project.description}
                                </p>
                              )}
                              {projectUrl && (
                                <a
                                  href={projectUrl}
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
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-tertiary-text border-border rounded-xl border border-dashed py-4 text-center text-sm">
                      Add your projects
                    </p>
                  )}
                </section>
              </div>
            );
          })()}

        {/* CTA SECTION */}
        {details?.cta?.visible !== false && (
          <section className="w-full">
            <h2 className="text-primary-text text-[24px] font-bold tracking-tight">
              {cta?.title || "Open to new projects."}
            </h2>
            <p className="text-secondary-text mt-2 mb-6 max-w-[500px] text-[15px]">
              {cta?.subtitle ||
                "Have an idea or product you're building? I can help you design it the right way."}
            </p>
            <a
              href={cta?.url || "mailto:hello@example.com"}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-brand-hover-bg hover:bg-button-brand-bg inline-flex h-10 items-center justify-center rounded-md px-6 text-sm font-bold text-white shadow-sm transition-all active:scale-95"
            >
              {cta?.label || "Work with me"}
            </a>
          </section>
        )}

        {/* FOOTER */}
        <TemplateFooter />
      </div>
    </div>
  );
}

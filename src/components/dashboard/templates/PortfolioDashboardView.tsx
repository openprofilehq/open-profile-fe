import React from "react";
import Image from "next/image";
import { ArrowRight, Mail } from "lucide-react";
import { TemplateLinkCard } from "../shared/TemplateLinkCard";
import {
  DashboardProfileResponse,
  ProfileContentResponse,
  LinkItem,
  ProjectItem,
  ProfileAppearanceSettings,
} from "@/api/profile/profile.type";
import { getImageUrl, isProjectHighlighted } from "@/utils/profile";
import { TemplateFooter } from "./TemplateFooter";
import HighlightCard from "../HighlightCard";

type Props = {
  profile?: DashboardProfileResponse;
  content?: ProfileContentResponse;
  isLoadingProfile?: boolean;
  isLoadingContent?: boolean;
  appearance?: ProfileAppearanceSettings | null;
  isPreview?: boolean;
};

const DEFAULT_LINKS = [
  { id: "link-1", title: "Website", url: "https://john.studio" },
  { id: "link-2", title: "Instagram", url: "https://instagram.com/johnsmith" },
  { id: "link-3", title: "Twitter/X", url: "https://twitter.com/johnsmith" },
  { id: "link-4", title: "LinkedIn", url: "https://linkedin.com/in/johnsmith" },
] as LinkItem[];

const DEFAULT_PROJECTS = [
  {
    id: "proj-1",
    title: "Fintech Dashboard",
    description:
      "A financial analytics dashboard that helps users track their investments",
    buttonText: "View Project",
    url: "#",
    imageSrc: "/profile-preview/feature1.jpg",
  },
  {
    id: "proj-2",
    title: "Landing page Design",
    description: "A minimal landing page design for an e-commerce website",
    buttonText: "View Project",
    url: "#",
    imageSrc: "/profile-preview/feature2.jpg",
  },
  {
    id: "proj-3",
    title: "Nova Health SaaS",
    description: "A minimalist SaaS platform designed for doctors.",
    buttonText: "View Project",
    url: "#",
    imageSrc: "/profile-preview/feature3.jpg",
  },
  {
    id: "proj-4",
    title: "Origin Collective",
    description:
      "A minimalist e-commerce website for a high-end furniture brand.",
    buttonText: "View Project",
    url: "#",
    imageSrc: "/profile-preview/feature2.jpg",
  },
  {
    id: "proj-5",
    title: "Apex Banking App",
    description: "Redesigning the core user journey of a modern banking app.",
    buttonText: "View Project",
    url: "#",
    imageSrc: "/profile-preview/feature1.jpg",
  },
  {
    id: "proj-6",
    title: "Form Branding System",
    description: "A cohesive visual identity and branding system.",
    buttonText: "View Project",
    url: "#",
    imageSrc: "/profile-preview/feature3.jpg",
  },
] as ProjectItem[];

function getInitials(fullName?: string | null) {
  const parts = fullName?.trim().split(/\s+/).filter(Boolean) ?? [];

  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return "U";
}

export default function PortfolioDashboardView({
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
    "I help teams craft thoughtful, user-centered products — from the first sketch to a polished design system. Currently shaping fintech and SaaS experiences.";

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
    <div className="text-primary-text flex w-full flex-col font-sans antialiased">
      <div
        className="mx-auto flex w-full max-w-5xl flex-col px-6 pt-8 pb-16 sm:pb-24"
        style={{ gap: "var(--op-spacing, 2rem)" }}
      >
        {/* HEADER SECTION */}
        <header
          className="flex w-full flex-col justify-between sm:flex-row sm:items-start"
          style={{ gap: "var(--op-spacing, 24px)" }}
        >
          <div
            className="flex flex-col"
            style={{ gap: "var(--op-spacing, 24px)" }}
          >
            <div className="border-border bg-secondary-bg relative h-[80px] w-[80px] shrink-0 overflow-hidden rounded-full border">
              {photoSrc ? (
                <Image
                  src={photoSrc}
                  alt={name}
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <div className="bg-brand-hover-bg text-inverse-text flex h-full w-full items-center justify-center text-[32px] font-bold">
                  {getInitials(name)}
                </div>
              )}
            </div>

            <div className="flex flex-col">
              <h1 className="text-primary-text text-[26px] leading-tight font-bold tracking-tight">
                {name}
              </h1>
              <p className="text-secondary-text mt-1 text-[14px]">
                openprofile.app/{username}
              </p>
            </div>
          </div>
          {details?.cta?.visible !== false && (cta?.value ?? cta?.url) && (
            <a
              href={cta?.value ?? cta?.url ?? ""}
              target="_blank"
              rel="noopener noreferrer"
              className="border-brand-hover-bg bg-background text-brand-hover-bg hover:bg-brand-hover-bg/5 inline-flex h-9 items-center justify-center gap-2 rounded-md border px-4 text-[13px] font-semibold transition-colors"
            >
              {cta?.iconSrc ? (
                <div
                  className="bg-brand-hover-bg h-4 w-4"
                  style={{
                    maskImage: `url(${cta.iconSrc})`,
                    WebkitMaskImage: `url(${cta.iconSrc})`,
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
              {cta?.label || "Email"}
            </a>
          )}
        </header>

        {/* BIO SECTION */}
        <section>
          <p className="text-secondary-text max-w-3xl text-[15px] leading-relaxed">
            {bio}
          </p>
        </section>

        {/* LINKS SECTION */}
        {details?.links?.visible !== false && (
          <section className="w-full">
            <h2 className="text-tertiary-text mb-4 text-[13px]">Links</h2>
            {links.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {links.map((link) => (
                  <TemplateLinkCard
                    key={link.id}
                    id={link.id}
                    title={link.title || link.label || ""}
                    url={link.url || ""}
                  />
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
                <HighlightCard details={content?.content} />
                {remainingProjects.length > 0 ? (
                  <section className="w-full">
                    <h2 className="text-tertiary-text mb-6 text-[13px]">
                      {details?.projects?.sectionTitle || "Featured Projects"}
                    </h2>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {remainingProjects.map((project, idx) => {
                        const numberStr = String(idx + 1).padStart(2, "0");
                        const projectUrl =
                          project.url ||
                          (project as { repoUrl?: string }).repoUrl;
                        return (
                          <div
                            key={project.id}
                            className="group border-border bg-background flex flex-col overflow-hidden rounded-[12px] border shadow-sm transition-shadow hover:shadow-md"
                          >
                            {/* Project Image Placeholder */}
                            <div className="bg-secondary-bg border-border relative aspect-16/10 w-full overflow-hidden border-b">
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
                                  className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                                  unoptimized
                                />
                              ) : (
                                <div className="text-tertiary-text flex h-full w-full items-center justify-center bg-neutral-200 text-xs transition-transform duration-500 group-hover:scale-[1.02]">
                                  No image
                                </div>
                              )}
                            </div>

                            <div className="flex flex-1 flex-col p-6">
                              <div className="mb-2 flex items-start gap-2">
                                <span className="text-primary-text text-[16px] font-bold">
                                  {numberStr}
                                </span>
                                <h3 className="text-primary-text min-w-0 flex-1 text-[16px] font-bold">
                                  {project.title}
                                </h3>
                              </div>

                              {project.description && (
                                <p className="text-secondary-text mb-6 ml-6 line-clamp-2 text-[13px]">
                                  {project.description}
                                </p>
                              )}

                              {projectUrl && (
                                <a
                                  href={projectUrl}
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
                  </section>
                ) : projects.length === 0 ? (
                  <section className="w-full">
                    <h2 className="text-tertiary-text mb-6 text-[13px]">
                      {details?.projects?.sectionTitle || "Featured Projects"}
                    </h2>
                    <p className="text-tertiary-text border-border rounded-xl border border-dashed py-4 text-center text-sm">
                      Add your projects
                    </p>
                  </section>
                ) : null}
              </div>
            );
          })()}

        {/* CTA SECTION */}
        {details?.cta?.visible !== false && (cta?.value ?? cta?.url) && (
          <section className="w-full py-8">
            <div
              className={`flex flex-col ${cta?.layout === "2" ? "items-start text-left" : cta?.layout === "3" ? "items-end text-right" : "items-center text-center"}`}
            >
              {cta?.iconSrc && (
                <div className="mb-6 flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-transparent">
                  <div
                    className="bg-brand-hover-bg h-8 w-8"
                    style={{
                      maskImage: `url(${cta.iconSrc})`,
                      WebkitMaskImage: `url(${cta.iconSrc})`,
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
                {cta?.title || "Interested in working together?"}
              </h2>
              <p className="text-secondary-text mt-3 mb-8 max-w-[600px] text-base leading-relaxed">
                {cta?.subtitle ||
                  "I am currently available for freelance project"}
              </p>
              <a
                href={cta?.value ?? cta?.url ?? ""}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-brand-hover-bg hover:bg-button-brand-bg inline-flex h-12 items-center justify-center rounded-xl px-8 text-[15px] font-bold text-white shadow-sm transition-all"
              >
                {cta?.label || "Let's Connect"}
              </a>
            </div>
          </section>
        )}

        {/* FOOTER */}
        <TemplateFooter />
      </div>
    </div>
  );
}

import React from "react";
import Image from "next/image";
import {
  Mail,

  ArrowRight,
  Rocket,
} from "lucide-react";
import { TemplateLinkCard } from "../shared/TemplateLinkCard";
import {
  DashboardProfileResponse,
  ProfileContentResponse,
  LinkItem,
  ProjectItem,
  ProfileAppearanceSettings,
} from "@/api/profile/profile.type";
import { getImageUrl } from "@/utils/profile";
import { TemplateFooter } from "./TemplateFooter";

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

export default function PortfolioDashboardView({ profile, content, isPreview }: Props) {
  const name = profile?.fullName ?? profile?.username ?? "John Smith";
  const username = profile?.username ?? "johnsmith";
  const details = content?.content;
  const bio =
    profile?.bio ??
    details?.bio?.content ??
    "I help teams craft thoughtful, user-centered products — from the first sketch to a polished design system. Currently shaping fintech and SaaS experiences.";

  const rawLinks = (details?.links?.items ?? []) as LinkItem[];
  const links = rawLinks.length > 0 ? rawLinks : (isPreview ? DEFAULT_LINKS : []);

  const rawProjects = (details?.projects?.items ?? []) as ProjectItem[];
  const projects = rawProjects.length > 0 ? rawProjects : (isPreview ? DEFAULT_PROJECTS : []);

  const cta = details?.cta;

  const rawPhotoSrc = profile?.photoUrl;
  const photoSrc = rawPhotoSrc
    ? rawPhotoSrc.startsWith("/profile-preview/")
      ? rawPhotoSrc
      : getImageUrl(rawPhotoSrc)
    : null;

  return (
    <div className="text-primary-text flex w-full flex-col font-sans antialiased">
      <div className="mx-auto w-full max-w-5xl px-6 pb-16 sm:pb-24">
        {/* HEADER SECTION */}
        <header className="mb-8 flex w-full flex-col justify-between gap-6 sm:flex-row sm:items-start">
          <div className="flex flex-col gap-6">
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
                <div className="flex h-full w-full items-center justify-center bg-brand-subtle-bg text-[40px] font-bold text-brand-hover-bg">
                  {name.charAt(0).toUpperCase()}
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

          <a
            href="mailto:hello@example.com"
            className="border-brand-hover-bg bg-background text-brand-hover-bg hover:bg-brand-hover-bg/5 inline-flex h-9 items-center justify-center gap-2 rounded-md border px-4 text-[13px] font-semibold transition-colors"
          >
            <Mail size={16} />
            Email
          </a>
        </header>

        {/* BIO SECTION */}
        <section className="mb-16">
          <p className="text-secondary-text max-w-3xl text-[15px] leading-relaxed">
            {bio}
          </p>
        </section>

        {/* LINKS SECTION */}
        {details?.links?.visible !== false && (
          <section className="mb-20 w-full">
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
        {details?.projects?.visible !== false && (
          <section className="mb-20 w-full">
            <h2 className="text-tertiary-text mb-6 text-[13px]">
              {details?.projects?.sectionTitle || "Featured Projects"}
            </h2>
            {projects.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {projects.map((project, idx) => {
                  const numberStr = String(idx + 1).padStart(2, "0");
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
                              project.imageSrc.startsWith("/profile-preview/")
                                ? project.imageSrc
                                : getImageUrl(project.imageSrc)!
                            }
                            alt={project.title || "Project"}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                            unoptimized
                          />
                        ) : (
                          <Image
                            src="/profile-preview/feature1.jpg"
                            alt="Project placeholder"
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                            unoptimized
                          />
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
                            href={project.url}
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
                Add your projects
              </p>
            )}
          </section>
        )}

        {/* CTA SECTION */}
        {details?.cta?.visible !== false && (
          <section className="mb-24 w-full py-8">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
              <div className="flex items-center gap-4">
                <div className="bg-brand-hover-bg flex h-12 w-12 shrink-0 items-center justify-center rounded-[10px] text-white shadow-sm">
                  <Rocket size={24} strokeWidth={2} />
                </div>
                <div className="flex flex-col">
                  <h3 className="text-primary-text text-[16px] font-bold">
                    {cta?.title || "Interested in working together?"}
                  </h3>
                  <p className="text-secondary-text mt-0.5 text-[13px]">
                    {cta?.subtitle ||
                      "I am currently available for freelance project"}
                  </p>
                </div>
              </div>
              <a
                href={cta?.url || "mailto:hello@example.com"}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-brand-hover-bg hover:bg-button-brand-bg inline-flex h-10 items-center justify-center rounded-md px-6 text-[14px] font-bold whitespace-nowrap text-white shadow-sm transition-all active:scale-95"
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

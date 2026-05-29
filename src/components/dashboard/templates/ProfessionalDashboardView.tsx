import React from "react";
import Image from "next/image";
import { Mail, ArrowRight, ExternalLink } from "lucide-react";
import { TemplateLinkCard } from "../shared/TemplateLinkCard";
import {
  DashboardProfileResponse,
  ProfileContentResponse,
  LinkItem,
  ProjectItem,
} from "@/api/profile/profile.type";
import { getImageUrl } from "@/utils/profile";
import { TemplateFooter } from "./TemplateFooter";

type Props = {
  profile?: DashboardProfileResponse;
  content?: ProfileContentResponse;
  isLoadingProfile?: boolean;
  isLoadingContent?: boolean;
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

export default function ProfessionalDashboardView({ profile, content }: Props) {
  const name = profile?.fullName ?? profile?.username ?? "John Smith";
  const username = profile?.username ?? "johnsmith";

  const details = content?.content;
  const bio =
    profile?.bio ??
    details?.bio?.content ??
    "Product Designer helping early-stage startups build meaningful, trustworthy experiences. Previously at Linear and Loom";

  const rawLinks = (details?.links?.items ?? []) as LinkItem[];
  const links = rawLinks.length > 0 ? rawLinks : DEFAULT_LINKS;

  const rawProjects = (details?.projects?.items ?? []) as ProjectItem[];
  const projects = rawProjects.length > 0 ? rawProjects : DEFAULT_PROJECTS;

  const cta = details?.cta;

  const rawPhotoSrc = profile?.photoUrl;
  const photoSrc = rawPhotoSrc
    ? rawPhotoSrc.startsWith("/profile-preview/")
      ? rawPhotoSrc
      : getImageUrl(rawPhotoSrc)
    : null;

  return (
    <div className="text-primary-text bg-secondary-bg flex w-full flex-col font-sans antialiased">
      <div className="mx-auto w-full max-w-5xl px-6 pb-16 sm:pb-24">
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
                <div className="flex h-full w-full items-center justify-center bg-brand-subtle-bg text-[40px] font-bold text-brand-hover-bg">
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

          <a
            href="mailto:hello@example.com"
            className="border-brand-hover-bg bg-brand-hover-bg/5 text-brand-hover-bg hover:bg-brand-hover-bg/10 inline-flex h-9 items-center justify-center gap-2 rounded-md border px-4 text-sm font-semibold transition-colors"
          >
            <Mail size={16} />
            Email
          </a>
        </header>

        {/* BIO SECTION */}
        <section className="mt-8">
          <p className="text-secondary-text max-w-2xl text-[16px] leading-relaxed">
            {bio}
          </p>
        </section>

        {/* LINKS SECTION */}
        {details?.links?.visible !== false && links.length > 0 && (
          <section className="mt-16 w-full">
            <h2 className="text-tertiary-text mb-4 text-[13px]">Links</h2>
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
          </section>
        )}

        {/* PROJECTS SECTION */}
        {details?.projects?.visible !== false && projects.length > 0 && (
          <section className="mt-16 w-full">
            <h2 className="text-tertiary-text mb-4 text-[13px]">
              {details?.projects?.sectionTitle || "Selected Work"}
            </h2>
            <div className="flex flex-col gap-4">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="border-border bg-background flex flex-col items-start rounded-[12px] border p-4 shadow-sm transition-shadow hover:shadow-md sm:flex-row sm:items-center"
                >
                  <div className="bg-secondary-bg border-border relative mb-4 h-[80px] w-full shrink-0 overflow-hidden rounded-lg border sm:mb-0 sm:w-[120px]">
                    {project.imageSrc ? (
                      <Image
                        src={
                          project.imageSrc.startsWith("/profile-preview/")
                            ? project.imageSrc
                            : getImageUrl(project.imageSrc)!
                        }
                        alt={project.title || "Project"}
                        fill
                        className="object-cover"
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

                  <div className="flex w-full flex-col sm:ml-6">
                    <h3 className="text-primary-text text-[16px] font-bold">
                      {project.title}
                    </h3>
                    {project.description && (
                      <p className="text-secondary-text mt-1 text-[13px]">
                        {project.description}
                      </p>
                    )}
                    {project.url && (
                      <a
                        href={project.url}
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
              ))}
            </div>
          </section>
        )}

        {/* CTA SECTION */}
        {details?.cta?.visible !== false && (
          <section className="mt-20 w-full">
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

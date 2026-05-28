import React from "react";
import Image from "next/image";
import { Mail, Link as LinkIcon, ArrowRight } from "lucide-react";
import { DashboardProfileResponse, ProfileContentResponse, LinkItem, ProjectItem } from "@/api/profile/profile.type";
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
  { id: "proj-1", title: "Atlas - Onboarding kit for SaaS", description: "A complete design system and onboarding flow", buttonText: "View Project", url: "#", imageSrc: "/profile-preview/feature1.jpg" },
  { id: "proj-2", title: "Field - Mobile Journaling app", description: "A calm journaling experience with a custom typography stack.", buttonText: "View Project", url: "#", imageSrc: "/profile-preview/feature2.jpg" },
  { id: "proj-3", title: "Northwind Analytics", description: "Dashboard rework for a B2B analytics products.", buttonText: "View Project", url: "#", imageSrc: "/profile-preview/feature3.jpg" },
] as ProjectItem[];

export default function ProfessionalDashboardView({
  profile,
  content,
}: Props) {
  const name = profile?.fullName ?? profile?.username ?? "John Smith";
  const username = profile?.username ?? "johnsmith";
  
  const details = content?.content;
  const bio = profile?.bio ?? details?.bio?.content ?? "Product Designer helping early-stage startups build meaningful, trustworthy experiences. Previously at Linear and Loom";
  
  const rawLinks = (details?.links?.items ?? []) as LinkItem[];
  const links = rawLinks.length > 0 ? rawLinks : DEFAULT_LINKS;
  
  const rawProjects = (details?.projects?.items ?? []) as ProjectItem[];
  const projects = rawProjects.length > 0 ? rawProjects : DEFAULT_PROJECTS;
  
  const cta = details?.cta;

  const rawPhotoSrc = profile?.photoUrl;
  const photoSrc = rawPhotoSrc 
    ? (rawPhotoSrc.startsWith('/profile-preview/') ? rawPhotoSrc : getImageUrl(rawPhotoSrc)!)
    : "/profile-preview/avatar.png";

  return (
    <div className="flex w-full flex-col font-sans text-primary-text antialiased bg-secondary-bg">
      <div className="mx-auto w-full max-w-5xl px-6 py-16 sm:py-24">
        
        {/* HEADER SECTION */}
        <header className="flex w-full flex-col sm:flex-row sm:items-start justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-full border border-border bg-secondary-bg">
              <Image
                src={photoSrc}
                alt={name}
                fill
                className="object-cover"
                unoptimized
              />
              {/* Online indicator dot */}
              <div className="absolute bottom-1 right-1 h-3.5 w-3.5 rounded-full border-2 border-background bg-green-500" />
            </div>
            
            <div className="flex flex-col">
              <h1 className="text-[28px] font-bold tracking-tight text-primary-text leading-tight">
                {name}
              </h1>
              <p className="text-[15px] text-secondary-text mt-1">
                openprofile.app/{username}
              </p>
            </div>
          </div>

          <a
            href="mailto:hello@example.com"
            className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-brand-hover-bg bg-brand-hover-bg/5 px-4 text-sm font-semibold text-brand-hover-bg transition-colors hover:bg-brand-hover-bg/10"
          >
            <Mail size={16} />
            Email
          </a>
        </header>

        {/* BIO SECTION */}
        <section className="mt-8">
          <p className="text-[16px] leading-relaxed text-secondary-text max-w-2xl">
            {bio}
          </p>
        </section>

        {/* LINKS SECTION */}
        {details?.links?.visible !== false && links.length > 0 && (
          <section className="mt-16 w-full">
            <h2 className="mb-4 text-[13px] text-tertiary-text">Links</h2>
            <div className="flex flex-col">
              {links.map((link, idx) => {
                // Strip protocols and www for a cleaner display URL
                const displayUrl = link.url?.replace(/^https?:\/\/(www\.)?/, '')?.replace(/\/$/, '') || "link";
                
                return (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group flex items-center justify-between py-4 transition-colors hover:bg-hover-bg ${
                      idx === 0 ? "border-y border-border" : "border-b border-border"
                    }`}
                  >
                    <span className="text-[15px] font-bold text-primary-text">{link.title}</span>
                    <span className="flex items-center gap-2 text-[14px] text-secondary-text transition-colors group-hover:text-brand-hover-bg">
                      {displayUrl}
                      <LinkIcon size={14} />
                    </span>
                  </a>
                );
              })}
            </div>
          </section>
        )}

        {/* PROJECTS SECTION */}
        {details?.projects?.visible !== false && projects.length > 0 && (
          <section className="mt-16 w-full">
            <h2 className="mb-4 text-[13px] text-tertiary-text">
              {details?.projects?.sectionTitle || "Selected Work"}
            </h2>
            <div className="flex flex-col gap-4">
              {projects.map((project) => (
                <div key={project.id} className="flex flex-col sm:flex-row items-start sm:items-center rounded-xl border border-border bg-background p-4 shadow-sm transition-shadow hover:shadow-md">
                  <div className="relative mb-4 sm:mb-0 h-[80px] w-full sm:w-[120px] shrink-0 overflow-hidden rounded-lg bg-secondary-bg border border-border">
                    {project.imageSrc ? (
                      <Image
                        src={
                          project.imageSrc.startsWith('/profile-preview/') 
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

                  <div className="sm:ml-6 flex flex-col w-full">
                    <h3 className="text-[16px] font-bold text-primary-text">
                      {project.title}
                    </h3>
                    {project.description && (
                      <p className="mt-1 text-[13px] text-secondary-text">
                        {project.description}
                      </p>
                    )}
                    {project.url && (
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-bold text-brand-hover-bg hover:underline"
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
            <h2 className="text-[24px] font-bold text-primary-text tracking-tight">
              {cta?.title || "Open to new projects."}
            </h2>
            <p className="mt-2 mb-6 text-[15px] text-secondary-text max-w-[500px]">
              {cta?.subtitle || "Have an idea or product you're building? I can help you design it the right way."}
            </p>
            <a
              href={cta?.url || "mailto:hello@example.com"}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 items-center justify-center rounded-md bg-brand-hover-bg px-6 text-sm font-bold text-white shadow-sm transition-all hover:bg-button-brand-bg active:scale-95"
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

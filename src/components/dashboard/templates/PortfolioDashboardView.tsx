import React from "react";
import Image from "next/image";
import { 
  BadgeCheck, 
  Mail, 
  Globe, 
  ExternalLink,
  ArrowRight,
  Rocket
} from "lucide-react";
import { XIcon, InstagramIcon, LinkedInIcon, GithubIcon, YoutubeIcon } from "@/components/icons/BrandIcons";
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
  { id: "link-1", title: "Website", url: "https://john.studio" },
  { id: "link-2", title: "Instagram", url: "https://instagram.com/johnsmith" },
  { id: "link-3", title: "Twitter/X", url: "https://twitter.com/johnsmith" },
  { id: "link-4", title: "LinkedIn", url: "https://linkedin.com/in/johnsmith" },
] as LinkItem[];

const DEFAULT_PROJECTS = [
  { id: "proj-1", title: "Fintech Dashboard", description: "A financial analytics dashboard that helps users track their investments", buttonText: "View Project", url: "#", imageSrc: "/profile-preview/feature1.jpg" },
  { id: "proj-2", title: "Landing page Design", description: "A minimal landing page design for an e-commerce website", buttonText: "View Project", url: "#", imageSrc: "/profile-preview/feature2.jpg" },
  { id: "proj-3", title: "Nova Health SaaS", description: "A minimalist SaaS platform designed for doctors.", buttonText: "View Project", url: "#", imageSrc: "/profile-preview/feature3.jpg" },
  { id: "proj-4", title: "Origin Collective", description: "A minimalist e-commerce website for a high-end furniture brand.", buttonText: "View Project", url: "#", imageSrc: "/profile-preview/feature2.jpg" },
  { id: "proj-5", title: "Apex Banking App", description: "Redesigning the core user journey of a modern banking app.", buttonText: "View Project", url: "#", imageSrc: "/profile-preview/feature1.jpg" },
  { id: "proj-6", title: "Form Branding System", description: "A cohesive visual identity and branding system.", buttonText: "View Project", url: "#", imageSrc: "/profile-preview/feature3.jpg" },
] as ProjectItem[];

const getLinkIcon = (title: string = "") => {
  const t = title.toLowerCase();
  if (t.includes("instagram")) return <InstagramIcon style={{ fontSize: 18 }} />;
  if (t.includes("twitter") || t === "x") return <XIcon style={{ fontSize: 18 }} />;
  if (t.includes("linkedin")) return <LinkedInIcon style={{ fontSize: 18 }} />;
  if (t.includes("github")) return <GithubIcon style={{ fontSize: 18 }} />;
  if (t.includes("youtube")) return <YoutubeIcon style={{ fontSize: 18 }} />;
  return <Globe size={18} />;
};

export default function PortfolioDashboardView({
  profile,
  content,
}: Props) {
  const name = profile?.fullName ?? profile?.username ?? "John Smith";
  const username = profile?.username ?? "johnsmith";
  const details = content?.content;
  const bio = profile?.bio ?? details?.bio?.content ?? "I help teams craft thoughtful, user-centered products — from the first sketch to a polished design system. Currently shaping fintech and SaaS experiences.";
  
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
        <header className="flex w-full flex-col sm:flex-row sm:items-start justify-between gap-6 mb-8">
          <div className="flex flex-col gap-6">
            <div className="relative h-[80px] w-[80px] shrink-0 overflow-hidden rounded-full border border-border bg-secondary-bg">
              <Image
                src={photoSrc}
                alt={name}
                fill
                className="object-cover"
                unoptimized
              />
              {/* Online indicator dot */}
              <div className="absolute bottom-1 right-1 h-4 w-4 rounded-full border-[3px] border-background bg-green-500" />
            </div>
            
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <h1 className="text-[26px] font-bold tracking-tight text-primary-text leading-tight">
                  {name}
                </h1>
                <BadgeCheck className="text-brand-hover-bg" size={20} fill="currentColor" stroke="var(--background)" strokeWidth={1.5} />
              </div>
              <p className="text-[14px] text-secondary-text mt-1">
                openprofile.app/{username}
              </p>
            </div>
          </div>

          <a
            href="mailto:hello@example.com"
            className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-brand-hover-bg bg-background px-4 text-[13px] font-semibold text-brand-hover-bg transition-colors hover:bg-brand-hover-bg/5"
          >
            <Mail size={16} />
            Email
          </a>
        </header>

        {/* BIO SECTION */}
        <section className="mb-16">
          <p className="text-[15px] leading-relaxed text-secondary-text max-w-3xl">
            {bio}
          </p>
        </section>

        {/* LINKS SECTION */}
        {details?.links?.visible !== false && links.length > 0 && (
          <section className="mb-20 w-full">
            <h2 className="mb-4 text-[13px] text-tertiary-text">Links</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {links.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between rounded-xl border border-border bg-background p-4 shadow-sm transition-all hover:border-brand-hover-bg/30 hover:shadow-md"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-primary-text transition-colors group-hover:text-brand-hover-bg">
                      {getLinkIcon(link.title)}
                    </div>
                    <span className="text-[14px] font-medium text-primary-text">{link.title}</span>
                  </div>
                  <ExternalLink size={14} className="text-tertiary-text transition-colors group-hover:text-brand-hover-bg" />
                </a>
              ))}
            </div>
          </section>
        )}

        {/* PROJECTS SECTION */}
        {details?.projects?.visible !== false && projects.length > 0 && (
          <section className="mb-20 w-full">
            <h2 className="mb-6 text-[13px] text-tertiary-text">
              {details?.projects?.sectionTitle || "Featured Projects"}
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((project, idx) => {
                const numberStr = String(idx + 1).padStart(2, "0");
                return (
                  <div key={project.id} className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-sm transition-shadow hover:shadow-md">
                    {/* Project Image Placeholder */}
                    <div className="relative aspect-16/10 w-full overflow-hidden bg-secondary-bg border-b border-border">
                      {project.imageSrc ? (
                        <Image
                          src={
                            project.imageSrc.startsWith('/profile-preview/') 
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
                      <div className="flex items-start gap-2 mb-1">
                        <span className="text-[16px] font-bold text-primary-text">{numberStr}</span>
                        <h3 className="text-[16px] font-bold text-primary-text">
                          {project.title}
                        </h3>
                      </div>
                      
                      <span className="text-[11px] text-tertiary-text ml-6 mb-3">
                        Product Design
                      </span>

                      {project.description && (
                        <p className="ml-6 text-[13px] text-secondary-text mb-6 line-clamp-2">
                          {project.description}
                        </p>
                      )}

                      {project.url && (
                        <a
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-6 mt-auto inline-flex items-center gap-1.5 text-[13px] font-bold text-brand-hover-bg hover:underline"
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
        )}

        {/* CTA SECTION */}
        {details?.cta?.visible !== false && (
          <section className="mb-24 w-full py-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-hover-bg text-white shadow-sm">
                  <Rocket size={24} strokeWidth={2} />
                </div>
                <div className="flex flex-col">
                  <h3 className="text-[16px] font-bold text-primary-text">
                    {cta?.title || "Interested in working together?"}
                  </h3>
                  <p className="text-[13px] text-secondary-text mt-0.5">
                    {cta?.subtitle || "I am currently available for freelance project"}
                  </p>
                </div>
              </div>
              <a
                href={cta?.url || "mailto:hello@example.com"}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 items-center justify-center rounded-md bg-brand-hover-bg px-6 text-[14px] font-bold text-white shadow-sm transition-all hover:bg-button-brand-bg active:scale-95 whitespace-nowrap"
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

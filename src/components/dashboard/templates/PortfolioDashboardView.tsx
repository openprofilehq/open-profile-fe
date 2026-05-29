import React from "react";
import Image from "next/image";
import {
  BadgeCheck,
  Mail,
  Globe,
  ExternalLink,
  ArrowRight,
  Rocket,
} from "lucide-react";
import {
  XIcon,
  InstagramIcon,
  LinkedInIcon,
  GithubIcon,
  YoutubeIcon,
} from "@/components/icons/BrandIcons";
import {
  DashboardProfileResponse,
  ProfileContentResponse,
  LinkItem,
  ProjectItem,
  ProfileAppearanceSettings,
} from "@/api/profile/profile.type";
import { getImageUrl } from "@/utils/profile";
import { TemplateFooter } from "./TemplateFooter";
import { normalizeHref } from "@/utils/url";

type Props = {
  profile?: DashboardProfileResponse;
  content?: ProfileContentResponse;
  isLoadingProfile?: boolean;
  isLoadingContent?: boolean;
  appearance?: ProfileAppearanceSettings | null;
};

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

export default function PortfolioDashboardView({ profile, content }: Props) {
  const name = profile?.fullName ?? profile?.username ?? "John Smith";
  const username = profile?.username ?? "johnsmith";
  const details = content?.content;
  const bio =
    profile?.bio ??
    details?.bio?.content ??
    "I help teams craft thoughtful, user-centered products — from the first sketch to a polished design system. Currently shaping fintech and SaaS experiences.";

  const links = (details?.links?.items ?? []) as LinkItem[];

  const projects = (details?.projects?.items ?? []) as ProjectItem[];

  const cta = details?.cta;

  const rawPhotoSrc = profile?.photoUrl;
  const photoSrc = rawPhotoSrc
    ? rawPhotoSrc.startsWith("/profile-preview/")
      ? rawPhotoSrc
      : getImageUrl(rawPhotoSrc) || "/profile-preview/avatar.png"
    : "/profile-preview/avatar.png";

  return (
    <div className="text-primary-text bg-secondary-bg flex w-full flex-col font-sans antialiased">
      <div className="mx-auto w-full max-w-5xl px-6 py-16 sm:py-24">
        {/* HEADER SECTION */}
        <header className="mb-8 flex w-full flex-col justify-between gap-6 sm:flex-row sm:items-start">
          <div className="flex flex-col gap-6">
            <div className="border-border bg-secondary-bg relative h-[80px] w-[80px] shrink-0 overflow-hidden rounded-full border">
              <Image
                src={photoSrc}
                alt={name}
                fill
                className="object-cover"
                unoptimized
              />
              {/* Online indicator dot */}
              <div className="border-background absolute right-1 bottom-1 h-4 w-4 rounded-full border-[3px] bg-green-500" />
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <h1 className="text-primary-text text-[26px] leading-tight font-bold tracking-tight">
                  {name}
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
        {details?.links?.visible !== false && links.length > 0 && (
          <section className="mb-20 w-full">
            <h2 className="text-tertiary-text mb-4 text-[13px]">Links</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {links.map((link) => {
                const safeHref = normalizeHref(link.url);

                if (safeHref) {
                  return (
                    <a
                      key={link.id}
                      href={safeHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group border-border bg-background hover:border-brand-hover-bg/30 flex items-center justify-between rounded-xl border p-4 shadow-sm transition-all hover:shadow-md"
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-primary-text group-hover:text-brand-hover-bg transition-colors">
                          {getLinkIcon(link.title || link.label)}
                        </div>
                        <span className="text-primary-text text-[14px] font-medium">
                          {link.title || link.label}
                        </span>
                      </div>
                      <ExternalLink
                        size={14}
                        className="text-tertiary-text group-hover:text-brand-hover-bg transition-colors"
                      />
                    </a>
                  );
                }

                return (
                  <div
                    key={link.id}
                    className="group border-border bg-background flex items-center justify-between rounded-xl border p-4 shadow-sm transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-primary-text transition-colors">
                        {getLinkIcon(link.title || link.label)}
                      </div>
                      <span className="text-primary-text text-[14px] font-medium">
                        {link.title || link.label}
                      </span>
                    </div>
                    <ExternalLink size={14} className="text-tertiary-text" />
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* PROJECTS SECTION */}
        {details?.projects?.visible !== false && projects.length > 0 && (
          <section className="mb-20 w-full">
            <h2 className="text-tertiary-text mb-6 text-[13px]">
              {details?.projects?.sectionTitle || "Featured Projects"}
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((project, idx) => {
                const numberStr = String(idx + 1).padStart(2, "0");
                return (
                  <div
                    key={project.id}
                    className="group border-border bg-background flex flex-col overflow-hidden rounded-2xl border shadow-sm transition-shadow hover:shadow-md"
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

                      {project.url &&
                        (() => {
                          const safe = normalizeHref(project.url);
                          if (!safe) {
                            return (
                              <span className="text-tertiary-text mt-auto ml-6 inline-flex items-center gap-1.5 text-[13px] font-bold">
                                {project.buttonText || "View Project"}
                              </span>
                            );
                          }

                          return (
                            <a
                              href={safe}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-brand-hover-bg mt-auto ml-6 inline-flex items-center gap-1.5 text-[13px] font-bold hover:underline"
                            >
                              {project.buttonText || "View Project"}
                              <ArrowRight size={14} strokeWidth={2.5} />
                            </a>
                          );
                        })()}
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
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
              <div className="flex items-center gap-4">
                <div className="bg-brand-hover-bg flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white shadow-sm">
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

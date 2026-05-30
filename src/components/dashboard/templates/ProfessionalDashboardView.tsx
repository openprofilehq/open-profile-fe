import React from "react";
import Image from "next/image";
import { Mail, Link as LinkIcon, ArrowRight } from "lucide-react";
import {
  DashboardProfileResponse,
  ProfileContentResponse,
  LinkItem,
  ProjectItem,
  ProfileAppearanceSettings,
} from "@/api/profile/profile.type";
import { getImageUrl } from "@/utils/profile";
import normalizeHref from "@/utils/url";
import { TemplateFooter } from "./TemplateFooter";

type Props = {
  profile?: DashboardProfileResponse;
  content?: ProfileContentResponse;
  isLoadingProfile?: boolean;
  isLoadingContent?: boolean;
  appearance?: ProfileAppearanceSettings | null;
  isPreview?: boolean;
};

export default function ProfessionalDashboardView({
  profile,
  content,
  appearance,
}: Props) {
  const name = profile?.fullName ?? profile?.username ?? "John Smith";
  const username = profile?.username ?? "johnsmith";

  const details = content?.content;
  const bio =
    profile?.bio ??
    details?.bio?.content ??
    "Product Designer helping early-stage startups build meaningful, trustworthy experiences. Previously at Linear and Loom";

  const links = (details?.links?.items ?? []) as LinkItem[];

  const projects = (details?.projects?.items ?? []) as ProjectItem[];

  const cta = details?.cta;

  const rawPhotoSrc = profile?.photoUrl;
  const photoSrc = rawPhotoSrc
    ? rawPhotoSrc.startsWith("/profile-preview/")
      ? rawPhotoSrc
      : getImageUrl(rawPhotoSrc)!
    : "/profile-preview/avatar.png";

  const hasCustomBg = !!(
    appearance?.backgroundColour ||
    appearance?.bgColor ||
    appearance?.accentColour
  );
  const customBgStyle = hasCustomBg
    ? undefined
    : ({
        "--primary-bg": "#FFFFFF",
      } as React.CSSProperties);

  return (
    <div
      className="text-primary-text bg-primary-bg flex min-h-screen w-full flex-col antialiased"
      style={customBgStyle}
    >
      <div
        className="mx-auto flex w-full max-w-5xl flex-col px-6 py-16 sm:py-24"
        style={{ gap: "calc(var(--op-spacing, 24px) * 2)" }}
      >
        {/* HEADER SECTION */}
        <header
          className="flex w-full flex-col justify-between sm:flex-row sm:items-start"
          style={{ gap: "var(--op-spacing, 24px)" }}
        >
          <div
            className="flex items-center"
            style={{ gap: "var(--op-spacing, 24px)" }}
          >
            <div className="border-border bg-secondary-bg relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-full border">
              <Image
                src={photoSrc}
                alt={name}
                fill
                className="object-cover"
                unoptimized
              />
              {/* Online indicator dot */}
              <div className="border-background absolute right-1 bottom-1 h-3.5 w-3.5 rounded-full border-2 bg-green-500" />
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
        <section>
          <p className="text-secondary-text max-w-2xl text-[16px] leading-relaxed">
            {bio}
          </p>
        </section>

        {/* LINKS SECTION */}
        {details?.links?.visible !== false && links.length > 0 && (
          <section className="w-full">
            <h2 className="text-tertiary-text mb-4 text-[13px]">Links</h2>
            <div className="flex flex-col">
              {links.map((link, idx) => {
                // Strip protocols and www for a cleaner display URL
                const displayUrl =
                  link.url
                    ?.replace(/^https?:\/\/(www\.)?/, "")
                    ?.replace(/\/$/, "") || "link";

                const safeHref = normalizeHref(link.url);

                if (safeHref) {
                  return (
                    <a
                      key={link.id}
                      href={safeHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={
                        idx === 0
                          ? "group hover:bg-hover-bg border-border flex items-center justify-between border-y py-4 transition-colors"
                          : "group hover:bg-hover-bg border-border flex items-center justify-between border-b py-4 transition-colors"
                      }
                    >
                      <span className="text-primary-text text-[15px] font-bold">
                        {link.title || link.label}
                      </span>
                      <span className="text-secondary-text group-hover:text-brand-hover-bg flex items-center gap-2 text-[14px] transition-colors">
                        {displayUrl}
                        <LinkIcon size={14} />
                      </span>
                    </a>
                  );
                }

                return (
                  <div
                    key={link.id}
                    className={
                      idx === 0
                        ? "group border-border flex items-center justify-between border-y py-4 transition-colors"
                        : "group border-border flex items-center justify-between border-b py-4 transition-colors"
                    }
                  >
                    <span className="text-primary-text text-[15px] font-bold">
                      {link.title || link.label}
                    </span>
                    <span className="text-secondary-text flex items-center gap-2 text-[14px]">
                      {displayUrl}
                      <LinkIcon size={14} />
                    </span>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* PROJECTS SECTION */}
        {details?.projects?.visible !== false && projects.length > 0 && (
          <section className="w-full">
            <h2 className="text-tertiary-text mb-4 text-[13px]">
              {details?.projects?.sectionTitle || "Selected Work"}
            </h2>
            <div
              className="flex flex-col"
              style={{ gap: "var(--op-spacing, 24px)" }}
            >
              {projects.map((project) => {
                const safeHref = normalizeHref(project.url);

                let ctaNode: React.ReactNode = null;
                if (project.url) {
                  if (safeHref) {
                    ctaNode = (
                      <a
                        href={safeHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-brand-hover-bg mt-3 inline-flex items-center gap-1.5 text-[13px] font-bold hover:underline"
                      >
                        {project.buttonText || "View Project"}
                        <ArrowRight size={14} strokeWidth={2.5} />
                      </a>
                    );
                  } else {
                    ctaNode = (
                      <span className="text-tertiary-text mt-3 inline-flex items-center gap-1.5 text-[13px] font-bold">
                        {project.buttonText || "View Project"}
                      </span>
                    );
                  }
                }

                return (
                  <div
                    key={project.id}
                    className="border-border bg-background flex flex-col items-start rounded-xl border shadow-sm transition-shadow hover:shadow-md sm:flex-row sm:items-center"
                    style={{ padding: "var(--op-spacing, 24px)" }}
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
                      {ctaNode}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

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

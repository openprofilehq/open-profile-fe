"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ArrowRight, MessageSquare } from "lucide-react";
import { TemplateLinkCard, getLinkIcon } from "../shared/TemplateLinkCard";
import {
  DashboardProfileResponse,
  ProfileContentResponse,
  LinkItem,
  ProjectItem,
  ProfileAppearanceSettings,
} from "@/api/profile/profile.type";
import { getImageUrl } from "@/utils/profile";
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
  { id: "link-1", title: "Instagram", url: "https://instagram.com/johnsmith" },
  { id: "link-2", title: "Twitter / X", url: "https://twitter.com/johnsmith" },
  { id: "link-3", title: "LinkedIn", url: "https://linkedin.com/in/johnsmith" },
  { id: "link-4", title: "Facebook", url: "https://facebook.com/johnsmith" },
  { id: "link-5", title: "Website", url: "https://johnsmithdesign.com" },
] as LinkItem[];

const DEFAULT_PROJECTS = [
  {
    id: "proj-1",
    title: "Summer Campaign x [Pitaya]",
    description:
      "A cross-platform content series reaching over 2M views, focusing on sustainable lifestyle.",
    buttonText: "View Project",
    url: "#",
    imageSrc: "/profile-preview/feature1.jpg",
  },
  {
    id: "proj-2",
    title: "The 30-Day Creative Challenge",
    description: "Launched a guided workshop series for 10,000+ creators.",
    buttonText: "View Project",
    url: "#",
    imageSrc: "/profile-preview/feature2.jpg",
  },
  {
    id: "proj-3",
    title: "Documentary Series",
    description: "A 3-part YouTube series exploring the creator economy.",
    buttonText: "View Project",
    url: "#",
    imageSrc: "/profile-preview/feature3.jpg",
  },
  {
    id: "proj-4",
    title: "Documentary Series",
    description: "A 3-part YouTube series exploring the creator economy.",
    buttonText: "View Project",
    url: "#",
    imageSrc: "/profile-preview/feature3.jpg",
  },
] as ProjectItem[];

export default function CreatorDashboardView({ profile, content, isPreview }: Props) {
  const [activeTab, setActiveTab] = useState<"projects" | "links" | "about">(
    "projects"
  );

  const name =
    profile?.fullName ?? profile?.username ?? "John Smith - Product designer";
  const username = profile?.username ?? "johnsmith";

  const details = content?.content;
  const bio =
    profile?.bio ??
    details?.bio?.content ??
    "I'm John Smith—a creator focused on building and sharing things that feel simple and useful. I spend most of my time working on ideas, collaborating with others, and turning rough concepts into something real. Some of it sticks, some of it doesn't, but that's part of the process.\n\nThis is where everything lives—my work, my links, and a way to get in touch if you want to build something together.";

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

  const socialLinks = links
    .filter((link) => {
      const url = (link.url || "").toLowerCase();
      return (
        url.includes("twitter") ||
        url.includes("x.com") ||
        url.includes("linkedin") ||
        url.includes("instagram") ||
        url.includes("facebook") ||
        url.includes("youtube") ||
        url.includes("whatsapp")
      );
    })
    .slice(0, 4);
  return (
    <div className="text-primary-text flex min-h-screen w-full flex-col font-sans antialiased">
      <div className="mx-auto w-full max-w-3xl px-6 py-16 sm:py-24">
        <header className="flex w-full flex-col items-center gap-4 text-center">
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

          <div className="flex flex-col items-center">
            <h1 className="text-primary-text flex items-center gap-2 text-2xl font-bold tracking-tight sm:text-3xl">
              {name}
            </h1>
            <p className="text-secondary-text mt-1 text-[15px]">
              openprofile.app/{username}
            </p>
          </div>

          {socialLinks.length > 0 && (
            <div className="mt-2 flex items-center gap-4">
              {socialLinks.map((link, i) => {
                return (
                  <a
                    key={i}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-secondary-text hover:text-primary-text transition-colors"
                  >
                    {getLinkIcon((link.url || "") + " " + (link.title || link.label || ""))}
                  </a>
                );
              })}
            </div>
          )}

          {details?.cta?.visible !== false && (
            <a
              href={cta?.url || "mailto:hello@example.com"}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-brand-hover-bg hover:bg-button-brand-bg mt-4 inline-flex h-10 items-center justify-center gap-2 rounded-md px-6 text-sm font-semibold text-white shadow-sm transition-all active:scale-95"
            >
              {cta?.iconSrc ? (
                <Image src={getImageUrl(cta.iconSrc)!} alt="CTA Icon" width={16} height={16} className="h-4 w-4 object-contain brightness-0 invert" unoptimized />
              ) : (
                <MessageSquare size={16} />
              )}
              {cta?.buttonText || cta?.label || "Let's Collaborate"}
            </a>
          )}
        </header>

        {/* TABS NAVIGATION */}
        <div className="border-border mt-12 flex items-center justify-center gap-8 border-b">
          <button
            onClick={() => setActiveTab("projects")}
            className={`relative pb-3 text-[15px] font-semibold transition-colors ${activeTab === "projects" ? "text-brand-hover-bg" : "text-secondary-text hover:text-primary-text"}`}
          >
            Projects
            {activeTab === "projects" && (
              <span className="bg-brand-hover-bg absolute right-0 -bottom-px left-0 h-[2px]" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("links")}
            className={`relative pb-3 text-[15px] font-semibold transition-colors ${activeTab === "links" ? "text-brand-hover-bg" : "text-secondary-text hover:text-primary-text"}`}
          >
            Links
            {activeTab === "links" && (
              <span className="bg-brand-hover-bg absolute right-0 -bottom-px left-0 h-[2px]" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("about")}
            className={`relative pb-3 text-[15px] font-semibold transition-colors ${activeTab === "about" ? "text-brand-hover-bg" : "text-secondary-text hover:text-primary-text"}`}
          >
            About
            {activeTab === "about" && (
              <span className="bg-brand-hover-bg absolute right-0 -bottom-px left-0 h-[2px]" />
            )}
          </button>
        </div>

        {/* TABS CONTENT */}
        <div className="mt-10 min-h-[400px] w-full">
          {activeTab === "projects" && (() => {
            const highlightedProject = projects.find(
              (p) => p.highlighted === true || String(p.highlighted) === "true" || String(p.id).startsWith("hl_")
            );
            const remainingProjects = projects.filter((p) => p.id !== highlightedProject?.id);

            return (
              <div className="flex flex-col gap-10">
                <HighlightCard details={content?.content} />
                {remainingProjects.length > 0 ? (
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    {remainingProjects.map((project) => {
                      const projectUrl = project.url || (project as { repoUrl?: string }).repoUrl;
                      return (
                        <div
                          key={project.id}
                          className="border-border bg-background flex flex-col overflow-hidden rounded-[12px] border transition-shadow hover:shadow-md"
                        >
                          <div className="bg-secondary-bg relative h-[200px] w-full shrink-0">
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
                              <div className="h-full w-full bg-neutral-200" />
                            )}
                          </div>
                          <div className="flex flex-col p-6">
                            <h3 className="text-primary-text text-[17px] font-bold">
                              {project.title}
                            </h3>
                            {project.description && (
                              <p className="text-secondary-text mt-3 line-clamp-3 text-[14px] leading-relaxed">
                                {project.description}
                              </p>
                            )}
                            {projectUrl && (
                              <a
                                href={projectUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-brand-hover-bg mt-6 inline-flex items-center gap-1.5 text-[14px] font-bold hover:underline"
                              >
                                {project.buttonText || "View Project"}
                                <ArrowRight size={16} strokeWidth={2.5} />
                              </a>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-tertiary-text border-border rounded-xl border border-dashed py-8 text-center text-sm">
                    Add your projects
                  </p>
                )}
              </div>
            );
          })()}

          {activeTab === "links" && (
            <>
              {links.length > 0 ? (
                <div className="mx-auto flex w-full flex-col gap-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 w-full">
                    {links.map((link) => (
                      <TemplateLinkCard
                        key={link.id}
                        id={link.id}
                        title={link.title || link.label || ""}
                        url={link.url || ""}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-tertiary-text border-border rounded-xl border border-dashed py-8 text-center text-sm">
                  Add your links
                </p>
              )}
            </>
          )}

          {activeTab === "about" && (
            <div className="border-border bg-background mx-auto max-w-2xl rounded-[12px] border p-8 sm:p-12">
              <p className="text-secondary-text text-center text-[16px] leading-relaxed whitespace-pre-wrap">
                {bio}
              </p>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="mt-20">
          <TemplateFooter />
        </div>
      </div>
    </div>
  );
}

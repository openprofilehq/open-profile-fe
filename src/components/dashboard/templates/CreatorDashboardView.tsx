"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Mail, ArrowRight } from "lucide-react";
import {
  DashboardProfileResponse,
  ProfileContentResponse,
  LinkItem,
  ProjectItem,
} from "@/api/profile/profile.type";
import { getImageUrl } from "@/utils/profile";
import { TemplateFooter } from "./TemplateFooter";
import {
  XIcon,
  InstagramIcon,
  LinkedInIcon,
  GithubIcon,
  YoutubeIcon,
  FacebookIcon,
  DribbbleIcon,
  GlobeIcon,
} from "@/components/icons/BrandIcons";

type Props = {
  profile?: DashboardProfileResponse;
  content?: ProfileContentResponse;
  isLoadingProfile?: boolean;
  isLoadingContent?: boolean;
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

const getIconForUrl = (url: string = "") => {
  const lowerUrl = url.toLowerCase();
  if (lowerUrl.includes("twitter.com") || lowerUrl.includes("x.com"))
    return XIcon;
  if (lowerUrl.includes("instagram.com")) return InstagramIcon;
  if (lowerUrl.includes("linkedin.com")) return LinkedInIcon;
  if (lowerUrl.includes("github.com")) return GithubIcon;
  if (lowerUrl.includes("youtube.com")) return YoutubeIcon;
  if (lowerUrl.includes("facebook.com")) return FacebookIcon;
  if (lowerUrl.includes("dribbble.com")) return DribbbleIcon;
  return GlobeIcon;
};

export default function CreatorDashboardView({ profile, content }: Props) {
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
  const links = rawLinks.length > 0 ? rawLinks : DEFAULT_LINKS;

  const rawProjects = (details?.projects?.items ?? []) as ProjectItem[];
  const projects = rawProjects.length > 0 ? rawProjects : DEFAULT_PROJECTS;

  const cta = details?.cta;

  const rawPhotoSrc = profile?.photoUrl;
  const photoSrc = rawPhotoSrc
    ? rawPhotoSrc.startsWith("/profile-preview/")
      ? rawPhotoSrc
      : getImageUrl(rawPhotoSrc)!
    : "/profile-preview/avatar.png";

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
    <div className="text-primary-text bg-primary-bg flex min-h-screen w-full flex-col font-sans antialiased">
      <div className="mx-auto w-full max-w-3xl px-6 py-16 sm:py-24">
        <header className="flex w-full flex-col items-center gap-4 text-center">
          <div className="border-border bg-secondary-bg relative h-24 w-24 shrink-0 overflow-hidden rounded-full border">
            <Image
              src={photoSrc}
              alt={name}
              fill
              className="object-cover"
              unoptimized
            />
            <div className="border-background absolute right-[6px] bottom-[6px] h-4 w-4 rounded-full border-2 bg-green-400" />
          </div>

          <div className="flex flex-col items-center">
            <h1 className="text-primary-text flex items-center gap-2 text-2xl font-bold tracking-tight sm:text-3xl">
              {name}
              <svg
                className="text-brand-hover-bg h-5 w-5"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15l-4-4 1.41-1.41L11 14.17l6.59-6.59L19 9l-8 8z" />
              </svg>
            </h1>
            <p className="text-secondary-text mt-1 text-[15px]">
              openprofile.app/{username}
            </p>
          </div>

          {socialLinks.length > 0 && (
            <div className="mt-2 flex items-center gap-4">
              {socialLinks.map((link, i) => {
                const Icon = getIconForUrl(link.url);
                return (
                  <a
                    key={i}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-secondary-text hover:text-primary-text transition-colors"
                  >
                    <Icon className="h-5 w-5" />
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
              <Mail size={16} />
              {cta?.label || "Let's Collaborate"}
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
              <span className="bg-brand-hover-bg absolute right-0 bottom-[-1px] left-0 h-[2px]" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("links")}
            className={`relative pb-3 text-[15px] font-semibold transition-colors ${activeTab === "links" ? "text-brand-hover-bg" : "text-secondary-text hover:text-primary-text"}`}
          >
            Links
            {activeTab === "links" && (
              <span className="bg-brand-hover-bg absolute right-0 bottom-[-1px] left-0 h-[2px]" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("about")}
            className={`relative pb-3 text-[15px] font-semibold transition-colors ${activeTab === "about" ? "text-brand-hover-bg" : "text-secondary-text hover:text-primary-text"}`}
          >
            About
            {activeTab === "about" && (
              <span className="bg-brand-hover-bg absolute right-0 bottom-[-1px] left-0 h-[2px]" />
            )}
          </button>
        </div>

        {/* TABS CONTENT */}
        <div className="mt-10 min-h-[400px] w-full">
          {activeTab === "projects" && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="border-border bg-background flex flex-col overflow-hidden rounded-2xl border transition-shadow hover:shadow-md"
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
                    {project.url && (
                      <a
                        href={project.url}
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
              ))}
            </div>
          )}

          {activeTab === "links" && (
            <div className="mx-auto flex max-w-xl flex-col gap-4">
              {links.map((link) => {
                const Icon = getIconForUrl(link.url);
                const isWebsite =
                  !link.url?.includes("twitter") &&
                  !link.url?.includes("instagram") &&
                  !link.url?.includes("linkedin") &&
                  !link.url?.includes("facebook") &&
                  !link.url?.includes("youtube") &&
                  !link.url?.includes("github");
                const subtitle = isWebsite
                  ? link.url
                      ?.replace(/^https?:\/\/(www\.)?/, "")
                      ?.replace(/\/$/, "")
                  : `@${username}`;

                return (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group border-border bg-background hover:border-brand-hover-bg flex items-center justify-between rounded-2xl border p-4 transition-all hover:shadow-sm sm:px-6"
                  >
                    <div className="flex items-center gap-4">
                      <div className="bg-brand-light-subtle-bg text-brand-hover-bg flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-primary-text text-[15px] font-bold">
                          {link.title || link.label}
                        </span>
                        <span className="text-tertiary-text text-[13px]">
                          {subtitle}
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="text-tertiary-text group-hover:text-brand-hover-bg h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </a>
                );
              })}
            </div>
          )}

          {activeTab === "about" && (
            <div className="border-border bg-background mx-auto max-w-2xl rounded-3xl border p-8 sm:p-12">
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

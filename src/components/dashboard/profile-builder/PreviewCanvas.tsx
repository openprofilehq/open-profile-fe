"use client";

import {
  Link2,
  Folder,
  Briefcase,
  ExternalLink,
  Eye,
  Trash2,
} from "lucide-react";
import { getImageUrl } from "@/utils/profile";
import type { ProjectItem } from "@/api/profile/project.type";
import type { Section } from "./types";


interface PreviewCanvasProps {
  font: string;
  textColor: string;
  bgColor: string;
  iconColor: string;
  spacing: number;
  borderRadius: "sharp" | "medium" | "round";
  theme: "light" | "dark";
  sections: Section[];
  profile?: {
    fullName?: string;
    bio?: string | null;
    photoUrl?: string | null;
  } | null;
}

export default function PreviewCanvas({
  font,
  textColor,
  bgColor,
  iconColor,
  spacing,
  borderRadius,
  theme,
  sections,
  profile,
}: PreviewCanvasProps) {
  const fontStyles: Record<string, string> = {
    Afacad: "font-afacad",
    Inter: "font-sans",
    Serif: "font-serif",
    Mono: "font-mono",
  };

  const selectedFontClass = fontStyles[font] || "font-afacad";

  const radiusMap = {
    sharp: "0px",
    medium: "16px",
    round: "32px",
  };
  const activeRadius = radiusMap[borderRadius] || "16px";

  // Light/Dark Theme
  const isDark = theme === "dark";

  const cardStyle = {
    backgroundColor:
      bgColor === "#FFFFFF" && isDark
        ? "#1E1E1E"
        : bgColor || (isDark ? "#1E1E1E" : "#FFFFFF"),
    borderRadius: activeRadius,
    color:
      textColor === "#050505" && isDark
        ? "#FAFAFA"
        : textColor || (isDark ? "#FAFAFA" : "#050505"),
    borderColor: isDark ? "#2D2D2D" : "#EDEDED",
    marginBottom: `${spacing}px`,
  };

  const textStyle = {
    color:
      textColor === "#050505" && isDark
        ? "#E0E0E0"
        : textColor || (isDark ? "#E0E0E0" : "#454545"),
  };

  const iconStyle = {
    color: iconColor || "#0a92a4",
    backgroundColor: isDark
      ? "rgba(10, 146, 164, 0.15)"
      : "rgba(10, 146, 164, 0.08)",
  };

  const renderProjectMedia = (project: ProjectItem) => {
    const projectImageUrl = getImageUrl(project.imageUrl || "");

    return projectImageUrl ? (
      <div className="relative h-full min-h-[180px] w-full overflow-hidden rounded-[14px] bg-black/10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={projectImageUrl}
          alt={project.title || "Project image"}
          className="h-full w-full object-cover"
        />
      </div>
    ) : (
      <div
        className="flex h-full min-h-[180px] w-full items-center justify-center rounded-[14px] bg-[#F4F4F5] text-[#8A8A8A]"
        style={{ backgroundColor: isDark ? "#2A2A2A" : "#F4F4F5" }}
      >
        <Folder size={32} className="opacity-20" />
      </div>
    );
  };

  const renderGridProjects = (section: Section) => {
    const allProjects = section.projects || [];
    const highlighted = allProjects.filter((p) => p.isHighlight);
    const rest = allProjects.filter((p) => !p.isHighlight);

    return (
      <div className="flex flex-col gap-4">
        {highlighted.map((project) => (
          <div
            key={project.id}
            className="overflow-hidden rounded-[12px] border"
            style={{ borderColor: isDark ? "#2D2D2D" : "#EDEDED" }}
          >
            {renderProjectMedia(project)}
            <div className="p-4">
              <p
                className="mb-1 text-xs font-semibold"
                style={{ color: iconColor || "#087583" }}
              >
                Highlight
              </p>
              <h4 className="text-base font-bold leading-snug">
                {project.title || "Untitled Project"}
              </h4>
              {project.subtitle && (
                <p className="mt-1.5 text-sm leading-relaxed opacity-70">
                  {project.subtitle}
                </p>
              )}
              {project.projectUrl && (
                <a
                  href={project.projectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1.5 rounded-lg border px-4 py-2 text-sm font-semibold transition-opacity hover:opacity-80"
                  style={{ borderColor: isDark ? "#3D3D3D" : "#E4E4E7" }}
                >
                  View project
                  <ExternalLink size={13} />
                </a>
              )}
            </div>
          </div>
        ))}

        {rest.length > 0 && (
          <div className="grid grid-cols-2 gap-3">
            {rest.map((project) => (
              <div
                key={project.id}
                className="flex flex-col overflow-hidden rounded-[12px] border"
                style={{ borderColor: isDark ? "#2D2D2D" : "#EDEDED" }}
              >
                <div className="relative h-28 w-full overflow-hidden">
                  {project.imageUrl ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={project.imageUrl}
                        alt={project.title || "Project image"}
                        className="h-full w-full object-cover"
                      />
                    </>
                  ) : (
                    <div
                      className="flex h-28 w-full items-center justify-center"
                      style={{ backgroundColor: isDark ? "#2A2A2A" : "#F4F4F5" }}
                    >
                      <Folder size={22} className="opacity-20" />
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <h4 className="truncate text-sm font-semibold">
                    {project.title || "Untitled Project"}
                  </h4>
                  {project.subtitle && (
                    <p className="mt-0.5 truncate text-xs opacity-60">
                      {project.subtitle}
                    </p>
                  )}
                  {project.projectUrl && (
                    <ExternalLink
                      size={12}
                      className="mt-1.5 opacity-40"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderProjectListItem = (project: ProjectItem) => (
    <div
      key={project.id}
      className="flex overflow-hidden rounded-[14px] border"
      style={{ borderColor: isDark ? "#2D2D2D" : "#EDEDED" }}
    >
      <div className="relative h-24 w-24 shrink-0 overflow-hidden bg-black/10">
        {project.imageUrl ? (
          <img
            src={getImageUrl(project.imageUrl || "")}
            alt={project.title || "Project image"}
            className="h-full w-full object-cover"
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center"
            style={{ backgroundColor: isDark ? "#2A2A2A" : "#F4F4F5" }}
          >
            <Folder size={24} className="opacity-20" />
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col justify-center gap-1 p-3">
        <div className="flex items-center justify-between gap-2">
          <span
            className="text-[11px] font-semibold uppercase tracking-[0.16em]"
            style={{ color: iconColor || "#087583" }}
          >
            {project.isHighlight ? "Highlight" : "Project"}
          </span>
          {project.projectUrl && (
            <ExternalLink size={14} className="opacity-60" />
          )}
        </div>
        <h4 className="truncate text-sm font-semibold">
          {project.title || "Untitled Project"}
        </h4>
        {project.subtitle && (
          <p className="truncate text-xs opacity-70">{project.subtitle}</p>
        )}
      </div>
    </div>
  );

  const renderFeaturedProjectLayout = (
    section: Section,
    side: "left" | "right"
  ) => {
    const allProjects = section.projects || [];
    if (allProjects.length === 0) {
      return (
        <div className="border-tertiary-b flex items-center rounded-lg border border-dashed bg-black/5 p-4">
          <p className="text-tertiary-text text-xs">
            No projects yet — add one from the left panel
          </p>
        </div>
      );
    }

    const featuredProject =
      allProjects.find((p) => p.isHighlight) || allProjects[0];
    const restProjects = allProjects.filter((project) => project.id !== featuredProject.id);

    const featuredCard = (
      <div
        className="overflow-hidden rounded-[18px] border bg-transparent"
        style={{ borderColor: isDark ? "#2D2D2D" : "#EDEDED" }}
      >
        {renderProjectMedia(featuredProject)}
        <div className="p-5">
          <p
            className="mb-2 text-xs font-semibold uppercase"
            style={{ color: iconColor || "#087583" }}
          >
            {featuredProject.isHighlight ? "Highlighted project" : "Featured project"}
          </p>
          <h4 className="text-2xl font-bold leading-snug">
            {featuredProject.title || "Untitled Project"}
          </h4>
          {featuredProject.subtitle && (
            <p className="mt-3 text-sm leading-relaxed opacity-80">
              {featuredProject.subtitle}
            </p>
          )}
          {featuredProject.projectUrl && (
            <a
              href={featuredProject.projectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 rounded-lg border px-4 py-3 text-sm font-semibold transition-opacity hover:opacity-80"
              style={{ borderColor: isDark ? "#3D3D3D" : "#E4E4E7" }}
            >
              View project
              <ExternalLink size={13} />
            </a>
          )}
        </div>
      </div>
    );

    const listColumn = (
      <div className="flex flex-col gap-3">
        {restProjects.length > 0 ? (
          restProjects.map((project) => renderProjectListItem(project))
        ) : (
          <div className="rounded-[14px] border border-dashed border-neutral-300 bg-neutral-50 p-5 text-sm text-neutral-500">
            No additional projects
          </div>
        )}
      </div>
    );

    return (
      <div className="grid gap-4 lg:grid-cols-[1.7fr_1fr]">
        {side === "left" ? (
          <>
            {featuredCard}
            {listColumn}
          </>
        ) : (
          <>
            {listColumn}
            {featuredCard}
          </>
        )}
      </div>
    );
  };

  const renderProjectsSection = (section: Section) => {
    const allProjects = section.projects || [];
    if (allProjects.length === 0) {
      return (
        <div className="border-tertiary-b flex items-center rounded-lg border border-dashed bg-black/5 p-4">
          <p className="text-tertiary-text text-xs">
            No projects yet — add one from the left panel
          </p>
        </div>
      );
    }

    const layout = section.projectLayout || "grid";

    if (layout === "wide") {
      return (
        <div className="flex flex-col gap-4">
          {allProjects.map((project) => (
            <div
              key={project.id}
              className="overflow-hidden rounded-[14px] border"
              style={{ borderColor: isDark ? "#2D2D2D" : "#EDEDED" }}
            >
              <div className="grid gap-4 p-4 sm:p-5 md:grid-cols-[1.5fr_1fr] md:items-center">
                <div className="flex flex-col gap-4">
                  <p
                    className="text-xs font-semibold uppercase"
                    style={{ color: iconColor || "#087583" }}
                  >
                    {project.isHighlight ? "Highlight" : "Project"}
                  </p>
                  <h4 className="text-xl font-bold leading-snug">
                    {project.title || "Untitled Project"}
                  </h4>
                  {project.subtitle && (
                    <p className="text-sm leading-relaxed opacity-75">
                      {project.subtitle}
                    </p>
                  )}
                  {project.projectUrl && (
                    <a
                      href={project.projectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-semibold transition-opacity hover:opacity-80"
                      style={{ borderColor: isDark ? "#3D3D3D" : "#E4E4E7" }}
                    >
                      View project
                      <ExternalLink size={13} />
                    </a>
                  )}
                </div>
                <div>{renderProjectMedia(project)}</div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (layout === "left") {
      return renderFeaturedProjectLayout(section, "left");
    }

    if (layout === "right") {
      return renderFeaturedProjectLayout(section, "right");
    }

    return renderGridProjects(section);
  };

  return (
    <div
      className={`animate-in fade-in flex flex-1 justify-center overflow-y-auto transition-colors duration-200 ${isDark ? "bg-[#121212]" : "bg-transparent"}`}
    >
      {/* Device wrapper */}
      <div className="flex w-full max-w-195 flex-col gap-6">
        {/* Dynamic Card Container with settings applied */}
        <div
          className={`flex w-full flex-col transition-all duration-300 ${selectedFontClass}`}
        >
          {/* 1. Main Bio Card */}
          <div
            style={cardStyle}
            className="relative flex flex-col items-center gap-6 border p-6 shadow-sm transition-all duration-300 sm:flex-row sm:items-start sm:p-8"
          >
            {/* Action buttons */}
            <div className="absolute top-6 right-6 flex items-center gap-3 rounded-full border border-[#EDEDED] bg-white px-3.5 py-1.5 shadow-none select-none">
              <button
                className="text-[#3A3A3A] transition-opacity hover:opacity-80"
                title="Toggle visibility"
              >
                <Eye size={18} strokeWidth={2} />
              </button>
              <button
                className="text-[#9F2B2B] transition-opacity hover:opacity-80"
                title="Delete section"
              >
                <Trash2 size={18} strokeWidth={2} />
              </button>
            </div>

            {/* Avatar */}
            <div className="border-brand-b/20 bg-brand-light-subtle-bg relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 shadow-inner">
              {getImageUrl(profile?.photoUrl) ? (
                <img
                  src={getImageUrl(profile?.photoUrl) || ""}
                  alt={profile?.fullName ?? "Profile avatar"}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="text-brand-text text-3xl font-bold">
                  {(profile?.fullName || "M").charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-2xl font-bold tracking-tight">
                {profile?.fullName || "Micaela Robinsonss"}
              </h2>
                <p
                  style={textStyle}
                  className="mt-3 text-[15px] leading-relaxed opacity-90 transition-colors"
                >
                  {profile?.bio ||
                    "I'm a digital creator focusing on the intersection of design, technology, and intentional living. Sharing insights to help you build better products and habits."}
                </p>
              </div>
            </div>

          {/* 2. Dynamic Section Renderers */}
          {sections.map((section) => {
            if (section.type === "bio") return null;

            return (
              <div
                key={section.id}
                style={cardStyle}
                className="relative flex flex-col border p-6 shadow-sm transition-all duration-300"
              >
                {/* Action buttons */}
                <div className="absolute top-6 right-6 flex items-center gap-3 rounded-[10px] border border-[#EDEDED] bg-white px-6 py-3 shadow-none select-none">
                  <button
                    className="text-[#3A3A3A] transition-opacity hover:opacity-80"
                    title="Toggle visibility"
                  >
                    <Eye size={18} strokeWidth={2} />
                  </button>
                  <button
                    className="text-[#9F2B2B] transition-opacity hover:opacity-80"
                    title="Delete section"
                  >
                    <Trash2 size={18} strokeWidth={2} />
                  </button>
                </div>

                {/* Section Header */}
                <div
                  className="mb-4 flex items-center justify-between border-b pr-24 pb-4"
                  style={{ borderColor: isDark ? "#2D2D2D" : "#F0F0F0" }}
                >
                  <div className="flex items-center gap-3">
                    <span
                      style={iconStyle}
                      className="flex h-10 w-10 items-center justify-center rounded-lg transition-all duration-300"
                    >
                      {section.type === "projects" && <Folder size={18} />}
                      {section.type === "links" && <Link2 size={18} />}
                      {section.type === "experience" && <Briefcase size={18} />}
                    </span>
                    <h3 className="text-lg font-bold">
                      {section.type === "projects"
                        ? section.sectionTitle || section.title
                        : section.title}
                    </h3>
                  </div>
                </div>

                {/* Section Body */}
                {section.type === "projects" && renderProjectsSection(section)}

                {section.type === "links" && (
                  <div className="flex flex-wrap gap-2">
                    {["Twitter", "GitHub", "YouTube", "LinkedIn"].map(
                      (platform) => (
                        <span
                          key={platform}
                          className="border-tertiary-b inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold hover:bg-black/5"
                          style={{ borderColor: isDark ? "#2D2D2D" : undefined }}
                        >
                          <Link2 size={12} />
                          {platform}
                        </span>
                      )
                    )}
                  </div>
                )}

                {section.type === "experience" && (
                  <div className="flex flex-col gap-3">
                    <div className="flex items-start justify-between text-xs">
                      <div>
                        <p className="text-sm font-bold">Lead UI Architect</p>
                        <p className="text-tertiary-text">Stark Industries</p>
                      </div>
                      <span className="text-disabled-text">2024 - Present</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
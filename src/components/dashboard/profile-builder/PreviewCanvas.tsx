"use client";

import Image from "next/image";
import {
  Folder,
  Briefcase,
  ExternalLink,
  Eye,
  EyeOff,
  Trash2,
} from "lucide-react";
import { getImageUrl } from "@/utils/profile";
import CtaSectionPreview from "../cta/CtaSectionPreview";
import type { Section, ProfilePreview } from "./types";

interface PreviewCanvasProps {
  font: string;
  textColor: string;
  bgColor: string;
  iconColor: string;
  spacing: number;
  borderRadius: "sharp" | "medium" | "round";
  theme: "light" | "dark";
  sections: Section[];
  selectedSectionType: string | null;
  selectedSectionId: string | null;
  profile?: ProfilePreview | null;
  onToggleSectionVisibility: (id: string) => void;
  onRemoveSection: (id: string) => void;
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
  selectedSectionType,
  selectedSectionId,
  profile,
  onToggleSectionVisibility,
  onRemoveSection,
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

  const visibleSections = sections.filter((section) => section.visible);

  const isBioVisible = visibleSections.some(
    (section) => section.type === "bio"
  );

  return (
    <div
      className={`animate-in fade-in no-scrollbar flex flex-1 justify-center overflow-y-auto transition-colors duration-200 ${isDark ? "bg-black-100-text" : "bg-transparent"}`}
    >
      {/* Device wrapper */}
      <div className="flex w-full max-w-195 flex-col gap-6">
        {/* Dynamic Card Container with settings applied */}
        <div
          className={`flex w-full flex-col transition-all duration-300 ${selectedFontClass}`}
        >
          {/* 1. Main Bio Card (Standard Profile Header) */}
          {selectedSectionType !== "cta" && isBioVisible && (
            <div
              style={cardStyle}
              className="relative flex flex-col items-center gap-6 border p-6 shadow-sm transition-all duration-300 sm:flex-row sm:items-start sm:p-8"
            >
              {/* Action buttons (View/Delete) */}
              <div className="border-tertiary-b bg-neutral-subtle-bg absolute top-6 right-6 flex items-center gap-3 rounded-full border px-3.5 py-1.5 shadow-none select-none">
                <button
                  className="text-preview-action-icon transition-opacity hover:opacity-80"
                  title="Toggle visibility"
                >
                  <Eye size={18} strokeWidth={2} />
                </button>
                <button
                  className="text-preview-action-delete transition-opacity hover:opacity-80"
                  title="Delete section"
                >
                  <Trash2 size={18} strokeWidth={2} />
                </button>
              </div>
              {/* Avatar image */}
              <div className="border-brand-b/20 bg-brand-light-subtle-bg relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 shadow-inner">
                {getImageUrl(profile?.photoUrl) ? (
                  <Image
                    src={getImageUrl(profile?.photoUrl) || ""}
                    alt={profile?.fullName ?? "Profile avatar"}
                    fill
                    className="object-cover"
                    unoptimized
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
                  className="mt-3 text-base leading-relaxed opacity-90 transition-colors"
                >
                  {profile?.bio ||
                    "I'm a digital creator focusing on the intersection of design, technology, and intentional living. Sharing insights to help you build better products and habits."}
                </p>
              </div>
            </div>
          )}

          {visibleSections.map((section) => {
            if (section.type === "bio") return null; // Already rendered in main card

            if (section.type === "cta") {
              // CHANGED: only show CTA preview when it's the selected section
              if (section.id !== selectedSectionId) return null;
              return (
                <CtaSectionPreview
                  key={section.id}
                  section={section}
                  textColor={textColor}
                  bgColor={bgColor}
                  iconColor={iconColor}
                  borderRadius={activeRadius}
                  isDark={isDark}
                  fontClass={selectedFontClass}
                />
              );
            }

            return (
              <div
                key={section.id}
                style={cardStyle}
                className="relative flex flex-col border p-6 shadow-sm transition-all duration-300"
              >
                {/* Action buttons (View/Delete) */}
                <div className="absolute top-6 right-6 z-10 flex w-24 items-center justify-between gap-3 rounded-[10px] border border-[#EDEDED] bg-white p-3 shadow-none select-none">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleSectionVisibility(section.id);
                    }}
                    className="text-[#3A3A3A] transition-opacity hover:opacity-80"
                    title="Toggle visibility"
                  >
                    {section.visible ? (
                      <Eye size={18} strokeWidth={2} />
                    ) : (
                      <EyeOff size={18} strokeWidth={2} />
                    )}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveSection(section.id);
                    }}
                    className="text-[#9F2B2B] transition-opacity hover:opacity-80"
                    title="Delete section"
                  >
                    <Trash2 size={18} strokeWidth={2} />
                  </button>
                </div>
                {section.type !== "links" ? (
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
                        {section.type === "experience" && (
                          <Briefcase size={18} />
                        )}
                      </span>
                      <h3 className="text-lg font-bold">{section.title}</h3>
                    </div>
                  </div>
                ) : (
                  <h3 className="mb-4 text-3xl font-bold">{section.title}</h3>
                )}

                {/* Section-specific placeholders */}
                {section.type === "projects" && (
                  <div className="grid grid-cols-1 gap-4">
                    {section.projects && section.projects.length > 0 ? (
                      section.projects.map((project) => (
                        <div
                          key={project.id}
                          className="border-tertiary-b flex items-center justify-between rounded-lg border bg-black/5 p-4 dark:border-[#2D2D2D] dark:bg-white/5"
                        >
                          <div>
                            <h4 className="text-sm font-semibold">
                              {project.title}
                            </h4>
                            <p className="text-tertiary-text mt-1 text-xs">
                              {project.description}
                            </p>
                          </div>
                          {project.url && (
                            <a
                              href={project.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:text-brand-hover-bg transition-colors"
                            >
                              <ExternalLink
                                size={16}
                                className="text-disabled-text"
                              />
                            </a>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-tertiary-text py-4 text-center text-xs">
                        No projects added yet.
                      </p>
                    )}
                  </div>
                )}

                {section.type === "links" && (
                  <div className="flex flex-col gap-4">
                    {section.subtitle && (
                      <p className="text-tertiary-text leading-relaxed">
                        {section.subtitle}
                      </p>
                    )}

                    {section.links && section.links.length > 0 && (
                      <div className="grid grid-cols-1 gap-3">
                        {section.links.map((link) => (
                          <div
                            key={link.id}
                            className="border-tertiary-b flex items-center justify-between rounded-xl border bg-white/60 p-4 transition-colors hover:bg-black/5 dark:border-[#2D2D2D] dark:bg-white/5 dark:hover:bg-white/10"
                          >
                            <div className="flex min-w-0 items-center gap-3">
                              {link.imageSrc ? (
                                <Image
                                  src={link.imageSrc}
                                  alt={link.title}
                                  width={40}
                                  height={40}
                                  unoptimized
                                  className="h-10 w-10 shrink-0 rounded-md object-cover"
                                />
                              ) : link.iconSrc ? (
                                <span className="rounded-md border p-2">
                                  <Image
                                    src={link.iconSrc}
                                    alt={link.iconLabel ?? link.title}
                                    width={24}
                                    height={24}
                                    className="shrink-0"
                                  />
                                </span>
                              ) : (
                                <span className="bg-brand-light-subtle-bg text-brand-text flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-sm font-bold">
                                  {link.title.charAt(0).toUpperCase()}
                                </span>
                              )}

                              <div className="min-w-0">
                                <p className="truncate text-sm font-semibold">
                                  {link.title}
                                </p>
                                <p className="truncate text-xs text-gray-500">
                                  {link.url}
                                </p>
                              </div>
                            </div>
                            <span className="cursor-pointer rounded-full border p-2">
                              <ExternalLink size={14} className="shrink-0" />
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {section.type === "experience" && (
                  <div className="flex flex-col gap-4">
                    {section.experience && section.experience.length > 0 ? (
                      section.experience.map((exp) => (
                        <div
                          key={exp.id}
                          className="flex items-start justify-between text-xs"
                        >
                          <div>
                            <p className="text-sm font-bold">{exp.role}</p>
                            <p className="text-tertiary-text">{exp.company}</p>
                          </div>
                          <span className="text-disabled-text">
                            {exp.duration}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-tertiary-text py-4 text-center text-xs">
                        No experience items added yet.
                      </p>
                    )}
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

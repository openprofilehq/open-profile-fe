"use client";

import Image from "next/image";
import { Link2, Folder, Briefcase, ExternalLink } from "lucide-react";
import { getImageUrl } from "@/utils/profile";
import type { ProjectItem } from "@/api/profile/project.type";

interface Section {
  id: string;
  title: string;
  type: string;
  visible: boolean;
}

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
      className={`animate-in fade-in flex flex-1 justify-center overflow-y-auto transition-colors duration-200 ${isDark ? "bg-[#121212]" : "bg-transparent"}`}
    >
      {/* Device wrapper */}
      <div className="flex w-full max-w-[780px] flex-col gap-6">
        {/* Dynamic Card Container with settings applied */}
        <div
          className={`flex w-full flex-col transition-all duration-300 ${selectedFontClass}`}
        >
          {/* 1. Main Bio Card (Standard Profile Header) */}
          {isBioVisible && (
            <div
              style={cardStyle}
              className="relative flex flex-col items-center gap-6 border p-6 shadow-sm transition-all duration-300 sm:flex-row sm:items-start sm:p-8"
            >
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
                  className="mt-3 text-[15px] leading-relaxed opacity-90 transition-colors"
                >
                  {profile?.bio ||
                    "I'm a digital creator focusing on the intersection of design, technology, and intentional living. Sharing insights to help you build better products and habits."}
                </p>
              </div>
            </div>
          )}

          {visibleSections.map((section) => {
            if (section.type === "bio") return null; // Already rendered in main card

            return (
              <div
                key={section.id}
                style={cardStyle}
                className="relative flex flex-col border p-6 shadow-sm transition-all duration-300"
              >
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
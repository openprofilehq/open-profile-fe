"use client";

import Image from "next/image";
import { Link2, Folder, Briefcase, ExternalLink } from "lucide-react";
import { getImageUrl } from "@/utils/profile";

interface Section {
  id: string;
  title: string;
  type: string;
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
  // Map fonts to real family names or styles
  const fontStyles: Record<string, string> = {
    Afacad: "font-afacad",
    Inter: "font-sans",
    Serif: "font-serif",
    Mono: "font-mono",
  };

  const selectedFontClass = fontStyles[font] || "font-afacad";

  // Map border radii to pixels
  const radiusMap = {
    sharp: "0px",
    medium: "16px",
    round: "32px",
  };
  const activeRadius = radiusMap[borderRadius] || "16px";

  // Light/Dark Theme backgrounds
  const isDark = theme === "dark";
  const canvasBg = isDark ? "bg-[#121212]" : "bg-[#FAFAFA]";

  // Custom Styles
  const cardStyle = {
    backgroundColor: bgColor || (isDark ? "#1E1E1E" : "#FFFFFF"),
    borderRadius: activeRadius,
    color: textColor || (isDark ? "#FAFAFA" : "#050505"),
    borderColor: isDark ? "#2D2D2D" : "#EDEDED",
    marginBottom: `${spacing}px`,
  };

  const textStyle = {
    color: textColor || (isDark ? "#E0E0E0" : "#454545"),
  };

  const iconStyle = {
    color: iconColor || "#087583",
    backgroundColor: isDark
      ? "rgba(8, 117, 131, 0.15)"
      : "rgba(8, 117, 131, 0.08)",
  };

  return (
    <div
      className={`flex flex-1 items-start justify-center overflow-y-auto p-8 transition-colors duration-300 ${canvasBg}`}
    >
      {/* Device wrapper */}
      <div className="flex w-full max-w-[640px] flex-col gap-6">
        {/* Helper info bar */}
        <div className="mb-2 flex items-center justify-between text-xs font-semibold tracking-wider text-[#747474] uppercase">
          <span>Live Preview</span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
            Connected
          </span>
        </div>

        {/* Dynamic Card Container with settings applied */}
        <div
          className={`flex w-full flex-col transition-all duration-300 ${selectedFontClass}`}
        >
          {/* 1. Main Bio Card (Standard Profile Header) */}
          <div
            style={cardStyle}
            className="flex flex-col items-center gap-6 border p-6 shadow-sm transition-all duration-300 sm:flex-row sm:items-start sm:p-8"
          >
            {/* Avatar image */}
            <div className="relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-[#087583]/20 bg-[#E5F4F6] shadow-inner">
              {getImageUrl(profile?.photoUrl) ? (
                <Image
                  src={getImageUrl(profile?.photoUrl) || ""}
                  alt={profile?.fullName ?? "Profile avatar"}
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <div className="text-3xl font-bold text-[#087583]">
                  {(profile?.fullName || "M").charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-2xl font-bold tracking-tight">
                {profile?.fullName || "Micaela, Robinsonss"}
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
            if (section.type === "bio") return null; // Already rendered in main card

            return (
              <div
                key={section.id}
                style={cardStyle}
                className="flex flex-col border p-6 shadow-sm transition-all duration-300"
              >
                <div
                  className="mb-4 flex items-center justify-between border-b pb-4"
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
                    <h3 className="text-lg font-bold">{section.title}</h3>
                  </div>

                  <span className="text-xs font-semibold tracking-wider text-[#A2A2A2] uppercase">
                    {section.type}
                  </span>
                </div>

                {/* Section-specific placeholders */}
                {section.type === "projects" && (
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex items-center justify-between rounded-lg border border-[#EDEDED] bg-black/5 p-4 dark:border-[#2D2D2D] dark:bg-white/5">
                      <div>
                        <h4 className="text-sm font-semibold">
                          OpenProfile Platform
                        </h4>
                        <p className="mt-1 text-xs text-[#747474]">
                          Open-source links-in-bio platform for modern creators.
                        </p>
                      </div>
                      <ExternalLink size={16} className="text-[#A2A2A2]" />
                    </div>
                  </div>
                )}

                {section.type === "links" && (
                  <div className="flex flex-wrap gap-2">
                    {["Twitter", "GitHub", "YouTube", "LinkedIn"].map(
                      (platform) => (
                        <span
                          key={platform}
                          className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-[#EDEDED] px-3.5 py-1.5 text-xs font-semibold hover:bg-black/5 dark:border-[#2D2D2D] dark:hover:bg-white/5"
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
                        <p className="text-[#747474]">Stark Industries</p>
                      </div>
                      <span className="text-[#A2A2A2]">2024 - Present</span>
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

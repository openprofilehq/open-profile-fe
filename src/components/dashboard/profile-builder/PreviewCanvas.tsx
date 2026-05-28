"use client";

import Image from "next/image";
import { Folder, ExternalLink, Eye, EyeOff, Trash2, MessageSquare } from "lucide-react";
import { getImageUrl, sanitizeUrl } from "@/utils/profile";
import type { Section, ProfilePreview } from "./types";
import { THEME_DEFAULTS } from "@/constants/theme";

interface PreviewCanvasProps {
  font: string;
  textColor: string;
  bgColor: string;
  iconColor: string;
  spacing: number;
  borderRadius: "sharp" | "medium" | "round";
  theme: "light" | "dark";
  template?: string;
  sections: Section[];
  profile?: ProfilePreview | null;
  selectedSectionId?: string | null;
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
  template,
  sections,
  profile,
  selectedSectionId,
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
      bgColor === THEME_DEFAULTS.BG_COLOR && isDark
        ? THEME_DEFAULTS.DARK_MODE.BG_COLOR
        : bgColor || (isDark ? THEME_DEFAULTS.DARK_MODE.BG_COLOR : THEME_DEFAULTS.BG_COLOR),
    borderRadius: activeRadius,
    color:
      textColor === THEME_DEFAULTS.TEXT_COLOR && isDark
        ? THEME_DEFAULTS.DARK_MODE.TEXT_COLOR
        : textColor || (isDark ? THEME_DEFAULTS.DARK_MODE.TEXT_COLOR : THEME_DEFAULTS.TEXT_COLOR),
    borderColor: isDark ? THEME_DEFAULTS.DARK_MODE.BORDER_COLOR : THEME_DEFAULTS.LIGHT_MODE.BORDER_COLOR,
    marginBottom: `${spacing}px`,
  };

  const textStyle = {
    color:
      textColor === THEME_DEFAULTS.TEXT_COLOR && isDark
        ? THEME_DEFAULTS.DARK_MODE.MUTED_TEXT
        : textColor || (isDark ? THEME_DEFAULTS.DARK_MODE.MUTED_TEXT : THEME_DEFAULTS.LIGHT_MODE.MUTED_TEXT),
  };

  const getRgbaColor = (hex: string, alpha: number) => {
    if (!hex) return `rgba(10, 146, 164, ${alpha})`;
    const cleanHex = hex.replace("#", "");
    if (cleanHex.length === 3) {
      const r = parseInt(cleanHex[0] + cleanHex[0], 16);
      const g = parseInt(cleanHex[1] + cleanHex[1], 16);
      const b = parseInt(cleanHex[2] + cleanHex[2], 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
    const num = parseInt(cleanHex, 16);
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const iconStyle = {
    color: iconColor || THEME_DEFAULTS.ACCENT_COLORS.DEFAULT,
    backgroundColor: getRgbaColor(iconColor || THEME_DEFAULTS.ACCENT_COLORS.DEFAULT, isDark ? 0.15 : 0.08),
  };

  const visibleSections = sections.filter((section) => section.visible);

  const bioSection = sections.find((s) => s.type === "bio");
  const bioSectionId = bioSection?.id ?? "bio";

  return (
    <div
      className={`animate-in fade-in flex h-full min-h-0 flex-1 justify-center overflow-y-auto px-4 lg:px-12 transition-colors duration-200 ${isDark ? "bg-inverse-bg" : "bg-transparent"}`}
    >
      {/* Device wrapper */}
      <div className="flex w-full max-w-3xl flex-col gap-6 pb-32">
        {/* Dynamic Card Container with settings applied */}
        <div
          className={`flex w-full flex-col transition-all duration-300 ${selectedFontClass}`}
        >
          {visibleSections.map((section) => {
            const isPortfolio = template === "portfolio";
            const isCreator = template === "creator";
            if (section.type === "bio") {
              if (
                selectedSectionId &&
                selectedSectionId !== bioSectionId &&
                section.id !== selectedSectionId
              )
                return null;
              return (
                <div
                  key={section.id}
                  style={cardStyle}
                  className={`relative flex flex-col items-center border transition-all duration-300 sm:flex-row sm:items-start ${isPortfolio ? "gap-8 p-8 sm:p-12 md:flex-row md:items-start" : isCreator ? "gap-5 p-6 md:flex-row" : "gap-6 p-6 sm:p-8"}`}
                >
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
                  <div className="flex-1 text-center sm:text-left">
                    <h2 className={`font-bold tracking-tight ${isPortfolio ? "mb-4 text-[28px] sm:text-[32px] font-extrabold" : "text-2xl"}`}>
                      {profile?.fullName || "Micaela Robinsonss"}
                    </h2>
                    <p
                      style={textStyle}
                      className={`leading-relaxed opacity-90 transition-colors ${isPortfolio ? "mb-6 text-[16px] sm:text-[17px]" : "mt-3 text-[15px]"}`}
                    >
                      {profile?.bio ||
                        "I'm a digital creator focusing on the intersection of design, technology, and intentional living. Sharing insights to help you build better products and habits."}
                    </p>
                    {isPortfolio && (
                      <button style={{ backgroundColor: iconColor || THEME_DEFAULTS.ACCENT_COLORS.DEFAULT }} className="rounded-[8px] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:opacity-90 active:scale-95">
                        Message
                      </button>
                    )}
                  </div>
                </div>
              );
            }

            if (
              selectedSectionId &&
              selectedSectionId !== bioSectionId &&
              section.id !== selectedSectionId
            )
              return null;

            const isSectionHighlighted =
              section.type === "projects" && section.highlightSection;
            const currentCardStyle = isSectionHighlighted
              ? {
                  ...cardStyle,
                  borderColor: iconColor || THEME_DEFAULTS.ACCENT_COLORS.DEFAULT,
                  boxShadow: `0 0 16px ${iconColor || THEME_DEFAULTS.ACCENT_COLORS.DEFAULT}25`,
                  borderWidth: "2px",
                }
              : cardStyle;

            return (
              <div
                key={section.id}
                style={currentCardStyle}
                className="relative flex flex-col border p-6 transition-all duration-300"
              >
                {/* Action buttons (View/Delete) */}
                <div className={`absolute z-10 flex w-24 items-center justify-between gap-3 rounded-[10px] border border-border bg-background p-3 shadow-none select-none ${isPortfolio ? "top-8 right-8" : "top-6 right-6"}`}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleSectionVisibility(section.id);
                    }}
                    className="text-secondary-text transition-opacity hover:opacity-80"
                    title="Toggle visibility"
                    aria-label="Toggle section visibility"
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
                    className="text-negative-text transition-opacity hover:opacity-80"
                    title="Delete section"
                    aria-label="Delete section"
                  >
                    <Trash2 size={18} strokeWidth={2} />
                  </button>
                </div>
                {section.type === "experience" ? null : section.type ===
                  "links" ? (
                  <h3 className="mb-4 text-3xl font-bold">{section.title}</h3>
                ) : (
                  <div
                    className="mb-4 flex items-center justify-between border-b pr-24 pb-4"
                    style={{ borderColor: isDark ? THEME_DEFAULTS.DARK_MODE.BORDER_COLOR : THEME_DEFAULTS.LIGHT_MODE.BORDER_LIGHT }}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        style={iconStyle}
                        className="flex h-10 w-10 items-center justify-center rounded-lg transition-all duration-300"
                      >
                        {section.type === "projects" && <Folder size={18} />}
                      </span>
                      <h3 className="text-lg font-bold">{section.title}</h3>
                    </div>
                  </div>
                )}

                {/* Section-specific placeholders */}
                {section.type === "projects" && (
                  <div>
                    {section.subtitle && (
                      <p className="text-tertiary-text mb-6 text-sm leading-relaxed">
                        {section.subtitle}
                      </p>
                    )}
                    

                    {section.projects && section.projects.length > 0 ? (
                      <div
                        className={
                          isPortfolio ? "grid w-full grid-cols-1 gap-8 xl:grid-cols-2" :
                          (section.layout === "1" && !isCreator)
                            ? "grid grid-cols-1 gap-4 sm:grid-cols-2"
                            : "flex flex-col gap-4"
                        }
                      >
                        {section.projects.map((project) => {
                          const isHighlighted = project.highlighted;
                          let forcedLayout = section.layout || "1";
                          if (isPortfolio) forcedLayout = "1";
                          if (isCreator) forcedLayout = "4";
                          const projectCardStyle = {
                            borderColor: isHighlighted
                              ? iconColor || THEME_DEFAULTS.ACCENT_COLORS.DEFAULT
                              : isDark
                                ? THEME_DEFAULTS.DARK_MODE.BORDER_COLOR
                                : THEME_DEFAULTS.LIGHT_MODE.BORDER_COLOR,
                            boxShadow: isHighlighted
                              ? `0 4px 12px ${iconColor || THEME_DEFAULTS.ACCENT_COLORS.DEFAULT}20`
                              : undefined,
                            borderWidth: isHighlighted ? "2px" : "1px",
                            backgroundColor: "transparent",
                          };

                          // Render Layout 1: Grid Card
                          if (forcedLayout === "1") {
                            return (
                              <div
                                key={project.id}
                                style={projectCardStyle}
                                className="flex flex-col overflow-hidden rounded-xl border transition-all"
                              >
                                {getImageUrl(project.imageSrc) && (
                                  <div className={`relative w-full shrink-0 ${isDark ? 'bg-zinc-800' : 'bg-secondary-bg'} ${isPortfolio ? "aspect-4/3" : "aspect-video"}`}>
                                    <Image
                                      src={getImageUrl(project.imageSrc)}
                                      alt={project.title}
                                      fill
                                      className="object-cover"
                                      unoptimized
                                    />
                                  </div>
                                )}
                                <div className="flex flex-1 flex-col p-4">
                                  <h4 className="truncate text-sm font-bold">
                                    {project.title}
                                  </h4>
                                  <p className="text-tertiary-text mt-1 line-clamp-2 flex-1 text-xs">
                                    {project.description}
                                  </p>
                                  {project.url && (
                                    <a
                                      href={sanitizeUrl(project.url)}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      style={{
                                        backgroundColor: iconColor || THEME_DEFAULTS.ACCENT_COLORS.DEFAULT,
                                      }}
                                      className="mt-4 flex h-9 w-full items-center justify-center rounded-lg px-4 text-center text-xs font-bold text-white transition-opacity hover:opacity-90"
                                    >
                                      {project.buttonText || "View project"}
                                    </a>
                                  )}
                                </div>
                              </div>
                            );
                          }

                          // Render Layout 2: Full List Card (Image on top, full width)
                          if (forcedLayout === "2") {
                            return (
                              <div
                                key={project.id}
                                style={projectCardStyle}
                                className="flex flex-col overflow-hidden rounded-xl border transition-all"
                              >
                                {getImageUrl(project.imageSrc) && (
                                  <div className={`relative h-44 w-full shrink-0 ${isDark ? 'bg-zinc-800' : 'bg-secondary-bg'}`}>
                                    <Image
                                      src={getImageUrl(project.imageSrc)}
                                      alt={project.title}
                                      fill
                                      className="object-cover"
                                      unoptimized
                                    />
                                  </div>
                                )}
                                <div className="flex flex-col p-5">
                                  <h4 className="text-base font-bold">
                                    {project.title}
                                  </h4>
                                  <p className="text-tertiary-text mt-2 text-xs leading-relaxed">
                                    {project.description}
                                  </p>
                                  {project.url && (
                                    <div className="mt-4 flex justify-start">
                                      <a
                                        href={sanitizeUrl(project.url)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{
                                          backgroundColor:
                                            iconColor || THEME_DEFAULTS.ACCENT_COLORS.DEFAULT,
                                        }}
                                        className="flex h-9 items-center justify-center rounded-lg px-5 text-center text-xs font-bold text-white transition-opacity hover:opacity-90"
                                      >
                                        {project.buttonText || "View project"}
                                      </a>
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          }

                          // Render Layout 3: Image Left
                          if (forcedLayout === "3") {
                            return (
                              <div
                                key={project.id}
                                style={projectCardStyle}
                                className="flex items-center gap-4 rounded-xl border p-4 transition-all"
                              >
                                {getImageUrl(project.imageSrc) && (
                                  <div className={`relative h-18 w-18 shrink-0 overflow-hidden rounded-lg ${isDark ? 'bg-zinc-800' : 'bg-secondary-bg'}`}>
                                    <Image
                                      src={getImageUrl(project.imageSrc)}
                                      alt={project.title}
                                      fill
                                      className="object-cover"
                                      unoptimized
                                    />
                                  </div>
                                )}
                                <div className="min-w-0 flex-1">
                                  <h4 className="truncate text-sm font-bold">
                                    {project.title}
                                  </h4>
                                  <p className="text-tertiary-text mt-1 line-clamp-2 text-xs">
                                    {project.description}
                                  </p>
                                  {project.url && (
                                    <a
                                      href={sanitizeUrl(project.url)}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      style={{ color: iconColor || THEME_DEFAULTS.ACCENT_COLORS.DEFAULT }}
                                      className="mt-2 inline-flex items-center gap-1 text-xs font-bold hover:underline"
                                    >
                                      <span>
                                        {project.buttonText || "View project"}
                                      </span>
                                      <ExternalLink size={12} />
                                    </a>
                                  )}
                                </div>
                              </div>
                            );
                          }

                          // Render Layout 4: Image Right
                          if (forcedLayout === "4") {
                            return (
                              <div
                                key={project.id}
                                style={projectCardStyle}
                                className="flex items-center gap-4 rounded-xl border p-4 transition-all"
                              >
                                <div className="min-w-0 flex-1">
                                  <h4 className="truncate text-sm font-bold">
                                    {project.title}
                                  </h4>
                                  <p className="text-tertiary-text mt-1 line-clamp-2 text-xs">
                                    {project.description}
                                  </p>
                                  {project.url && (
                                    <a
                                      href={sanitizeUrl(project.url)}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      style={{ color: iconColor || THEME_DEFAULTS.ACCENT_COLORS.DEFAULT }}
                                      className="mt-2 inline-flex items-center gap-1 text-xs font-bold hover:underline"
                                    >
                                      <span>
                                        {project.buttonText || "View project"}
                                      </span>
                                      <ExternalLink size={12} />
                                    </a>
                                  )}
                                </div>
                                {getImageUrl(project.imageSrc) && (
                                  <div className={`relative h-18 w-18 shrink-0 overflow-hidden rounded-lg ${isDark ? 'bg-zinc-800' : 'bg-secondary-bg'}`}>
                                    <Image
                                      src={getImageUrl(project.imageSrc)}
                                      alt={project.title}
                                      fill
                                      className="object-cover"
                                      unoptimized
                                    />
                                  </div>
                                )}
                              </div>
                            );
                          }

                          return null;
                        })}
                      </div>
                    ) : (
                      <p className="text-tertiary-text py-4 text-center text-xs">
                        No projects added yet.
                      </p>
                    )}
                  </div>
                )}

                {section.type === "links" && (
                  <div className={`flex flex-col gap-4 ${isPortfolio ? "opacity-50 grayscale" : ""}`}>
                    {isPortfolio && <div className="text-xs font-bold text-red-500 mb-2 border border-red-500/20 bg-red-500/10 p-2 rounded-md">Links are hidden in Portfolio template (visible here for editing only)</div>}
                    {section.subtitle && (
                      <p className="text-tertiary-text leading-relaxed">
                        {section.subtitle}
                      </p>
                    )}

                    {section.links && section.links.length > 0 ? (
                      <div className="grid grid-cols-1 gap-3">
                        {section.links.map((link) => (
                          <div
                            key={link.id}
                            className={`border-tertiary-b flex items-center justify-between rounded-xl border p-4 transition-colors ${isDark ? 'border-secondary-b bg-background/5 hover:bg-background/10' : 'bg-background/60 hover:bg-black/5'}`}
                          >
                            <div className="flex min-w-0 items-center gap-3">
                              {getImageUrl(link.imageSrc) ? (
                                <Image
                                  src={getImageUrl(link.imageSrc)}
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
                                    unoptimized
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
                                <p className="truncate text-xs text-secondary-text">
                                  {link.url}
                                </p>
                              </div>
                            </div>
                            <span className="rounded-full border p-2">
                              <ExternalLink size={14} className="shrink-0" />
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-tertiary-text py-4 text-center text-xs">
                        No links added yet.
                      </p>
                    )}
                  </div>
                )}

                {section.type === "experience" && (
                  <div
                    className={`flex py-4 ${
                      isPortfolio ? "flex-col items-center text-center" :
                      isCreator ? "flex-col gap-6 lg:flex-row lg:items-center lg:justify-between text-left" :
                      section.layout === "2" ? "flex-col items-start text-left" :
                      section.layout === "3" ? "flex-col items-end text-right" : "flex-col items-center text-center"
                    }`}
                  >
                    {/* Icon card wrapper */}
                    {(section.iconSrc || isPortfolio) && (
                      <div
                        style={{
                          borderColor: isDark ? THEME_DEFAULTS.DARK_MODE.BORDER_COLOR : THEME_DEFAULTS.LIGHT_MODE.BORDER_COLOR,
                        }}
                        className="mb-5 flex h-16 w-16 shrink-0 items-center justify-center rounded-[16px] border bg-background shadow-[0_2px_8px_rgba(0,0,0,0.03)] transition-all duration-300"
                      >
                        <div className="relative h-7 w-7">
                          {isPortfolio ? (
                            <MessageSquare className="h-full w-full opacity-80" />
                          ) : (
                            <Image
                              src={section.iconSrc!}
                              alt={section.iconLabel || "CTA Icon"}
                              fill
                              className={`object-contain filter ${isDark ? 'invert' : ''}`}
                              unoptimized
                            />
                          )}
                        </div>
                      </div>
                    )}

                    {/* Text Container (Title + Subtitle) */}
                    <div className={isCreator ? "flex flex-col" : "flex flex-col items-center"}>
                      <h4 className={`text-[32px] leading-snug font-bold tracking-tight ${isDark ? 'text-white' : 'text-primary-text'}`}>
                        {section.title || "Let's build something"}
                      </h4>

                      {/* Subtitle */}
                      {section.subtitle && (
                        <p
                          style={textStyle}
                          className="text-tertiary-text mt-3 max-w-lg text-[15px] leading-relaxed font-medium"
                        >
                          {section.subtitle}
                        </p>
                      )}
                    </div>

                    {/* Action Button */}
                    {section.buttonText && (
                      <a
                        href={sanitizeUrl(section.url)}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          backgroundColor: iconColor || THEME_DEFAULTS.ACCENT_COLORS.DEFAULT,
                          borderRadius: activeRadius || "8px",
                        }}
                        className="mt-6 inline-flex h-11 items-center justify-center px-[32px] text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90 active:scale-95"
                      >
                        {section.buttonText}
                      </a>
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

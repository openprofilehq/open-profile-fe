import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  type ProfileContentDetails,
  type ProfileResponse,
  type LinkItem,
  type ProjectItem,
  type ProfileAppearanceSettings,
} from "@/api/profile/profile.type";
import { env as serverEnv } from "@/env/server";
import { Folder, ExternalLink } from "lucide-react";
import { THEME_DEFAULTS } from "@/constants/theme";
import CreatorDashboardView from "@/components/dashboard/templates/CreatorDashboardView";
import ProfessionalDashboardView from "@/components/dashboard/templates/ProfessionalDashboardView";
import PortfolioDashboardView from "@/components/dashboard/templates/PortfolioDashboardView";
import TemplateAppearanceProvider from "@/components/dashboard/templates/TemplateAppearanceProvider";

type Props = {
  params: Promise<{ username: string }>;
};

type LegacyContent = ProfileContentDetails & {
  themeSettings?: unknown;
};

function getImageUrl(src?: string | null) {
  if (!src) return null;
  if (src.startsWith("http")) return src;
  return new URL(src, serverEnv.API_BASE_URL).toString();
}

function getRgbaColor(hex: string, alpha: number) {
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
}

export default async function UserProfilePage({ params }: Props) {
  const { username } = await params;

  const res = await fetch(
    `${serverEnv.API_BASE_URL}/api/v1/profiles/${encodeURIComponent(username)}`,
    { cache: "no-store" }
  );

  if (!res.ok) notFound();

  const json = await res.json();
  const profile: ProfileResponse = json.data ?? json;

  const name = profile.fullName ?? username;
  const initials = name
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const photoSrc = profile.photoUrl
    ? profile.photoUrl.startsWith("http")
      ? profile.photoUrl
      : new URL(profile.photoUrl, serverEnv.API_BASE_URL).toString()
    : "";

  const content = profile.content;
  let sectionOrder = content?.sectionOrder?.length
    ? content.sectionOrder
    : ["bio"];

  if (!content?.sectionOrder?.length) {
    if (content?.links) sectionOrder.push("links");
    if (content?.projects) sectionOrder.push("projects");
    if (content?.cta) sectionOrder.push("cta");
    sectionOrder = [...new Set(sectionOrder)];
  }

  type PublicProfileAppearance = {
    template?: string;
    accentColour?: string;
    iconColor?: string;
    textColor?: string;
    bgColor?: string;
    font?: string;
    cornerStyle?: string;
    borderRadius?: "sharp" | "medium" | "round";
    spacing?: number;
    theme?: "light" | "dark";
  };

  const mapCornerStyleToRadius = (
    cornerStyle?: unknown
  ): "sharp" | "medium" | "round" | undefined => {
    if (cornerStyle === "sharp") return "sharp";
    if (cornerStyle === "rounded") return "medium";
    if (cornerStyle === "pill") return "round";
    return undefined;
  };

  const rawAppearance = (profile.appearance ||
    profile.themeSettings ||
    (content as LegacyContent | null)?.themeSettings ||
    {}) as PublicProfileAppearance;

  const themeSettings: PublicProfileAppearance = {
    ...rawAppearance,
    iconColor: rawAppearance.iconColor ?? rawAppearance.accentColour,
    borderRadius:
      rawAppearance.borderRadius ??
      mapCornerStyleToRadius(rawAppearance.cornerStyle),
  };

  const rawTemplate =
    rawAppearance.template || profile.templateType || "default";

  const activeTemplateMap: Record<string, string> = {
    portfolio: "portfolio",
    professional: "professional",
    creator: "creator",
    default: "default",
  };

  const activeTemplate =
    typeof rawTemplate === "string"
      ? activeTemplateMap[rawTemplate.toLowerCase()] || "default"
      : "default";

  if (activeTemplate !== "default") {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dashboardProfile: any = {
      ...profile,
      isPublished: true,
      hasUnpublishedChanges: false,
      ctaLabel: null,
      ctaUrl: null,
      components: [],
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const profileContent: any = {
      profileId: profile.id || "",
      bio: profile.bio,
      photoUrl: profile.photoUrl,
      content: profile.content,
      source: "published",
      updatedAt: new Date().toISOString(),
    };

    if (activeTemplate === "creator") {
      return (
        <TemplateAppearanceProvider appearance={themeSettings}>
          <CreatorDashboardView
            profile={dashboardProfile}
            content={profileContent}
            appearance={themeSettings as unknown as ProfileAppearanceSettings}
          />
        </TemplateAppearanceProvider>
      );
    }

    if (activeTemplate === "professional") {
      return (
        <TemplateAppearanceProvider appearance={themeSettings}>
          <ProfessionalDashboardView
            profile={dashboardProfile}
            content={profileContent}
            appearance={themeSettings as unknown as ProfileAppearanceSettings}
          />
        </TemplateAppearanceProvider>
      );
    }

    if (activeTemplate === "portfolio") {
      return (
        <TemplateAppearanceProvider appearance={themeSettings}>
          <PortfolioDashboardView
            profile={dashboardProfile}
            content={profileContent}
            appearance={themeSettings as unknown as ProfileAppearanceSettings}
          />
        </TemplateAppearanceProvider>
      );
    }
  }

  const globalFont = (themeSettings.font || "afacad").toString();
  const globalFontNormalized = globalFont.toLowerCase();

  const fontStyles: Record<string, string> = {
    afacad: "font-afacad",
    inter: "font-sans",
    serif: "font-serif",
    mono: "font-mono",
    geologica: "font-sans",
    manrope: "font-sans",

    Afacad: "font-afacad",
    Inter: "font-sans",
    Serif: "font-serif",
    Mono: "font-mono",
    Geologica: "font-sans",
    Manrope: "font-sans",
  };

  const selectedFontClass =
    fontStyles[globalFontNormalized] || fontStyles[globalFont] || "font-afacad";

  const globalBgColor = themeSettings.bgColor || THEME_DEFAULTS.BG_COLOR;

  const globalTextColor = themeSettings.textColor || THEME_DEFAULTS.TEXT_COLOR;

  const globalIconColor =
    themeSettings.iconColor || THEME_DEFAULTS.ACCENT_COLORS.DEFAULT;
  const globalSpacing =
    typeof themeSettings.spacing === "number" ? themeSettings.spacing : 20;

  const radiusMap = {
    sharp: "0px",
    medium: "16px",
    round: "32px",
  };
  const activeRadius =
    radiusMap[themeSettings.borderRadius as keyof typeof radiusMap] || "16px";

  const defaultCardStyle = {
    backgroundColor: globalBgColor,
    borderRadius: activeRadius,
    color: globalTextColor,
    borderColor: THEME_DEFAULTS.LIGHT_MODE.BORDER_COLOR,
    marginBottom: `${globalSpacing}px`,
  };

  const textStyle = {
    color:
      globalTextColor === THEME_DEFAULTS.TEXT_COLOR
        ? THEME_DEFAULTS.LIGHT_MODE.MUTED_TEXT
        : globalTextColor || THEME_DEFAULTS.TEXT_COLOR,
  };

  return (
    <TemplateAppearanceProvider appearance={themeSettings}>
      <div className="bg-primary-bg flex min-h-screen flex-col transition-colors duration-200">
        <div className="flex justify-center pt-6">
          <Link href="/">
            <Image
              src="/auth/logo.png"
              alt="Open.Profile"
              width={140}
              height={32}
              priority
            />
          </Link>
        </div>

        <div
          className={`mx-auto flex w-full max-w-195 flex-col px-4 py-10 transition-all duration-300 ${selectedFontClass}`}
        >
          {sectionOrder.map((sectionId) => {
            if (sectionId === "bio") {
              const isBioVisible = content?.bio?.visible ?? true;
              if (!isBioVisible) return null;

              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const secProps = (content?.bio || {}) as any;
              const secBgColor = secProps.bgColor || globalBgColor;
              const secTextColor = secProps.textColor || globalTextColor;

              const cardStyle = {
                ...defaultCardStyle,
                backgroundColor: secBgColor,
                color: secTextColor,
                paddingTop: `${secProps.paddingTop ?? 32}px`,
                paddingBottom: `${secProps.paddingBottom ?? 32}px`,
              };

              return (
                <div
                  key="bio"
                  style={cardStyle}
                  className="relative flex flex-col items-center gap-6 border shadow-sm transition-all duration-300 sm:flex-row sm:items-start sm:px-8"
                >
                  <div className="border-brand-b/20 bg-brand-light-subtle-bg relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 shadow-inner">
                    {photoSrc ? (
                      <Image
                        src={photoSrc}
                        alt={name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="text-brand-text text-3xl font-bold">
                        {initials}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <h2 className="text-2xl font-bold tracking-tight">
                      {name}
                    </h2>
                    {(content?.bio?.content || profile.bio) && (
                      <p
                        style={{
                          color:
                            secTextColor === THEME_DEFAULTS.TEXT_COLOR
                              ? THEME_DEFAULTS.LIGHT_MODE.MUTED_TEXT
                              : secTextColor || textStyle.color,
                        }}
                        className="mt-3 text-[15px] leading-relaxed whitespace-pre-wrap opacity-90 transition-colors"
                      >
                        {content?.bio?.content || profile.bio}
                      </p>
                    )}
                  </div>
                </div>
              );
            }

            if (sectionId === "links" && content?.links) {
              if (!content.links.visible) return null;
              const links = (content.links.items || []) as LinkItem[];
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const secProps = content.links as any;
              const secBgColor = secProps.bgColor || globalBgColor;
              const secTextColor = secProps.textColor || globalTextColor;
              const cardStyle = {
                ...defaultCardStyle,
                backgroundColor: secBgColor,
                color: secTextColor,
                paddingTop: `${secProps.paddingTop ?? 24}px`,
                paddingBottom: `${secProps.paddingBottom ?? 24}px`,
              };

              return (
                <div
                  key="links"
                  style={cardStyle}
                  className="relative flex flex-col border px-6 shadow-sm transition-all duration-300"
                >
                  <h3 className="mb-4 text-3xl font-bold">
                    {content.links.sectionTitle || "Links"}
                  </h3>
                  <div className="flex flex-col gap-4">
                    {links.length > 0 ? (
                      <div className="grid grid-cols-1 gap-3">
                        {links.map((link: LinkItem) => (
                          <a
                            key={link.id}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              borderColor:
                                THEME_DEFAULTS.LIGHT_MODE.BORDER_COLOR,
                              backgroundColor: "rgba(255,255,255,0.6)",
                            }}
                            className="flex items-center justify-between rounded-xl border p-4 transition-colors hover:bg-black/5 dark:hover:bg-white/10"
                          >
                            <div className="flex min-w-0 items-center gap-3">
                              {link.imageSrc ? (
                                <Image
                                  src={getImageUrl(link.imageSrc)!}
                                  alt={link.title || ""}
                                  width={40}
                                  height={40}
                                  unoptimized
                                  className="h-10 w-10 shrink-0 rounded-md object-cover"
                                />
                              ) : link.iconSrc ? (
                                <span
                                  className="rounded-md border p-2"
                                  style={{
                                    borderColor:
                                      THEME_DEFAULTS.LIGHT_MODE.BORDER_COLOR,
                                  }}
                                >
                                  <Image
                                    src={link.iconSrc}
                                    alt={link.iconLabel || link.title || ""}
                                    width={24}
                                    height={24}
                                    unoptimized
                                    className="shrink-0"
                                  />
                                </span>
                              ) : (
                                <span className="bg-brand-light-subtle-bg text-brand-text flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-sm font-bold">
                                  {(link.title || "L").charAt(0).toUpperCase()}
                                </span>
                              )}
                              <div className="min-w-0">
                                <p className="truncate text-sm font-semibold">
                                  {link.title}
                                </p>
                                {link.url && (
                                  <p className="truncate text-xs opacity-60">
                                    {link.url}
                                  </p>
                                )}
                              </div>
                            </div>
                            <span
                              className="rounded-full border p-2 opacity-70"
                              style={{
                                borderColor:
                                  THEME_DEFAULTS.LIGHT_MODE.BORDER_COLOR,
                              }}
                            >
                              <ExternalLink size={14} className="shrink-0" />
                            </span>
                          </a>
                        ))}
                      </div>
                    ) : (
                      <p className="py-4 text-center text-xs opacity-60">
                        No links added yet.
                      </p>
                    )}
                  </div>
                </div>
              );
            }

            if (sectionId === "projects" && content?.projects) {
              if (!content.projects.visible) return null;
              const projects = (content.projects.items || []) as ProjectItem[];
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const secProps = content.projects as any;
              const secBgColor = secProps.bgColor || globalBgColor;
              const secTextColor = secProps.textColor || globalTextColor;
              const secIconColor = secProps.iconColor || globalIconColor;
              const cardStyle = {
                ...defaultCardStyle,
                backgroundColor: secBgColor,
                color: secTextColor,
                paddingTop: `${secProps.paddingTop ?? 24}px`,
                paddingBottom: `${secProps.paddingBottom ?? 24}px`,
              };

              const iconStyle = {
                color: secIconColor,
                backgroundColor: getRgbaColor(secIconColor, 0.08),
              };

              return (
                <div
                  key="projects"
                  style={cardStyle}
                  className="relative flex flex-col border px-6 shadow-sm transition-all duration-300"
                >
                  <div
                    className="mb-4 flex items-center justify-between border-b pb-4"
                    style={{
                      borderColor: THEME_DEFAULTS.LIGHT_MODE.BORDER_LIGHT,
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        style={iconStyle}
                        className="flex h-10 w-10 items-center justify-center rounded-lg transition-all duration-300"
                      >
                        <Folder size={18} />
                      </span>
                      <h3 className="text-lg font-bold">
                        {content.projects.sectionTitle || "Projects"}
                      </h3>
                    </div>
                  </div>
                  <div>
                    {projects.length > 0 ? (
                      <div
                        className={
                          secProps.layout === "1" || !secProps.layout
                            ? "grid grid-cols-1 gap-4 sm:grid-cols-2"
                            : "flex flex-col gap-4"
                        }
                      >
                        {projects.map((project: ProjectItem) => {
                          const isHighlighted = project.highlighted;
                          const projectCardStyle = {
                            borderColor: isHighlighted
                              ? secIconColor
                              : THEME_DEFAULTS.LIGHT_MODE.BORDER_COLOR,
                            boxShadow: isHighlighted
                              ? `0 4px 12px ${secIconColor}20`
                              : undefined,
                            borderWidth: isHighlighted ? "2px" : "1px",
                            backgroundColor: "transparent",
                          };

                          if (!secProps.layout || secProps.layout === "1") {
                            return (
                              <div
                                key={project.id}
                                style={projectCardStyle}
                                className="flex flex-col overflow-hidden rounded-xl border transition-all"
                              >
                                {project.imageSrc && (
                                  <div className="relative aspect-video w-full shrink-0 bg-gray-100 dark:bg-zinc-800">
                                    <Image
                                      src={getImageUrl(project.imageSrc)!}
                                      alt={project.title || ""}
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
                                  <p className="mt-1 line-clamp-2 flex-1 text-xs opacity-70">
                                    {project.description}
                                  </p>
                                  {project.url && (
                                    <a
                                      href={project.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      style={{ backgroundColor: secIconColor }}
                                      className="mt-4 flex h-9 w-full items-center justify-center rounded-lg px-4 text-center text-xs font-bold text-white transition-opacity hover:opacity-90"
                                    >
                                      {project.buttonText || "View project"}
                                    </a>
                                  )}
                                </div>
                              </div>
                            );
                          }

                          if (secProps.layout === "2") {
                            return (
                              <div
                                key={project.id}
                                style={projectCardStyle}
                                className="flex flex-col overflow-hidden rounded-xl border transition-all"
                              >
                                {project.imageSrc && (
                                  <div className="relative h-44 w-full shrink-0 bg-gray-100 dark:bg-zinc-800">
                                    <Image
                                      src={getImageUrl(project.imageSrc)!}
                                      alt={project.title || ""}
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
                                  <p className="mt-2 text-xs leading-relaxed opacity-70">
                                    {project.description}
                                  </p>
                                  {project.url && (
                                    <div className="mt-4 flex justify-start">
                                      <a
                                        href={project.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{
                                          backgroundColor: secIconColor,
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

                          if (secProps.layout === "3") {
                            return (
                              <div
                                key={project.id}
                                style={projectCardStyle}
                                className="flex items-center gap-4 rounded-xl border p-4 transition-all"
                              >
                                {project.imageSrc && (
                                  <div className="relative h-18 w-18 shrink-0 overflow-hidden rounded-lg bg-gray-100 dark:bg-zinc-800">
                                    <Image
                                      src={getImageUrl(project.imageSrc)!}
                                      alt={project.title || ""}
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
                                  <p className="mt-1 line-clamp-2 text-xs opacity-70">
                                    {project.description}
                                  </p>
                                  {project.url && (
                                    <a
                                      href={project.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      style={{ color: secIconColor }}
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

                          if (secProps.layout === "4") {
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
                                  <p className="mt-1 line-clamp-2 text-xs opacity-70">
                                    {project.description}
                                  </p>
                                  {project.url && (
                                    <a
                                      href={project.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      style={{ color: secIconColor }}
                                      className="mt-2 inline-flex items-center gap-1 text-xs font-bold hover:underline"
                                    >
                                      <span>
                                        {project.buttonText || "View project"}
                                      </span>
                                      <ExternalLink size={12} />
                                    </a>
                                  )}
                                </div>
                                {project.imageSrc && (
                                  <div className="relative h-18 w-18 shrink-0 overflow-hidden rounded-lg bg-gray-100 dark:bg-zinc-800">
                                    <Image
                                      src={getImageUrl(project.imageSrc)!}
                                      alt={project.title || ""}
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
                      <p className="py-4 text-center text-xs opacity-60">
                        No projects added yet.
                      </p>
                    )}
                  </div>
                </div>
              );
            }

            if (sectionId === "cta" && content?.cta) {
              if (!content.cta.visible) return null;
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const secProps = content.cta as any;
              const secBgColor = secProps.bgColor || globalBgColor;
              const secTextColor = secProps.textColor || globalTextColor;
              const secIconColor = secProps.iconColor || globalIconColor;
              const cardStyle = {
                ...defaultCardStyle,
                backgroundColor: secBgColor,
                color: secTextColor,
                paddingTop: `${secProps.paddingTop ?? 16}px`,
                paddingBottom: `${secProps.paddingBottom ?? 16}px`,
              };

              const ctaLayout = secProps.layout || "1";
              const ctaAlignClass =
                ctaLayout === "2"
                  ? "items-start text-left"
                  : ctaLayout === "3"
                    ? "items-end text-right"
                    : "items-center text-center";

              return (
                <div
                  key="cta"
                  style={cardStyle}
                  className="relative flex flex-col border px-6 shadow-sm transition-all duration-300"
                >
                  <div className={`flex flex-col py-4 ${ctaAlignClass}`}>
                    {secProps.iconSrc && (
                      <div
                        style={{
                          borderColor: THEME_DEFAULTS.LIGHT_MODE.BORDER_COLOR,
                        }}
                        className="mb-5 flex h-16 w-16 shrink-0 items-center justify-center rounded-[16px] border bg-white shadow-[0_2px_8px_rgba(0,0,0,0.03)]"
                      >
                        <div className="relative h-7 w-7">
                          <Image
                            src={secProps.iconSrc}
                            alt={secProps.iconLabel || "CTA Icon"}
                            fill
                            className="object-contain"
                            unoptimized
                          />
                        </div>
                      </div>
                    )}
                    <h4 className="text-[32px] leading-snug font-bold tracking-tight">
                      {secProps.title || "Let's build something"}
                    </h4>
                    {secProps.subtitle && (
                      <p
                        style={{ color: secTextColor }}
                        className="mt-3 max-w-lg text-[15px] leading-relaxed font-medium opacity-80"
                      >
                        {secProps.subtitle}
                      </p>
                    )}
                    {(content.cta.label || content.cta.url) && (
                      <a
                        href={content.cta.url || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          backgroundColor: secIconColor,
                          borderRadius: activeRadius,
                        }}
                        className="mt-6 inline-flex h-11 items-center justify-center px-[32px] text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90 active:scale-95"
                      >
                        {content.cta.label || "Visit"}
                      </a>
                    )}
                  </div>
                </div>
              );
            }

            return null;
          })}
        </div>

        <footer className="py-6 text-center text-xs opacity-50">
          © {new Date().getFullYear()} Open Profile. All rights reserved.
        </footer>
      </div>
    </TemplateAppearanceProvider>
  );
}

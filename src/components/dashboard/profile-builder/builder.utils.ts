import type {
  ProfileContentResponse,
  UpsertDraftRequest,
  DashboardProfileResponse,
} from "@/api/profile/profile.type";
import type { Section, SavedLink, ProjectItem } from "./types";
import { encodeUrlForBackend, decodeUrlForFrontend } from "@/utils/profile";

export function contentToSections(
  rawContent: ProfileContentResponse,
  profile: DashboardProfileResponse
): Section[] {
  const content = rawContent?.content;
  let order = content?.sectionOrder?.length
    ? [...new Set(content.sectionOrder)]
    : ["bio"];

  // Derive fallback order from existing keys in content if sectionOrder is missing to prevent data loss
  if (!content?.sectionOrder?.length) {
    if (content?.links) order.push("links");
    if (content?.projects) order.push("projects");
    if (content?.cta) order.push("cta");
    order = [...new Set(order)];
  }

  return order.map((key) => {
    if (key === "bio") {
      return {
        id: "bio",
        title: "Bio",
        type: "bio" as const,
        visible: content?.bio?.visible ?? true,
        bio: content?.bio?.content || profile.bio || "",
        fullName: profile.fullName ?? "",
      };
    }

    if (key === "links") {
      return {
        id: "links",
        title: content?.links?.sectionTitle || "Links - Featured Links",
        type: "links" as const,
        visible: content?.links?.visible ?? true,
        subtitle: content?.links?.sectionTitle ?? "",
        links: (content?.links?.items ?? []).map((l: any) => ({
          ...l,
          url: decodeUrlForFrontend(l.url),
        })) as unknown as SavedLink[],
      };
    }

    if (key === "projects") {
      return {
        id: "projects",
        title: content?.projects?.sectionTitle || "Projects - Portfolio",
        type: "projects" as const,
        visible: content?.projects?.visible ?? true,
        subtitle: content?.projects?.sectionTitle ?? "",
        projects: (content?.projects?.items ?? []).map((p: any) => ({
          ...p,
          url: decodeUrlForFrontend(p.url),
        })) as unknown as ProjectItem[],
      };
    }

    // key === "cta"
    return {
      id: "cta",
      title: content?.cta?.title || "Let's build something",
      type: "experience" as const,
      visible: content?.cta?.visible ?? true,
      subtitle: content?.cta?.subtitle ?? "",
      layout: content?.cta?.layout ?? "1",
      buttonText: content?.cta?.label ?? "",
      url: decodeUrlForFrontend(content?.cta?.url),
      iconId: content?.cta?.iconId ?? null,
      iconSrc: content?.cta?.iconSrc ?? null,
      iconLabel: content?.cta?.iconLabel ?? null,
    };
  });
}

const isRemoteUrl = (src?: string | null) =>
  !!src && (src.startsWith("http://") || src.startsWith("https://"));

export const isValidUrl = (urlString: string, iconId?: string | null) => {
  if (!urlString) return true;
  const trimmed = urlString.trim();

  // Allow explicit protocols
  if (/^(mailto:|tel:|whatsapp:|sms:)/i.test(trimmed)) return true;
  
  // Allow wa.me links
  if (/^wa\.me\//i.test(trimmed)) return true;

  // Allow plain phone numbers
  if (/^\+?[0-9\s()-]{7,20}$/.test(trimmed)) return true;

  // Allow email addresses
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return true;

  // Allow social media usernames starting with @
  if (/^@[\w.-]+$/.test(trimmed)) {
    const supportedSocials = ["insta", "twitter", "linkedin", "github", "youtube", "tiktok", "behance", "flickr", "pinterest"];
    if (iconId && supportedSocials.includes(iconId)) {
      return true;
    }
    return false; // Context-aware rejection of handles for unsupported or global links
  }

  // Allow plain domains without http/www
  if (/^[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{2,10}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/i.test(trimmed)) return true;

  return /^(https?:\/\/|www\.)[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{2,10}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/i.test(trimmed);
};

export function sectionsToContent(
  sections: Section[]
): NonNullable<UpsertDraftRequest["content"]> {
  const sectionOrder = sections.map((s) =>
    s.type === "experience" ? "cta" : s.id
  );

  const bioSection = sections.find((s) => s.type === "bio");
  const linksSection = sections.find((s) => s.type === "links");
  const projectsSection = sections.find((s) => s.type === "projects");
  const ctaSection = sections.find((s) => s.type === "experience");

  return {
    sectionOrder,
    bio: bioSection
      ? { visible: bioSection.visible, content: bioSection.bio ?? "" }
      : undefined,
    links: linksSection
      ? {
          visible: linksSection.visible,
          sectionTitle: linksSection.subtitle ?? "Links",
          items: (linksSection.links ?? []).map((l) => ({
            ...l,
            url: l.url ? encodeUrlForBackend(l.url, l.iconId) : "",
            imageSrc: isRemoteUrl(l.imageSrc) ? l.imageSrc : null,
          })) as unknown as Record<string, unknown>[],
        }
      : undefined,
    projects: projectsSection
      ? {
          visible: projectsSection.visible,
          sectionTitle: projectsSection.subtitle ?? "Projects",
          items: (projectsSection.projects ?? []).map((p) => ({
            ...p,
            url: p.url ? encodeUrlForBackend(p.url) : "",
            imageSrc: isRemoteUrl(p.imageSrc) ? p.imageSrc : null,
          })) as unknown as Record<string, unknown>[],
        }
      : undefined,
    cta: ctaSection
      ? {
          visible: ctaSection.visible,
          label: ctaSection.buttonText ?? "",
          url: ctaSection.url ? encodeUrlForBackend(ctaSection.url, ctaSection.iconId) : null,
          title: ctaSection.title ?? "",
          subtitle: ctaSection.subtitle ?? "",
          layout: ctaSection.layout ?? "1",
          iconId: ctaSection.iconId ?? null,
          iconSrc: ctaSection.iconSrc ?? null,
          iconLabel: ctaSection.iconLabel ?? null,
        }
      : undefined,
  };
}

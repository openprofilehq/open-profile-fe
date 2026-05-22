import type {
  ProfileContentResponse,
  UpsertDraftRequest,
  DashboardProfileResponse,
} from "@/api/profile/profile.type";
import type { Section, SavedLink, ProjectItem } from "./types";

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
        links: (content?.links?.items ?? []) as unknown as SavedLink[],
      };
    }

    if (key === "projects") {
      return {
        id: "projects",
        title: content?.projects?.sectionTitle || "Projects - Portfolio",
        type: "projects" as const,
        visible: content?.projects?.visible ?? true,
        subtitle: content?.projects?.sectionTitle ?? "",
        projects: (content?.projects?.items ?? []) as unknown as ProjectItem[],
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
      url: content?.cta?.url ?? "",
      iconId: content?.cta?.iconId ?? null,
      iconSrc: content?.cta?.iconSrc ?? null,
      iconLabel: content?.cta?.iconLabel ?? null,
    };
  });
}

const isRemoteUrl = (src?: string | null) =>
  !!src && (src.startsWith("http://") || src.startsWith("https://"));

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
            imageSrc: isRemoteUrl(p.imageSrc) ? p.imageSrc : null,
          })) as unknown as Record<string, unknown>[],
        }
      : undefined,
    cta: ctaSection
      ? {
          visible: ctaSection.visible,
          label: ctaSection.buttonText ?? "",
          url: ctaSection.url || null,
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

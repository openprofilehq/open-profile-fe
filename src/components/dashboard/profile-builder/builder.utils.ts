import type {
  ProfileContentResponse,
  UpsertDraftRequest,
  DashboardProfileResponse,
  LinkItem,
  ProjectItem as ApiProjectItem,
} from "@/api/profile/profile.type";
import type {
  Section,
  SavedLink,
  ProjectItem,
  ExperienceItem,
  EducationItem,
  SkillItem,
} from "./types";
import { encodeUrlForBackend, decodeUrlForFrontend } from "@/utils/profile";
import {
  educationResponseToItem,
  skillResponseToItem,
  workExperienceResponseToItem,
} from "./profile-content-api-mappers";

export function deserializeTitleAndSubtitle(
  rawTitle: string,
  defaultTitle: string
): { title: string; subtitle: string } {
  if (!rawTitle) {
    return { title: defaultTitle, subtitle: "" };
  }
  if (rawTitle.includes("///")) {
    const delimiterIndex = rawTitle.indexOf("///");
    const titlePart = rawTitle.slice(0, delimiterIndex);
    const subtitlePart = rawTitle.slice(delimiterIndex + 3);
    return {
      title: titlePart || defaultTitle,
      subtitle: subtitlePart || "",
    };
  }
  const isDefaultTitle = [
    "links",
    "featured links",
    "selected projects",
    "projects",
    "portfolio",
    "work experience",
    "education",
    "skills",
  ].includes(rawTitle.toLowerCase().trim());
  if (isDefaultTitle) {
    return { title: rawTitle, subtitle: "" };
  }
  return { title: defaultTitle, subtitle: rawTitle };
}

const createStableContentItemId = (
  rawId: unknown,
  prefix: "link" | "project" | "experience" | "education" | "skill",
  index: number,
  parts: unknown[],
  seenIds: Set<string>
) => {
  const existingId =
    typeof rawId === "string" || typeof rawId === "number"
      ? String(rawId).trim()
      : "";
  const source = parts
    .map((part) =>
      typeof part === "string" || typeof part === "number" ? String(part) : ""
    )
    .filter(Boolean)
    .join("-")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);

  let nextId = existingId || `${prefix}-${index}-${source || "item"}`;

  let suffix = 1;
  const baseId = nextId;
  while (seenIds.has(nextId)) {
    nextId = `${baseId}-${index}-${suffix}`;
    suffix += 1;
  }

  seenIds.add(nextId);

  return nextId;
};

const getContentSection = (
  content: ProfileContentResponse["content"],
  key: string
) => {
  return (content as Record<string, unknown> | null | undefined)?.[key] as
    | Record<string, unknown>
    | undefined;
};

const getSectionItems = (section: Record<string, unknown> | undefined) => {
  return Array.isArray(section?.items)
    ? (section.items as Record<string, unknown>[])
    : [];
};

const API_SECTION_TYPE_TO_BUILDER_SECTION: Record<string, string> = {
  bio: "bio",
  links: "links",
  projects: "projects",
  cta: "cta",
  work_experience: "workExperience",
  workExperience: "workExperience",
  education: "education",
  skills: "skills",
};

const getProfileComponentInfo = (
  profile: DashboardProfileResponse,
  type: string
) => {
  const comp = Array.isArray(profile.components)
    ? (profile.components as any[]).find(
        (c) => (c.sectionType ?? c.type) === type
      )
    : undefined;
  const sect = Array.isArray(profile.sections)
    ? profile.sections.find((s) => s.type === type)
    : undefined;

  return {
    visible: sect?.isEnabled ?? comp?.isEnabled ?? true,
    title: sect?.title ?? comp?.title ?? undefined,
    subtitle: sect?.subtitle ?? comp?.subtitle ?? undefined,
  };
};

const getProfileSectionOrder = (profile: DashboardProfileResponse) => {
  const sections =
    Array.isArray(profile.sections) && profile.sections.length > 0
      ? profile.sections
      : Array.isArray(profile.components)
        ? (profile.components as any[]).map((c) => ({
            type: c.sectionType ?? c.type,
            displayOrder: c.displayOrder,
            isEnabled: c.isEnabled,
            title: c.title,
            subtitle: c.subtitle,
          }))
        : [];

  return sections
    .slice()
    .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
    .map((section) => API_SECTION_TYPE_TO_BUILDER_SECTION[section.type])
    .filter((type): type is string => Boolean(type));
};

export function contentToSections(
  rawContent: ProfileContentResponse,
  profile: DashboardProfileResponse
): Section[] {
  const content = rawContent?.content;
  const profileSectionOrder = getProfileSectionOrder(profile);
  let order = content?.sectionOrder?.length
    ? [...new Set(content.sectionOrder)].map((key) =>
        key === "work_experience" ? "workExperience" : key
      )
    : profileSectionOrder.length
      ? [...new Set(profileSectionOrder)]
      : ["bio"];

  // Merge any sections from the database component list that are enabled but missing from the draft order
  profileSectionOrder.forEach((key) => {
    if (!order.includes(key)) {
      const compInfo = getProfileComponentInfo(
        profile,
        key === "workExperience" ? "work_experience" : key
      );
      if (compInfo.visible) {
        order.push(key);
      }
    }
  });

  // Derive fallback order from existing keys in content/profile if sectionOrder is missing to prevent data loss
  if (!content?.sectionOrder?.length) {
    if (content?.links) order.push("links");
    if (content?.projects) order.push("projects");
    if (content?.cta) order.push("cta");
    if (
      getContentSection(content, "workExperience") ||
      profile.workExperience?.length
    )
      order.push("workExperience");
    if (getContentSection(content, "education") || profile.education?.length)
      order.push("education");
    if (getContentSection(content, "skills") || profile.skills?.length)
      order.push("skills");
    order = [...new Set(order)];
  }

  return order.map((key) => {
    if (key === "bio") {
      return {
        id: "bio",
        title: "Bio",
        type: "bio" as const,
        visible: content?.bio?.visible ?? true,
        bio: content?.bio?.content || profile?.bio || "",
        fullName: profile?.fullName ?? "",
        textColor: (content?.bio as Record<string, unknown>)?.textColor as
          | string
          | undefined,
        bgColor: (content?.bio as Record<string, unknown>)?.bgColor as
          | string
          | undefined,
        font: (content?.bio as Record<string, unknown>)?.font as
          | string
          | undefined,
        iconColor: (content?.bio as Record<string, unknown>)?.iconColor as
          | string
          | undefined,
        paddingTop: (content?.bio as Record<string, unknown>)?.paddingTop as
          | number
          | undefined,
        paddingBottom: (content?.bio as Record<string, unknown>)
          ?.paddingBottom as number | undefined,
        gap: (content?.bio as Record<string, unknown>)?.gap as
          | number
          | undefined,
        padding: (content?.bio as Record<string, unknown>)?.padding as
          | number
          | undefined,
      };
    }

    if (key === "links") {
      const rawTitle = content?.links?.sectionTitle || "Featured Links";
      const { title, subtitle } = deserializeTitleAndSubtitle(
        rawTitle,
        "Featured Links"
      );
      return {
        id: "links",
        title,
        type: "links" as const,
        visible: content?.links?.visible ?? true,
        subtitle,
        links: (() => {
          const seenLinkIds = new Set<string>();

          return (content?.links?.items ?? []).map(
            (l: Record<string, unknown>, index) => ({
              ...l,
              id: createStableContentItemId(
                l.id,
                "link",
                index,
                [l.label, l.title, l.url],
                seenLinkIds
              ),
              title: l.label || l.title || "",
              url: decodeUrlForFrontend(l.url as string),
            })
          ) as unknown as SavedLink[];
        })(),
        textColor: (content?.links as Record<string, unknown>)?.textColor as
          | string
          | undefined,
        bgColor: (content?.links as Record<string, unknown>)?.bgColor as
          | string
          | undefined,
        font: (content?.links as Record<string, unknown>)?.font as
          | string
          | undefined,
        iconColor: (content?.links as Record<string, unknown>)?.iconColor as
          | string
          | undefined,
        paddingTop: (content?.links as Record<string, unknown>)?.paddingTop as
          | number
          | undefined,
        paddingBottom: (content?.links as Record<string, unknown>)
          ?.paddingBottom as number | undefined,
        gap: (content?.links as Record<string, unknown>)?.gap as
          | number
          | undefined,
        padding: (content?.links as Record<string, unknown>)?.padding as
          | number
          | undefined,
      };
    }

    if (key === "projects") {
      const rawTitle = content?.projects?.sectionTitle || "Selected Projects";
      const { title, subtitle } = deserializeTitleAndSubtitle(
        rawTitle,
        "Selected Projects"
      );
      return {
        id: "projects",
        title,
        type: "projects" as const,
        visible: content?.projects?.visible ?? true,
        subtitle,
        projects: (() => {
          const seenProjectIds = new Set<string>();

          return (content?.projects?.items ?? []).map(
            (p: Record<string, unknown>, index) => {
              const rawId =
                typeof p.id === "string" || typeof p.id === "number"
                  ? String(p.id)
                  : "";
              const isHl = rawId.startsWith("hl_");
              const baseId = isHl ? rawId.slice(3) : rawId;

              return {
                ...p,
                id: createStableContentItemId(
                  baseId,
                  "project",
                  index,
                  [p.title, p.description, p.repoUrl, p.url],
                  seenProjectIds
                ),
                highlighted: isHl,
                url: decodeUrlForFrontend(
                  (p.repoUrl as string) || (p.url as string)
                ),
              };
            }
          ) as unknown as ProjectItem[];
        })(),
        layout: (content?.projects as Record<string, unknown>)?.layout as
          | string
          | undefined,
        textColor: (content?.projects as Record<string, unknown>)?.textColor as
          | string
          | undefined,
        bgColor: (content?.projects as Record<string, unknown>)?.bgColor as
          | string
          | undefined,
        font: (content?.projects as Record<string, unknown>)?.font as
          | string
          | undefined,
        iconColor: (content?.projects as Record<string, unknown>)?.iconColor as
          | string
          | undefined,
        paddingTop: (content?.projects as Record<string, unknown>)
          ?.paddingTop as number | undefined,
        paddingBottom: (content?.projects as Record<string, unknown>)
          ?.paddingBottom as number | undefined,
        gap: (content?.projects as Record<string, unknown>)?.gap as
          | number
          | undefined,
        padding: (content?.projects as Record<string, unknown>)?.padding as
          | number
          | undefined,
      };
    }

    if (key === "workExperience") {
      const workExperience =
        getContentSection(content, "work_experience") ||
        getContentSection(content, "workExperience");
      const compInfo =
        getProfileComponentInfo(profile, "work_experience") ||
        getProfileComponentInfo(profile, "workExperience");
      const rawTitle =
        typeof workExperience?.sectionTitle === "string"
          ? workExperience.sectionTitle
          : typeof compInfo.title === "string"
            ? compInfo.title
            : "Work Experience";
      const { title, subtitle } = deserializeTitleAndSubtitle(
        rawTitle,
        "Work Experience"
      );
      const seenExperienceIds = new Set<string>();

      return {
        id: "workExperience",
        title,
        type: "workExperience" as const,
        visible:
          typeof workExperience?.visible === "boolean"
            ? workExperience.visible
            : compInfo.visible,
        subtitle: subtitle || compInfo.subtitle || "",
        experiences: (() => {
          const contentItems = getSectionItems(workExperience);

          if (contentItems.length > 0) {
            return contentItems.map((item, index) => ({
              id: createStableContentItemId(
                item.id,
                "experience",
                index,
                [item.role, item.company, item.startYear],
                seenExperienceIds
              ),
              role: typeof item.role === "string" ? item.role : "",
              company: typeof item.company === "string" ? item.company : "",
              employmentType:
                typeof item.employmentType === "string"
                  ? item.employmentType
                  : undefined,
              startMonth:
                typeof item.startMonth === "string" ? item.startMonth : "",
              startYear:
                typeof item.startYear === "string" ? item.startYear : "",
              endMonth: typeof item.endMonth === "string" ? item.endMonth : "",
              endYear: typeof item.endYear === "string" ? item.endYear : "",
              currentlyWorking: item.currentlyWorking === true,
              description:
                typeof item.description === "string" ? item.description : "",
            })) as ExperienceItem[];
          }

          return (profile.workExperience ?? []).map(
            workExperienceResponseToItem
          );
        })(),
        textColor: workExperience?.textColor as string | undefined,
        bgColor: workExperience?.bgColor as string | undefined,
        font: workExperience?.font as string | undefined,
        iconColor: workExperience?.iconColor as string | undefined,
        paddingTop: workExperience?.paddingTop as number | undefined,
        paddingBottom: workExperience?.paddingBottom as number | undefined,
        gap: workExperience?.gap as number | undefined,
        padding: workExperience?.padding as number | undefined,
      };
    }

    if (key === "education") {
      const education = getContentSection(content, "education");
      const compInfo = getProfileComponentInfo(profile, "education");
      const rawTitle =
        typeof education?.sectionTitle === "string"
          ? education.sectionTitle
          : typeof compInfo.title === "string"
            ? compInfo.title
            : "Education";
      const { title, subtitle } = deserializeTitleAndSubtitle(
        rawTitle,
        "Education"
      );
      const seenEducationIds = new Set<string>();

      return {
        id: "education",
        title,
        type: "education" as const,
        visible:
          typeof education?.visible === "boolean"
            ? education.visible
            : compInfo.visible,
        subtitle: subtitle || compInfo.subtitle || "",
        education: (() => {
          const contentItems = getSectionItems(education);

          if (contentItems.length > 0) {
            return contentItems.map((item, index) => ({
              id: createStableContentItemId(
                item.id,
                "education",
                index,
                [item.degree, item.institution, item.startYear],
                seenEducationIds
              ),
              institution:
                typeof item.institution === "string" ? item.institution : "",
              degree: typeof item.degree === "string" ? item.degree : "",
              startMonth:
                typeof item.startMonth === "string" ? item.startMonth : "",
              startYear:
                typeof item.startYear === "string" ? item.startYear : "",
              endMonth: typeof item.endMonth === "string" ? item.endMonth : "",
              endYear: typeof item.endYear === "string" ? item.endYear : "",
              currentlyStudying: item.currentlyStudying === true,
            })) as EducationItem[];
          }

          return (profile.education ?? []).map(educationResponseToItem);
        })(),
        textColor: education?.textColor as string | undefined,
        bgColor: education?.bgColor as string | undefined,
        font: education?.font as string | undefined,
        iconColor: education?.iconColor as string | undefined,
        paddingTop: education?.paddingTop as number | undefined,
        paddingBottom: education?.paddingBottom as number | undefined,
        gap: education?.gap as number | undefined,
        padding: education?.padding as number | undefined,
      };
    }

    if (key === "skills") {
      const skills = getContentSection(content, "skills");
      const compInfo = getProfileComponentInfo(profile, "skills");
      const rawTitle =
        typeof skills?.sectionTitle === "string"
          ? skills.sectionTitle
          : typeof compInfo.title === "string"
            ? compInfo.title
            : "Skills";
      const { title, subtitle } = deserializeTitleAndSubtitle(
        rawTitle,
        "Skills"
      );
      const seenSkillIds = new Set<string>();

      return {
        id: "skills",
        title,
        type: "skills" as const,
        visible:
          typeof skills?.visible === "boolean"
            ? skills.visible
            : compInfo.visible,
        subtitle: subtitle || compInfo.subtitle || "",
        skills: (() => {
          const contentItems = getSectionItems(skills);

          if (contentItems.length > 0) {
            return contentItems.map((item, index) => ({
              id: createStableContentItemId(
                item.id,
                "skill",
                index,
                [item.name, item.label],
                seenSkillIds
              ),
              name:
                typeof item.name === "string"
                  ? item.name
                  : typeof item.label === "string"
                    ? item.label
                    : "",
            })) as SkillItem[];
          }

          return (profile.skills ?? []).map(skillResponseToItem);
        })(),
        textColor: skills?.textColor as string | undefined,
        bgColor: skills?.bgColor as string | undefined,
        font: skills?.font as string | undefined,
        iconColor: skills?.iconColor as string | undefined,
        paddingTop: skills?.paddingTop as number | undefined,
        paddingBottom: skills?.paddingBottom as number | undefined,
        gap: skills?.gap as number | undefined,
        padding: skills?.padding as number | undefined,
      };
    }

    // key === "cta"
    return {
      id: "cta",
      title: content?.cta?.title || "Let's build something",
      type: "cta" as const,
      visible: content?.cta?.visible ?? true,
      subtitle: content?.cta?.subtitle ?? "",
      layout: content?.cta?.layout ?? "1",
      buttonText: content?.cta?.label ?? "",
      url: decodeUrlForFrontend(content?.cta?.value),
      ctaType:
        (content?.cta?.type as "link" | "email" | "phone" | "whatsapp") ??
        "link",
      iconId: content?.cta?.iconId ?? null,
      iconSrc: content?.cta?.iconSrc ?? null,
      iconLabel: content?.cta?.iconLabel ?? null,
      textColor: (content?.cta as Record<string, unknown>)?.textColor as
        | string
        | undefined,
      bgColor: (content?.cta as Record<string, unknown>)?.bgColor as
        | string
        | undefined,
      font: (content?.cta as Record<string, unknown>)?.font as
        | string
        | undefined,
      iconColor: (content?.cta as Record<string, unknown>)?.iconColor as
        | string
        | undefined,
      paddingTop: (content?.cta as Record<string, unknown>)?.paddingTop as
        | number
        | undefined,
      paddingBottom: (content?.cta as Record<string, unknown>)
        ?.paddingBottom as number | undefined,
      gap: (content?.cta as Record<string, unknown>)?.gap as number | undefined,
      padding: (content?.cta as Record<string, unknown>)?.padding as
        | number
        | undefined,
    };
  });
}

export const isValidUrl = (urlString: string, iconId?: string | null) => {
  if (!urlString) return true;
  const trimmed = urlString.trim();

  // Allow explicit protocols
  if (/^(mailto:|tel:|whatsapp:|sms:)/i.test(trimmed)) return true;

  // Allow wa.me links
  if (/^(?:https?:\/\/)?wa\.me\//i.test(trimmed)) {
    const extractedNumber = trimmed.split("wa.me/")[1];
    if (extractedNumber && /^\d+$/.test(extractedNumber)) return true;
    return false;
  }

  // Allow plain phone numbers
  if (/^\+?[0-9\s()-]{7,20}$/.test(trimmed)) return true;

  // Allow email addresses
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return true;

  // Allow social media usernames starting with @
  if (/^@[\w.-]+$/.test(trimmed)) {
    const supportedSocials = [
      "insta",
      "twitter",
      "linkedin",
      "github",
      "youtube",
      "tiktok",
      "behance",
      "flickr",
      "pinterest",
    ];
    if (iconId && supportedSocials.includes(iconId)) {
      return true;
    }
    return false; // Context-aware rejection of handles for unsupported or global links
  }

  // Allow plain domains without http/www
  if (
    /^[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9]{2,63}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/i.test(
      trimmed
    )
  )
    return true;

  return /^(https?:\/\/|www\.)[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9]{2,63}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/i.test(
    trimmed
  );
};

export function sectionsToContent(
  sections: Section[]
): NonNullable<UpsertDraftRequest["content"]> {
  const sectionOrder = sections.map((s) =>
    s.id === "workExperience" ? "work_experience" : s.id
  );

  const bioSection = sections.find((s) => s.type === "bio");
  const linksSection = sections.find((s) => s.type === "links");
  const projectsSection = sections.find((s) => s.type === "projects");
  const ctaSection = sections.find((s) => s.type === "cta");

  const sectionStyleFields = (s: Section) => ({
    ...(s.textColor && { textColor: s.textColor }),
    ...(s.bgColor && { bgColor: s.bgColor }),
    ...(s.font && { font: s.font }),
    ...(s.iconColor && { iconColor: s.iconColor }),
    ...(s.paddingTop != null && { paddingTop: s.paddingTop }),
    ...(s.paddingBottom != null && { paddingBottom: s.paddingBottom }),
    ...(s.gap != null && { gap: s.gap }),
    ...(s.padding != null && { padding: s.padding }),
  });

  return {
    sectionOrder,
    bio: bioSection
      ? {
          visible: bioSection.visible,
          content: bioSection.bio ?? "",
          ...sectionStyleFields(bioSection),
        }
      : undefined,
    links: linksSection
      ? {
          visible: linksSection.visible,
          sectionTitle: `${linksSection.title ?? "Featured Links"}///${linksSection.subtitle ?? ""}`,
          items: (linksSection.links ?? []).map((l) => ({
            id: l.id,
            label: l.title || "",
            url: l.url ? encodeUrlForBackend(l.url, l.iconId) : "",
            visible: true,
          })) as unknown as LinkItem[],
          ...sectionStyleFields(linksSection),
        }
      : undefined,
    projects: projectsSection
      ? {
          visible: projectsSection.visible,
          sectionTitle: `${projectsSection.title ?? "Selected Projects"}///${projectsSection.subtitle ?? ""}`,
          ...(projectsSection.layout && { layout: projectsSection.layout }),
          ...sectionStyleFields(projectsSection),
          items: (projectsSection.projects ?? []).map((p) => {
            const isHighlighted =
              p.highlighted === true || String(p.highlighted) === "true";
            // Note: The "hl_" prefix is a presentation-layer convention used for the highlighted project feature.
            // We defensively strip it here to ensure the backend only receives the original UUID.
            const baseId = String(p.id).startsWith("hl_")
              ? String(p.id).slice(3)
              : p.id;
            const mappedProject: Record<string, unknown> = {
              id: isHighlighted ? `hl_${baseId}` : baseId,
              title: p.title || "",
              description: p.description || "",
              visible: true,
            };
            if (p.imageSrc) {
              mappedProject.imageSrc = p.imageSrc;
            }
            if (p.buttonText) {
              mappedProject.buttonText = p.buttonText;
            }
            if (p.url) {
              mappedProject.repoUrl = encodeUrlForBackend(p.url);
            }
            return mappedProject;
          }) as unknown as ApiProjectItem[],
        }
      : undefined,
    cta: ctaSection
      ? {
          visible: ctaSection.visible,
          ...sectionStyleFields(ctaSection),
          type:
            ctaSection.ctaType ??
            (ctaSection.url?.includes("@") ||
            ctaSection.url?.startsWith("mailto:")
              ? "email"
              : "link"),
          label: ctaSection.buttonText ?? "",
          value: ctaSection.url
            ? encodeUrlForBackend(ctaSection.url, ctaSection.iconId)
            : null,
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

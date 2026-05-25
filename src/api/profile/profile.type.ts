export type CreateProfileRequest = {
  username: string;
  fullName: string;
  bio: string;
  photoUrl?: string;
};

export type CreateProfileResponse = {
  username: string;
  fullName: string;
  bio: string;
  photoUrl: string | null;
};

export type UsernameCheckResponse = {
  available: boolean;
  username?: string;
};

export type ProfileResponse = {
  id?: string;
  username: string;
  fullName: string;
  bio: string | null;
  photoUrl: string | null;
  isPublished?: boolean;
  templateType?: string | null;
  themeSettings?: unknown | null;
  content?: ProfileContentDetails | null;
};

export type DashboardProfileResponse = {
  username: string;
  fullName: string;
  bio: string | null;
  photoUrl: string | null;
  templateType: string | null;
  themeSettings: unknown | null;
  isPublished: boolean;
  hasUnpublishedChanges: boolean;
  ctaLabel: string | null;
  ctaUrl: string | null;
  components: unknown[];
};

export type ProfileContentSectionBio = {
  visible: boolean;
  content: string;
};

export type ProfileContentSectionLinks = {
  visible: boolean;
  sectionTitle: string;
  items: Record<string, unknown>[];
};

export type ProfileContentSectionProjects = {
  visible: boolean;
  sectionTitle: string;
  items: Record<string, unknown>[];
};

export type ProfileContentSectionCta = {
  visible: boolean;
  label: string;
  url: string | null;
  title?: string;
  subtitle?: string;
  layout?: string;
  iconId?: string | null;
  iconSrc?: string | null;
  iconLabel?: string | null;
};

export type ProfileContentDetails = {
  sectionOrder: string[];
  bio: ProfileContentSectionBio;
  links: ProfileContentSectionLinks;
  projects: ProfileContentSectionProjects;
  cta: ProfileContentSectionCta;
};

export type ProfileContentResponse = {
  profileId: string;
  bio: string | null;
  photoUrl: string | null;
  content: ProfileContentDetails | null;
  source: "draft" | "published";
  updatedAt: string;
};

export type UpsertDraftRequest = {
  bio?: string | null;
  photoUrl?: string | null;
  themeSettings?: Record<string, unknown> | null;
  content?: {
    bio?: ProfileContentSectionBio;
    links?: ProfileContentSectionLinks;
    projects?: ProfileContentSectionProjects;
    cta?: ProfileContentSectionCta;
    sectionOrder?: string[];
  };
};

export type UpsertDraftResponse = {
  status: string;
  message: string;
  data: ProfileContentResponse;
};

export type DraftStateResponse = {
  status: string;
  hasDraft: boolean;
  draftId?: string;
  updatedAt?: string;
};

export type PublishProfileResponse = {
  status: string;
  message: string;
  data: {
    profileId: string;
    username: string;
    publishedAt: string;
  };
};

export type ProfileAppearanceRequest = {
  template: string;
  accentColour: string;
  font: string;
  cornerStyle: "sharp" | "medium" | "round";
  spacing: number;
  theme: "light" | "dark";
};

export type ProfileAppearanceResponse = {
  status: string;
  message: string;
};

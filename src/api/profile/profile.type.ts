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
  templateType?: TemplateType | null;
  themeSettings?: unknown | null;
  appearance?: ProfileAppearanceSettings | null;
  content?: ProfileContentDetails | null;
  skills?: SkillResponseDto[];
  education?: EducationResponseDto[];
  workExperience?: WorkExperienceResponseDto[];
  sections?: ProfileSectionOrderItem[];
};

export type DashboardProfileResponse = {
  username: string;
  fullName: string;
  bio: string | null;
  photoUrl: string | null;
  templateType: TemplateType | null;
  themeSettings: unknown | null;
  isPublished: boolean;
  hasUnpublishedChanges: boolean;
  ctaLabel: string | null;
  ctaUrl: string | null;
  components: unknown[];
  skills?: SkillResponseDto[];
  education?: EducationResponseDto[];
  workExperience?: WorkExperienceResponseDto[];
  sections?: ProfileSectionOrderItem[];
};

export type ProfileContentSectionBio = {
  visible: boolean;
  content: string;
};

export type TemplateType = "Professional" | "Creator" | "Portfolio" | "Default";

export type LinkItem = {
  id: string | number;
  url?: string;
  title?: string;
  label?: string;
  imageSrc?: string;
  iconSrc?: string;
  iconLabel?: string;
};

export type ProjectItem = {
  id: string | number;
  title?: string;
  description?: string;
  url?: string;
  buttonText?: string;
  imageSrc?: string;
  highlighted?: boolean;
};

export type ExperienceItem = {
  id: string | number;
  role?: string;
  company?: string;
  employmentType?: string;
  startMonth?: string;
  startYear?: string;
  endMonth?: string;
  endYear?: string;
  currentlyWorking?: boolean;
  description?: string;
};

export type EducationItem = {
  id: string | number;
  institution?: string;
  degree?: string;
  startMonth?: string;
  startYear?: string;
  endMonth?: string;
  endYear?: string;
  currentlyStudying?: boolean;
};

export type SkillItem = {
  id: string | number;
  name?: string;
  label?: string;
};

export type ProfileComponentSectionType =
  | "bio"
  | "links"
  | "projects"
  | "cta"
  | "work_experience"
  | "education"
  | "skills"
  | "awards";

export type ProfileSectionOrderItem = {
  id?: string;
  componentId?: string;
  type: ProfileComponentSectionType | string;
  displayOrder: number;
  isEnabled?: boolean;
  title?: string | null;
  subtitle?: string | null;
};

export type SkillLevel = "beginner" | "intermediate" | "expert";

export type SkillResponseDto = {
  id: string;
  profileId?: string;
  name: string;
  level?: SkillLevel | null;
  displayOrder?: number;
  createdAt?: string;
  updatedAt?: string;
};

export type CreateSkillRequest = {
  name: string;
  level?: SkillLevel;
};

export type UpdateSkillRequest = Partial<CreateSkillRequest>;

export type ReorderSkillsRequest = {
  skillIds: string[];
};

export type ReorderSkillsResponse = {
  skills: SkillResponseDto[];
};

export type EducationResponseDto = {
  id: string;
  profileId?: string;
  school: string;
  degree: string;
  fieldOfStudy: string;
  location?: string | null;
  activitiesHonors?: string | null;
  startYear: number;
  endYear: number;
  displayOrder?: number;
  createdAt?: string;
  updatedAt?: string;
};

export type CreateEducationRequest = {
  school: string;
  degree: string;
  fieldOfStudy: string;
  location?: string;
  activitiesHonors?: string;
  startYear: number;
  endYear: number;
};

export type UpdateEducationRequest = Partial<CreateEducationRequest>;

export type ReorderEducationRequest = {
  educationIds: string[];
};

export type ReorderEducationResponse = {
  education: EducationResponseDto[];
};

export type WorkExperienceResponseDto = {
  id: string;
  profileId?: string;
  companyName: string;
  jobTitle: string;
  location?: string | null;
  description?: string | null;
  startMonth: number;
  startYear: number;
  endMonth?: number | null;
  endYear?: number | null;
  isCurrent: boolean;
  displayOrder?: number;
  createdAt?: string;
  updatedAt?: string;
};

export type CreateWorkExperienceRequest = {
  companyName: string;
  jobTitle: string;
  location?: string;
  description?: string;
  startMonth: number;
  startYear: number;
  endMonth?: number | null;
  endYear?: number | null;
  isCurrent: boolean;
};

export type UpdateWorkExperienceRequest = Partial<CreateWorkExperienceRequest>;

export type ReorderWorkExperienceRequest = {
  workExperienceIds: string[];
};

export type ReorderWorkExperienceResponse = {
  workExperience: WorkExperienceResponseDto[];
};

export type ProfileComponentUpdateRequest = {
  isEnabled?: boolean;
  title?: string;
  subtitle?: string;
  displayOrder?: number;
};

export type ReorderProfileComponentsRequest = {
  componentIds: string[];
};

export type ProfileContentSectionLinks = {
  visible: boolean;
  sectionTitle: string;
  items: LinkItem[];
};

export type ProfileContentSectionProjects = {
  visible: boolean;
  sectionTitle: string;
  items: ProjectItem[];
};

export type ProfileContentSectionWorkExperience = {
  visible: boolean;
  sectionTitle: string;
  items: ExperienceItem[];
};

export type ProfileContentSectionEducation = {
  visible: boolean;
  sectionTitle: string;
  items: EducationItem[];
};

export type ProfileContentSectionSkills = {
  visible: boolean;
  sectionTitle: string;
  items: SkillItem[];
};

export type ProfileContentSectionCta = {
  visible: boolean;
  type?: "link" | "email" | "phone" | "whatsapp";
  label: string;
  url?: string | null;
  value?: string | null;
  title?: string;
  subtitle?: string;
  layout?: string;
  buttonText?: string;
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
  workExperience?: ProfileContentSectionWorkExperience;
  education?: ProfileContentSectionEducation;
  skills?: ProfileContentSectionSkills;
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
    workExperience?: ProfileContentSectionWorkExperience;
    education?: ProfileContentSectionEducation;
    skills?: ProfileContentSectionSkills;
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

export type ProfileAppearanceFont =
  | "afacad"
  | "inter"
  | "serif"
  | "mono"
  | "geologica"
  | "manrope";

export type ProfileAppearanceCornerStyle =
  | "sharp"
  | "medium"
  | "round"
  | "rounded"
  | "pill";

export type ComponentAppearance = {
  backgroundColour?: string;
  /** @deprecated Use `backgroundColour` instead */
  bgColor?: string;
  textColour?: string;
  /** @deprecated Use `textColour` instead */
  textColor?: string;
  accentColour?: string;
  /** @deprecated Use `accentColour` instead */
  iconColor?: string;
  [key: string]: unknown;
};

export type ProfileAppearanceValues = {
  template: string;
  accentColour: string;
  backgroundColour?: string;
  textColour?: string;
  font: ProfileAppearanceFont;
  cornerStyle: ProfileAppearanceCornerStyle;
  spacing: number;
  theme?: string;
};

export type ProfileAppearanceSettings = {
  global?: {
    template: string;
    accentColour: string;
    backgroundColour?: string;
    textColour?: string;
    /** @deprecated Use `textColour` instead */
    textColor?: string;
    /** @deprecated Use `backgroundColour` instead */
    bgColor?: string;
    font: ProfileAppearanceFont;
    cornerStyle: ProfileAppearanceCornerStyle;
    spacing: number;
    theme?: string;
  };
  components?: Record<string, ComponentAppearance>;
  template?: string;
  accentColour?: string;
  backgroundColour?: string;
  textColour?: string;
  /** @deprecated Use `textColour` instead */
  textColor?: string;
  /** @deprecated Use `backgroundColour` instead */
  bgColor?: string;
  font?: ProfileAppearanceFont;
  cornerStyle?: ProfileAppearanceCornerStyle;
  spacing?: number;
  theme?: string;
};

export type ProfileAppearanceRequest = {
  global?: {
    template?: string;
    accentColour?: string;
    backgroundColour?: string;
    textColour?: string;
    font?: ProfileAppearanceFont;
    cornerStyle?: ProfileAppearanceCornerStyle;
    spacing?: number;
    theme?: string;
  };
  components?: {
    bio?: Record<string, unknown>;
    links?: Record<string, unknown>;
    projects?: Record<string, unknown>;
    cta?: Record<string, unknown>;
    workExperience?: Record<string, unknown>;
    education?: Record<string, unknown>;
    skills?: Record<string, unknown>;
    [key: string]: unknown;
  };
};

export type ProfileAppearanceResponse = {
  status: string;
  message: string;
  appearance?: ProfileAppearanceSettings | null;
  data?: ProfileAppearanceSettings | null;
};

/**
 * Response for GET /profiles/appearance.
 *
 * `appearance` is the canonical response field returned by the current backend.
 * `data` is kept only as a temporary backwards-compatible fallback for older
 * response shapes and should be removed once the migration is complete.
 *
 * Callers should always prefer `appearance` before falling back to `data`.
 */
export type GetProfileAppearanceResponse = {
  status: string;
  message?: string;
  appearance?: ProfileAppearanceSettings | null;
  /** @deprecated Use `appearance` instead. */
  data?: ProfileAppearanceSettings | null;
};

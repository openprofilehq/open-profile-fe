export type SectionType = "bio" | "links" | "projects" | "experience";

export interface SavedLink {
  id: string;
  title: string;
  url: string;
  iconId: string | null;
  iconLabel: string | null;
  iconSrc: string | null;
  imageSrc: string | null;
}

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  url?: string;
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  duration: string;
}

export interface Section {
  id: string;
  title: string;
  type: SectionType | string;
  visible: boolean;
  fullName?: string;
  bio?: string;
  subtitle?: string;
  links?: SavedLink[];
  projects?: ProjectItem[];
  experience?: ExperienceItem[];
  font?: string;
  textColor?: string;
  bgColor?: string;
  iconColor?: string;
  paddingTop?: number;
  paddingBottom?: number;
  gap?: number;
  padding?: number;
  ctaTitle?: string;
  ctaSubtitle?: string;
  ctaButton?: string;
  ctaButtonLink?: string;
  ctaLayout?: "center" | "left" | "right";
  ctaSpacingTop?: number;
  ctaSpacingBottom?: number;
  ctaSpacingGap?: number;
  ctaSpacingPadding?: number;
}

export interface ProfilePreview {
  fullName?: string;
  bio?: string | null;
  photoUrl?: string | null;
  username?: string;
}

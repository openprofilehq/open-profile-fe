import type { SavedLink } from "./LinkSidebar";

export interface Section {
  id: string;
  title: string;
  type: string;
  visible: boolean;
  fullName?: string;
  bio?: string;
  subtitle?: string;
  links?: SavedLink[];
  font?: string;
  textColor?: string;
  bgColor?: string;
  iconColor?: string;
  paddingTop?: number;
  paddingBottom?: number;
  gap?: number;
  padding?: number;
}

export interface ProfilePreview {
  fullName?: string;
  bio?: string | null;
  photoUrl?: string | null;
  username?: string;
}

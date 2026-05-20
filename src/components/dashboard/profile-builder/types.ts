import type { ProjectItem } from "@/api/profile/project.type";
import type { SavedLink } from "./LinkSidebar";

export interface Section {
  id: string;
  title: string;
  type: string;
  visible?: boolean;
  sectionTitle?: string;
  projects?: ProjectItem[];
  projectLayout?: "grid" | "wide" | "left" | "right";
  subtitle?: string;
  links?: SavedLink[];
  fullName?: string;
  bio?: string;
}

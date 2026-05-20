export type ProjectItem = {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string | null;
  projectUrl: string;
  isHighlight: boolean;
};

export type ProjectsSection = {
  id: string;
  title: string;
  type: "projects";
  sectionTitle: string;
  projects: ProjectItem[];
};
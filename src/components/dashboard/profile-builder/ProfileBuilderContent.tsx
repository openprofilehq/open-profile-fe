"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { dashboardProfileOption } from "@/api/profile/profile.options";
import BuilderHeader from "./BuilderHeader";
import LeftSidebar from "./LeftSidebar";
import PreviewCanvas from "./PreviewCanvas";
import RightPanel from "./RightPanel";
import ProjectsForm from "./ProjectsForm";
import ProjectDetailForm from "./ProjectDetailForm";
import type { ProjectItem } from "@/api/profile/project.type";
import { LayoutList, Eye, SlidersHorizontal } from "lucide-react";

interface Section {
  id: string;
  title: string;
  type: string;
  sectionTitle?: string;
  projects?: ProjectItem[];
  projectLayout?: "grid" | "wide" | "left" | "right";
}

type LeftPanelView =
  | { kind: "sidebar" }
  | { kind: "projects-list"; sectionId: string }
  | { kind: "project-detail"; sectionId: string; projectId: string };

type MobileTab = "left" | "preview" | "right";

export default function ProfileBuilderContent() {
  const dashboardProfile = useQuery(dashboardProfileOption());
  const profile = dashboardProfile.data;

  // Styles State
  const [font, setFont] = useState("Afacad");
  const [textColor, setTextColor] = useState("#050505");
  const [bgColor, setBgColor] = useState("#FFFFFF");
  const [iconColor, setIconColor] = useState("#087583");
  const [spacing, setSpacing] = useState(20);
  const [borderRadius, setBorderRadius] = useState<"sharp" | "medium" | "round">("medium");
  const [theme, setTheme] = useState<"light" | "dark">("light");

  // Sections State
  const [sections, setSections] = useState<Section[]>([
    { id: "1", title: "Bio - John Smith", type: "bio" },
  ]);

  // UI State
  const [activeTab, setActiveTab] = useState<"general" | "section">("general");
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>("1");
  const [leftPanel, setLeftPanel] = useState<LeftPanelView>({ kind: "sidebar" });
  const [projectsFormTab, setProjectsFormTab] = useState<"content" | "section">("content");
  const [mobileTab, setMobileTab] = useState<MobileTab>("preview");

  // ── Section handlers ──
  const handleSelectSection = (id: string) => {
    setSelectedSectionId(id);
    setActiveTab("section");
    const section = sections.find((s) => s.id === id);
    if (section?.type === "projects") {
      setLeftPanel({ kind: "projects-list", sectionId: id });
    } else {
      setLeftPanel({ kind: "sidebar" });
    }
  };

  const handleAddSection = (title: string, type: string) => {
    const newSection: Section = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      type,
      ...(type === "projects" && {
        sectionTitle: "Selected Projects",
        projects: [],
        projectLayout: "grid",
      }),
    };
    setSections([...sections, newSection]);
    setSelectedSectionId(newSection.id);
    setActiveTab("section");
    if (type === "projects") {
      setLeftPanel({ kind: "projects-list", sectionId: newSection.id });
    }
  };

  const handleRemoveSection = (id: string) => {
    const updated = sections.filter((s) => s.id !== id);
    setSections(updated);
    if (selectedSectionId === id) {
      setSelectedSectionId(updated[0]?.id || null);
    }
    setLeftPanel({ kind: "sidebar" });
  };

  const handleUpdateSection = (id: string, updates: Partial<Section>) => {
    setSections(sections.map((s) => (s.id === id ? { ...s, ...updates } : s)));
  };

  // ── Project handlers ──
  const getProjectsSection = (sectionId: string) =>
    sections.find((s) => s.id === sectionId);

  const handleAddProject = (sectionId: string) => {
    const newProject: ProjectItem = {
      id: crypto.randomUUID(),
      title: "",
      subtitle: "",
      imageUrl: null,
      projectUrl: "",
      isHighlight: false,
    };
    setSections(
      sections.map((s) =>
        s.id === sectionId
          ? { ...s, projects: [...(s.projects || []), newProject] }
          : s
      )
    );
    setLeftPanel({ kind: "project-detail", sectionId, projectId: newProject.id });
  };

  const handleUpdateProject = (
    sectionId: string,
    projectId: string,
    updates: Partial<ProjectItem>
  ) => {
    setSections(
      sections.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              projects: (s.projects || []).map((p) =>
                p.id === projectId ? { ...p, ...updates } : p
              ),
            }
          : s
      )
    );
  };

  const handleDeleteProject = (sectionId: string, projectId: string) => {
    setSections(
      sections.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              projects: (s.projects || []).filter((p) => p.id !== projectId),
            }
          : s
      )
    );
    setLeftPanel({ kind: "projects-list", sectionId });
  };

  const selectedSection = sections.find((s) => s.id === selectedSectionId) || null;

  // ── Resolve left panel content ──
  const renderLeftPanelContent = () => {
    if (leftPanel.kind === "projects-list") {
      const section = getProjectsSection(leftPanel.sectionId);
      return (
        <ProjectsForm
  sectionTitle={section?.sectionTitle || "Selected Projects"}
  projects={section?.projects || []}

  selectedLayout={
    (section?.projectLayout as
      | "grid"
      | "wide"
      | "left"
      | "right") || "grid"
  }

  onChangeLayout={(layout) =>
    handleUpdateSection(leftPanel.sectionId, {
      projectLayout: layout,
    })
  }

  onChangeSectionTitle={(val) =>
    handleUpdateSection(leftPanel.sectionId, {
      sectionTitle: val,
    })
  }

  onSelectProject={(projectId) =>
    setLeftPanel({
      kind: "project-detail",
      sectionId: leftPanel.sectionId,
      projectId,
    })
  }

  onAddProject={() =>
    handleAddProject(leftPanel.sectionId)
  }

  onBack={() =>
    setLeftPanel({ kind: "sidebar" })
  }

  activeTab={projectsFormTab}
  onChangeTab={setProjectsFormTab}
/>
      );
    }

    if (leftPanel.kind === "project-detail") {
      const section = getProjectsSection(leftPanel.sectionId);
      const project = (section?.projects || []).find(
        (p) => p.id === leftPanel.projectId
      );
      if (!project) return null;
      return (
        <ProjectDetailForm
          project={project}
          onUpdate={(updates) =>
            handleUpdateProject(leftPanel.sectionId, leftPanel.projectId, updates)
          }
          onDelete={() =>
            handleDeleteProject(leftPanel.sectionId, leftPanel.projectId)
          }
          onBack={() =>
            setLeftPanel({ kind: "projects-list", sectionId: leftPanel.sectionId })
          }
        />
      );
    }

    return (
      <LeftSidebar
        sections={sections}
        selectedSectionId={selectedSectionId}
        onSelectSection={handleSelectSection}
        onAddSection={handleAddSection}
        onRemoveSection={handleRemoveSection}
        profile={profile}
      />
    );
  };

  const mobileNavItems: { tab: MobileTab; icon: React.ReactNode; label: string }[] = [
    { tab: "left", icon: <LayoutList size={20} />, label: "Sections" },
    { tab: "preview", icon: <Eye size={20} />, label: "Preview" },
    { tab: "right", icon: <SlidersHorizontal size={20} />, label: "Style" },
  ];

  return (
    <div className="flex h-dvh w-full flex-col overflow-hidden bg-[#F6F7F9]">
      {/* ── Header ── */}
      <BuilderHeader />

      {/* ── Main Area ── */}
      <div className="relative flex min-h-0 flex-1 overflow-hidden">

        {/* ───────────────────────────────────────────
            DESKTOP (lg+): three columns side by side
        ─────────────────────────────────────────── */}
        <div className="hidden lg:flex lg:h-full lg:w-full lg:gap-2 lg:p-2 lg:px-4">
          {/* Left panel */}
          <aside className="border-tertiary-b flex h-full w-[290px] shrink-0 flex-col overflow-hidden rounded-xl border bg-white shadow-sm">
            {renderLeftPanelContent()}
          </aside>

          {/* Preview */}
          <div className="flex min-w-0 flex-1 overflow-y-auto rounded-xl">
            <PreviewCanvas
              font={font}
              textColor={textColor}
              bgColor={bgColor}
              iconColor={iconColor}
              spacing={spacing}
              borderRadius={borderRadius}
              theme={theme}
              sections={sections}
              profile={profile}
            />
          </div>

          {/* Right panel */}
          <aside className="border-tertiary-b flex h-full w-[290px] shrink-0 flex-col overflow-hidden rounded-xl border bg-white shadow-sm">
            <RightPanel
              font={font}
              onChangeFont={setFont}
              textColor={textColor}
              onChangeTextColor={setTextColor}
              bgColor={bgColor}
              onChangeBgColor={setBgColor}
              iconColor={iconColor}
              onChangeIconColor={setIconColor}
              spacing={spacing}
              onChangeSpacing={setSpacing}
              borderRadius={borderRadius}
              onChangeBorderRadius={setBorderRadius}
              theme={theme}
              onChangeTheme={setTheme}
              activeTab={activeTab}
              onChangeTab={setActiveTab}
              selectedSection={selectedSection}
              onUpdateSection={handleUpdateSection}
            />
          </aside>
        </div>

        {/* ───────────────────────────────────────────
            TABLET (md): left sidebar + preview only,
            right panel hidden (or add a drawer later)
        ─────────────────────────────────────────── */}
        <div className="hidden md:flex lg:hidden h-full w-full gap-2 p-2 px-4">
          {/* Left panel */}
          <aside className="border-tertiary-b flex h-full w-[260px] shrink-0 flex-col overflow-hidden rounded-xl border bg-white shadow-sm">
            {renderLeftPanelContent()}
          </aside>

          {/* Preview */}
          <div className="flex min-w-0 flex-1 overflow-y-auto rounded-xl">
            <PreviewCanvas
              font={font}
              textColor={textColor}
              bgColor={bgColor}
              iconColor={iconColor}
              spacing={spacing}
              borderRadius={borderRadius}
              theme={theme}
              sections={sections}
              profile={profile}
            />
          </div>
        </div>

        {/* ───────────────────────────────────────────
            MOBILE (<md): one panel at a time,
            switched by bottom tab bar
        ─────────────────────────────────────────── */}
        <div className="flex h-full w-full flex-col md:hidden">
          {/* Panel area */}
          <div className="min-h-0 flex-1 overflow-hidden">
            {mobileTab === "left" && (
              <div className="h-full overflow-y-auto bg-white">
                {renderLeftPanelContent()}
              </div>
            )}
            {mobileTab === "preview" && (
              <div className="h-full overflow-y-auto p-3">
                <PreviewCanvas
                  font={font}
                  textColor={textColor}
                  bgColor={bgColor}
                  iconColor={iconColor}
                  spacing={spacing}
                  borderRadius={borderRadius}
                  theme={theme}
                  sections={sections}
                  profile={profile}
                />
              </div>
            )}
            {mobileTab === "right" && (
              <div className="h-full overflow-y-auto bg-white">
                <RightPanel
                  font={font}
                  onChangeFont={setFont}
                  textColor={textColor}
                  onChangeTextColor={setTextColor}
                  bgColor={bgColor}
                  onChangeBgColor={setBgColor}
                  iconColor={iconColor}
                  onChangeIconColor={setIconColor}
                  spacing={spacing}
                  onChangeSpacing={setSpacing}
                  borderRadius={borderRadius}
                  onChangeBorderRadius={setBorderRadius}
                  theme={theme}
                  onChangeTheme={setTheme}
                  activeTab={activeTab}
                  onChangeTab={setActiveTab}
                  selectedSection={selectedSection}
                  onUpdateSection={handleUpdateSection}
                />
              </div>
            )}
          </div>

          {/* Mobile bottom tab bar */}
          <nav className="border-tertiary-b shrink-0 border-t bg-white">
            <div className="flex">
              {mobileNavItems.map(({ tab, icon, label }) => (
                <button
                  key={tab}
                  onClick={() => setMobileTab(tab)}
                  className={`flex flex-1 flex-col items-center gap-1 py-3 text-xs font-semibold transition-colors ${
                    mobileTab === tab
                      ? "text-[#087583]"
                      : "text-[#888] hover:text-[#333]"
                  }`}
                >
                  {icon}
                  {label}
                </button>
              ))}
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
}
"use client";

import type { FC } from "react";
import { ChevronLeft, GripVertical, Plus, ChevronRight } from "lucide-react";
import type { ProjectItem } from "@/api/profile/project.type";

type LayoutId = "grid" | "wide" | "left" | "right";

interface ProjectsFormProps {
  sectionTitle: string;
  projects: ProjectItem[];
  selectedLayout: LayoutId;
  onChangeLayout: (layout: LayoutId) => void;
  onChangeSectionTitle: (val: string) => void;
  onSelectProject: (id: string) => void;
  onAddProject: () => void;
  onBack: () => void;
  activeTab: "content" | "section";
  onChangeTab: (tab: "content" | "section") => void;
}

/* ---------- Layout SVG previews ---------- */

function LayoutGrid() {
  return (
    <svg viewBox="0 0 88 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
      <rect x="4" y="4" width="37" height="24" rx="3" fill="#1a1a1a" />
      <rect x="47" y="4" width="37" height="24" rx="3" fill="#1a1a1a" />
      <rect x="4" y="32" width="37" height="24" rx="3" fill="#1a1a1a" />
      <rect x="47" y="32" width="37" height="24" rx="3" fill="#1a1a1a" />
      <rect x="4" y="29" width="37" height="3" rx="1" fill="#bbb" />
      <rect x="47" y="29" width="37" height="3" rx="1" fill="#bbb" />
      <rect x="4" y="57" width="37" height="3" rx="1" fill="#bbb" />
      <rect x="47" y="57" width="37" height="3" rx="1" fill="#bbb" />
    </svg>
  );
}

function LayoutSingleWide() {
  return (
    <svg viewBox="0 0 88 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
      <rect x="4" y="4" width="80" height="36" rx="3" fill="#D4D4D8" />
      <rect x="4" y="44" width="50" height="5" rx="2" fill="#1a1a1a" />
      <rect x="4" y="53" width="35" height="4" rx="2" fill="#D4D4D8" />
    </svg>
  );
}

function LayoutImageLeft() {
  return (
    <svg viewBox="0 0 88 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
      <rect x="4" y="6" width="28" height="48" rx="3" fill="#D4D4D8" />
      <rect x="38" y="10" width="46" height="6" rx="2" fill="#1a1a1a" />
      <rect x="38" y="21" width="46" height="4" rx="2" fill="#D4D4D8" />
      <rect x="38" y="29" width="38" height="4" rx="2" fill="#D4D4D8" />
      <rect x="38" y="37" width="30" height="4" rx="2" fill="#D4D4D8" />
    </svg>
  );
}

function LayoutImageRight() {
  return (
    <svg viewBox="0 0 88 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
      <rect x="56" y="6" width="28" height="48" rx="3" fill="#D4D4D8" />
      <rect x="4" y="10" width="46" height="6" rx="2" fill="#1a1a1a" />
      <rect x="4" y="21" width="46" height="4" rx="2" fill="#D4D4D8" />
      <rect x="4" y="29" width="38" height="4" rx="2" fill="#D4D4D8" />
      <rect x="4" y="37" width="30" height="4" rx="2" fill="#D4D4D8" />
    </svg>
  );
}

const LAYOUTS: { id: LayoutId; Component: FC }[] = [
  { id: "grid", Component: LayoutGrid },
  { id: "wide", Component: LayoutSingleWide },
  { id: "left", Component: LayoutImageLeft },
  { id: "right", Component: LayoutImageRight },
];

const MAX_PROJECTS = 20;

export default function ProjectsForm({
  sectionTitle,
  projects,
  selectedLayout,
  onChangeLayout,
  onChangeSectionTitle,
  onSelectProject,
  onAddProject,
  onBack,
  activeTab,
  onChangeTab,
}: ProjectsFormProps) {
  const highlightedCount = projects.filter((p) => p.isHighlight).length;

  return (
    <div className="flex h-full flex-col">

      {/* Header */}
      <div className="mb-4 shrink-0 px-6 pt-6">
        <button
          onClick={onBack}
          className="text-primary-text hover:text-link-hover-text inline-flex items-center gap-2 text-base font-semibold transition-all"
        >
          <ChevronLeft size={20} />
          <span>Portfolio</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="border-tertiary-b mb-4 flex shrink-0 border-b px-6">
        {(["content", "section"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => onChangeTab(tab)}
            className={`mr-6 pb-3 text-sm font-semibold capitalize transition-all ${
              activeTab === tab
                ? "border-b-2 border-brand-b text-link-hover-text"
                : "text-tertiary-text hover:text-primary-text"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-6">

        {activeTab === "content" && (
          <div className="flex flex-col gap-5">

            {/* Layout Picker */}
            <div>
              <p className="text-primary-text mb-3 text-xs font-bold uppercase tracking-wide">
                Layout
              </p>
              <div className="grid grid-cols-2 gap-3">
                {LAYOUTS.map(({ id, Component }) => {
                  const isActive = selectedLayout === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => onChangeLayout(id)}
                      className={`flex h-[72px] items-center justify-center overflow-hidden rounded-[12px] border p-3 transition-all duration-150 ${
                        isActive
                          ? "border-brand-b bg-brand-light-subtle-bg"
                          : "border-tertiary-b bg-secondary-bg hover:border-brand-subtle-b hover:bg-white"
                      }`}
                    >
                      <Component />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Section title */}
            <div>
              <label className="text-primary-text mb-1.5 block text-sm font-semibold">
                Title
              </label>
              <input
                type="text"
                value={sectionTitle}
                onChange={(e) => onChangeSectionTitle(e.target.value.slice(0, 80))}
                maxLength={80}
                placeholder="Selected Projects"
                className="border-tertiary-b text-primary-text placeholder-tertiary-text focus:border-brand-b focus:ring-brand-b w-full rounded-[10px] border bg-white px-3 py-2.5 text-sm outline-none focus:ring-1"
              />
            </div>

            {/* Projects list */}
            <div>
              <div className="mb-3 flex items-center justify-between">
                <span className="text-primary-text text-sm font-bold">Projects</span>
                {highlightedCount > 0 && (
                  <span className="text-tertiary-text text-xs">
                    {highlightedCount} Highlight{highlightedCount === 1 ? "" : "s"}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-2">
                {projects.map((project) => (
                  <button
                    key={project.id}
                    onClick={() => onSelectProject(project.id)}
                    className="border-tertiary-b hover:border-brand-subtle-b group flex w-full items-center justify-between rounded-[10px] border bg-white px-3 py-3 text-left transition-all"
                  >
                    <span className="text-primary-text flex-1 truncate text-sm font-medium">
                      {project.title || "Untitled Project"}
                    </span>
                    <div className="flex items-center gap-2">
                      <ChevronRight size={14} className="text-disabled-text" />
                      <GripVertical size={16} className="text-tertiary-b" />
                    </div>
                  </button>
                ))}

                {projects.length < MAX_PROJECTS && (
                  <button
                    onClick={onAddProject}
                    className="border-tertiary-b hover:border-brand-subtle-b flex w-full items-center justify-between rounded-[10px] border border-dashed bg-white px-3 py-3 text-left transition-all"
                  >
                    <span className="text-link-hover-text text-sm font-medium">
                      Add Project
                    </span>
                    <Plus size={16} className="text-link-hover-text" />
                  </button>
                )}
              </div>
            </div>

          </div>
        )}

        {activeTab === "section" && (
          <div className="pt-1">
            <p className="text-disabled-text text-xs">
              Section styling options will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
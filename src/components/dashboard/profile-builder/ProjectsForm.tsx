"use client";

import type { FC } from "react";
import { ChevronLeft, GripVertical, Plus, ChevronRight } from "lucide-react";
import type { ProjectItem } from "@/api/profile/project.type";

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

/* ---------- Layout previews ---------- */

function LayoutGrid() {
  return (
    <svg
      viewBox="0 0 88 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-full w-full"
    >
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
    <svg
      viewBox="0 0 88 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-full w-full"
    >
      <rect x="4" y="4" width="80" height="36" rx="3" fill="#D4D4D8" />
      <rect x="4" y="44" width="50" height="5" rx="2" fill="#1a1a1a" />
      <rect x="4" y="53" width="35" height="4" rx="2" fill="#D4D4D8" />
    </svg>
  );
}

function LayoutImageLeft() {
  return (
    <svg
      viewBox="0 0 88 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-full w-full"
    >
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
    <svg
      viewBox="0 0 88 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-full w-full"
    >
      <rect x="56" y="6" width="28" height="48" rx="3" fill="#D4D4D8" />
      <rect x="4" y="10" width="46" height="6" rx="2" fill="#1a1a1a" />
      <rect x="4" y="21" width="46" height="4" rx="2" fill="#D4D4D8" />
      <rect x="4" y="29" width="38" height="4" rx="2" fill="#D4D4D8" />
      <rect x="4" y="37" width="30" height="4" rx="2" fill="#D4D4D8" />
    </svg>
  );
}

type LayoutId = "grid" | "wide" | "left" | "right";

const LAYOUTS: { id: LayoutId; Component: FC }[] = [
  { id: "grid", Component: LayoutGrid },
  { id: "wide", Component: LayoutSingleWide },
  { id: "left", Component: LayoutImageLeft },
  { id: "right", Component: LayoutImageRight },
];

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
  const MAX_PROJECTS = 20;
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
                ? "border-b-2 border-[#087583] text-[#087583]"
                : "text-[#888] hover:text-[#333]"
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
                          ? "border-[#087583] bg-[#F0FAFA]"
                          : "border-[#E4E4E7] bg-[#F4F4F5] hover:border-[#087583]/40 hover:bg-white"
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
              <label className="mb-1.5 block text-sm font-semibold">
                Title
              </label>

              <input
                type="text"
                value={sectionTitle}
                onChange={(e) =>
                  onChangeSectionTitle(e.target.value.slice(0, 80))
                }
                maxLength={80}
                placeholder="Selected Projects"
                className="w-full rounded-[10px] border px-3 py-2.5 text-sm outline-none"
              />
            </div>

            {/* Projects */}
            <div>
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-bold">Projects</span>

                {highlightedCount > 0 && (
                  <span className="text-xs text-[#888]">
                    {highlightedCount}/3 Highlighted
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-2">
                {projects.map((project) => (
                  <button
                    key={project.id}
                    onClick={() => onSelectProject(project.id)}
                    className="group flex w-full items-center justify-between rounded-[10px] border bg-white px-3 py-3 text-left transition-all hover:border-[#087583]/40"
                  >
                    <span className="flex-1 truncate text-sm font-medium">
                      {project.title || "Untitled Project"}
                    </span>

                    <div className="flex items-center gap-2">
                      <ChevronRight size={14} className="text-[#aaa]" />
                      <GripVertical size={16} className="text-[#ccc]" />
                    </div>
                  </button>
                ))}

                {projects.length < MAX_PROJECTS && (
                  <button
                    onClick={onAddProject}
                    className="flex w-full items-center justify-between rounded-[10px] border border-dashed bg-white px-3 py-3 text-left transition-all hover:border-[#087583]/40"
                  >
                    <span className="text-sm font-medium text-[#087583]">
                      Add Project
                    </span>

                    <Plus
                      size={16}
                      className="text-[#087583]"
                    />
                  </button>
                )}
              </div>
            </div>

          </div>
        )}

        {activeTab === "section" && (
          <div className="pt-1">
            <p className="text-xs text-[#aaa]">
              Section styling options will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
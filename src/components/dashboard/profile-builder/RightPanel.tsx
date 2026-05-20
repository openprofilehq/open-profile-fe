"use client";

import { Sun, Moon, Sliders, Type, Palette } from "lucide-react";

interface Section {
  id: string;
  title: string;
  type: string;
}

interface RightPanelProps {
  font: string;
  onChangeFont: (font: string) => void;
  textColor: string;
  onChangeTextColor: (color: string) => void;
  bgColor: string;
  onChangeBgColor: (color: string) => void;
  iconColor: string;
  onChangeIconColor: (color: string) => void;
  spacing: number;
  onChangeSpacing: (spacing: number) => void;
  theme: "light" | "dark";
  onChangeTheme: (theme: "light" | "dark") => void;

  // Tab & Section Management
  activeTab: "general" | "section";
  onChangeTab: (tab: "general" | "section") => void;
  selectedSection: Section | null;
  onUpdateSection: (id: string, updates: Partial<Section>) => void;
}

export default function RightPanel({
  font,
  onChangeFont,
  textColor,
  onChangeTextColor,
  bgColor,
  onChangeBgColor,
  iconColor,
  onChangeIconColor,
  spacing,
  onChangeSpacing,
  theme,
  onChangeTheme,
  activeTab,
  onChangeTab,
  selectedSection,
  onUpdateSection,
}: RightPanelProps) {
  return (
    <aside className="border-tertiary-b bg-card flex h-full w-[360px] shrink-0 flex-col border-l select-none">
      {/* Tabs Header */}
      <div className="border-tertiary-b flex border-b p-2">
        <button
          onClick={() => onChangeTab("general")}
          className={`relative flex-1 py-3 text-center text-sm font-bold transition-all ${
            activeTab === "general"
              ? "text-link-hover-text"
              : "text-tertiary-text hover:text-primary-text"
          }`}
        >
          General
          {activeTab === "general" && (
            <span className="bg-link-hover-text absolute bottom-0 left-0 h-[2px] w-full transition-all" />
          )}
        </button>
        <button
          onClick={() => onChangeTab("section")}
          className={`relative flex-1 py-3 text-center text-sm font-bold transition-all ${
            activeTab === "section"
              ? "text-link-hover-text"
              : "text-tertiary-text hover:text-primary-text"
          }`}
        >
          Section
          {activeTab === "section" && (
            <span className="bg-link-hover-text absolute bottom-0 left-0 h-[2px] w-full transition-all" />
          )}
        </button>
      </div>

      {/* Settings Body */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === "general" ? (
          <div className="flex flex-col gap-6">
            {/* Font Selection */}
            <div>
              <label className="text-tertiary-text mb-2 flex items-center gap-2 text-xs font-bold tracking-wider uppercase">
                <Type size={14} />
                Font
              </label>
              <select
                value={font}
                onChange={(e) => onChangeFont(e.target.value)}
                className="border-tertiary-b bg-primary-bg text-primary-text focus:border-brand-b w-full rounded-[10px] border px-4 py-3 text-sm font-semibold transition-all outline-none"
              >
                <option value="Afacad">Afacad</option>
                <option value="Inter">Inter Sans</option>
                <option value="Serif">Playfair Serif</option>
                <option value="Mono">Roboto Mono</option>
              </select>
            </div>

            {/* Colors Selection */}
            <div>
              <label className="text-tertiary-text mb-3 flex items-center gap-2 text-xs font-bold tracking-wider uppercase">
                <Palette size={14} />
                Colors
              </label>

              <div className="border-tertiary-b bg-primary-bg flex flex-col gap-3 rounded-[12px] border p-4">
                {/* Text Color */}
                <div className="flex items-center justify-between">
                  <span className="text-tertiary-text text-xs font-semibold">
                    Text
                  </span>
                  <div className="border-tertiary-b flex items-center gap-2 rounded-lg border bg-white px-2.5 py-1.5 shadow-sm">
                    <input
                      type="color"
                      value={textColor}
                      onChange={(e) => onChangeTextColor(e.target.value)}
                      className="h-5 w-5 cursor-pointer rounded border-0 p-0 outline-none"
                    />
                    <input
                      type="text"
                      value={textColor.toUpperCase()}
                      onChange={(e) => onChangeTextColor(e.target.value)}
                      className="text-primary-text w-16 border-0 p-0 text-center text-xs font-bold uppercase outline-none"
                    />
                  </div>
                </div>

                {/* Background Color */}
                <div className="flex items-center justify-between">
                  <span className="text-tertiary-text text-xs font-semibold">
                    Bg
                  </span>
                  <div className="border-tertiary-b flex items-center gap-2 rounded-lg border bg-white px-2.5 py-1.5 shadow-sm">
                    <input
                      type="color"
                      value={bgColor}
                      onChange={(e) => onChangeBgColor(e.target.value)}
                      className="h-5 w-5 cursor-pointer rounded border-0 p-0 outline-none"
                    />
                    <input
                      type="text"
                      value={bgColor.toUpperCase()}
                      onChange={(e) => onChangeBgColor(e.target.value)}
                      className="text-primary-text w-16 border-0 p-0 text-center text-xs font-bold uppercase outline-none"
                    />
                  </div>
                </div>

                {/* Icon Color */}
                <div className="flex items-center justify-between">
                  <span className="text-tertiary-text text-xs font-semibold">
                    Icon
                  </span>
                  <div className="border-tertiary-b flex items-center gap-2 rounded-lg border bg-white px-2.5 py-1.5 shadow-sm">
                    <input
                      type="color"
                      value={iconColor}
                      onChange={(e) => onChangeIconColor(e.target.value)}
                      className="h-5 w-5 cursor-pointer rounded border-0 p-0 outline-none"
                    />
                    <input
                      type="text"
                      value={iconColor.toUpperCase()}
                      onChange={(e) => onChangeIconColor(e.target.value)}
                      className="text-primary-text w-16 border-0 p-0 text-center text-xs font-bold uppercase outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Spacing Slider */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-tertiary-text flex items-center gap-2 text-xs font-bold tracking-wider uppercase">
                  <Sliders size={14} />
                  Spacing
                </label>
                <span className="bg-hover-bg text-primary-text rounded px-2 py-0.5 text-xs font-bold">
                  {spacing}px
                </span>
              </div>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="0"
                  max="48"
                  value={spacing}
                  onChange={(e) => onChangeSpacing(Number(e.target.value))}
                  className="bg-active-bg accent-link-hover-text h-1.5 flex-1 cursor-pointer appearance-none rounded-lg"
                />
              </div>
            </div>

            {/* Theme Selector */}
            <div>
              <label className="text-tertiary-text mb-3 block text-xs font-bold tracking-wider uppercase">
                Theme
              </label>
              <div className="border-tertiary-b bg-primary-bg flex rounded-xl border p-1.5">
                <button
                  onClick={() => onChangeTheme("light")}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-bold transition-all ${
                    theme === "light"
                      ? "text-link-hover-text bg-white shadow-sm"
                      : "text-tertiary-text hover:text-primary-text"
                  }`}
                >
                  <Sun size={14} />
                  Light
                </button>
                <button
                  onClick={() => onChangeTheme("dark")}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-bold transition-all ${
                    theme === "dark"
                      ? "text-link-hover-text bg-white shadow-sm"
                      : "text-tertiary-text hover:text-primary-text"
                  }`}
                >
                  <Moon size={14} />
                  Dark
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex h-full flex-col gap-6">
            {selectedSection ? (
              <div className="flex flex-col gap-6">
                <div>
                  <h3 className="text-primary-text text-base font-bold">
                    Edit Section
                  </h3>
                  <p className="text-tertiary-text text-xs">
                    Customize specific details for this component.
                  </p>
                </div>

                {/* Section Title */}
                <div>
                  <label className="text-tertiary-text mb-2 block text-xs font-bold tracking-wider uppercase">
                    Section Title
                  </label>
                  <input
                    type="text"
                    value={selectedSection.title}
                    onChange={(e) =>
                      onUpdateSection(selectedSection.id, {
                        title: e.target.value,
                      })
                    }
                    className="border-tertiary-b bg-primary-bg text-primary-text focus:border-brand-b w-full rounded-[10px] border px-4 py-3 text-sm font-semibold transition-all outline-none"
                  />
                </div>

                {/* Section Type Selector */}
                <div>
                  <label className="text-tertiary-text mb-2 block text-xs font-bold tracking-wider uppercase">
                    Component Type
                  </label>
                  <select
                    value={selectedSection.type}
                    onChange={(e) =>
                      onUpdateSection(selectedSection.id, {
                        type: e.target.value,
                      })
                    }
                    className="border-tertiary-b bg-primary-bg text-primary-text focus:border-brand-b w-full rounded-[10px] border px-4 py-3 text-sm font-semibold transition-all outline-none"
                  >
                    <option value="bio">Bio / Header</option>
                    <option value="projects">Projects Showcase</option>
                    <option value="links">Social Link Grid</option>
                    <option value="experience">Timeline / Experience</option>
                  </select>
                </div>

                <div className="border-secondary-b mt-4 rounded-xl border border-dashed p-6 text-center">
                  <p className="text-tertiary-text text-xs font-semibold">
                    Additional dynamic items editor will display here based on
                    chosen component.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex h-[300px] flex-col items-center justify-center px-4 text-center">
                <Sliders size={32} className="text-disabled-text mb-3" />
                <p className="text-primary-text text-sm font-semibold">
                  No section selected
                </p>
                <p className="text-tertiary-text mt-1 max-w-[200px] text-xs">
                  Select a section from the left sidebar to customize its items
                  and content.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}

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
  borderRadius: "sharp" | "medium" | "round";
  onChangeBorderRadius: (radius: "sharp" | "medium" | "round") => void;
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
  borderRadius,
  onChangeBorderRadius,
  theme,
  onChangeTheme,
  activeTab,
  onChangeTab,
  selectedSection,
  onUpdateSection,
}: RightPanelProps) {
  return (
    <aside className="flex h-full w-[360px] shrink-0 flex-col border-l border-[#EDEDED] bg-white select-none">
      {/* Tabs Header */}
      <div className="flex border-b border-[#EDEDED] p-2">
        <button
          onClick={() => onChangeTab("general")}
          className={`relative flex-1 py-3 text-center text-sm font-bold transition-all ${
            activeTab === "general"
              ? "text-[#087583]"
              : "text-[#747474] hover:text-[#050505]"
          }`}
        >
          General
          {activeTab === "general" && (
            <span className="absolute bottom-0 left-0 h-[2px] w-full bg-[#087583] transition-all" />
          )}
        </button>
        <button
          onClick={() => onChangeTab("section")}
          className={`relative flex-1 py-3 text-center text-sm font-bold transition-all ${
            activeTab === "section"
              ? "text-[#087583]"
              : "text-[#747474] hover:text-[#050505]"
          }`}
        >
          Section
          {activeTab === "section" && (
            <span className="absolute bottom-0 left-0 h-[2px] w-full bg-[#087583] transition-all" />
          )}
        </button>
      </div>

      {/* Settings Body */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === "general" ? (
          <div className="flex flex-col gap-6">
            {/* Font Selection */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-xs font-bold tracking-wider text-[#747474] uppercase">
                <Type size={14} />
                Font
              </label>
              <select
                value={font}
                onChange={(e) => onChangeFont(e.target.value)}
                className="w-full rounded-[10px] border border-[#EDEDED] bg-[#FAFAFA] px-4 py-3 text-sm font-semibold text-[#050505] transition-all outline-none focus:border-[#087583]"
              >
                <option value="Afacad">Afacad</option>
                <option value="Inter">Inter Sans</option>
                <option value="Serif">Playfair Serif</option>
                <option value="Mono">Roboto Mono</option>
              </select>
            </div>

            {/* Colors Selection */}
            <div>
              <label className="mb-3 flex items-center gap-2 text-xs font-bold tracking-wider text-[#747474] uppercase">
                <Palette size={14} />
                Colors
              </label>

              <div className="flex flex-col gap-3 rounded-[12px] border border-[#EDEDED] bg-[#FAFAFA] p-4">
                {/* Text Color */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#747474]">
                    Text
                  </span>
                  <div className="flex items-center gap-2 rounded-lg border border-[#EDEDED] bg-white px-2.5 py-1.5 shadow-sm">
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
                      className="w-16 border-0 p-0 text-center text-xs font-bold text-[#050505] uppercase outline-none"
                    />
                  </div>
                </div>

                {/* Background Color */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#747474]">
                    Bg
                  </span>
                  <div className="flex items-center gap-2 rounded-lg border border-[#EDEDED] bg-white px-2.5 py-1.5 shadow-sm">
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
                      className="w-16 border-0 p-0 text-center text-xs font-bold text-[#050505] uppercase outline-none"
                    />
                  </div>
                </div>

                {/* Icon Color */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#747474]">
                    Icon
                  </span>
                  <div className="flex items-center gap-2 rounded-lg border border-[#EDEDED] bg-white px-2.5 py-1.5 shadow-sm">
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
                      className="w-16 border-0 p-0 text-center text-xs font-bold text-[#050505] uppercase outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Spacing Slider */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs font-bold tracking-wider text-[#747474] uppercase">
                  <Sliders size={14} />
                  Spacing
                </label>
                <span className="rounded bg-gray-100 px-2 py-0.5 text-xs font-bold text-[#050505]">
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
                  className="h-1.5 flex-1 cursor-pointer appearance-none rounded-lg bg-[#EDEDED] accent-[#087583]"
                />
              </div>
            </div>

            {/* Border Radius Selectors */}
            <div>
              <label className="mb-3 block text-xs font-bold tracking-wider text-[#747474] uppercase">
                Border Radius
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(
                  [
                    { value: "sharp", label: "Sharp", style: "rounded-none" },
                    { value: "medium", label: "Medium", style: "rounded-md" },
                    { value: "round", label: "Round", style: "rounded-full" },
                  ] as const
                ).map((item) => (
                  <button
                    key={item.value}
                    onClick={() => onChangeBorderRadius(item.value)}
                    className={`flex flex-col items-center gap-2 rounded-xl border p-3 transition-all ${
                      borderRadius === item.value
                        ? "border-[#087583] bg-[#F1FDFE]"
                        : "border-[#EDEDED] bg-[#FAFAFA] hover:bg-white"
                    }`}
                  >
                    <span
                      className={`h-6 w-6 border-2 border-current ${item.style} ${
                        borderRadius === item.value
                          ? "text-[#087583]"
                          : "text-gray-400"
                      }`}
                    />
                    <span className="text-xs font-semibold">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Theme Selector */}
            <div>
              <label className="mb-3 block text-xs font-bold tracking-wider text-[#747474] uppercase">
                Theme
              </label>
              <div className="flex rounded-xl border border-[#EDEDED] bg-[#FAFAFA] p-1.5">
                <button
                  onClick={() => onChangeTheme("light")}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-bold transition-all ${
                    theme === "light"
                      ? "bg-white text-[#087583] shadow-sm"
                      : "text-[#747474] hover:text-[#050505]"
                  }`}
                >
                  <Sun size={14} />
                  Light
                </button>
                <button
                  onClick={() => onChangeTheme("dark")}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-bold transition-all ${
                    theme === "dark"
                      ? "bg-white text-[#087583] shadow-sm"
                      : "text-[#747474] hover:text-[#050505]"
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
                  <h3 className="text-base font-bold text-[#050505]">
                    Edit Section
                  </h3>
                  <p className="text-xs text-[#747474]">
                    Customize specific details for this component.
                  </p>
                </div>

                {/* Section Title */}
                <div>
                  <label className="mb-2 block text-xs font-bold tracking-wider text-[#747474] uppercase">
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
                    className="w-full rounded-[10px] border border-[#EDEDED] bg-[#FAFAFA] px-4 py-3 text-sm font-semibold text-[#050505] transition-all outline-none focus:border-[#087583]"
                  />
                </div>

                {/* Section Type Selector */}
                <div>
                  <label className="mb-2 block text-xs font-bold tracking-wider text-[#747474] uppercase">
                    Component Type
                  </label>
                  <select
                    value={selectedSection.type}
                    onChange={(e) =>
                      onUpdateSection(selectedSection.id, {
                        type: e.target.value,
                      })
                    }
                    className="w-full rounded-[10px] border border-[#EDEDED] bg-[#FAFAFA] px-4 py-3 text-sm font-semibold text-[#050505] transition-all outline-none focus:border-[#087583]"
                  >
                    <option value="bio">Bio / Header</option>
                    <option value="projects">Projects Showcase</option>
                    <option value="links">Social Link Grid</option>
                    <option value="experience">Timeline / Experience</option>
                  </select>
                </div>

                <div className="mt-4 rounded-xl border border-dashed border-gray-300 p-6 text-center">
                  <p className="text-xs font-semibold text-[#747474]">
                    Additional dynamic items editor will display here based on
                    chosen component.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex h-[300px] flex-col items-center justify-center px-4 text-center">
                <Sliders size={32} className="mb-3 text-[#A2A2A2]" />
                <p className="text-sm font-semibold text-[#050505]">
                  No section selected
                </p>
                <p className="mt-1 max-w-[200px] text-xs text-[#747474]">
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

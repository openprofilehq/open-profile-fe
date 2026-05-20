"use client";

import { Sun, Moon, Type, ChevronDown } from "lucide-react";
import CtaRightPanel from "../cta/CtaRightPanel";

interface Section {
  id: string;
  title: string;
  type: string;
  ctaSpacingTop?: number;
  ctaSpacingBottom?: number;
  ctaSpacingGap?: number;
  ctaSpacingPadding?: number;
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
  const isValidHex = (color: string) => /^#[0-9A-F]{6}$/i.test(color);

  return (
    <aside className="border-tertiary-b animate-in fade-in flex h-full w-[290px] shrink-0 flex-col overflow-hidden border bg-white shadow-sm duration-200 select-none">
      {/* Tabs Header */}
      <div className="border-tertiary-b flex border-b">
        <button
          onClick={() => onChangeTab("general")}
          className={`relative flex-1 py-4 text-center text-sm font-bold transition-all ${
            activeTab === "general"
              ? "text-primary-text"
              : "text-tertiary-text hover:text-primary-text"
          }`}
        >
          General
          {activeTab === "general" && (
            <span className="bg-primary-text absolute bottom-0 left-0 h-[2.5px] w-full transition-all" />
          )}
        </button>
        <button
          onClick={() => onChangeTab("section")}
          className={`relative flex-1 py-4 text-center text-sm font-bold transition-all ${
            activeTab === "section"
              ? "text-primary-text"
              : "text-tertiary-text hover:text-primary-text"
          }`}
        >
          Section
          {activeTab === "section" && (
            <span className="bg-primary-text absolute bottom-0 left-0 h-[2.5px] w-full transition-all" />
          )}
        </button>
      </div>

      {/* Settings Body */}
      <div className="no-scrollbar flex-1 overflow-y-auto p-6">
        {activeTab === "general" ? (
          <div className="flex flex-col gap-6">
            {/* Font Selection */}
            <div>
              <label className="text-primary-text mb-2 block text-xs font-bold tracking-wider uppercase">
                Font
              </label>
              <div className="relative w-full">
                <select
                  value={font}
                  onChange={(e) => onChangeFont(e.target.value)}
                  className="border-tertiary-b text-primary-text focus:border-brand-b w-full cursor-pointer appearance-none rounded-[12px] border bg-white py-3.5 pr-10 pl-4 text-sm font-semibold transition-all outline-none"
                >
                  <option value="Afacad">Afacad</option>
                  <option value="Inter">Inter Sans</option>
                  <option value="Serif">Playfair Serif</option>
                  <option value="Mono">Roboto Mono</option>
                </select>
                <div className="text-primary-text pointer-events-none absolute inset-y-0 right-3.5 flex items-center">
                  <ChevronDown size={18} />
                </div>
              </div>
            </div>

            {/* Colors Selection */}
            <div>
              <label className="text-primary-text mb-3 block text-xs font-bold tracking-wider uppercase">
                Colors
              </label>

              <div className="border-tertiary-b flex flex-col gap-3 rounded-[16px] border bg-white p-4">
                {/* Text Color */}
                <div className="flex items-center justify-between">
                  <span className="text-tertiary-text text-sm font-semibold">
                    Text
                  </span>
                  <label className="border-tertiary-b bg-hover-bg hover:bg-active-bg relative flex max-w-[145px] flex-1 cursor-pointer items-center gap-2 rounded-[12px] border p-1.5 transition-colors">
                    <div
                      style={{
                        backgroundColor: isValidHex(textColor)
                          ? textColor
                          : "#050505",
                      }}
                      className="relative h-8 w-8 shrink-0 overflow-hidden rounded-[8px] border border-black/10 shadow-sm"
                    >
                      <input
                        type="color"
                        value={isValidHex(textColor) ? textColor : "#050505"}
                        onChange={(e) => onChangeTextColor(e.target.value)}
                        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                      />
                    </div>
                    <input
                      type="text"
                      value={textColor.toUpperCase()}
                      onChange={(e) => onChangeTextColor(e.target.value)}
                      className="text-primary-text w-16 border-0 bg-transparent p-0 text-sm font-bold uppercase outline-none focus:ring-0"
                    />
                  </label>
                </div>

                {/* Background Color */}
                <div className="flex items-center justify-between">
                  <span className="text-tertiary-text text-sm font-semibold">
                    Bg
                  </span>
                  <label className="border-tertiary-b bg-hover-bg hover:bg-active-bg relative flex max-w-[145px] flex-1 cursor-pointer items-center gap-2 rounded-[12px] border p-1.5 transition-colors">
                    <div
                      style={{
                        backgroundColor: isValidHex(bgColor)
                          ? bgColor
                          : "#FFFFFF",
                      }}
                      className="relative h-8 w-8 shrink-0 overflow-hidden rounded-[8px] border border-black/10 shadow-sm"
                    >
                      <input
                        type="color"
                        value={isValidHex(bgColor) ? bgColor : "#FFFFFF"}
                        onChange={(e) => onChangeBgColor(e.target.value)}
                        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                      />
                    </div>
                    <input
                      type="text"
                      value={bgColor.toUpperCase()}
                      onChange={(e) => onChangeBgColor(e.target.value)}
                      className="text-primary-text w-16 border-0 bg-transparent p-0 text-sm font-bold uppercase outline-none focus:ring-0"
                    />
                  </label>
                </div>

                {/* Icon Color */}
                <div className="flex items-center justify-between">
                  <span className="text-tertiary-text text-sm font-semibold">
                    Icon
                  </span>
                  <label className="border-tertiary-b bg-hover-bg hover:bg-active-bg relative flex max-w-[145px] flex-1 cursor-pointer items-center gap-2 rounded-[12px] border p-1.5 transition-colors">
                    <div
                      style={{
                        backgroundColor: isValidHex(iconColor)
                          ? iconColor
                          : "#087583",
                      }}
                      className="relative h-8 w-8 shrink-0 overflow-hidden rounded-[8px] border border-black/10 shadow-sm"
                    >
                      <input
                        type="color"
                        value={isValidHex(iconColor) ? iconColor : "#087583"}
                        onChange={(e) => onChangeIconColor(e.target.value)}
                        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                      />
                    </div>
                    <input
                      type="text"
                      value={iconColor.toUpperCase()}
                      onChange={(e) => onChangeIconColor(e.target.value)}
                      className="text-primary-text w-16 border-0 bg-transparent p-0 text-sm font-bold uppercase outline-none focus:ring-0"
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Spacing Slider */}
            <div>
              <label className="text-primary-text mb-2 block text-xs font-bold tracking-wider uppercase">
                Spacing
              </label>
              <div className="border-tertiary-b relative flex h-[48px] w-full items-center overflow-hidden rounded-[12px] border bg-white">
                <style
                  dangerouslySetInnerHTML={{
                    __html: `
                  .custom-slider::-webkit-slider-runnable-track {
                    background: transparent;
                  }
                  .custom-slider::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    appearance: none;
                    width: 12px;
                    height: 32px;
                    border-radius: 6px;
                    background-color: #C5C5C5;
                    cursor: pointer;
                    transition: background-color 0.15s ease;
                  }
                  .custom-slider::-webkit-slider-thumb:hover {
                    background-color: #A5A5A5;
                  }
                  .custom-slider::-moz-range-thumb {
                    width: 12px;
                    height: 32px;
                    border-radius: 6px;
                    background-color: #C5C5C5;
                    cursor: pointer;
                    border: 0;
                    transition: background-color 0.15s ease;
                  }
                  .custom-slider::-moz-range-thumb:hover {
                    background-color: #A5A5A5;
                  }
                `,
                  }}
                />

                {/* Left background fill block up to the active value */}
                <div
                  className="bg-hover-bg pointer-events-none absolute top-0 bottom-0 left-0 transition-all duration-75"
                  style={{ width: `${(spacing / 48) * 100}%` }}
                />

                {/* The actual native input slider overlaying everything */}
                <input
                  type="range"
                  min="0"
                  max="48"
                  value={spacing}
                  onChange={(e) => onChangeSpacing(Number(e.target.value))}
                  className="custom-slider absolute inset-0 h-full w-full cursor-pointer appearance-none bg-transparent px-4 outline-none focus:outline-none"
                />

                {/* Numeric display text absolutely positioned on the right */}
                <div className="text-primary-text pointer-events-none absolute right-4 text-sm font-semibold select-none">
                  {spacing}
                </div>
              </div>
            </div>

            {/* Border Radius */}
            <div>
              <label className="text-primary-text mb-2 block text-xs font-bold tracking-wider uppercase">
                Border Radius
              </label>
              <div className="border-tertiary-b flex gap-1 rounded-[12px] border bg-white p-1">
                <button
                  type="button"
                  onClick={() => onChangeBorderRadius("medium")}
                  className={`flex flex-1 items-center justify-center rounded-[8px] py-3 transition-all duration-200 ${
                    borderRadius === "medium"
                      ? "bg-hover-bg text-primary-text"
                      : "text-tertiary-text hover:bg-primary-bg hover:text-primary-text"
                  }`}
                  title="Medium"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M6 18V12C6 8.68629 8.68629 6 12 6H18"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => onChangeBorderRadius("sharp")}
                  className={`flex flex-1 items-center justify-center rounded-[8px] py-3 transition-all duration-200 ${
                    borderRadius === "sharp"
                      ? "bg-hover-bg text-primary-text"
                      : "text-tertiary-text hover:bg-primary-bg hover:text-primary-text"
                  }`}
                  title="Sharp"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M6 18V6H18"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => onChangeBorderRadius("round")}
                  className={`flex flex-1 items-center justify-center rounded-[8px] py-3 transition-all duration-200 ${
                    borderRadius === "round"
                      ? "bg-hover-bg text-primary-text"
                      : "text-tertiary-text hover:bg-primary-bg hover:text-primary-text"
                  }`}
                  title="Round"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M6 18V15C6 10.0294 10.0294 6 15 6H18"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Theme Selector */}
            <div>
              <label className="text-primary-text mb-2 block text-xs font-bold tracking-wider uppercase">
                Theme
              </label>
              <div className="border-tertiary-b flex gap-1 rounded-[12px] border bg-white p-1">
                <button
                  type="button"
                  onClick={() => onChangeTheme("light")}
                  className={`flex flex-1 items-center justify-center rounded-[8px] py-3 transition-all duration-200 ${
                    theme === "light"
                      ? "bg-hover-bg text-primary-text"
                      : "text-tertiary-text hover:bg-primary-bg hover:text-primary-text"
                  }`}
                >
                  <Sun size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => onChangeTheme("dark")}
                  className={`flex flex-1 items-center justify-center rounded-[8px] py-3 transition-all duration-200 ${
                    theme === "dark"
                      ? "bg-hover-bg text-primary-text"
                      : "text-tertiary-text hover:bg-primary-bg hover:text-primary-text"
                  }`}
                >
                  <Moon size={18} />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex h-full flex-col gap-6">
            {selectedSection ? (
              selectedSection.type === "cta" ? (
                <CtaRightPanel
                  section={selectedSection}
                  font={font}
                  onChangeFont={onChangeFont}
                  textColor={textColor}
                  onChangeTextColor={onChangeTextColor}
                  bgColor={bgColor}
                  onChangeBgColor={onChangeBgColor}
                  iconColor={iconColor}
                  onChangeIconColor={onChangeIconColor}
                  onUpdate={(updates) =>
                    onUpdateSection(selectedSection.id, updates)
                  }
                />
              ) : (
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
              )
            ) : (
              <div className="flex h-[300px] flex-col items-center justify-center px-4 text-center">
                <Type size={32} className="text-disabled-text mb-3" />
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

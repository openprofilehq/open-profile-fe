"use client";

import { Sun, Moon, Type, ChevronDown, Pipette } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { HexAlphaColorPicker } from "react-colorful";
import type { Section } from "./types";

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

function useOutsideClick(callback: () => void) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) callback();
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [callback]);
  return ref;
}

const isValidHex = (color: string) => /^#[0-9A-F]{6}$/i.test(color);

function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
}

function hexToHsl(hex: string) {
  let { r, g, b } = hexToRgb(hex);
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h = 0,
    s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

function CustomDropdown({
  value,
  options,
  onChange,
}: {
  value: string;
  options: { value: string; label: string }[];
  onChange: (val: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useOutsideClick(() => setOpen(false));

  return (
    <div className="relative w-full" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="border-tertiary-b text-primary-text focus:border-brand-b flex w-full cursor-pointer appearance-none items-center justify-between rounded-[12px] border bg-white px-4 py-3.5 text-sm font-semibold transition-all outline-none"
      >
        <span>{options.find((o) => o.value === value)?.label || value}</span>
        <ChevronDown
          size={18}
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="border-tertiary-b animate-in fade-in zoom-in-95 absolute top-full left-0 z-50 mt-2 flex w-full flex-col overflow-hidden rounded-[12px] border bg-white py-2 shadow-[0_8px_30px_rgb(0,0,0,0.12)] duration-200">
          {options.map((opt) => {
            const isActive = value === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={`w-full px-5 py-3 text-left text-sm transition-colors duration-150 ${isActive ? "bg-hover-bg text-primary-text font-bold" : "text-tertiary-text hover:bg-hover-bg hover:text-primary-text font-semibold"}`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

const RECOMMENDED_COLORS = [
  "#D9D9D9",
  "#050505",
  "#335CFF",
  "#FF3366",
  "#00D084",
  "#FF8A00",
  "#9747FF",
  "#00E0FF",
];

function CustomColorPicker({
  color,
  onChange,
  label,
}: {
  color: string;
  onChange: (val: string) => void;
  label: string;
}) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"HEX" | "RGB" | "HSL">("HEX");
  const [popupStyle, setPopupStyle] = useState<React.CSSProperties>({});
  const triggerRef = useRef<HTMLButtonElement>(null);
  const ref = useOutsideClick(() => setOpen(false));
  const safeColor = isValidHex(color) ? color : "#050505";

  const rgb = hexToRgb(safeColor);
  const hsl = hexToHsl(safeColor);

  const inputValue =
    mode === "HEX"
      ? safeColor.replace("#", "")
      : mode === "RGB"
        ? `${rgb.r}, ${rgb.g}, ${rgb.b}`
        : `${hsl.h}°, ${hsl.s}%, ${hsl.l}%`;

  const handleOpen = () => {
    if (!open && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const popupHeight = 380;
      const spaceBelow = window.innerHeight - rect.bottom;
      const openUpward = spaceBelow < popupHeight && rect.top > popupHeight;
      setPopupStyle({
        position: "fixed",
        right: window.innerWidth - rect.right,
        ...(openUpward
          ? { top: rect.top - popupHeight - 8 }
          : { top: rect.top - 60 }),
        width: 260,
        zIndex: 9999,
      });
    }
    setOpen(!open);
  };

  return (
    <div className="relative flex items-center justify-between" ref={ref}>
      <span className="text-tertiary-text text-sm font-semibold">{label}</span>
      <button
        ref={triggerRef}
        type="button"
        onClick={handleOpen}
        className={`border-tertiary-b relative flex max-w-[145px] flex-1 cursor-pointer items-center gap-2 rounded-[12px] border p-1.5 transition-colors ${open ? "bg-active-bg" : "bg-hover-bg hover:bg-active-bg"}`}
      >
        <div
          style={{ backgroundColor: safeColor }}
          className="relative h-8 w-8 shrink-0 overflow-hidden rounded-[8px] border border-black/10 shadow-sm"
        />
        <div className="text-primary-text w-16 border-0 bg-transparent p-0 text-left text-sm font-bold uppercase outline-none">
          {safeColor}
        </div>
      </button>

      {open && (
        <div
          className="animate-in fade-in zoom-in-95 overflow-hidden rounded-[16px] bg-white shadow-[0_8px_30px_rgb(0,0,0,0.18)] duration-200"
          style={popupStyle}
        >
          <style>{`
            .kiro-picker .react-colorful { width: 100% !important; gap: 10px !important; }
            .kiro-picker .react-colorful__saturation { border-radius: 8px !important; height: 160px !important; }
            .kiro-picker .react-colorful__hue,
            .kiro-picker .react-colorful__alpha { height: 12px !important; border-radius: 6px !important; }
            .kiro-picker .react-colorful__saturation-pointer { width: 20px !important; height: 20px !important; border: 3px solid white !important; box-shadow: 0 2px 6px rgba(0,0,0,0.25) !important; }
            .kiro-picker .react-colorful__hue-pointer,
            .kiro-picker .react-colorful__alpha-pointer { width: 14px !important; height: 14px !important; border: 2px solid white !important; box-shadow: 0 1px 4px rgba(0,0,0,0.3) !important; }
          `}</style>
          <div className="kiro-picker p-3 pb-0">
            <HexAlphaColorPicker
              color={safeColor}
              onChange={(val) => onChange(val.slice(0, 7))}
              style={{ width: "100%" }}
            />
          </div>

          <div className="p-3 pt-2">
            <div className="border-tertiary-b mb-2.5 border-b border-dashed" />

            {/* Mode label row */}
            <div className="mb-1.5 flex items-center gap-1.5">
              <Pipette size={12} className="text-tertiary-text" />
              <button
                type="button"
                onClick={() =>
                  setMode(
                    mode === "HEX" ? "RGB" : mode === "RGB" ? "HSL" : "HEX"
                  )
                }
                className="text-tertiary-text flex items-center gap-0.5 text-xs font-medium"
              >
                {mode}
                <ChevronDown size={10} />
              </button>
            </div>

            {/* Input row */}
            <div className="border-tertiary-b mb-3 flex items-center rounded-[8px] border">
              <div className="flex flex-1 items-center gap-1 px-2 py-1.5">
                {mode === "HEX" && (
                  <span className="text-tertiary-text text-sm font-bold">
                    #
                  </span>
                )}
                <input
                  className="text-primary-text min-w-0 flex-1 bg-transparent text-sm font-bold uppercase outline-none"
                  value={inputValue}
                  readOnly={mode !== "HEX"}
                  onChange={(e) => {
                    if (mode === "HEX" && e.target.value.length <= 6)
                      onChange("#" + e.target.value);
                  }}
                />
              </div>
              <div className="border-tertiary-b h-6 w-px border-l" />
              <div className="px-2.5 py-1.5">
                <span className="text-tertiary-text text-sm font-medium">
                  100%
                </span>
              </div>
            </div>

            {/* Recommended Colors */}
            <div>
              <span className="text-tertiary-text mb-2 block text-[11px] font-medium">
                Recommended Colors
              </span>
              <div className="flex items-center gap-1.5">
                {RECOMMENDED_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => onChange(c)}
                    className={`h-[22px] w-[22px] shrink-0 rounded-full border border-black/10 transition-transform hover:scale-110 active:scale-95 ${safeColor.toUpperCase() === c.toUpperCase() ? "ring-primary-text ring-2 ring-offset-1" : ""}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
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
    <aside className="border-tertiary-b animate-in fade-in hidden h-full w-[290px] shrink-0 flex-col border bg-white shadow-sm duration-200 select-none lg:flex">
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
      <div className="flex-1 overflow-x-visible overflow-y-auto p-6">
        {activeTab === "general" ? (
          <div className="flex flex-col gap-6">
            {/* Font Selection */}
            <div>
              <label className="text-primary-text mb-2 block text-xs font-bold tracking-wider uppercase">
                Font
              </label>
              <CustomDropdown
                value={font}
                onChange={onChangeFont}
                options={[
                  { value: "Afacad", label: "Afacad" },
                  { value: "Inter", label: "Inter Sans" },
                  { value: "Serif", label: "Playfair Serif" },
                  { value: "Mono", label: "Roboto Mono" },
                  { value: "Geoligica", label: "Geoligica" },
                  { value: "Manrope", label: "Manrope" },
                ]}
              />
            </div>

            {/* Colors Selection */}
            <div>
              <label className="text-primary-text mb-3 block text-xs font-bold tracking-wider uppercase">
                Colors
              </label>

              <div className="border-tertiary-b flex flex-col gap-3 rounded-[16px] border bg-white p-4">
                <CustomColorPicker
                  label="Text"
                  color={textColor}
                  onChange={onChangeTextColor}
                />
                <CustomColorPicker
                  label="Bg"
                  color={bgColor}
                  onChange={onChangeBgColor}
                />
                <CustomColorPicker
                  label="Icon"
                  color={iconColor}
                  onChange={onChangeIconColor}
                />
              </div>
            </div>

            {/* Spacing Slider */}
            <div>
              <label className="text-primary-text mb-2 block text-xs font-bold tracking-wider uppercase">
                Spacing
              </label>
              <div className="border-tertiary-b relative flex h-[48px] w-full items-center overflow-hidden rounded-[12px] border bg-white">
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
              <div className="flex flex-col gap-6">
                {/* Font Selection */}
                <div>
                  <label className="text-primary-text mb-2 block text-xs font-bold tracking-wider uppercase">
                    Font
                  </label>
                  <CustomDropdown
                    value={selectedSection.font ?? font}
                    onChange={(val) =>
                      onUpdateSection(selectedSection.id, { font: val })
                    }
                    options={[
                      { value: "Afacad", label: "Afacad" },
                      { value: "Inter", label: "Inter Sans" },
                      { value: "Serif", label: "Playfair Serif" },
                      { value: "Mono", label: "Roboto Mono" },
                      { value: "Geoligica", label: "Geoligica" },
                      { value: "Manrope", label: "Manrope" },
                    ]}
                  />
                </div>

                {/* Colors Selection */}
                <div>
                  <label className="text-primary-text mb-3 block text-xs font-bold tracking-wider uppercase">
                    Color
                  </label>

                  <div className="border-tertiary-b flex flex-col gap-3 rounded-[16px] border bg-white p-4">
                    <CustomColorPicker
                      label="Text"
                      color={
                        isValidHex(selectedSection.textColor ?? textColor)
                          ? (selectedSection.textColor ?? textColor)
                          : "#050505"
                      }
                      onChange={(val) =>
                        onUpdateSection(selectedSection.id, { textColor: val })
                      }
                    />
                    <CustomColorPicker
                      label="Bg"
                      color={
                        isValidHex(selectedSection.bgColor ?? bgColor)
                          ? (selectedSection.bgColor ?? bgColor)
                          : "#FFFFFF"
                      }
                      onChange={(val) =>
                        onUpdateSection(selectedSection.id, { bgColor: val })
                      }
                    />
                    <CustomColorPicker
                      label="Icon"
                      color={
                        isValidHex(selectedSection.iconColor ?? iconColor)
                          ? (selectedSection.iconColor ?? iconColor)
                          : "#087583"
                      }
                      onChange={(val) =>
                        onUpdateSection(selectedSection.id, { iconColor: val })
                      }
                    />
                  </div>
                </div>

                {/* Section Spacing */}
                <div>
                  <label className="text-primary-text mb-4 block text-xs font-bold tracking-wider uppercase">
                    Spacing
                  </label>
                  <div className="flex flex-col gap-4">
                    {[
                      { label: "Top", key: "paddingTop", defaultVal: 24 },
                      { label: "Bottom", key: "paddingBottom", defaultVal: 24 },
                      { label: "Gap", key: "gap", defaultVal: 20 },
                      { label: "Padding", key: "padding", defaultVal: 16 },
                    ].map((item) => {
                      const val = Number(
                        (
                          selectedSection as unknown as Record<
                            string,
                            number | undefined
                          >
                        )[item.key] ?? item.defaultVal
                      );
                      return (
                        <div key={item.label} className="flex flex-col gap-2">
                          <span className="text-primary-text text-sm font-semibold">
                            {item.label}
                          </span>
                          <div className="border-tertiary-b relative flex h-[48px] w-full items-center overflow-hidden rounded-[12px] border bg-white">
                            <div
                              className="bg-hover-bg pointer-events-none absolute top-0 bottom-0 left-0 transition-all duration-75"
                              style={{ width: `${(val / 48) * 100}%` }}
                            />
                            <input
                              type="range"
                              min="0"
                              max="48"
                              value={val}
                              onChange={(e) =>
                                onUpdateSection(selectedSection.id, {
                                  [item.key]: Number(e.target.value),
                                })
                              }
                              className="custom-slider absolute inset-0 h-full w-full cursor-pointer appearance-none bg-transparent px-4 outline-none focus:outline-none"
                            />
                            <div className="text-primary-text pointer-events-none absolute right-4 text-sm font-semibold select-none">
                              {val}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
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

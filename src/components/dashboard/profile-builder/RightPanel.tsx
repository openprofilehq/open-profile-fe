"use client";

import { ColorPicker } from "@/components/ui/color-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TemplateSelectionModal } from "../TemplateSelectionModal";
import { Button } from "@/components/ui/button";
import { Palette, ChevronDown } from "lucide-react";

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
  borderRadius: "sharp" | "rounded" | "pill";
  onChangeBorderRadius: (radius: "sharp" | "rounded" | "pill") => void;
  template: string;
  onChangeTemplate?: (template: string | null) => void;
}

const FONT_OPTIONS = [
  { value: "Afacad", label: "Afacad" },
  { value: "Inter", label: "Inter Sans" },
  { value: "Serif", label: "Playfair Serif" },
  { value: "Mono", label: "Roboto Mono" },
  { value: "Geologica", label: "Geologica" },
  { value: "Manrope", label: "Manrope" },
];

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
  template,
  onChangeTemplate,
}: RightPanelProps) {
  return (
    <aside className="border-tertiary-b animate-in fade-in bg-background hidden h-full w-[290px] shrink-0 flex-col rounded-2xl border p-6 shadow-sm duration-200 select-none lg:flex">
      <div className="border-tertiary-b mb-6 border-b pb-4">
        <h2 className="text-primary-text text-center text-sm font-bold">General</h2>
      </div>

      {/* Settings Body */}
      <div className="relative flex-1 overflow-x-visible overflow-y-auto pr-1">
        <div>
            <div className="flex flex-col gap-6">
              {/* Template Selection */}
              <div>
                <label className="text-primary-text mb-2 block text-xs font-bold tracking-wider uppercase">
                  Template
                </label>
                <TemplateSelectionModal
                  initialTemplate={
                    (template
                      ? template.charAt(0).toUpperCase() + template.slice(1)
                      : "Professional") as
                      | "Professional"
                      | "Creator"
                      | "Portfolio"
                      | "Default"
                  }
                  onPreviewChange={onChangeTemplate}
                  trigger={
                    <Button
                      variant="outline"
                      className="border-tertiary-b hover:bg-hover-bg bg-background text-primary-text h-auto w-full justify-between rounded-[12px] border px-4 py-3.5 text-sm font-semibold"
                    >
                      <span className="flex items-center">
                        <Palette
                          size={16}
                          className="text-secondary-text mr-2"
                        />
                        {template
                          ? template.charAt(0).toUpperCase() + template.slice(1)
                          : "Choose Template"}
                      </span>
                      <ChevronDown
                        size={16}
                        className="text-secondary-text opacity-50"
                      />
                    </Button>
                  }
                />
              </div>

              {/* Font Selection */}
              <div>
                <label className="text-primary-text mb-2 block text-xs font-bold tracking-wider uppercase">
                  Font
                </label>
                <Select value={font} onValueChange={onChangeFont}>
                  <SelectTrigger className="border-tertiary-b bg-background rounded-[12px] border px-4 py-3.5 text-sm font-semibold">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FONT_OPTIONS.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Colors Selection */}
              <div>
                <label className="text-primary-text mb-3 block text-xs font-bold tracking-wider uppercase">
                  Colors
                </label>

                <div className="border-tertiary-b bg-background flex flex-col gap-3 rounded-[16px] border p-4">
                  <ColorPicker
                    label="Text"
                    color={textColor}
                    onChange={onChangeTextColor}
                  />
                  <ColorPicker
                    label="Bg"
                    color={bgColor}
                    onChange={onChangeBgColor}
                  />
                  <ColorPicker
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
                <div className="border-tertiary-b bg-background relative flex h-[48px] w-full items-center overflow-hidden rounded-[12px] border">
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
                <div className="border-tertiary-b bg-background flex gap-1 rounded-[12px] border p-1">
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
                    onClick={() => onChangeBorderRadius("rounded")}
                    className={`flex flex-1 items-center justify-center rounded-[8px] py-3 transition-all duration-200 ${
                      borderRadius === "rounded"
                        ? "bg-hover-bg text-primary-text"
                        : "text-tertiary-text hover:bg-primary-bg hover:text-primary-text"
                    }`}
                    title="Rounded"
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
                    onClick={() => onChangeBorderRadius("pill")}
                    className={`flex flex-1 items-center justify-center rounded-[8px] py-3 transition-all duration-200 ${
                      borderRadius === "pill"
                        ? "bg-hover-bg text-primary-text"
                        : "text-tertiary-text hover:bg-primary-bg hover:text-primary-text"
                    }`}
                    title="Pill"
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
            </div>
        </div>
      </div>
    </aside>
  );
}

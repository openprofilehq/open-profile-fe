"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CtaSection {
  id: string;
  title: string;
  type: string;
  ctaSpacingTop?: number;
  ctaSpacingBottom?: number;
  ctaSpacingGap?: number;
  ctaSpacingPadding?: number;
}

interface CtaRightPanelProps {
  section: CtaSection;
  font: string;
  onChangeFont: (font: string) => void;
  textColor: string;
  onChangeTextColor: (color: string) => void;
  bgColor: string;
  onChangeBgColor: (color: string) => void;
  iconColor: string;
  onChangeIconColor: (color: string) => void;
  onUpdate: (updates: Partial<CtaSection>) => void;
}

const sliders = [
  { key: "ctaSpacingTop", label: "Top", default: 24 },
  { key: "ctaSpacingBottom", label: "Bottom", default: 24 },
  { key: "ctaSpacingGap", label: "Gap", default: 20 },
  { key: "ctaSpacingPadding", label: "Padding", default: 16 },
] as const;

export default function CtaRightPanel({
  section,
  font,
  onChangeFont,
  textColor,
  onChangeTextColor,
  bgColor,
  onChangeBgColor,
  iconColor,
  onChangeIconColor,
  onUpdate,
}: CtaRightPanelProps) {
  const isValidHex = (color: string) => /^#[0-9A-F]{6}$/i.test(color);

  return (
    <div>
      <div className="no-scrollbar flex flex-col gap-4 overflow-y-auto">
        {/* Font */}
        <div className="gap-2">
          <label className="text-primary-text text-m-medium">Font</label>
          <Select value={font} onValueChange={onChangeFont}>
            <SelectTrigger className="border-tertiary-b focus:border-brand-b text-m-regular text-primary-text h-10 w-full cursor-pointer rounded-[8px] border bg-white pl-3 transition-all outline-none">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-[8px]">
              <SelectItem className="cta-font-item" value="Afacad">
                Afacad
              </SelectItem>
              <SelectItem className="cta-font-item" value="Geoligica">
                Geoligica
              </SelectItem>
              <SelectItem className="cta-font-item" value="Manrope">
                Manrope
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Color */}
        <div className="space-y-2">
          <label className="text-m-medium text-primary-text">Color</label>

          <div className="border-tertiary-b flex flex-col gap-2 rounded-[16px] border px-3 py-4 shadow-sm">
            {[
              {
                label: "Text",
                value: textColor,
                onChange: onChangeTextColor,
                fallback: "#050505",
              },
              {
                label: "Bg",
                value: bgColor,
                onChange: onChangeBgColor,
                fallback: "#FFFFFF",
              },
              {
                label: "Icon",
                value: iconColor,
                onChange: onChangeIconColor,
                fallback: "#087583",
              },
            ].map(({ label, value, onChange, fallback }) => (
              <div key={label} className="flex items-center justify-between">
                <span className="text-m-regular text-secondary-text">
                  {label}
                </span>

                <label className="border-tertiary-b bg-hover-bg hover:bg-active-bg relative flex max-w-[170px] flex-1 cursor-pointer items-center gap-4 rounded-[12px] border p-1.5 transition-colors">
                  <div
                    style={{
                      backgroundColor: isValidHex(value) ? value : fallback,
                    }}
                    className="relative h-8 w-8 shrink-0 overflow-hidden rounded-[8px] border border-black/10 shadow-sm"
                  >
                    <input
                      type="color"
                      value={isValidHex(value) ? value : fallback}
                      onChange={(e) => onChange(e.target.value)}
                      className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                    />
                  </div>
                  <input
                    type="text"
                    value={value.toUpperCase()}
                    onChange={(e) => onChange(e.target.value)}
                    className="text-primary-text text-m-regular w-16 border-0 bg-transparent p-0 font-bold uppercase outline-none focus:ring-0"
                  />
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Spacing */}
        <div className="flex flex-col gap-4">
          <label className="text-primary-text text-m-medium">Spacing</label>

          <div className="flex flex-col gap-4">
            {sliders.map(({ key, label, default: defaultVal }) => {
              const value = (section[key] as number) ?? defaultVal;
              return (
                <div key={key} className="">
                  <p className="text-primary-text text-m-regular">{label}</p>

                  <div className="border-tertiary-b relative flex h-10 w-full items-center overflow-hidden rounded-[8px] border bg-white">
                    <div
                      className="bg-hover-bg pointer-events-none absolute top-0 bottom-0 left-0 transition-all duration-75"
                      style={{ width: `${(value / 80) * 100}%` }}
                    />
                    <input
                      type="range"
                      min="0"
                      max="80"
                      step="1"
                      value={value}
                      onChange={(e) =>
                        onUpdate({ [key]: Number(e.target.value) })
                      }
                      className="cta-slider absolute inset-0 h-full w-full cursor-pointer appearance-none bg-transparent shadow-sm outline-none"
                    />

                    <span className="text-m-regular pointer-events-none absolute right-3 text-[#121212]">
                      {value}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

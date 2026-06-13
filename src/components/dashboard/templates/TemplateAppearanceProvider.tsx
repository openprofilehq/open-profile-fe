import type { CSSProperties, ReactNode } from "react";

type TemplateAppearanceInput = {
  font?: string | null;
  accentColour?: string | null;
  iconColor?: string | null;
  textColor?: string | null;
  textColour?: string | null;
  bgColor?: string | null;
  backgroundColour?: string | null;
  cornerStyle?: string | null;
  borderRadius?: string | null;
  spacing?: number | null;
  theme?: string | null;
};

type Props = {
  appearance?: TemplateAppearanceInput | null;
  children: ReactNode;
  className?: string;
};

function normalizeColor(color?: string | null) {
  if (!color) return null;

  if (color.startsWith("#")) return color;

  const hex = color.split("_")[0];

  return `#${hex}`;
}

function getRgbaColor(color: string, alpha: number) {
  const cleanHex = color.replace("#", "");

  if (cleanHex.length !== 6) {
    return `rgba(8, 117, 131, ${alpha})`;
  }

  const value = Number.parseInt(cleanHex, 16);
  const red = (value >> 16) & 255;
  const green = (value >> 8) & 255;
  const blue = value & 255;

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

export function getFontClass(font?: string | null) {
  const normalizedFont = font?.toLowerCase();

  const fontClassMap: Record<string, string> = {
    afacad: "font-afacad",
    inter: "font-sans",
    serif: "font-playfair",
    playfair: "font-playfair",
    "playfair display": "font-playfair",
    mono: "font-mono",
    geologica: "font-geologica",
    geoligica: "font-sans",
    manrope: "font-sans",

    Afacad: "font-afacad",
    Inter: "font-sans",
    Serif: "font-playfair",
    "Playfair Display": "font-playfair",
    Mono: "font-mono",
    Geologica: "font-geologica",
    Geoligica: "font-sans",
    Manrope: "font-sans",
  };

  return (
    fontClassMap[normalizedFont ?? ""] ||
    fontClassMap[font ?? ""] ||
    "font-afacad"
  );
}

function getRadius(cornerStyle?: string | null, borderRadius?: string | null) {
  const value = cornerStyle || borderRadius;

  if (value === "sharp") return "0px";
  if (value === "pill" || value === "round") return "32px";

  return "16px";
}

export default function TemplateAppearanceProvider({
  appearance,
  children,
  className = "",
}: Props) {
  const accentColor =
    normalizeColor(appearance?.accentColour || appearance?.iconColor) ||
    "#087583";

  const selectedBgColor =
    normalizeColor(appearance?.backgroundColour || appearance?.bgColor) ||
    "#FFFFFF";

  const isDarkTheme = appearance?.theme === "dark";
  const bgColor = isDarkTheme ? "#0F0F0F" : selectedBgColor;

  const surfaceColor = isDarkTheme ? "#151515" : "#FFFFFF";
  const secondarySurfaceColor = isDarkTheme ? "#202020" : "#F6F6F6";

  const textColor = isDarkTheme
    ? "#F7F7F7"
    : normalizeColor(appearance?.textColour || appearance?.textColor) ||
      "#050505";

  const secondaryTextColor = isDarkTheme ? "#D6D6D6" : "#454545";
  const tertiaryTextColor = isDarkTheme ? "#A3A3A3" : "#747474";
  const borderColor = isDarkTheme ? "#303030" : "#EDEDED";
  const radius = getRadius(appearance?.cornerStyle, appearance?.borderRadius);
  const spacing =
    typeof appearance?.spacing === "number" ? appearance.spacing : 20;

  const style = {
    "--primary-text": textColor,
    "--secondary-text": secondaryTextColor,
    "--tertiary-text": tertiaryTextColor,
    "--label-text": secondaryTextColor,

    "--primary-bg": bgColor,
    "--secondary-bg": secondarySurfaceColor,
    "--background": surfaceColor,
    "--hover-bg": isDarkTheme ? "#2A2A2A" : "#F1F1F1",

    "--brand": accentColor,
    "--brand-text": accentColor,
    "--brand-bg": accentColor,
    "--brand-hover-bg": accentColor,
    "--brand-active-bg": accentColor,
    "--button-brand-bg": accentColor,
    "--purple-brand": accentColor,
    "--purple-brand-hover": accentColor,
    "--brand-b": accentColor,
    "--link-text": accentColor,
    "--link-hover-text": accentColor,
    "--link-active-text": accentColor,
    "--brand-subtle-bg": getRgbaColor(accentColor, 0.14),
    "--brand-light-subtle-bg": getRgbaColor(accentColor, 0.1),

    "--border": borderColor,
    "--tertiary-b": borderColor,
    "--input-b": borderColor,

    "--radius": radius,
    "--template-radius": radius,
    "--template-spacing": `${spacing}px`,

    "--op-text-color": textColor,
    "--op-secondary-text-color": secondaryTextColor,
    "--op-tertiary-text-color": tertiaryTextColor,
    "--op-bg-color": bgColor,
    "--op-surface-color": surfaceColor,
    "--op-secondary-bg-color": secondarySurfaceColor,
    "--op-accent-color": accentColor,
    "--op-border-color": borderColor,
    "--op-rounded": radius,
    "--op-spacing": `${spacing}px`,

    color: "var(--op-text-color)",
    backgroundColor: "var(--op-bg-color)",
  } as CSSProperties;

  return (
    <div
      className={`template-appearance-scope ${getFontClass(
        appearance?.font
      )} ${className}`}
      style={style}
    >
      <style>
        {`
          .template-appearance-scope [class*="rounded-"]:not([class*="rounded-full"]) {
            border-radius: var(--op-rounded, var(--template-radius)) !important;
          }

          .template-appearance-scope .text-brand-hover-bg,
          .template-appearance-scope .text-brand-text,
          .template-appearance-scope .text-link-text {
            color: var(--op-accent-color) !important;
          }

          .template-appearance-scope .bg-brand-hover-bg,
          .template-appearance-scope .bg-brand-bg,
          .template-appearance-scope .bg-button-brand-bg {
            background-color: var(--op-accent-color) !important;
          }

          .template-appearance-scope .border-brand-hover-bg,
          .template-appearance-scope .border-brand-b {
            border-color: var(--op-accent-color) !important;
          }

        `}
      </style>
      {children}
    </div>
  );
}

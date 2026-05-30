import type { Section, ProfilePreview } from "./types";
import CreatorPreview from "./previews/CreatorPreview";
import ProfessionalPreview from "./previews/ProfessionalPreview";
import DefaultPreview from "./previews/DefaultPreview";
import PortfolioPreview from "./previews/PortfolioPreview";
import TemplateAppearanceProvider from "../templates/TemplateAppearanceProvider";

interface PreviewCanvasProps {
  font: string;
  textColor: string;
  bgColor: string;
  iconColor: string;
  spacing: number;
  borderRadius: "sharp" | "medium" | "round";
  theme: "light" | "dark";
  template?: string;
  sections: Section[];
  profile?: ProfilePreview | null;
  selectedSectionId?: string | null;
  onToggleSectionVisibility: (id: string) => void;
  onRemoveSection: (id: string) => void;
}

export default function PreviewCanvas(props: PreviewCanvasProps) {
  const { font, theme } = props;

  const fontStyles: Record<string, string> = {
    Afacad: "font-afacad",
    Inter: "font-sans",
    Serif: "font-serif",
    Mono: "font-mono",
    Geologica: "font-sans",
    Manrope: "font-sans",
  };
  const selectedFontClass = fontStyles[font] || "font-afacad";
  const isDark = theme === "dark";

  return (
    <TemplateAppearanceProvider
      appearance={{
        font: props.font,
        accentColour: props.iconColor,
        iconColor: props.iconColor,
        textColor: props.textColor,
        bgColor: props.bgColor,
        cornerStyle: props.borderRadius,
        borderRadius: props.borderRadius,
        spacing: props.spacing,
        theme: props.theme,
      }}
      className="flex flex-col flex-1 min-w-0 h-full"
    >
      <div
        className={`animate-in fade-in flex h-full min-h-0 flex-1 justify-center overflow-y-auto px-4 py-12 transition-colors duration-200 lg:px-4 ${isDark ? "bg-inverse-bg" : "bg-transparent"} ${selectedFontClass}`}
      >
        <div className="flex w-full max-w-5xl flex-col gap-6 pb-32">
          {props.template === "creator" && <CreatorPreview {...props} />}
          {props.template === "portfolio" && <PortfolioPreview {...props} />}
          {props.template === "default" && <DefaultPreview {...props} />}
          {(!props.template || props.template === "professional") && (
            <ProfessionalPreview {...props} />
          )}
        </div>
      </div>
    </TemplateAppearanceProvider>
  );
}

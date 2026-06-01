import React, { useState } from "react";
import type { Section, ProfilePreview } from "./types";
import CreatorPreview from "./previews/CreatorPreview";
import ProfessionalPreview from "./previews/ProfessionalPreview";
import PortfolioPreview from "./previews/PortfolioPreview";
import DefaultPreview from "./previews/DefaultPreview";
import TemplateAppearanceProvider from "../templates/TemplateAppearanceProvider";

interface PreviewCanvasProps {
  font: string;
  textColor: string;
  bgColor: string;
  iconColor: string;
  spacing: number;
  borderRadius: "sharp" | "rounded" | "pill";
  template?: string;
  sections: Section[];
  profile?: ProfilePreview | null;
  selectedSectionId?: string | null;
  onToggleSectionVisibility: (id: string) => void;
  onRemoveSection: (id: string) => void;
}

export default function PreviewCanvas(props: PreviewCanvasProps) {
  const { font } = props;
  const [sectionToDelete, setSectionToDelete] = useState<string | null>(null);

  const handleConfirmDelete = () => {
    if (sectionToDelete) {
      props.onRemoveSection(sectionToDelete);
      setSectionToDelete(null);
    }
  };

  const handleRequestRemove = (id: string) => {
    setSectionToDelete(id);
  };

  const enhancedProps = {
    ...props,
    onRemoveSection: handleRequestRemove,
  };

  const templateKey = props.template
    ? String(props.template).toLowerCase()
    : "";

  const fontStyles: Record<string, string> = {
    Afacad: "font-afacad",
    Inter: "font-sans",
    Serif: "font-serif",
    Mono: "font-mono",
    Geologica: "font-sans",
    Manrope: "font-sans",
  };
  const selectedFontClass = fontStyles[font] || "font-afacad";

  return (
    <>
      <TemplateAppearanceProvider
        appearance={{
          font: props.font,
          accentColour: props.iconColor,
          iconColor: props.iconColor,
          textColor: props.textColor,
          textColour: props.textColor,
          bgColor: props.bgColor,
          backgroundColour: props.bgColor,
          cornerStyle: props.borderRadius,
          borderRadius: props.borderRadius,
          spacing: props.spacing,
        }}
        className="flex h-full w-full min-w-0 flex-1 flex-col"
      >
        <div
          className={`animate-in fade-in flex h-full min-h-0 flex-1 justify-center overflow-y-auto bg-transparent px-4 transition-colors duration-200 lg:px-12 ${selectedFontClass}`}
        >
          <div className="flex w-full max-w-5xl flex-col gap-6 pb-32">
            {templateKey === "creator" && <CreatorPreview {...enhancedProps} />}
            {templateKey === "portfolio" && (
              <PortfolioPreview {...enhancedProps} />
            )}
            {templateKey === "default" && <DefaultPreview {...enhancedProps} />}
            {(templateKey === "" || templateKey === "professional") && (
              <ProfessionalPreview {...enhancedProps} />
            )}
          </div>
        </div>
      </TemplateAppearanceProvider>

      {sectionToDelete && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSectionToDelete(null);
          }}
          onKeyDown={(e) => {
            if (e.key === "Escape") setSectionToDelete(null);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-section-title"
            className="bg-background w-full max-w-sm rounded-2xl p-6 shadow-xl"
          >
            <h3
              id="delete-section-title"
              className="text-primary-text text-lg font-bold"
            >
              Delete Section
            </h3>
            <p className="text-secondary-text mt-2 text-sm">
              Are you sure you want to delete this section? This action cannot
              be undone.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setSectionToDelete(null)}
                className="text-primary-text hover:bg-hover-bg rounded-lg px-4 py-2 text-sm font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="bg-negative-text hover:bg-negative-text/90 rounded-lg px-4 py-2 text-sm font-semibold text-white transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, X, Eye } from "lucide-react";

export type TemplateType = "Professional" | "Creator" | "Portfolio";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  selectedTemplate: TemplateType | null;
  onSelectTemplate: (template: TemplateType) => void;
  isSaving?: boolean;
};

const TEMPLATES: { type: TemplateType; description: string }[] = [
  {
    type: "Professional",
    description:
      "A clean, minimal layout perfect for highlighting your professional experience.",
  },
  {
    type: "Creator",
    description:
      "A bold, vibrant layout optimized for showcasing links and creative work.",
  },
  {
    type: "Portfolio",
    description:
      "A grid-based layout ideal for featuring projects and visual media.",
  },
];

export function TemplateSelectionModal({
  isOpen,
  onClose,
  selectedTemplate,
  onSelectTemplate,
  isSaving,
}: Props) {
  const [localSelectedTemplate, setLocalSelectedTemplate] =
    useState<TemplateType>(selectedTemplate ?? "Creator");

  if (!isOpen) return null;

  const handleConfirm = () => {
    onSelectTemplate(localSelectedTemplate);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-card w-full max-w-3xl rounded-[24px] border border-neutral-100 p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h2 className="text-primary-text text-2xl font-bold">
              Choose a Template
            </h2>
            <p className="text-secondary-text mt-2 text-sm">
              Select a starting template for your profile. You can preview and
              change this later.
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={isSaving}
            className="text-tertiary-text hover:bg-hover-bg rounded-full p-2 transition-colors disabled:pointer-events-none disabled:opacity-40"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          {TEMPLATES.map((template) => {
            const isSelected = localSelectedTemplate === template.type;
            const isProfessional = template.type === "Professional";
            const isCreator = template.type === "Creator";
            const isPortfolio = template.type === "Portfolio";
            return (
              <div
                key={template.type}
                role="button"
                tabIndex={0}
                aria-pressed={isSelected}
                onClick={() => setLocalSelectedTemplate(template.type)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setLocalSelectedTemplate(template.type);
                  }
                }}
                className={`relative flex cursor-pointer flex-col items-start rounded-xl border-2 p-4 text-left transition-all focus-visible:ring-2 focus-visible:ring-[#087583] focus-visible:outline-none ${
                  isSelected
                    ? "border-[#087583] bg-[#087583]/5"
                    : "border-[#EDEDED] hover:border-[#087583]/40 hover:bg-[#FAFAFA]"
                }`}
              >
                {isSelected && (
                  <div className="absolute top-3 right-3 z-10 rounded-full bg-[#087583] p-1 text-white">
                    <Check size={14} />
                  </div>
                )}
                <div className="relative mb-4 flex h-32 w-full flex-col items-center justify-center overflow-hidden rounded-lg bg-[#EDEDED] text-xs font-semibold text-[#A3A3A3]">
                  <span>{template.type} Preview</span>
                  {isProfessional && (
                    <a
                      href="/templates/professional/preview"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="z-25 mt-3 flex items-center gap-1 rounded-md bg-[#087583] px-3 py-1.5 text-[11px] font-bold text-white shadow-sm transition-all hover:scale-105 hover:bg-[#065e69] active:scale-95"
                    >
                      <Eye size={12} />
                      Live Preview ↗
                    </a>
                  )}
                  {isCreator && (
                    <a
                      href="/dashboard"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="z-25 mt-3 flex items-center gap-1 rounded-md bg-[#087583] px-3 py-1.5 text-[11px] font-bold text-white shadow-sm transition-all hover:scale-105 hover:bg-[#065e69] active:scale-95"
                    >
                      <Eye size={12} />
                      Live Preview ↗
                    </a>
                  )}
                  {isPortfolio && (
                    <a
                      href="/templates/portfolio/preview"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="z-25 mt-3 flex items-center gap-1 rounded-md bg-[#087583] px-3 py-1.5 text-[11px] font-bold text-white shadow-sm transition-all hover:scale-105 hover:bg-[#065e69] active:scale-95"
                    >
                      <Eye size={12} />
                      Live Preview ↗
                    </a>
                  )}
                </div>
                <h3 className="flex items-center gap-2 text-lg font-bold">
                  {template.type}
                  {isCreator && (
                    <span className="rounded-full bg-[#087583]/10 px-2 py-0.5 text-[10px] font-bold tracking-wider text-[#087583] uppercase">
                      Default
                    </span>
                  )}
                </h3>
                <p className="mt-1 text-xs leading-snug text-[#454545]">
                  {template.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-8 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} disabled={isSaving}>
            Cancel
          </Button>
          <Button
            className="bg-[#087583] px-6 font-bold text-white hover:bg-[#065e69]"
            onClick={handleConfirm}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Confirm"}
          </Button>
        </div>
      </div>
    </div>
  );
}

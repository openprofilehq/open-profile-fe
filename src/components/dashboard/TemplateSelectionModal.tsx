import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, X, Eye, ExternalLink } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  dashboardProfileOption,
  saveTemplateOption,
  profileContentOption,
  profileAppearanceOption,
} from "@/api/profile/profile.options";
import { toast } from "sonner";
import { TemplateType } from "@/api/profile/profile.type";

type Props = {
  initialTemplate: TemplateType;
  trigger?: React.ReactNode;
  onPreviewChange?: (template: TemplateType | null) => void;
  defaultOpen?: boolean;
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
  {
    type: "Default",
    description:
      "The standard profile layout with your summary, featured links, and highlights.",
  },
];

export function TemplateSelectionModal({
  initialTemplate,
  trigger,
  onPreviewChange,
  defaultOpen = false,
}: Props) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [localSelectedTemplate, setLocalSelectedTemplate] =
    useState<TemplateType>(initialTemplate);
  const queryClient = useQueryClient();

  const { mutate: doSaveTemplate, isPending: isSaving } = useMutation({
    ...saveTemplateOption,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dashboardProfileOption().queryKey });
      queryClient.invalidateQueries({ queryKey: profileContentOption().queryKey });
      queryClient.invalidateQueries({ queryKey: profileAppearanceOption().queryKey });
      toast.success("Template saved successfully.");
      setIsOpen(false);
      onPreviewChange?.(localSelectedTemplate);
    },
    onError: () => {
      toast.error("Failed to save template.");
    },
  });

  const handleConfirm = () => {
    doSaveTemplate(localSelectedTemplate);
  };

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => {
    if (isSaving) return;
    setIsOpen(false);
    setLocalSelectedTemplate(initialTemplate);
    onPreviewChange?.(null);
  };

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (!isSaving) {
          setIsOpen(false);
          setLocalSelectedTemplate(initialTemplate);
          onPreviewChange?.(null);
        }
      }
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isSaving, initialTemplate, onPreviewChange]);

  return (
    <>

      {trigger && (
        <div 
          onClick={handleOpen}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleOpen();
            }
          }}
          role="button"
          tabIndex={0}
          className="w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#087583] rounded-[12px]"
        >
          {trigger}
        </div>
      )}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm"
          onClick={handleClose}
        >
          <div
            className="bg-background w-full max-w-3xl rounded-[24px] border border-border p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="template-modal-title"
          >
          <div className="mb-4 flex items-start justify-between">
            <div>
              <h2 id="template-modal-title" className="text-primary-text text-2xl font-bold">
                Choose a Template
              </h2>
              <p className="text-secondary-text mt-2 text-sm">
                Select a starting template for your profile. You can preview and
                change this later.
              </p>
            </div>
            <button
              onClick={handleClose}
              disabled={isSaving}
              aria-label="Close template modal"
              className="text-tertiary-text hover:bg-hover-bg rounded-full p-2 transition-colors disabled:pointer-events-none disabled:opacity-40"
            >
              <X size={20} />
            </button>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {TEMPLATES.map((template) => {
              const isSelected = localSelectedTemplate === template.type;

              return (
                <div
                  key={template.type}
                  role="button"
                  tabIndex={0}
                  aria-pressed={isSelected}
                  onClick={() => {
                    setLocalSelectedTemplate(template.type);
                    onPreviewChange?.(template.type);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setLocalSelectedTemplate(template.type);
                      onPreviewChange?.(template.type);
                    }
                  }}
                  className={`relative flex cursor-pointer flex-col items-start rounded-xl border-2 p-4 text-left transition-all focus-visible:ring-2 focus-visible:ring-[#087583] focus-visible:outline-none ${
                    isSelected
                      ? "border-[#087583] bg-[#087583]/5"
                      : "border-border hover:border-[#087583]/40 hover:bg-hover-bg"
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-3 right-3 z-10 rounded-full bg-[#087583] p-1 text-white">
                      <Check size={14} />
                    </div>
                  )}
                  <div className="relative mb-4 flex h-32 w-full flex-col items-center justify-center overflow-hidden rounded-lg bg-secondary-bg text-xs font-semibold text-tertiary-text">
                    <span>{template.type} Preview</span>
                    <a
                      href={`/templates/${template.type.toLowerCase()}/preview`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      onKeyDown={(e) => e.stopPropagation()}
                      className="z-25 mt-3 flex items-center gap-1 rounded-md bg-[#087583] px-3 py-1.5 text-[11px] font-bold text-white shadow-sm transition-all hover:scale-105 hover:bg-[#065f6b] active:scale-95"
                    >
                      <Eye size={12} />
                      Live Preview <ExternalLink size={10} className="ml-0.5" />
                    </a>
                  </div>
                  <h3 className="flex items-center gap-2 text-lg font-bold text-primary-text">
                    {template.type}
                  </h3>
                  <p className="mt-1 text-xs leading-snug text-secondary-text">
                    {template.description}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-8 flex justify-end gap-3">
            <Button variant="outline" onClick={handleClose} disabled={isSaving}>
              Cancel
            </Button>
            <Button
              className="bg-[#087583] px-6 font-bold text-white hover:bg-[#065f6b]"
              onClick={handleConfirm}
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Confirm"}
            </Button>
          </div>
        </div>
        </div>
      )}
    </>
  );
}

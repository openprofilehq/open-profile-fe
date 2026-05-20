"use client";

import { ChevronLeft, MessageSquare, Trash2 } from "lucide-react";
import CtaLayoutIcon from "./CtaLayoutIcons";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface CtaSection {
  id: string;
  title: string;
  type: string;
  ctaTitle?: string;
  ctaSubtitle?: string;
  ctaButton?: string;
  ctaButtonLink?: string;
  ctaLayout?: "center" | "left" | "right";
}

interface CtaLeftPanelProps {
  section: CtaSection;
  onBack: () => void;
  onUpdate: (updates: Partial<CtaSection>) => void;
}

export default function CtaLeftPanel({
  section,
  onBack,
  onUpdate,
}: CtaLeftPanelProps) {
  const maxSubtitle = 200;

  return (
    <aside className="border-tertiary-b animate-in fade-in flex h-full w-[290px] shrink-0 flex-col border bg-white shadow-sm duration-200 select-none">
      {/* Header */}
      <div className="pl-4">
        <button
          onClick={onBack}
          className="text-primary-text hover:text-link-hover-text text-l-regular inline-flex h-12 cursor-pointer items-center gap-4 font-semibold transition-all"
        >
          <ChevronLeft size={16} />
          <span>CTA</span>
        </button>

        <p className="text-m-medium text-primary flex h-12 items-center">
          Content
        </p>
      </div>

      <section className="no-scrollbar flex flex-1 flex-col gap-4 overflow-y-auto border-t border-black px-4 py-6">
        {/* Layout */}
        <div className="flex flex-col gap-2">
          <p className="text-m-medium text-primary-text">Layout</p>

          <div className="flex gap-2">
            {(["center", "left", "right"] as const).map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => onUpdate({ ctaLayout: l })}
                className={`flex flex-1 cursor-pointer items-center justify-center overflow-hidden rounded-[10px] border transition-all duration-200 ${
                  (section.ctaLayout ?? "center") === l
                    ? "bg-brand-light-subtle-bg"
                    : "hover:bg-primary-bg bg-white"
                }`}
                title={l}
              >
                <CtaLayoutIcon
                  layout={l}
                  isActive={(section.ctaLayout ?? "center") === l}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Title */}
        <div className="flex flex-col gap-2">
          <label className="text-m-medium text-primary-text">Title</label>
          <input
            type="text"
            value={section.ctaTitle ?? ""}
            placeholder="Let's build something"
            onChange={(e) => onUpdate({ ctaTitle: e.target.value })}
            className="focus:border-brand-b text-m-regular text-secondary-text cta-shadow h-9 w-full rounded-[8px] border px-4 py-3 font-semibold transition-all outline-none"
          />
        </div>

        {/* Subtitle */}
        <div className="flex flex-col gap-2">
          <label className="text-m-medium text-primary-text">Subtitle</label>

          <div className="relative">
            <textarea
              value={section.ctaSubtitle ?? ""}
              placeholder="I'm currently accepting new projects..."
              rows={3}
              maxLength={maxSubtitle}
              onChange={(e) => onUpdate({ ctaSubtitle: e.target.value })}
              className="text-primary-text focus:border-brand-b border-soft-b cta-shadow h-28.75 w-full resize-none rounded-[8px] border px-2 py-2 pb-4 text-sm font-semibold transition-all outline-none"
            />
            <p className="absolute right-2 bottom-2 text-right text-[11px] font-medium text-[#A3A3A3]">
              {(section.ctaSubtitle ?? "").length}/{maxSubtitle}
            </p>
          </div>
        </div>

        {/* Icon */}
        <div className="flex flex-col gap-2">
          <label className="text-primary-text text-m-medium">Icon</label>

          <div className="cta-shadow flex items-center justify-between rounded-[8px] border border-[#EDEDED] px-2.25">
            <div className="flex h-9 w-9 items-center justify-center">
              <MessageSquare size={24} className="" />
            </div>

            <button className="h-full border-l border-[#EDEDED] px-3">
              <Trash2 size={16} className="text-negative-text" />
            </button>
          </div>
        </div>

        {/* Button */}
        <div className="flex flex-col gap-2">
          <label className="text-m-medium text-primary-text">Button</label>

          <div>
            <input
              type="text"
              value={section.ctaButton ?? ""}
              placeholder="Start a Conversation"
              onChange={(e) => onUpdate({ ctaButton: e.target.value })}
              className="border-tertiary-b text-primary-text focus:border-brand-b text-m-regular cta-shadow h-10 w-full rounded-t-[8px] border p-2 font-semibold transition-all outline-none"
            />

            <div className="relative flex items-center justify-between">
              <input
                type="text"
                value={section.ctaButtonLink ?? ""}
                placeholder="Search site or paste link"
                onChange={(e) => onUpdate({ ctaButtonLink: e.target.value })}
                className="border-tertiary-b text-primary-text focus:border-brand-b text-m-regular cta-shadow w-full rounded-b-[8px] border p-2 pr-10 font-semibold transition-all outline-none"
              />

              <Button
                variant="dropdownItem"
                className="absolute right-0 h-full w-10"
              >
                <Image src="/cta/ellipses.svg" height={14} width={14} alt="" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </aside>
  );
}

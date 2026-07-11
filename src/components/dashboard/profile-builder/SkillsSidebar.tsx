"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Section, SkillItem } from "./types";
import {
  createId,
  ensureItemIds,
  slugifyItemIdPart,
} from "./profile-builder-item-utils";
import { SectionHeadingFields, TextField } from "./profile-builder-fields";

const createFallbackSkillId = (item: SkillItem, index: number) => {
  const source = slugifyItemIdPart(`${item.name || "skill"}-${index}`);

  return `skill-${index}-${source || "item"}`;
};

const ensureSkillIds = (items: SkillItem[]) =>
  ensureItemIds(items, createFallbackSkillId);

function SkillsIcon({
  className = "",
  size = 18,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M14.7 5.3l4 4"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M15.9 4.1l4 4"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M13.9 6.1L4.8 15.2a2 2 0 0 0-.5.9L3.7 19a1 1 0 0 0 1.2 1.2l2.9-.6a2 2 0 0 0 .9-.5l9.1-9.1"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.5 5.5l12 12"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M5.1 6.9l2.8-2.8"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M16.1 19.9l2.8-2.8"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function SkillsSidebar({
  returnTab,
  section,
  onUpdateSection,
  mobile = false,
}: {
  returnTab: () => void;
  section: Section | null;
  onUpdateSection: (id: string, updates: Partial<Section>) => void;
  mobile?: boolean;
}) {
  const [selectedTab, setSelectedTab] = useState<"content" | "form">("content");
  const [skills, setSkills] = useState<SkillItem[]>(() =>
    ensureSkillIds(section?.skills ?? [])
  );
  const [editingSkill, setEditingSkill] = useState<SkillItem | null>(null);
  const [skillName, setSkillName] = useState("");
  const [sectionTitle, setSectionTitle] = useState(section?.title || "Skills");
  const [sectionSubtitle, setSectionSubtitle] = useState(
    section?.subtitle || ""
  );

  useEffect(() => {
    let cancelled = false;

    queueMicrotask(() => {
      if (cancelled) return;

      setSkills(ensureSkillIds(section?.skills ?? []));
      setSectionTitle(section?.title || "Skills");
      setSectionSubtitle(section?.subtitle || "");
    });

    return () => {
      cancelled = true;
    };
  }, [section?.id, section?.skills, section?.subtitle, section?.title]);

  const canSave = useMemo(() => Boolean(skillName.trim()), [skillName]);

  const syncSection = (updates: Partial<Section>) => {
    if (!section) return;
    onUpdateSection(section.id, updates);
  };

  const handleSkillsChange = (nextSkills: SkillItem[]) => {
    setSkills(nextSkills);
    syncSection({ skills: nextSkills });
  };

  const openForm = (item?: SkillItem) => {
    setEditingSkill(item ?? null);
    setSkillName(item?.name ?? "");
    setSelectedTab("form");
  };

  const handleSave = () => {
    if (!canSave) return;

    const nextItem: SkillItem = {
      id: editingSkill?.id ?? createId(),
      name: skillName.trim(),
    };

    handleSkillsChange(
      editingSkill
        ? skills.map((item) => (item.id === editingSkill.id ? nextItem : item))
        : [...skills, nextItem]
    );
    setEditingSkill(null);
    setSkillName("");
    setSelectedTab("content");
  };

  return (
    <aside
      className={`border-tertiary-b animate-in fade-in bg-background ${mobile ? "flex w-full border-r-0 p-4" : "flex p-6"} h-full w-72.5 shrink-0 flex-col border-r duration-200 select-none`}
    >
      <div
        className={`border-tertiary-b border-b pb-4 ${mobile ? "hidden" : ""}`}
      >
        {selectedTab === "content" ? (
          <button
            type="button"
            onClick={returnTab}
            className="text-primary-text hover:text-link-hover-text inline-flex items-center gap-2 text-base font-semibold transition-all"
          >
            <ChevronLeft size={20} />
            <span>Skills</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => {
              setEditingSkill(null);
              setSelectedTab("content");
            }}
            className="text-primary-text hover:text-link-hover-text inline-flex items-center gap-2 text-base font-semibold transition-all"
          >
            <ChevronLeft size={20} />
            <span>Back to Skills</span>
          </button>
        )}
      </div>

      <div
        className={`profile-builder-scrollbar flex-1 overflow-y-auto pr-1 ${mobile ? "py-2" : "py-6"}`}
      >
        {selectedTab === "content" ? (
          skills.length === 0 ? (
            <EmptySkillsState onAdd={() => openForm()} />
          ) : (
            <div className="flex flex-col gap-6">
              <SectionHeadingFields
                title={sectionTitle}
                subtitle={sectionSubtitle}
                titlePlaceholder="Skills"
                onTitleChange={(value) => {
                  setSectionTitle(value);
                  syncSection({ title: value });
                }}
                onSubtitleChange={(value) => {
                  setSectionSubtitle(value);
                  syncSection({ subtitle: value });
                }}
              />

              <div className="flex flex-col gap-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-primary-text font-bold">Skills</span>
                  <span className="text-tertiary-text font-medium">
                    Tap to edit
                  </span>
                </div>
                <div className="border-border bg-background flex flex-wrap gap-2 rounded-[10px] border p-3">
                  {skills.map((skill) => (
                    <button
                      key={skill.id}
                      type="button"
                      onClick={() => openForm(skill)}
                      className="bg-secondary-bg text-primary-text hover:bg-hover-bg rounded-md px-3 py-2 text-xs font-medium"
                    >
                      {skill.name}
                    </button>
                  ))}
                </div>

                <Button
                  type="button"
                  size="lg"
                  variant="waitlist"
                  onClick={() => openForm()}
                >
                  Add new skill +
                </Button>
              </div>
            </div>
          )
        ) : (
          <div className="flex flex-col gap-5">
            <TextField
              label="Skill"
              required
              value={skillName}
              placeholder="e.g. Accessibility"
              onChange={setSkillName}
            />

            {skills.length > 0 && (
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-primary-text font-bold">Skills</span>
                  <span className="text-tertiary-text font-medium">
                    Tap to edit
                  </span>
                </div>
                <div className="border-border bg-background flex flex-wrap gap-2 rounded-[10px] border p-3">
                  {skills.map((skill) => (
                    <button
                      key={skill.id}
                      type="button"
                      onClick={() => openForm(skill)}
                      className="bg-secondary-bg text-primary-text hover:bg-hover-bg rounded-md px-3 py-2 text-xs font-medium"
                    >
                      {skill.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <Button
              type="button"
              size="lg"
              variant="waitlist"
              onClick={handleSave}
              disabled={!canSave}
            >
              Save skill
            </Button>
          </div>
        )}
      </div>
    </aside>
  );
}

function EmptySkillsState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="border-border bg-primary-bg flex flex-col items-center justify-center rounded-[14px] border px-6 py-10 text-center">
      <div className="bg-secondary-bg text-tertiary-text mb-4 flex h-10 w-10 items-center justify-center rounded-full">
        <SkillsIcon size={18} />
      </div>
      <p className="text-primary-text text-sm font-bold">No skills added</p>
      <p className="text-secondary-text mt-1 max-w-[190px] text-xs leading-relaxed">
        Add skills to highlight your areas of expertise.
      </p>
      <Button
        type="button"
        onClick={onAdd}
        className="bg-brand-hover-bg hover:bg-brand mt-5 h-10 rounded-[10px] px-6 text-xs font-semibold text-white"
      >
        Add Skills
      </Button>
    </div>
  );
}

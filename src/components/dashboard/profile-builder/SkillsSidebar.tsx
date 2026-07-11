"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Section, SkillItem } from "./types";

const createId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

const createFallbackSkillId = (item: SkillItem, index: number) => {
  const source = `${item.name || "skill"}-${index}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);

  return `skill-${index}-${source || "item"}`;
};

const ensureSkillIds = (items: SkillItem[]) => {
  const seenIds = new Set<string>();

  return items.map((item, index) => {
    const existingId = typeof item.id === "string" ? item.id.trim() : "";
    const baseId = existingId || createFallbackSkillId(item, index);
    let nextId = baseId;
    let suffix = 1;

    while (seenIds.has(nextId)) {
      nextId = `${baseId}-${index}-${suffix}`;
      suffix += 1;
    }

    seenIds.add(nextId);

    return { ...item, id: nextId };
  });
};

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

  const handleDeleteSkill = (id: string) => {
    handleSkillsChange(skills.filter((item) => item.id !== id));
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
                  <span className="font-bold text-[#050505]">Skills</span>
                  <span className="font-medium text-gray-500">Tap to edit</span>
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
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-[#050505]">
                Skill<span className="ml-1 text-red-500">*</span>
              </label>
              <input
                type="text"
                value={skillName}
                onChange={(event) => setSkillName(event.target.value)}
                placeholder="e.g. Accessibility"
                className="border-border focus:border-brand-b w-full rounded-[10px] border px-4 py-3 text-sm text-[#050505] outline-none"
              />
            </div>

            {skills.length > 0 && (
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#050505]">Skills</span>
                  <span className="font-medium text-gray-500">Tap to edit</span>
                </div>
                <div className="border-border bg-background flex flex-wrap gap-2 rounded-[10px] border p-3">
                  {skills.map((skill) => (
                    <span
                      key={skill.id}
                      className="bg-secondary-bg text-primary-text inline-flex items-center gap-1 rounded-md px-3 py-2 text-xs font-medium"
                    >
                      <button
                        type="button"
                        onClick={() => openForm(skill)}
                        className="text-left"
                      >
                        {skill.name}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteSkill(skill.id)}
                        aria-label={`Delete skill ${skill.name}`}
                        className="text-tertiary-text hover:text-red-500"
                      >
                        <X size={12} />
                      </button>
                    </span>
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
              {editingSkill ? "Update skill" : "Save skill"}
            </Button>
          </div>
        )}
      </div>
    </aside>
  );
}

function SectionHeadingFields({
  title,
  subtitle,
  onTitleChange,
  onSubtitleChange,
}: {
  title: string;
  subtitle: string;
  onTitleChange: (value: string) => void;
  onSubtitleChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold text-[#050505]">Heading</label>
        <input
          type="text"
          value={title}
          onChange={(event) => onTitleChange(event.target.value)}
          placeholder="e.g. Accessibility"
          className="border-border focus:border-brand-b w-full rounded-[10px] border px-4 py-3 text-sm text-[#050505] outline-none"
        />
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold text-[#050505]">Sub-heading</label>
        <textarea
          value={subtitle}
          onChange={(event) => onSubtitleChange(event.target.value)}
          maxLength={200}
          placeholder="Add Text here"
          rows={3}
          className="border-border focus:border-brand-b w-full resize-none rounded-[10px] border px-4 py-3 text-sm text-[#050505] outline-none"
        />
        <p className="text-right text-[11px] text-[#A2A2A2]">
          {subtitle.length}/200
        </p>
      </div>
    </div>
  );
}

function EmptySkillsState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="border-border bg-primary-bg flex flex-col items-center justify-center rounded-[14px] border px-6 py-10 text-center">
      <div className="bg-secondary-bg text-tertiary-text mb-4 flex h-10 w-10 items-center justify-center rounded-full">
        <Sparkles size={18} />
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

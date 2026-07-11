"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BriefcaseBusiness,
  ChevronLeft,
  GripVertical,
  Trash2,
} from "lucide-react";
import { Reorder, useDragControls } from "motion/react";
import { Button } from "@/components/ui/button";
import type { ExperienceItem, Section } from "./types";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const YEARS = Array.from({ length: 80 }, (_, index) =>
  String(new Date().getFullYear() + 1 - index)
);

const EMPLOYMENT_TYPES = [
  "Full-time",
  "Part-time",
  "Contract",
  "Freelance",
  "Internship",
  "Apprenticeship",
];

const createId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

const createFallbackExperienceId = (item: ExperienceItem, index: number) => {
  const source = `${item.role || "experience"}-${item.company || index}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);

  return `experience-${index}-${source || "item"}`;
};

const ensureExperienceIds = (items: ExperienceItem[]) => {
  const seenIds = new Set<string>();

  return items.map((item, index) => {
    const existingId = typeof item.id === "string" ? item.id.trim() : "";
    const baseId = existingId || createFallbackExperienceId(item, index);
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

const emptyExperience: Omit<ExperienceItem, "id"> = {
  role: "",
  company: "",
  employmentType: "",
  startMonth: "",
  startYear: "",
  endMonth: "",
  endYear: "",
  currentlyWorking: false,
  description: "",
};

export default function ExperienceSidebar({
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
  const [experiences, setExperiences] = useState<ExperienceItem[]>(() =>
    ensureExperienceIds(section?.experiences ?? [])
  );
  const [editingExperience, setEditingExperience] =
    useState<ExperienceItem | null>(null);
  const [sectionTitle, setSectionTitle] = useState(
    section?.title || "Work Experience"
  );
  const [sectionSubtitle, setSectionSubtitle] = useState(
    section?.subtitle || ""
  );
  const [form, setForm] = useState<Omit<ExperienceItem, "id">>(emptyExperience);

  useEffect(() => {
    let cancelled = false;

    queueMicrotask(() => {
      if (cancelled) return;

      setExperiences(ensureExperienceIds(section?.experiences ?? []));
      setSectionTitle(section?.title || "Work Experience");
      setSectionSubtitle(section?.subtitle || "");
    });

    return () => {
      cancelled = true;
    };
  }, [section?.experiences, section?.id, section?.subtitle, section?.title]);

  const canSave = useMemo(() => {
    const hasEndDate = form.currentlyWorking || (form.endMonth && form.endYear);

    return Boolean(
      form.role.trim() &&
      form.company.trim() &&
      form.startMonth &&
      form.startYear &&
      hasEndDate
    );
  }, [form]);

  const syncSection = (updates: Partial<Section>) => {
    if (!section) return;
    onUpdateSection(section.id, updates);
  };

  const handleExperiencesChange = (nextExperiences: ExperienceItem[]) => {
    setExperiences(nextExperiences);
    syncSection({ experiences: nextExperiences });
  };

  const openForm = (item?: ExperienceItem) => {
    setEditingExperience(item ?? null);
    setForm(
      item
        ? {
            role: item.role,
            company: item.company,
            employmentType: item.employmentType ?? "",
            startMonth: item.startMonth,
            startYear: item.startYear,
            endMonth: item.endMonth ?? "",
            endYear: item.endYear ?? "",
            currentlyWorking: item.currentlyWorking ?? false,
            description: item.description ?? "",
          }
        : emptyExperience
    );
    setSelectedTab("form");
  };

  const handleDeleteExperience = (id: string) => {
    handleExperiencesChange(experiences.filter((item) => item.id !== id));
  };

  const handleSave = () => {
    if (!canSave) return;

    const nextItem: ExperienceItem = {
      id: editingExperience?.id ?? createId(),
      ...form,
      role: form.role.trim(),
      company: form.company.trim(),
      employmentType: form.employmentType?.trim() || undefined,
      endMonth: form.currentlyWorking ? "" : form.endMonth,
      endYear: form.currentlyWorking ? "" : form.endYear,
      description: form.description?.trim() || "",
    };

    handleExperiencesChange(
      editingExperience
        ? experiences.map((item) =>
            item.id === editingExperience.id ? nextItem : item
          )
        : [...experiences, nextItem]
    );
    setEditingExperience(null);
    setForm(emptyExperience);
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
            <span>Work Experience</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => {
              setEditingExperience(null);
              setSelectedTab("content");
            }}
            className="text-primary-text hover:text-link-hover-text inline-flex items-center gap-2 text-base font-semibold transition-all"
          >
            <ChevronLeft size={20} />
            <span>Back to Work Experience</span>
          </button>
        )}
      </div>

      <div
        className={`profile-builder-scrollbar flex-1 overflow-y-auto pr-1 ${mobile ? "py-2" : "py-6"}`}
      >
        {selectedTab === "content" ? (
          experiences.length === 0 ? (
            <EmptyExperienceState onAdd={() => openForm()} />
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
                  <span className="font-bold text-[#050505]">
                    Work Experience
                  </span>
                  <span className="font-medium text-gray-500">Tap to edit</span>
                </div>

                <Reorder.Group
                  axis="y"
                  values={experiences}
                  onReorder={handleExperiencesChange}
                  layoutScroll
                  className="flex flex-col gap-2.5"
                >
                  {experiences.map((item) => (
                    <SortableExperienceItem
                      key={item.id}
                      item={item}
                      onEdit={openForm}
                      onDelete={handleDeleteExperience}
                    />
                  ))}
                </Reorder.Group>

                <Button
                  type="button"
                  size="lg"
                  variant="waitlist"
                  onClick={() => openForm()}
                >
                  Add new experience +
                </Button>
              </div>
            </div>
          )
        ) : (
          <div className="flex flex-col gap-5">
            <TextField
              label="Role"
              required
              value={form.role}
              placeholder="Work Experience"
              onChange={(value) =>
                setForm((prev) => ({ ...prev, role: value }))
              }
            />
            <TextField
              label="Company"
              required
              value={form.company}
              placeholder="e.g Linear"
              onChange={(value) =>
                setForm((prev) => ({ ...prev, company: value }))
              }
            />
            <SelectField
              label="Employment Type"
              value={form.employmentType ?? ""}
              placeholder="Select Type"
              options={EMPLOYMENT_TYPES}
              onChange={(value) =>
                setForm((prev) => ({ ...prev, employmentType: value }))
              }
            />
            <DatePair
              label="Start Date"
              required
              month={form.startMonth}
              year={form.startYear}
              onMonthChange={(value) =>
                setForm((prev) => ({ ...prev, startMonth: value }))
              }
              onYearChange={(value) =>
                setForm((prev) => ({ ...prev, startYear: value }))
              }
            />

            <label className="border-border flex items-center justify-between rounded-[10px] border px-4 py-3 text-xs font-medium text-[#050505]">
              I currently work here
              <span className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  checked={form.currentlyWorking}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      currentlyWorking: event.target.checked,
                    }))
                  }
                  className="peer sr-only"
                />
                <span className="peer-checked:bg-brand-hover-bg after:bg-background h-6 w-11 rounded-full bg-gray-200 after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white" />
              </span>
            </label>

            {!form.currentlyWorking && (
              <DatePair
                label="End Date"
                required
                month={form.endMonth ?? ""}
                year={form.endYear ?? ""}
                onMonthChange={(value) =>
                  setForm((prev) => ({ ...prev, endMonth: value }))
                }
                onYearChange={(value) =>
                  setForm((prev) => ({ ...prev, endYear: value }))
                }
              />
            )}

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-[#050505]">
                Description
              </label>
              <textarea
                value={form.description ?? ""}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    description: event.target.value,
                  }))
                }
                placeholder="Enter a description..."
                rows={5}
                className="border-border focus:border-brand-b w-full resize-none rounded-[10px] border px-4 py-3 text-sm text-[#050505] outline-none"
              />
            </div>

            {experiences.length > 0 && (
              <CompactList
                label="Work Experience"
                items={experiences.map((item) => ({
                  id: item.id,
                  name: item.role,
                }))}
                onEdit={(id) =>
                  openForm(experiences.find((item) => item.id === id))
                }
              />
            )}

            <Button
              type="button"
              size="lg"
              variant="waitlist"
              onClick={handleSave}
              disabled={!canSave}
            >
              {editingExperience ? "Update Experience" : "Save Experience"}
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
      <TextField
        label="Heading"
        value={title}
        placeholder="Work Experience"
        onChange={onTitleChange}
      />
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

function EmptyExperienceState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="border-border bg-primary-bg flex flex-col items-center justify-center rounded-[14px] border px-6 py-10 text-center">
      <div className="bg-secondary-bg text-tertiary-text mb-4 flex h-10 w-10 items-center justify-center rounded-full">
        <BriefcaseBusiness size={18} />
      </div>
      <p className="text-primary-text text-sm font-bold">No experience added</p>
      <p className="text-secondary-text mt-1 max-w-[170px] text-xs leading-relaxed">
        Add your work history to showcase your career.
      </p>
      <Button
        type="button"
        onClick={onAdd}
        className="bg-brand-hover-bg hover:bg-brand mt-5 h-10 rounded-[10px] px-6 text-xs font-semibold text-white"
      >
        Add Experience
      </Button>
    </div>
  );
}

function SortableExperienceItem({
  item,
  onEdit,
  onDelete,
}: {
  item: ExperienceItem;
  onEdit: (item: ExperienceItem) => void;
  onDelete: (id: string) => void;
}) {
  const dragControls = useDragControls();

  return (
    <Reorder.Item
      value={item}
      dragListener={false}
      dragControls={dragControls}
      whileDrag={{ zIndex: 20 }}
      role="button"
      tabIndex={0}
      onClick={() => onEdit(item)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onEdit(item);
        }
      }}
      className="group hover:border-brand-b/40 border-border bg-background flex h-[50px] cursor-pointer items-center justify-between overflow-hidden rounded-[8px] border pl-4 transition-all"
    >
      <span className="flex-1 truncate text-sm font-semibold text-[#050505]">
        {item.role || "Untitled experience"}
      </span>
      <div className="flex h-full items-center">
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onDelete(item.id);
          }}
          className="flex h-full items-center px-3 text-gray-400 opacity-0 transition-opacity group-hover:opacity-100 hover:text-red-600 focus:opacity-100"
          title="Delete experience"
          aria-label={`Delete experience ${item.role || "Untitled experience"}`}
        >
          <Trash2 size={16} />
        </button>
        <button
          type="button"
          onClick={(event) => event.stopPropagation()}
          onPointerDown={(event) => {
            event.stopPropagation();
            dragControls.start(event);
          }}
          className="border-border flex h-full w-[50px] shrink-0 cursor-grab items-center justify-center border-l bg-[#F4F4F5] text-gray-400 transition-colors hover:bg-gray-100 active:cursor-grabbing"
          title="Drag to reorder experience"
          aria-label={`Drag to reorder ${item.role || "experience"}`}
        >
          <GripVertical size={16} />
        </button>
      </div>
    </Reorder.Item>
  );
}

function CompactList({
  label,
  items,
  onEdit,
}: {
  label: string;
  items: { id: string; name: string }[];
  onEdit: (id: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center justify-between text-xs">
        <span className="font-bold text-[#050505]">{label}</span>
        <span className="font-medium text-gray-500">Tap to edit</span>
      </div>
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onEdit(item.id)}
          className="border-border bg-background flex h-[42px] items-center rounded-[8px] border px-4 text-left text-xs font-medium text-[#050505]"
        >
          {item.name || "Untitled"}
        </button>
      ))}
    </div>
  );
}

function TextField({
  label,
  value,
  placeholder,
  onChange,
  required = false,
}: {
  label: string;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-bold text-[#050505]">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="border-border focus:border-brand-b w-full rounded-[10px] border px-4 py-3 text-sm text-[#050505] outline-none"
      />
    </div>
  );
}

function SelectField({
  label,
  value,
  placeholder,
  options,
  onChange,
}: {
  label: string;
  value: string;
  placeholder: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-bold text-[#050505]">{label}</label>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="border-border focus:border-brand-b w-full rounded-[10px] border px-4 py-3 text-sm text-[#050505] outline-none"
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

function DatePair({
  label,
  month,
  year,
  onMonthChange,
  onYearChange,
  required = false,
}: {
  label: string;
  month: string;
  year: string;
  onMonthChange: (value: string) => void;
  onYearChange: (value: string) => void;
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-bold text-[#050505]">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>
      <div className="grid grid-cols-2 gap-2">
        <select
          value={month}
          onChange={(event) => onMonthChange(event.target.value)}
          className="border-border focus:border-brand-b rounded-[10px] border px-3 py-3 text-sm text-[#050505] outline-none"
        >
          <option value="">Month</option>
          {MONTHS.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <select
          value={year}
          onChange={(event) => onYearChange(event.target.value)}
          className="border-border focus:border-brand-b rounded-[10px] border px-3 py-3 text-sm text-[#050505] outline-none"
        >
          <option value="">Year</option>
          {YEARS.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

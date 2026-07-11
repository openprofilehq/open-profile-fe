"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, GraduationCap, GripVertical, Trash2 } from "lucide-react";
import { Reorder, useDragControls } from "motion/react";
import { Button } from "@/components/ui/button";
import type { EducationItem, Section } from "./types";
import {
  createId,
  ensureItemIds,
  slugifyItemIdPart,
} from "./profile-builder-item-utils";
import {
  CompactList,
  DatePair,
  SectionHeadingFields,
  TextField,
} from "./profile-builder-fields";

const createFallbackEducationId = (item: EducationItem, index: number) => {
  const source = slugifyItemIdPart(
    `${item.degree || "education"}-${item.institution || index}`
  );

  return `education-${index}-${source || "item"}`;
};

const ensureEducationIds = (items: EducationItem[]) =>
  ensureItemIds(items, createFallbackEducationId);

const emptyEducation: Omit<EducationItem, "id"> = {
  institution: "",
  degree: "",
  startMonth: "",
  startYear: "",
  endMonth: "",
  endYear: "",
};

export default function EducationSidebar({
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
  const [education, setEducation] = useState<EducationItem[]>(() =>
    ensureEducationIds(section?.education ?? [])
  );
  const [editingEducation, setEditingEducation] =
    useState<EducationItem | null>(null);
  const [sectionTitle, setSectionTitle] = useState(
    section?.title || "Education"
  );
  const [sectionSubtitle, setSectionSubtitle] = useState(
    section?.subtitle || ""
  );
  const [form, setForm] = useState<Omit<EducationItem, "id">>(emptyEducation);

  useEffect(() => {
    let cancelled = false;

    queueMicrotask(() => {
      if (cancelled) return;

      setEducation(ensureEducationIds(section?.education ?? []));
      setSectionTitle(section?.title || "Education");
      setSectionSubtitle(section?.subtitle || "");
    });

    return () => {
      cancelled = true;
    };
  }, [section?.education, section?.id, section?.subtitle, section?.title]);

  const canSave = useMemo(
    () =>
      Boolean(
        form.institution.trim() &&
        form.degree.trim() &&
        form.startMonth &&
        form.startYear
      ),
    [form]
  );

  const syncSection = (updates: Partial<Section>) => {
    if (!section) return;
    onUpdateSection(section.id, updates);
  };

  const handleEducationChange = (nextEducation: EducationItem[]) => {
    setEducation(nextEducation);
    syncSection({ education: nextEducation });
  };

  const handleMoveEducation = (
    educationId: string,
    direction: "up" | "down"
  ) => {
    const currentIndex = education.findIndex((item) => item.id === educationId);
    const nextIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

    if (currentIndex < 0 || nextIndex < 0 || nextIndex >= education.length) {
      return;
    }

    const nextEducation = [...education];
    const [movedEducation] = nextEducation.splice(currentIndex, 1);
    nextEducation.splice(nextIndex, 0, movedEducation);
    handleEducationChange(nextEducation);
  };

  const openForm = (item?: EducationItem) => {
    setEditingEducation(item ?? null);
    setForm(
      item
        ? {
            institution: item.institution,
            degree: item.degree,
            startMonth: item.startMonth,
            startYear: item.startYear,
            endMonth: item.endMonth ?? "",
            endYear: item.endYear ?? "",
          }
        : emptyEducation
    );
    setSelectedTab("form");
  };

  const handleDeleteEducation = (id: string) => {
    handleEducationChange(education.filter((item) => item.id !== id));
  };

  const handleSave = () => {
    if (!canSave) return;

    const nextItem: EducationItem = {
      id: editingEducation?.id ?? createId(),
      ...form,
      institution: form.institution.trim(),
      degree: form.degree.trim(),
    };

    handleEducationChange(
      editingEducation
        ? education.map((item) =>
            item.id === editingEducation.id ? nextItem : item
          )
        : [...education, nextItem]
    );
    setEditingEducation(null);
    setForm(emptyEducation);
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
            <span>Education</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => {
              setEditingEducation(null);
              setSelectedTab("content");
            }}
            className="text-primary-text hover:text-link-hover-text inline-flex items-center gap-2 text-base font-semibold transition-all"
          >
            <ChevronLeft size={20} />
            <span>Back to Education</span>
          </button>
        )}
      </div>

      <div
        className={`profile-builder-scrollbar flex-1 overflow-y-auto pr-1 ${mobile ? "py-2" : "py-6"}`}
      >
        {selectedTab === "content" ? (
          education.length === 0 ? (
            <EmptyEducationState onAdd={() => openForm()} />
          ) : (
            <div className="flex flex-col gap-6">
              <SectionHeadingFields
                title={sectionTitle}
                subtitle={sectionSubtitle}
                titlePlaceholder="Education"
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
                  <span className="text-primary-text font-bold">Education</span>
                  <span className="text-tertiary-text font-medium">
                    Tap to edit
                  </span>
                </div>

                <Reorder.Group
                  axis="y"
                  values={education}
                  onReorder={handleEducationChange}
                  layoutScroll
                  className="flex flex-col gap-2.5"
                >
                  {education.map((item) => (
                    <SortableEducationItem
                      key={item.id}
                      item={item}
                      onEdit={openForm}
                      onDelete={handleDeleteEducation}
                      onMove={handleMoveEducation}
                    />
                  ))}
                </Reorder.Group>

                <Button
                  type="button"
                  size="lg"
                  variant="waitlist"
                  onClick={() => openForm()}
                >
                  Add education +
                </Button>
              </div>
            </div>
          )
        ) : (
          <div className="flex flex-col gap-5">
            <TextField
              label="Institution"
              required
              value={form.institution}
              placeholder="e.g. MIT"
              onChange={(value) =>
                setForm((prev) => ({ ...prev, institution: value }))
              }
            />
            <TextField
              label="Degree"
              required
              value={form.degree}
              placeholder="e.g. BSc Computer Science"
              onChange={(value) =>
                setForm((prev) => ({ ...prev, degree: value }))
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
            <DatePair
              label="End Date"
              month={form.endMonth ?? ""}
              year={form.endYear ?? ""}
              onMonthChange={(value) =>
                setForm((prev) => ({ ...prev, endMonth: value }))
              }
              onYearChange={(value) =>
                setForm((prev) => ({ ...prev, endYear: value }))
              }
            />

            {education.length > 0 && (
              <CompactList
                label="Education"
                items={education.map((item) => ({
                  id: item.id,
                  name: item.degree,
                }))}
                onEdit={(id) =>
                  openForm(education.find((item) => item.id === id))
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
              {editingEducation ? "Update education" : "Save education"}
            </Button>
          </div>
        )}
      </div>
    </aside>
  );
}

function EmptyEducationState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="border-border bg-primary-bg flex flex-col items-center justify-center rounded-[14px] border px-6 py-10 text-center">
      <div className="bg-secondary-bg text-tertiary-text mb-4 flex h-10 w-10 items-center justify-center rounded-full">
        <GraduationCap size={18} />
      </div>
      <p className="text-primary-text text-sm font-bold">No education added</p>
      <p className="text-secondary-text mt-1 max-w-[190px] text-xs leading-relaxed">
        Add your academic background to build credibility.
      </p>
      <Button
        type="button"
        onClick={onAdd}
        className="bg-brand-hover-bg hover:bg-brand mt-5 h-10 rounded-[10px] px-6 text-xs font-semibold text-white"
      >
        Add Education
      </Button>
    </div>
  );
}

function SortableEducationItem({
  item,
  onEdit,
  onDelete,
  onMove,
}: {
  item: EducationItem;
  onEdit: (item: EducationItem) => void;
  onDelete: (id: string) => void;
  onMove: (id: string, direction: "up" | "down") => void;
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
      <span className="text-primary-text flex-1 truncate text-sm font-semibold">
        {item.degree || "Untitled education"}
      </span>
      <div className="flex h-full items-center">
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onDelete(item.id);
          }}
          className="text-tertiary-text hover:text-negative-text flex h-full items-center px-3 opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100 focus:opacity-100"
          title="Delete education"
          aria-label={`Delete education ${item.degree || "Untitled education"}`}
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
          onKeyDown={(event) => {
            if (event.key === "ArrowUp" || event.key === "ArrowDown") {
              event.preventDefault();
              event.stopPropagation();
              onMove(item.id, event.key === "ArrowUp" ? "up" : "down");
            }
          }}
          className="border-border bg-active-bg text-tertiary-text hover:bg-hover-bg flex h-full w-[50px] shrink-0 cursor-grab items-center justify-center border-l transition-colors active:cursor-grabbing"
          title="Drag or use arrow keys to reorder education"
          aria-label={`Drag or use arrow keys to reorder ${item.degree || "education"}`}
        >
          <GripVertical size={16} />
        </button>
      </div>
    </Reorder.Item>
  );
}

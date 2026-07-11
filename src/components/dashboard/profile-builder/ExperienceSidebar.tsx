"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  BriefcaseBusiness,
  ChevronLeft,
  GripVertical,
  Trash2,
} from "lucide-react";
import { Reorder, useDragControls } from "motion/react";
import { Button } from "@/components/ui/button";
import type { ExperienceItem, Section } from "./types";
import { ensureItemIds, slugifyItemIdPart } from "./profile-builder-item-utils";
import {
  CompactList,
  DatePair,
  SectionHeadingFields,
  SelectField,
  TextField,
} from "./profile-builder-fields";
import {
  dashboardProfileOption,
  profileContentOption,
} from "@/api/profile/profile.options";
import {
  createProfileWorkExperience,
  deleteProfileWorkExperience,
  reorderProfileWorkExperience,
  updateProfileWorkExperience,
} from "@/api/profile/profile.service";
import {
  workExperienceItemToRequest,
  workExperienceResponseToItem,
} from "./profile-content-api-mappers";

const EMPLOYMENT_TYPES = [
  "Full-time",
  "Part-time",
  "Contract",
  "Freelance",
  "Internship",
  "Apprenticeship",
];

const createFallbackExperienceId = (item: ExperienceItem, index: number) => {
  const source = slugifyItemIdPart(
    `${item.role || "experience"}-${item.company || index}`
  );

  return `experience-${index}-${source || "item"}`;
};

const ensureExperienceIds = (items: ExperienceItem[]) =>
  ensureItemIds(items, createFallbackExperienceId);

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
  const queryClient = useQueryClient();
  const orderTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
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
  const descriptionId = useId();

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

  useEffect(() => {
    return () => {
      if (orderTimerRef.current) {
        clearTimeout(orderTimerRef.current);
      }
    };
  }, []);

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

  const invalidateProfileQueries = () => {
    queryClient.invalidateQueries({
      queryKey: dashboardProfileOption().queryKey,
    });
    queryClient.invalidateQueries({
      queryKey: profileContentOption().queryKey,
    });
  };

  const syncSection = (updates: Partial<Section>) => {
    if (!section) return;
    onUpdateSection(section.id, updates);
  };

  const persistExperienceOrder = (nextExperiences: ExperienceItem[]) => {
    if (orderTimerRef.current) {
      clearTimeout(orderTimerRef.current);
    }

    orderTimerRef.current = setTimeout(() => {
      void reorderProfileWorkExperience({
        workExperienceIds: nextExperiences.map((item) => item.id),
      })
        .then(() => invalidateProfileQueries())
        .catch((error) => {
          toast.error(
            error instanceof Error
              ? error.message
              : "Failed to reorder work experience."
          );
        });
    }, 500);
  };

  const handleExperiencesChange = (
    nextExperiences: ExperienceItem[],
    options: { persistOrder?: boolean } = {}
  ) => {
    setExperiences(nextExperiences);
    syncSection({ experiences: nextExperiences });

    if (options.persistOrder) {
      persistExperienceOrder(nextExperiences);
    }
  };

  const handleMoveExperience = (
    experienceId: string,
    direction: "up" | "down"
  ) => {
    const currentIndex = experiences.findIndex(
      (item) => item.id === experienceId
    );
    const nextIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

    if (currentIndex < 0 || nextIndex < 0 || nextIndex >= experiences.length) {
      return;
    }

    const nextExperiences = [...experiences];
    const [movedExperience] = nextExperiences.splice(currentIndex, 1);
    nextExperiences.splice(nextIndex, 0, movedExperience);
    handleExperiencesChange(nextExperiences, { persistOrder: true });
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

  const handleDeleteExperience = async (id: string) => {
    try {
      await deleteProfileWorkExperience(id);
      handleExperiencesChange(experiences.filter((item) => item.id !== id));
      invalidateProfileQueries();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to delete work experience."
      );
    }
  };

  const handleSave = async () => {
    if (!canSave) return;

    const nextItem: ExperienceItem = {
      id: editingExperience?.id ?? "",
      ...form,
      role: form.role.trim(),
      company: form.company.trim(),
      employmentType: form.employmentType?.trim() || undefined,
      endMonth: form.currentlyWorking ? "" : form.endMonth,
      endYear: form.currentlyWorking ? "" : form.endYear,
      description: form.description?.trim() || "",
    };

    try {
      const savedExperience = editingExperience
        ? await updateProfileWorkExperience(
            editingExperience.id,
            workExperienceItemToRequest(nextItem)
          )
        : await createProfileWorkExperience(
            workExperienceItemToRequest(nextItem)
          );
      const savedItem = workExperienceResponseToItem(savedExperience);

      handleExperiencesChange(
        editingExperience
          ? experiences.map((item) =>
              item.id === editingExperience.id ? savedItem : item
            )
          : [...experiences, savedItem]
      );
      invalidateProfileQueries();
      setEditingExperience(null);
      setForm(emptyExperience);
      setSelectedTab("content");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to save work experience."
      );
    }
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
                titlePlaceholder="Work Experience"
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
                  <span className="text-primary-text font-bold">
                    Work Experience
                  </span>
                  <span className="text-tertiary-text font-medium">
                    Tap to edit
                  </span>
                </div>

                <Reorder.Group
                  axis="y"
                  values={experiences}
                  onReorder={(nextItems) =>
                    handleExperiencesChange(nextItems, { persistOrder: true })
                  }
                  layoutScroll
                  className="flex flex-col gap-2.5"
                >
                  {experiences.map((item) => (
                    <SortableExperienceItem
                      key={item.id}
                      item={item}
                      onEdit={openForm}
                      onDelete={handleDeleteExperience}
                      onMove={handleMoveExperience}
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

            <label className="border-border text-primary-text flex items-center justify-between rounded-[10px] border px-4 py-3 text-xs font-medium">
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
                <span className="peer-checked:bg-brand-hover-bg after:bg-background bg-disabled-bg after:border-border peer-checked:after:border-background h-6 w-11 rounded-full after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:transition-all after:content-[''] peer-checked:after:translate-x-full" />
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
              <label
                htmlFor={descriptionId}
                className="text-primary-text text-xs font-bold"
              >
                Description
              </label>
              <textarea
                id={descriptionId}
                value={form.description ?? ""}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    description: event.target.value,
                  }))
                }
                placeholder="Enter a description..."
                rows={5}
                className="border-border focus:border-brand-b text-primary-text w-full resize-none rounded-[10px] border px-4 py-3 text-sm outline-none"
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
  onMove,
}: {
  item: ExperienceItem;
  onEdit: (item: ExperienceItem) => void;
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
      className="group hover:border-brand-b/40 border-border bg-background flex h-[50px] items-center justify-between overflow-hidden rounded-[8px] border pl-4 transition-all"
    >
      <button
        type="button"
        onClick={() => onEdit(item)}
        className="text-primary-text flex-1 truncate text-left text-sm font-semibold focus:outline-none"
        aria-label={`Edit experience ${item.role || "Untitled experience"}`}
      >
        {item.role || "Untitled experience"}
      </button>
      <div className="flex h-full items-center">
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onDelete(item.id);
          }}
          className="text-tertiary-text hover:text-negative-text flex h-full items-center px-3 opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100 focus:opacity-100"
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
          onKeyDown={(event) => {
            if (event.key === "ArrowUp" || event.key === "ArrowDown") {
              event.preventDefault();
              event.stopPropagation();
              onMove(item.id, event.key === "ArrowUp" ? "up" : "down");
            }
          }}
          className="border-border bg-active-bg text-tertiary-text hover:bg-hover-bg flex h-full w-[50px] shrink-0 cursor-grab items-center justify-center border-l transition-colors active:cursor-grabbing"
          title="Drag or use arrow keys to reorder experience"
          aria-label={`Drag or use arrow keys to reorder ${item.role || "experience"}`}
        >
          <GripVertical size={16} />
        </button>
      </div>
    </Reorder.Item>
  );
}

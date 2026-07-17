"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ChevronLeft, GraduationCap, GripVertical, Trash2 } from "lucide-react";
import { Reorder, useDragControls } from "motion/react";
import { Button } from "@/components/ui/button";
import type { EducationItem, Section } from "./types";
import { ensureItemIds, slugifyItemIdPart } from "./profile-builder-item-utils";
import {
  CompactList,
  DatePair,
  SectionHeadingFields,
  TextField,
} from "./profile-builder-fields";
import {
  dashboardProfileOption,
  profileContentOption,
} from "@/api/profile/profile.options";
import {
  createProfileEducation,
  deleteProfileEducation,
  reorderProfileEducation,
  updateProfileEducation,
} from "@/api/profile/profile.service";
import {
  educationItemToRequest,
  educationResponseToItem,
} from "./profile-content-api-mappers";

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
  const queryClient = useQueryClient();
  const orderTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingOrderIdsRef = useRef<string[] | null>(null);
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
  const [isSaving, setIsSaving] = useState(false);
  const [deletingEducationId, setDeletingEducationId] = useState<string | null>(
    null
  );

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

  useEffect(() => {
    return () => {
      if (orderTimerRef.current) {
        clearTimeout(orderTimerRef.current);
        orderTimerRef.current = null;
      }

      const pendingOrderIds = pendingOrderIdsRef.current;
      pendingOrderIdsRef.current = null;

      if (pendingOrderIds && pendingOrderIds.length > 0) {
        void reorderProfileEducation({ educationIds: pendingOrderIds }).catch(
          (error) => {
            console.error("Failed to flush education order on unmount.", error);
          }
        );
      }
    };
  }, []);

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

  const clearPendingEducationOrder = () => {
    if (orderTimerRef.current) {
      clearTimeout(orderTimerRef.current);
      orderTimerRef.current = null;
    }

    pendingOrderIdsRef.current = null;
  };

  const persistEducationOrder = (nextEducation: EducationItem[]) => {
    if (orderTimerRef.current) {
      clearTimeout(orderTimerRef.current);
    }

    const nextOrderIds = nextEducation.map((item) => item.id);
    pendingOrderIdsRef.current = nextOrderIds;

    orderTimerRef.current = setTimeout(() => {
      orderTimerRef.current = null;
      const orderIds = pendingOrderIdsRef.current;
      pendingOrderIdsRef.current = null;

      if (!orderIds || orderIds.length === 0) return;

      void reorderProfileEducation({
        educationIds: orderIds,
      })
        .then(() => invalidateProfileQueries())
        .catch((error) => {
          toast.error(
            error instanceof Error
              ? error.message
              : "Failed to reorder education."
          );
        });
    }, 500);
  };

  const handleEducationChange = (
    nextEducation: EducationItem[],
    options: { persistOrder?: boolean } = {}
  ) => {
    setEducation(nextEducation);
    syncSection({ education: nextEducation });

    if (options.persistOrder) {
      persistEducationOrder(nextEducation);
    }
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
    handleEducationChange(nextEducation, { persistOrder: true });
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

  const handleDeleteEducation = async (id: string) => {
    if (isSaving || deletingEducationId) return;

    const nextEducation = education.filter((item) => item.id !== id);
    const hadPendingOrder = Boolean(
      orderTimerRef.current || pendingOrderIdsRef.current
    );

    setDeletingEducationId(id);

    try {
      await deleteProfileEducation(id);
      clearPendingEducationOrder();
      handleEducationChange(nextEducation);

      if (hadPendingOrder && nextEducation.length > 0) {
        persistEducationOrder(nextEducation);
      }

      invalidateProfileQueries();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete education."
      );
    } finally {
      setDeletingEducationId(null);
    }
  };

  const handleSave = async () => {
    if (!canSave || isSaving || deletingEducationId) return;

    const nextItem: EducationItem = {
      id: editingEducation?.id ?? "",
      ...form,
      institution: form.institution.trim(),
      degree: form.degree.trim(),
    };

    setIsSaving(true);

    try {
      const savedEducation = editingEducation
        ? await updateProfileEducation(
            editingEducation.id,
            educationItemToRequest(nextItem)
          )
        : await createProfileEducation(educationItemToRequest(nextItem));
      const savedItem = educationResponseToItem(savedEducation);

      handleEducationChange(
        editingEducation
          ? education.map((item) =>
              item.id === editingEducation.id ? savedItem : item
            )
          : [...education, savedItem]
      );
      invalidateProfileQueries();
      setEditingEducation(null);
      setForm(emptyEducation);
      setSelectedTab("content");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to save education."
      );
    } finally {
      setIsSaving(false);
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
                  onReorder={(nextItems) =>
                    handleEducationChange(nextItems, { persistOrder: true })
                  }
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
                      deleteDisabled={isSaving || Boolean(deletingEducationId)}
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
              disabled={!canSave || isSaving || Boolean(deletingEducationId)}
            >
              {isSaving
                ? "Saving..."
                : editingEducation
                  ? "Update education"
                  : "Save education"}
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
  deleteDisabled,
}: {
  item: EducationItem;
  onEdit: (item: EducationItem) => void;
  onDelete: (id: string) => void;
  onMove: (id: string, direction: "up" | "down") => void;
  deleteDisabled?: boolean;
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
        aria-label={`Edit education ${item.degree || "Untitled education"}`}
      >
        {item.degree || "Untitled education"}
      </button>
      <div className="flex h-full items-center">
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            if (!deleteDisabled) {
              onDelete(item.id);
            }
          }}
          disabled={deleteDisabled}
          className="text-tertiary-text hover:text-negative-text flex h-full items-center px-3 opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100 focus:opacity-100 disabled:cursor-not-allowed disabled:opacity-40"
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

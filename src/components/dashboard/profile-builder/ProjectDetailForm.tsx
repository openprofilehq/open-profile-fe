"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronLeft, Trash2, Upload } from "lucide-react";
import type { ProjectItem } from "@/api/profile/project.type";
import { uploadProjectImage } from "@/api/uploads/uploads.service";

interface ProjectDetailFormProps {
  project: ProjectItem;
  highlightedCount: number;
  onUpdate: (updates: Partial<ProjectItem>) => void;
  onDelete: () => void;
  onBack: () => void;
}

export default function ProjectDetailForm({
  project,
  highlightedCount,
  onUpdate,
  onDelete,
  onBack,
}: ProjectDetailFormProps) {
  const [activeTab, setActiveTab] = useState<"content" | "section">("section");
  const [urlError, setUrlError] = useState("");
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  const MAX_HIGHLIGHTS = 3;

  const handleUrlChange = (val: string) => {
    onUpdate({ projectUrl: val });
    if (val && !val.match(/^https?:\/\//)) {
      setUrlError("URL must start with http:// or https://");
    } else {
      setUrlError("");
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset input so same file can be re-selected later
    if (fileInputRef.current) fileInputRef.current.value = "";

    if (!file.type.startsWith("image/")) {
      setUploadError("Please select an image file (JPG, PNG, GIF, WebP, etc.)");
      return;
    }

    setUploadError("");
    setUploadProgress(0);

    // Cancel any in-flight upload
    abortRef.current?.abort();
    abortRef.current = new AbortController();

    try {
      const expectedUrl = await uploadProjectImage(
        file,
        (pct) => setUploadProgress(pct),
        abortRef.current.signal
      );
      onUpdate({ imageUrl: expectedUrl });
      setUploadProgress(null);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Upload failed. Please try again.";
      setUploadError(message);
      setUploadProgress(null);
    }
  };

  return (
    <div className="flex h-full flex-col">

      {/* Header */}
      <div className="mb-4 flex shrink-0 items-center justify-between px-6 pt-6">
        <button
          onClick={onBack}
          className="text-primary-text hover:text-link-hover-text inline-flex items-center gap-2 text-base font-semibold transition-all"
        >
          <ChevronLeft size={20} />
          <span>Project</span>
        </button>

        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-negative-text transition-all hover:bg-negative-subtle-bg"
          title="Delete project"
        >
          <Trash2 size={17} />
        </button>
      </div>

      {/* Delete confirmation */}
      {showDeleteConfirm && (
        <div className="mx-6 mb-4 shrink-0 rounded-[10px] border border-negative-hover-bg bg-negative-subtle-bg p-4">
          <p className="text-negative-bold-text text-sm font-semibold">
            Delete this project?
          </p>
          <p className="text-negative-text mt-1 text-xs">This cannot be undone.</p>
          <div className="mt-3 flex gap-2">
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="border-tertiary-b text-primary-text hover:bg-hover-bg flex-1 rounded-lg border bg-white py-1.5 text-xs font-semibold transition-all"
            >
              Cancel
            </button>
            <button
              onClick={onDelete}
              className="bg-negative-bg hover:bg-negative-bold-text flex-1 rounded-lg py-1.5 text-xs font-semibold text-white transition-all"
            >
              Delete
            </button>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="border-tertiary-b mb-4 flex shrink-0 border-b px-6">
        {(["content", "section"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`mr-6 pb-3 text-sm font-semibold capitalize transition-all ${
              activeTab === tab
                ? "border-b-2 border-brand-b text-link-hover-text"
                : "text-tertiary-text hover:text-primary-text"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-6">

        {activeTab === "content" && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-disabled-text text-xs">
              No content options for individual projects.
            </p>
          </div>
        )}

        {activeTab === "section" && (
          <div className="flex flex-col gap-5">

            {/* Title */}
            <div>
              <label className="text-primary-text mb-1.5 block text-sm font-semibold">
                Title
              </label>
              <input
                type="text"
                value={project.title}
                onChange={(e) => onUpdate({ title: e.target.value.slice(0, 150) })}
                maxLength={150}
                placeholder="Add text here"
                className="border-tertiary-b text-primary-text placeholder-tertiary-text focus:border-brand-b focus:ring-brand-b w-full rounded-[10px] border bg-white px-3 py-2.5 text-sm outline-none focus:ring-1"
              />
            </div>

            {/* Subtitle */}
            <div>
              <label className="text-primary-text mb-1.5 block text-sm font-semibold">
                Subtitle
              </label>
              <textarea
                rows={4}
                value={project.subtitle}
                onChange={(e) =>
                  onUpdate({ subtitle: e.target.value.slice(0, 100) })
                }
                maxLength={100}
                placeholder="Add text here"
                className="border-tertiary-b text-primary-text placeholder-tertiary-text focus:border-brand-b focus:ring-brand-b w-full resize-none rounded-[10px] border bg-white px-3 py-2.5 text-sm outline-none focus:ring-1"
              />
              <p className="text-disabled-text mt-1 text-right text-[11px]">
                {project.subtitle.length}/100
              </p>
            </div>

            {/* Image upload */}
            <div>
              <label className="text-primary-text mb-1.5 block text-sm font-semibold">
                Image
              </label>

              {project.imageUrl ? (
                <div className="border-tertiary-b flex items-center justify-between rounded-[10px] border bg-white px-3 py-2">
                  <div className="border-tertiary-b relative h-10 w-10 overflow-hidden rounded-lg border">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={project.imageUrl}
                      alt="Project thumbnail"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <button
                    onClick={() => onUpdate({ imageUrl: null })}
                    className="text-negative-text hover:bg-negative-subtle-bg flex h-8 w-8 items-center justify-center rounded-lg transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadProgress !== null}
                  className="border-tertiary-b text-link-hover-text hover:bg-brand-light-subtle-bg flex w-full items-center justify-center gap-2 rounded-[10px] border border-dashed bg-white py-4 text-sm font-medium transition-all disabled:opacity-60"
                >
                  <Upload size={16} />
                  {uploadProgress !== null
                    ? `Uploading... ${uploadProgress}%`
                    : "Upload Image"}
                </button>
              )}

              {uploadProgress !== null && (
                <div className="bg-tertiary-b mt-2 h-1.5 w-full overflow-hidden rounded-full">
                  <div
                    className="bg-brand-hover-bg h-full transition-all duration-200"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              )}

              {uploadError && (
                <p className="text-negative-text mt-1.5 text-xs">{uploadError}</p>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            {/* Project URL */}
            <div>
              <label className="text-primary-text mb-1.5 block text-sm font-semibold">
                Project URL
              </label>
              <div className="border-tertiary-b bg-secondary-bg mb-1.5 flex items-center gap-2 rounded-[10px] border px-3 py-2.5">
                <span className="text-link-hover-text text-sm font-semibold">
                  View project
                </span>
              </div>
              <input
                type="text"
                value={project.projectUrl}
                onChange={(e) => handleUrlChange(e.target.value)}
                placeholder="Search site or paste link ..."
                className={`text-primary-text placeholder-tertiary-text w-full rounded-[10px] border bg-white px-3 py-2.5 text-sm outline-none focus:ring-1 ${
                  urlError
                    ? "border-negative-bg focus:border-negative-bg focus:ring-negative-bg"
                    : "border-tertiary-b focus:border-brand-b focus:ring-brand-b"
                }`}
              />
              {urlError && (
                <p className="text-negative-text mt-1.5 text-xs">{urlError}</p>
              )}
            </div>

            {/* Highlight toggle */}
            <div className="border-tertiary-b flex items-center justify-between rounded-[10px] border bg-white px-3 py-3">
              <div>
                <span className="text-primary-text text-sm font-semibold">
                  Highlight
                </span>
                {!project.isHighlight && highlightedCount >= MAX_HIGHLIGHTS && (
                  <p className="text-disabled-text mt-0.5 text-xs">
                    Max {MAX_HIGHLIGHTS} highlights reached
                  </p>
                )}
              </div>
              <button
                onClick={() => {
                  if (!project.isHighlight && highlightedCount >= MAX_HIGHLIGHTS)
                    return;
                  onUpdate({ isHighlight: !project.isHighlight });
                }}
                disabled={!project.isHighlight && highlightedCount >= MAX_HIGHLIGHTS}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors disabled:opacity-40 ${
                  project.isHighlight ? "bg-inverse-bg" : "bg-neutral-bg"
                }`}
                role="switch"
                aria-checked={project.isHighlight}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                    project.isHighlight ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
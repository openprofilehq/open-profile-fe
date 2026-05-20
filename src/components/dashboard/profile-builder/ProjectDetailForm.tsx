"use client";

import { useState, useRef } from "react";
import { ChevronLeft, Trash2, Upload } from "lucide-react";
import type { ProjectItem } from "@/api/profile/project.type";
import {
  getProjectImageUploadUrl,
  uploadToCloudinary,
} from "@/api/uploads/uploads.service";

interface ProjectDetailFormProps {
  project: ProjectItem;
  onUpdate: (updates: Partial<ProjectItem>) => void;
  onDelete: () => void;
  onBack: () => void;
}

export default function ProjectDetailForm({
  project,
  onUpdate,
  onDelete,
  onBack,
}: ProjectDetailFormProps) {
  // Default to "section" tab to match the design screenshot
  const [activeTab, setActiveTab] = useState<"content" | "section">("section");
  const [urlError, setUrlError] = useState("");
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

    if (!file.type.startsWith("image/")) {
      setUploadError("Please select an image file (JPG, PNG, GIF, WebP, etc.)");
      return;
    }

    setUploadError("");
    setUploadProgress(0);

    try {
      const { uploadUrl, expectedUrl } = await getProjectImageUploadUrl(file);
      await uploadToCloudinary(uploadUrl, file, (pct) => setUploadProgress(pct));
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
      <div className="shrink-0 flex items-center justify-between px-6 pt-6 mb-4">
        <button
          onClick={onBack}
          className="text-primary-text hover:text-link-hover-text inline-flex items-center gap-2 text-base font-semibold transition-all"
        >
          <ChevronLeft size={20} />
          <span>Project</span>
        </button>

        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-[#E53E3E] transition-all hover:bg-[#FFF0F0]"
          title="Delete project"
        >
          <Trash2 size={17} />
        </button>
      </div>

      {/* Delete confirmation */}
      {showDeleteConfirm && (
        <div className="mx-6 mb-4 shrink-0 rounded-[10px] border border-[#FED7D7] bg-[#FFF5F5] p-4">
          <p className="text-sm font-semibold text-[#C53030]">Delete this project?</p>
          <p className="mt-1 text-xs text-[#E53E3E]">This cannot be undone.</p>
          <div className="mt-3 flex gap-2">
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="flex-1 rounded-lg border border-[#E2E8F0] bg-white py-1.5 text-xs font-semibold text-[#333] transition-all hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={onDelete}
              className="flex-1 rounded-lg bg-[#E53E3E] py-1.5 text-xs font-semibold text-white transition-all hover:bg-[#C53030]"
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
                ? "border-b-2 border-[#087583] text-[#087583]"
                : "text-[#888] hover:text-[#333]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-6">

        {/* ── CONTENT TAB — empty per design ── */}
        {activeTab === "content" && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-xs text-[#aaa]">
              No content options for individual projects.
            </p>
          </div>
        )}

        {/* ── SECTION TAB — all project fields live here ── */}
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
                onChange={(e) => onUpdate({ subtitle: e.target.value.slice(0, 100) })}
                maxLength={100}
                placeholder="Add text here"
                className="border-tertiary-b text-primary-text placeholder-tertiary-text focus:border-brand-b focus:ring-brand-b w-full resize-none rounded-[10px] border bg-white px-3 py-2.5 text-sm outline-none focus:ring-1"
              />
              <p className="mt-1 text-right text-[11px] text-[#aaa]">
                {project.subtitle.length}/100
              </p>
            </div>

            {/* Image upload */}
            <div>
              <label className="text-primary-text mb-1.5 block text-sm font-semibold">
                Image
              </label>

              {project.imageUrl ? (
                /* Thumbnail row — use direct image rendering for remote uploads */
                <div className="flex items-center justify-between rounded-[10px] border border-[#E4E4E7] bg-white px-3 py-2">
                  <div className="relative h-10 w-10 overflow-hidden rounded-lg border border-[#E4E4E7]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={project.imageUrl}
                      alt="Project thumbnail"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <button
                    onClick={() => onUpdate({ imageUrl: null })}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-[#E53E3E] transition-all hover:bg-[#FFF0F0]"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadProgress !== null}
                  className="border-tertiary-b flex w-full items-center justify-center gap-2 rounded-[10px] border border-dashed bg-white py-4 text-sm font-medium text-[#087583] transition-all hover:bg-[#F0FAFA] disabled:opacity-60"
                >
                  <Upload size={16} />
                  {uploadProgress !== null
                    ? `Uploading... ${uploadProgress}%`
                    : "Upload Image"}
                </button>
              )}

              {uploadProgress !== null && (
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[#E4E4E7]">
                  <div
                    className="h-full bg-[#087583] transition-all duration-200"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              )}

              {uploadError && (
                <p className="mt-1.5 text-xs text-[#E53E3E]">{uploadError}</p>
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
              {/* Static label row */}
              <div className="mb-1.5 flex items-center gap-2 rounded-[10px] border border-[#E4E4E7] bg-[#F9F9F9] px-3 py-2.5">
                <span className="text-sm font-semibold text-[#087583]">View project</span>
              </div>
              {/* URL input */}
              <input
                type="text"
                value={project.projectUrl}
                onChange={(e) => handleUrlChange(e.target.value)}
                placeholder="Search site or paste link ..."
                className={`border-tertiary-b text-primary-text placeholder-tertiary-text focus:ring-brand-b w-full rounded-[10px] border bg-white px-3 py-2.5 text-sm outline-none focus:ring-1 ${
                  urlError
                    ? "border-[#E53E3E] focus:border-[#E53E3E] focus:ring-[#E53E3E]"
                    : "focus:border-brand-b"
                }`}
              />
              {urlError && (
                <p className="mt-1.5 text-xs text-[#E53E3E]">{urlError}</p>
              )}
            </div>

            {/* Highlight toggle */}
            <div className="flex items-center justify-between rounded-[10px] border border-[#E4E4E7] bg-white px-3 py-3">
              <span className="text-primary-text text-sm font-semibold">Highlight</span>
              <button
                onClick={() => onUpdate({ isHighlight: !project.isHighlight })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  project.isHighlight ? "bg-[#1a1a1a]" : "bg-[#D1D5DB]"
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
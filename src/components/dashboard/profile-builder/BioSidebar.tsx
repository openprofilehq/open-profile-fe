"use client";

import { ChevronLeft, Trash2, Upload } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getImageUrl } from "@/utils/profile";
import { uploadImage } from "@/api/uploads/uploads.service";
import { updateProfile } from "@/api/profile/profile.service";
import type { Section, ProfilePreview } from "./types";

interface BioSidebarProps {
  returnTab: () => void;
  section: Section;
  onUpdateSection: (id: string, updates: Partial<Section>) => void;
  profile?: ProfilePreview | null;
}

export default function BioSidebar({
  returnTab,
  section,
  onUpdateSection,
  profile,
}: BioSidebarProps) {
  const queryClient = useQueryClient();
  const [selectedTab, setSelectedTab] = useState<"content" | "section">(
    "content"
  );

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const fullName = section.fullName ?? profile?.fullName ?? "";
  const bio = section.bio ?? "";
  const profilePhotoUrl = getImageUrl(profile?.photoUrl);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) return;
    event.target.value = "";

    const prevUploadedImage = uploadedImage;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") setUploadedImage(reader.result);
    };
    reader.readAsDataURL(file);

    try {
      setUploading(true);
      const { url } = await uploadImage(file, "profiles");
      setUploadedImage(url);
      onUpdateSection(section.id, { photoUrl: url } as never);
      if (profile?.username) {
        await updateProfile(profile.username, { photoUrl: url });
        queryClient.invalidateQueries({ queryKey: ["profile", "dashboard"] });
      }
    } catch {
      // Rollback optimistic image on failure!
      setUploadedImage(prevUploadedImage);
      toast.error("Failed to upload profile photo.");
    } finally {
      setUploading(false);
    }
  };

  const displayImage = uploadedImage || profilePhotoUrl;

  return (
    <aside className="border-tertiary-b animate-in fade-in hidden h-full w-72.5 shrink-0 flex-col rounded-2xl border bg-background p-6 shadow-sm duration-200 select-none lg:flex">
      {/* Back Button */}
      <div className="pb-4">
        <button
          onClick={returnTab}
          className="text-primary-text hover:text-link-hover-text inline-flex items-center gap-2 text-base font-semibold transition-all"
        >
          <ChevronLeft size={20} />
          <span>Bio</span>
        </button>
      </div>

      {/* Tabs — mirrors RightPanel General/Section style */}
      <div className="border-tertiary-b flex border-b">
        <button
          onClick={() => setSelectedTab("content")}
          className={`relative flex-1 py-4 text-center text-sm font-bold transition-all ${
            selectedTab === "content"
              ? "text-primary-text"
              : "text-tertiary-text hover:text-primary-text"
          }`}
        >
          Content
          {selectedTab === "content" && (
            <span className="bg-primary-text absolute bottom-0 left-0 h-[2.5px] w-full transition-all" />
          )}
        </button>
        <button
          onClick={() => setSelectedTab("section")}
          className={`relative flex-1 py-4 text-center text-sm font-bold transition-all ${
            selectedTab === "section"
              ? "text-primary-text"
              : "text-tertiary-text hover:text-primary-text"
          }`}
        >
          Section
          {selectedTab === "section" && (
            <span className="bg-primary-text absolute bottom-0 left-0 h-[2.5px] w-full transition-all" />
          )}
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto py-6 pr-1">
        {selectedTab === "content" ? (
          <div className="flex flex-col gap-6">
            {/* Full name */}
            <div>
              <label
                className="text-primary-text mb-2 block text-sm font-semibold"
                htmlFor="bio-fullname"
              >
                <span className="text-[#D92D20]">*</span> Full name
              </label>
              <input
                type="text"
                id="bio-fullname"
                value={fullName}
                onChange={(e) =>
                  onUpdateSection(section.id, { fullName: e.target.value })
                }
                placeholder="Enter full name"
                className="border-tertiary-b focus:border-brand-b w-full rounded-[10px] border bg-background px-4 py-3 text-sm text-[#050505] transition-colors outline-none"
              />
            </div>

            {/* Bio */}
            <div>
              <label
                className="text-primary-text mb-2 block text-sm font-semibold"
                htmlFor="bio-text"
              >
                <span className="text-[#D92D20]">*</span> Bio
              </label>
              <textarea
                id="bio-text"
                value={bio}
                onChange={(e) =>
                  onUpdateSection(section.id, { bio: e.target.value })
                }
                rows={5}
                placeholder="Write a short bio..."
                className={`border-tertiary-b focus:border-brand-b w-full resize-none rounded-[10px] border bg-background px-4 py-3 text-sm transition-colors outline-none ${bio.length > 300 ? "border-[#D92D20] focus:border-[#D92D20] text-[#D92D20]" : "text-[#050505]"}`}
              />
              <p className={`mt-1 text-right text-xs ${bio.length > 300 ? "text-[#D92D20] font-medium" : "text-[#A2A2A2]"}`}>
                {bio.length <= 300 ? `${bio.length} / 300 characters` : `-${bio.length - 300} characters`}
              </p>
            </div>

            {/* Image — full-width row container */}
            <div>
              <label className="text-primary-text mb-2 block text-sm font-semibold">
                Image
              </label>
              <div className="border-tertiary-b flex overflow-hidden rounded-md border bg-background">
                {/* Left side — image / placeholder */}
                <button
                  type="button"
                  onClick={() => !displayImage && fileInputRef.current?.click()}
                  className="flex min-w-0 flex-1 items-center gap-3 p-1 text-left transition-colors hover:bg-[#F8FAFC]"
                >
                  {displayImage ? (
                    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full">
                      <Image
                        src={displayImage}
                        alt="Profile"
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  ) : (
                    <Image
                      src="/profilebuilder_home/icons/placeholder.svg"
                      alt="placeholder"
                      width={24}
                      height={24}
                      className="shrink-0"
                    />
                  )}
                </button>

                {/* Right side — action button */}
                <button
                  type="button"
                  disabled={uploading}
                  onClick={async () => {
                    if (displayImage) {
                      setUploadedImage(null);
                      onUpdateSection(section.id, { photoUrl: null } as never);
                      if (profile?.username) {
                        try {
                          await updateProfile(profile.username, {
                            photoUrl: null,
                          });
                          queryClient.invalidateQueries({
                            queryKey: ["profile", "dashboard"],
                          });
                        } catch {
                          toast.error("Failed to remove profile photo.");
                        }
                      }
                    } else {
                      fileInputRef.current?.click();
                    }
                  }}
                  className="text-muted-foreground border-tertiary-b flex w-14 shrink-0 items-center justify-center border-l transition-colors hover:bg-[#F8FAFC] disabled:opacity-50"
                  aria-label={displayImage ? "Remove image" : "Upload image"}
                  title={
                    uploading
                      ? "Uploading..."
                      : displayImage
                        ? "Remove image"
                        : "Upload image"
                  }
                >
                  {uploading ? (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#087583] border-t-transparent" />
                  ) : displayImage ? (
                    <Trash2 size={16} className="text-[#9F2B2B]" />
                  ) : (
                    <Upload size={16} />
                  )}
                </button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                aria-hidden
              />
            </div>


          </div>
        ) : (
          /* Section tab — Image upload */
          <div className="flex flex-col gap-6">
            {/* Upload area */}
            <div
              className="border-tertiary-b flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-8 transition-colors hover:bg-[#FAFAFA]"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload size={24} className="text-[#A2A2A2]" />
              <p className="text-sm text-[#747474]">
                Click to upload · 5MB max
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              aria-hidden
            />

            {/* Image preview */}
            <div>
              <label className="text-primary-text mb-2 block text-sm font-semibold">
                Image
              </label>
              <div className="border-tertiary-b flex h-16 w-16 items-center justify-center overflow-hidden rounded-md border">
                {displayImage ? (
                  <Image
                    src={displayImage}
                    alt="Profile"
                    width={64}
                    height={64}
                    className="h-full w-full object-cover"
                    unoptimized
                  />
                ) : (
                  <Image
                    src="/profilebuilder_home/icons/placeholder.svg"
                    alt="placeholder"
                    width={24}
                    height={24}
                    className="shrink-0 opacity-40"
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}

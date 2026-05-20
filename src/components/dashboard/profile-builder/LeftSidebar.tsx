"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, Search, Plus, GripVertical, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Section {
  id: string;
  title: string;
  type: string;
}

interface LeftSidebarProps {
  sections: Section[];
  selectedSectionId: string | null;
  onSelectSection: (id: string) => void;
  onAddSection: (title: string, type: string) => void;
  onRemoveSection: (id: string) => void;
  profile?: {
    fullName?: string;
  } | null;
}

export default function LeftSidebar({
  sections,
  selectedSectionId,
  onSelectSection,
  onAddSection,
  onRemoveSection,
  profile,
}: LeftSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddingSection, setIsAddingSection] = useState(false);

  const filteredSections = sections.filter((section) => {
    const displayTitle =
      section.type === "bio" &&
      section.title === "Bio - John Smith" &&
      profile?.fullName
        ? `Bio - ${profile.fullName}`
        : section.title;
    return displayTitle.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleSelectCard = (title: string, type: string) => {
    onAddSection(title, type);
    setIsAddingSection(false);
  };

  if (isAddingSection) {
    return (
      <aside className="border-tertiary-b animate-in fade-in flex h-full w-[320px] shrink-0 flex-col border bg-white p-6 shadow-sm duration-200 select-none">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => setIsAddingSection(false)}
            className="text-primary-text hover:text-link-hover-text inline-flex items-center gap-2 text-base font-semibold transition-all"
          >
            <ChevronLeft size={20} />
            <span>Add Section</span>
          </button>
        </div>

        {/* Subheader */}
        <div className="border-tertiary-b mb-6 flex items-center justify-between border-b pb-4">
          <span className="text-primary-text text-sm font-bold">Sections</span>
          <span className="bg-hover-bg text-primary-text flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold">
            4
          </span>
        </div>

        {/* Grid outline of Cards */}
        <div className="grid auto-rows-max grid-cols-2 gap-4 overflow-y-auto pr-1">
          {/* Card 1: Bio */}
          <div
            onClick={() => handleSelectCard("Bio", "bio")}
            className="group border-tertiary-b hover:border-brand-b flex h-[140px] cursor-pointer flex-col overflow-hidden rounded-[16px] border bg-white transition-all duration-200 hover:shadow-sm"
          >
            <div className="flex flex-1 items-center bg-white p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1A1A1A] text-white">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                  <div className="h-1.5 w-[42px] rounded-full bg-[#A5A5A5]" />
                  <div className="h-1.5 w-[28px] rounded-full bg-[#A5A5A5]" />
                  <div className="h-1.5 w-[20px] rounded-full bg-[#1A1A1A]" />
                </div>
              </div>
            </div>
            <div className="text-primary-text flex h-[36px] items-center bg-[#F4F4F5] px-4 text-[13px] font-medium transition-colors group-hover:bg-[#E5E7EB]">
              Bio
            </div>
          </div>

          {/* Card 2: Links */}
          <div
            onClick={() => handleSelectCard("Links", "links")}
            className="group border-tertiary-b hover:border-brand-b flex h-[140px] cursor-pointer flex-col overflow-hidden rounded-[16px] border bg-white transition-all duration-200 hover:shadow-sm"
          >
            <div className="flex flex-1 items-center bg-white p-4">
              <div className="flex items-center gap-2">
                <div className="flex shrink-0 items-center justify-center text-[#A5A5A5]">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                  </svg>
                </div>
                <div className="ml-1 flex min-w-0 flex-1 flex-col gap-1.5">
                  <div className="h-1.5 w-[42px] rounded-full bg-[#A5A5A5]" />
                  <div className="h-1.5 w-[24px] rounded-full bg-[#A5A5A5]" />
                </div>
              </div>
            </div>
            <div className="text-primary-text flex h-[36px] items-center bg-[#F4F4F5] px-4 text-[13px] font-medium transition-colors group-hover:bg-[#E5E7EB]">
              Links
            </div>
          </div>

          {/* Card 3: Portfolio */}
          <div
            onClick={() => handleSelectCard("Portfolio", "projects")}
            className="group border-tertiary-b hover:border-brand-b flex h-[140px] cursor-pointer flex-col overflow-hidden rounded-[16px] border bg-white transition-all duration-200 hover:shadow-sm"
          >
            <div className="flex flex-1 flex-col justify-center bg-white p-4">
              <div className="flex flex-col gap-2">
                <svg
                  className="text-[#A5A5A5]"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
                <div className="mt-1 flex flex-col gap-1.5">
                  <div className="h-1.5 w-[48px] rounded-full bg-[#A5A5A5]" />
                  <div className="h-1.5 w-[24px] rounded-full bg-[#E5E7EB]" />
                </div>
              </div>
            </div>
            <div className="text-primary-text flex h-[36px] items-center bg-[#F4F4F5] px-4 text-[13px] font-medium transition-colors group-hover:bg-[#E5E7EB]">
              Portfolio
            </div>
          </div>

          {/* Card 4: CTA */}
          <div
            onClick={() => handleSelectCard("CTA", "experience")}
            className="group border-tertiary-b hover:border-brand-b flex h-[140px] cursor-pointer flex-col overflow-hidden rounded-[16px] border bg-white transition-all duration-200 hover:shadow-sm"
          >
            <div className="flex flex-1 flex-col justify-center bg-white p-4">
              <div className="flex flex-col gap-2">
                <div className="h-7 w-7 rounded-full bg-[#A5A5A5]" />
                <div className="mt-1 flex flex-col gap-1.5">
                  <div className="h-1.5 w-[24px] rounded-full bg-[#E5E7EB]" />
                  <div className="h-1.5 w-[48px] rounded-full bg-[#A5A5A5]" />
                </div>
              </div>
            </div>
            <div className="text-primary-text flex h-[36px] items-center bg-[#F4F4F5] px-4 text-[13px] font-medium transition-colors group-hover:bg-[#E5E7EB]">
              CTA
            </div>
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside className="border-tertiary-b animate-in fade-in flex h-full w-[320px] shrink-0 flex-col border bg-white p-6 shadow-sm duration-200 select-none">
      {/* Back Button */}
      <div className="mb-6">
        <Link
          href="/dashboard"
          className="text-primary-text hover:text-link-hover-text inline-flex items-center gap-2 text-base font-semibold transition-all"
        >
          <ChevronLeft size={20} />
          <span>Home</span>
        </Link>
      </div>

      {/* Search Input */}
      <div className="relative mb-6">
        <span className="text-tertiary-text absolute inset-y-0 left-3 flex items-center">
          <Search size={18} />
        </span>
        <input
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border-tertiary-b text-primary-text placeholder-tertiary-text focus:border-brand-b focus:ring-brand-b w-full rounded-[10px] border bg-white py-3 pr-4 pl-10 text-sm font-medium transition-all outline-none focus:ring-1"
        />
      </div>

      {/* Add Section Button */}
      <div className="mb-6">
        <Button
          onClick={() => setIsAddingSection(true)}
          className="bg-brand-hover-bg hover:bg-brand flex h-12 w-full items-center justify-start gap-3 rounded-[10px] px-5 text-sm font-semibold text-white transition-all active:scale-95"
        >
          <Plus size={18} />
          Add Section
        </Button>
      </div>

      {/* Sections List */}
      <div className="flex-1 overflow-y-auto pr-1">
        <div className="flex flex-col gap-3">
          {filteredSections.map((section) => {
            const isSelected = selectedSectionId === section.id;
            return (
              <div
                key={section.id}
                onClick={() => onSelectSection(section.id)}
                className={`group flex cursor-pointer items-center justify-between overflow-hidden rounded-xl border transition-all duration-200 ${
                  isSelected
                    ? "border-brand-b bg-brand-light-subtle-bg shadow-sm"
                    : "border-tertiary-b hover:border-secondary-b hover:bg-primary-bg bg-white"
                }`}
              >
                <div className="flex min-w-0 flex-1 items-center justify-between px-4 py-3">
                  <p
                    className={`truncate text-sm font-semibold transition-colors ${
                      isSelected ? "text-link-hover-text" : "text-primary-text"
                    }`}
                  >
                    {section.type === "bio" &&
                    section.title === "Bio - John Smith" &&
                    profile?.fullName
                      ? `Bio - ${profile.fullName}`
                      : section.title}
                  </p>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveSection(section.id);
                    }}
                    className="hover:bg-hover-bg hover:text-negative-text ml-2 shrink-0 rounded-lg p-1.5 text-gray-400 opacity-0 transition-all group-hover:opacity-100"
                    title="Delete Section"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>

                <div className="border-tertiary-b bg-active-bg text-tertiary-text hover:bg-hover-bg flex cursor-grab items-center justify-center self-stretch border-l px-3.5 transition-colors active:cursor-grabbing">
                  <GripVertical size={16} />
                </div>
              </div>
            );
          })}

          {filteredSections.length === 0 && (
            <p className="text-tertiary-text py-8 text-center text-xs font-medium">
              No sections found
            </p>
          )}
        </div>
      </div>
    </aside>
  );
}

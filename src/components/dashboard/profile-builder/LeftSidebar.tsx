"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, Search, Plus, GripVertical, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import LinkSidebar, { type SavedLink } from "./LinkSidebar";

interface Section {
  id: string;
  title: string;
  type: string;
  subtitle?: string;
  links?: SavedLink[];
}

interface LeftSidebarProps {
  sections: Section[];
  selectedSectionId: string | null;
  selectedSection: Section | null;
  onSelectSection: (id: string) => void;
  onAddSection: (title: string, type: string) => void;
  onRemoveSection: (id: string) => void;
  onUpdateSection: (id: string, updates: Partial<Section>) => void;
  profile?: {
    fullName?: string;
  } | null;
}

export default function LeftSidebar({
  sections,
  selectedSectionId,
  selectedSection,
  onSelectSection,
  onAddSection,
  onRemoveSection,
  onUpdateSection,
  profile,
}: LeftSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddingSection, setIsAddingSection] = useState(false);
  const [linkSidebarOpen, setLinkSidebarOpen] = useState(false);

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

  const isDisabled = sections.some((s) => s.type === "links");

  const handleSwitchToAddLinkSection = () => {
    handleSelectCard("Links", "links");
    setIsAddingSection(false);
    setLinkSidebarOpen(true);
  };

  if (isAddingSection) {
    return (
      <aside className="border-tertiary-b animate-in fade-in flex h-full w-72.5 shrink-0 flex-col border bg-white p-6 shadow-sm duration-200 select-none">
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
          <button
            type="button"
            onClick={() => handleSelectCard("Bio", "bio")}
            className="group border-tertiary-b hover:border-brand-b flex h-35 w-full cursor-pointer flex-col overflow-hidden rounded-[16px] border bg-white text-left transition-all duration-200 hover:shadow-sm"
          >
            <div className="flex flex-1 items-center bg-white p-2">
              <Image
                src="/profilebuilder_home/bio.png"
                alt="Bio"
                width={107}
                height={32}
                className="object-contain"
              />
            </div>
            <div className="text-primary-text flex h-9 items-center bg-[#F4F4F5] px-4 text-[13px] font-medium transition-colors group-hover:bg-[#E5E7EB]">
              Bio
            </div>
          </button>

          {/* Card 2: Links */}
          <button
            type="button"
            onClick={handleSwitchToAddLinkSection}
            disabled={isDisabled}
            className={`group border-tertiary-b hover:border-brand-b disabled:border-tertiary-b flex h-35 w-full cursor-pointer flex-col overflow-hidden rounded-[16px] border bg-white text-left transition-all duration-200 hover:shadow-sm disabled:cursor-not-allowed disabled:bg-[#F4F4F5] disabled:opacity-70 ${isDisabled ? "cursor-not-allowed opacity-70" : "hover:shadow-sm"}`}
          >
            <div className="-mx-1 flex flex-1 items-center bg-white p-2">
              {isDisabled ? (
                <Image
                  src="/profilebuilder_home/link_disabled.svg"
                  alt="Links"
                  width={84}
                  height={48}
                  className="object-contain"
                />
              ) : (
                <Image
                  src="/profilebuilder_home/links.png"
                  alt="Links"
                  width={84}
                  height={48}
                  className="object-contain"
                />
              )}
            </div>
            <div className="text-primary-text flex h-9 items-center bg-[#F4F4F5] px-4 text-[13px] font-medium transition-colors group-hover:bg-[#E5E7EB]">
              Links
            </div>
          </button>

          {/* Card 3: Portfolio */}
          <button
            type="button"
            onClick={() => handleSelectCard("Portfolio", "projects")}
            className="group border-tertiary-b hover:border-brand-b flex h-35 w-full cursor-pointer flex-col overflow-hidden rounded-[16px] border bg-white text-left transition-all duration-200 hover:shadow-sm"
          >
            <div className="flex flex-1 items-center bg-white p-2">
              <Image
                src="/profilebuilder_home/portfolio.png"
                alt="Portfolio"
                width={46}
                height={48}
                className="object-contain"
              />
            </div>
            <div className="text-primary-text flex h-9 items-center bg-[#F4F4F5] px-4 text-[13px] font-medium transition-colors group-hover:bg-[#E5E7EB]">
              Portfolio
            </div>
          </button>

          {/* Card 4: CTA */}
          <button
            type="button"
            onClick={() => handleSelectCard("CTA", "experience")}
            className="group border-tertiary-b hover:border-brand-b flex h-35 w-full cursor-pointer flex-col overflow-hidden rounded-[16px] border bg-white text-left transition-all duration-200 hover:shadow-sm"
          >
            <div className="flex flex-1 items-center bg-white p-2">
              <Image
                src="/profilebuilder_home/cta.png"
                alt="CTA"
                width={48}
                height={48}
                className="object-contain"
              />
            </div>
            <div className="text-primary-text flex h-9 items-center bg-[#F4F4F5] px-4 text-[13px] font-medium transition-colors group-hover:bg-[#E5E7EB]">
              CTA
            </div>
          </button>
        </div>
      </aside>
    );
  }

  if (linkSidebarOpen) {
    return (
      <LinkSidebar
        returnTab={() => setLinkSidebarOpen(false)}
        section={selectedSection?.type === "links" ? selectedSection : null}
        onUpdateSection={onUpdateSection}
      />
    );
  }

  return (
    <aside className="border-tertiary-b animate-in fade-in flex h-full w-72.5 shrink-0 flex-col border bg-white p-6 shadow-sm duration-200 select-none">
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
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onSelectSection(section.id);
                  }
                }}
                role="button"
                tabIndex={0}
                className={`group focus:ring-brand-b flex cursor-pointer items-center justify-between overflow-hidden rounded-xl border transition-all duration-200 focus:ring-2 focus:outline-none ${
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
                    aria-label={`Delete section ${section.title}`}
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

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
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [newSectionType, setNewSectionType] = useState("bio");

  const filteredSections = sections.filter((section) => {
    const displayTitle =
      section.type === "bio" &&
      section.title === "Bio - John Smith" &&
      profile?.fullName
        ? `Bio - ${profile.fullName}`
        : section.title;
    return displayTitle.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSectionTitle.trim()) return;
    onAddSection(newSectionTitle.trim(), newSectionType);
    setNewSectionTitle("");
    setShowAddForm(false);
  };

  return (
    <aside className="border-tertiary-b bg-card flex h-full w-[320px] shrink-0 flex-col border-r p-6 select-none">
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
        {showAddForm ? (
          <form
            onSubmit={handleAddSubmit}
            className="border-tertiary-b bg-primary-bg rounded-xl border p-4 transition-all"
          >
            <h4 className="text-tertiary-text mb-2 text-xs font-bold tracking-wider uppercase">
              New Section
            </h4>
            <input
              type="text"
              placeholder="Section Title"
              value={newSectionTitle}
              onChange={(e) => setNewSectionTitle(e.target.value)}
              className="border-tertiary-b focus:border-brand-b mb-3 w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none"
              required
              autoFocus
            />
            <div className="mb-3">
              <label className="text-tertiary-text mb-1 block text-xs font-medium">
                Type
              </label>
              <select
                value={newSectionType}
                onChange={(e) => setNewSectionType(e.target.value)}
                className="border-tertiary-b focus:border-brand-b w-full rounded-lg border bg-white px-2 py-2 text-sm outline-none"
              >
                <option value="bio">Bio / Header</option>
                <option value="projects">Projects</option>
                <option value="links">Social Links</option>
                <option value="experience">Experience</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-brand-hover-bg hover:bg-brand flex-1 rounded-lg py-2 text-xs font-semibold text-white transition-colors"
              >
                Create
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="border-tertiary-b text-primary-text hover:bg-hover-bg rounded-lg border bg-white px-3 py-2 text-xs font-semibold transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <Button
            onClick={() => setShowAddForm(true)}
            className="bg-brand-hover-bg hover:bg-brand flex w-full items-center justify-center gap-2 rounded-[10px] py-4 text-sm font-semibold text-white transition-all"
          >
            <Plus size={18} />
            Add Section
          </Button>
        )}
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

                <div className="bg-active-bg border-tertiary-b text-tertiary-text hover:bg-hover-bg flex cursor-grab items-center justify-center self-stretch border-l px-3.5 transition-colors active:cursor-grabbing">
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

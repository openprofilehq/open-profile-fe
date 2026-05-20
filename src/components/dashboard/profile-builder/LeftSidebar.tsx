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
}

export default function LeftSidebar({
  sections,
  selectedSectionId,
  onSelectSection,
  onAddSection,
  onRemoveSection,
}: LeftSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [newSectionType, setNewSectionType] = useState("bio");

  const filteredSections = sections.filter((section) =>
    section.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSectionTitle.trim()) return;
    onAddSection(newSectionTitle.trim(), newSectionType);
    setNewSectionTitle("");
    setShowAddForm(false);
  };

  return (
    <aside className="flex h-full w-[320px] shrink-0 flex-col border-r border-[#EDEDED] bg-white p-6 select-none">
      {/* Back Button */}
      <div className="mb-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-base font-semibold text-[#050505] transition-all hover:text-[#087583]"
        >
          <ChevronLeft size={20} />
          <span>Home</span>
        </Link>
      </div>

      {/* Search Input */}
      <div className="relative mb-6">
        <span className="absolute inset-y-0 left-3 flex items-center text-[#747474]">
          <Search size={18} />
        </span>
        <input
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-[10px] border border-[#EDEDED] bg-white py-3 pr-4 pl-10 text-sm font-medium text-[#050505] placeholder-[#747474] transition-all outline-none focus:border-[#087583] focus:ring-1 focus:ring-[#087583]"
        />
      </div>

      {/* Add Section Button */}
      <div className="mb-6">
        {showAddForm ? (
          <form
            onSubmit={handleAddSubmit}
            className="rounded-xl border border-[#EDEDED] bg-[#FAFAFA] p-4 transition-all"
          >
            <h4 className="mb-2 text-xs font-bold tracking-wider text-[#747474] uppercase">
              New Section
            </h4>
            <input
              type="text"
              placeholder="Section Title"
              value={newSectionTitle}
              onChange={(e) => setNewSectionTitle(e.target.value)}
              className="mb-3 w-full rounded-lg border border-[#EDEDED] bg-white px-3 py-2 text-sm outline-none focus:border-[#087583]"
              required
              autoFocus
            />
            <div className="mb-3">
              <label className="mb-1 block text-xs font-medium text-[#747474]">
                Type
              </label>
              <select
                value={newSectionType}
                onChange={(e) => setNewSectionType(e.target.value)}
                className="w-full rounded-lg border border-[#EDEDED] bg-white px-2 py-2 text-sm outline-none focus:border-[#087583]"
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
                className="flex-1 rounded-lg bg-[#087583] py-2 text-xs font-semibold text-white hover:bg-[#065e69]"
              >
                Create
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="rounded-lg border border-[#EDEDED] bg-white px-3 py-2 text-xs font-semibold text-[#050505] hover:bg-[#F5F5F5]"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <Button
            onClick={() => setShowAddForm(true)}
            className="flex w-full items-center justify-center gap-2 rounded-[10px] bg-[#087583] py-4 text-sm font-semibold text-white transition-all hover:bg-[#065e69]"
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
                className={`group flex cursor-pointer items-center justify-between rounded-[10px] border p-4 transition-all duration-200 ${
                  isSelected
                    ? "border-[#087583] bg-[#F1FDFE] shadow-sm"
                    : "border-[#EDEDED] bg-[#FAFAFA] hover:border-gray-300 hover:bg-white"
                }`}
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <span className="text-[#A2A2A2] transition-colors group-hover:text-[#747474]">
                    <GripVertical size={16} />
                  </span>
                  <div className="overflow-hidden">
                    <p
                      className={`truncate text-sm font-semibold transition-colors ${
                        isSelected ? "text-[#087583]" : "text-[#050505]"
                      }`}
                    >
                      {section.title}
                    </p>
                    <span className="text-[10px] font-medium tracking-wider text-[#A2A2A2] uppercase">
                      {section.type}
                    </span>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveSection(section.id);
                  }}
                  className="rounded-lg p-1.5 text-gray-400 opacity-0 transition-all group-hover:opacity-100 hover:bg-gray-100 hover:text-red-500"
                  title="Delete Section"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            );
          })}

          {filteredSections.length === 0 && (
            <p className="py-8 text-center text-xs font-medium text-[#747474]">
              No sections found
            </p>
          )}
        </div>
      </div>
    </aside>
  );
}

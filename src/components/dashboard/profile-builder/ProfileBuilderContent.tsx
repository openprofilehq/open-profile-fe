"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { dashboardProfileOption } from "@/api/profile/profile.options";
import BuilderHeader from "./BuilderHeader";
import LeftSidebar from "./LeftSidebar";
import PreviewCanvas from "./PreviewCanvas";
import RightPanel from "./RightPanel";

interface Section {
  id: string;
  title: string;
  type: string;
}

export default function ProfileBuilderContent() {
  const dashboardProfile = useQuery(dashboardProfileOption());
  const profile = dashboardProfile.data;
  // Styles State
  const [font, setFont] = useState("Afacad");
  const [textColor, setTextColor] = useState("#050505");
  const [bgColor, setBgColor] = useState("#FFFFFF");
  const [iconColor, setIconColor] = useState("#087583");
  const [spacing, setSpacing] = useState(20);
  const [borderRadius, setBorderRadius] = useState<
    "sharp" | "medium" | "round"
  >("medium");
  const [theme, setTheme] = useState<"light" | "dark">("light");

  // Sections State
  const [sections, setSections] = useState<Section[]>([
    { id: "1", title: "Bio - John Smith", type: "bio" },
  ]);

  // UI Selection State
  const [activeTab, setActiveTab] = useState<"general" | "section">("general");
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(
    "1"
  );

  // Handlers
  const handleSelectSection = (id: string) => {
    setSelectedSectionId(id);
    setActiveTab("section");
  };

  const handleAddSection = (title: string, type: string) => {
    const newSection: Section = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      type,
    };
    setSections([...sections, newSection]);
    setSelectedSectionId(newSection.id);
    setActiveTab("section");
  };

  const handleRemoveSection = (id: string) => {
    const updated = sections.filter((s) => s.id !== id);
    setSections(updated);
    if (selectedSectionId === id) {
      setSelectedSectionId(updated[0]?.id || null);
    }
  };

  const handleUpdateSection = (id: string, updates: Partial<Section>) => {
    setSections(sections.map((s) => (s.id === id ? { ...s, ...updates } : s)));
  };

  const selectedSection =
    sections.find((s) => s.id === selectedSectionId) || null;

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-[#FAFAFA]">
      {/* 1. Header (Standard full screen top header) */}
      <BuilderHeader />

      {/* 2. Main Builder Workplace (Left, Canvas, Right) */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Side: Sections Outline */}
        <LeftSidebar
          sections={sections}
          selectedSectionId={selectedSectionId}
          onSelectSection={handleSelectSection}
          onAddSection={handleAddSection}
          onRemoveSection={handleRemoveSection}
          profile={profile}
        />

        {/* Center Canvas Preview: Real-time update device */}
        <PreviewCanvas
          font={font}
          textColor={textColor}
          bgColor={bgColor}
          iconColor={iconColor}
          spacing={spacing}
          borderRadius={borderRadius}
          theme={theme}
          sections={sections}
          profile={profile}
        />

        <RightPanel
          font={font}
          onChangeFont={setFont}
          textColor={textColor}
          onChangeTextColor={setTextColor}
          bgColor={bgColor}
          onChangeBgColor={setBgColor}
          iconColor={iconColor}
          onChangeIconColor={setIconColor}
          spacing={spacing}
          onChangeSpacing={setSpacing}
          borderRadius={borderRadius}
          onChangeBorderRadius={setBorderRadius}
          theme={theme}
          onChangeTheme={setTheme}
          activeTab={activeTab}
          onChangeTab={setActiveTab}
          selectedSection={selectedSection}
          onUpdateSection={handleUpdateSection}
        />
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { dashboardProfileOption } from "@/api/profile/profile.options";
import BuilderHeader from "./BuilderHeader";
import LeftSidebar from "./LeftSidebar";
import PreviewCanvas from "./PreviewCanvas";
import RightPanel from "./RightPanel";
import CtaLeftPanel from "../cta/CtaLeftPanel";

interface Section {
  id: string;
  title: string;
  type: string;
  ctaTitle?: string;
  ctaSubtitle?: string;
  ctaButton?: string;
  ctaButtonLink?: string;
  ctaLayout?: "center" | "left" | "right";
  ctaSpacingTop?: number;
  ctaSpacingBottom?: number;
  ctaSpacingGap?: number;
  ctaSpacingPadding?: number;
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
      ...(type === "cta" && {
        ctaTitle: "Let's build something.",
        ctaSubtitle:
          "I'm currently accepting new projects and consulting opportunities for Q3 2026.",
        ctaButton: "Start a Conversation",
        ctaButtonLink: "",
        ctaLayout: "center",
        ctaSpacingTop: 24,
        ctaSpacingBottom: 24,
        ctaSpacingGap: 20,
        ctaSpacingPadding: 16,
      }),
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
    <div className="bg-primary-bg flex h-screen w-screen flex-col overflow-hidden">
      <BuilderHeader />

      <div className="flex flex-1 gap-2 overflow-hidden bg-[#F6F7F9] p-2 px-4">
        {selectedSection?.type === "cta" ? (
          <CtaLeftPanel
            section={selectedSection}
            onBack={() => {
              const firstSection = sections.find((s) => s.type !== "cta");
              setSelectedSectionId(firstSection?.id ?? null);
              setActiveTab("general");
            }}
            onUpdate={(updates) =>
              handleUpdateSection(selectedSection.id, updates)
            }
          />
        ) : (
          <LeftSidebar
            sections={sections}
            selectedSectionId={selectedSectionId}
            onSelectSection={handleSelectSection}
            onAddSection={handleAddSection}
            onRemoveSection={handleRemoveSection}
            profile={profile}
          />
        )}

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
          selectedSectionType={selectedSection?.type ?? null}
          selectedSectionId={selectedSectionId}
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

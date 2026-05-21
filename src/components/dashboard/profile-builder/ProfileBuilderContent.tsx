"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { dashboardProfileOption } from "@/api/profile/profile.options";
import BuilderHeader from "./BuilderHeader";
import LeftSidebar from "./LeftSidebar";
import PreviewCanvas from "./PreviewCanvas";
import RightPanel from "./RightPanel";
import Link from "next/link";
import type { Section } from "./types";

export default function ProfileBuilderContent() {
  const dashboardProfile = useQuery(dashboardProfileOption());
  const profile = dashboardProfile.data;

  const [font, setFont] = useState("Afacad");
  const [textColor, setTextColor] = useState("#050505");
  const [bgColor, setBgColor] = useState("#FFFFFF");
  const [iconColor, setIconColor] = useState("#087583");
  const [spacing, setSpacing] = useState(20);
  const [borderRadius, setBorderRadius] = useState<
    "sharp" | "medium" | "round"
  >("medium");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [sections, setSections] = useState<Section[]>([
    {
      id: "bio",
      title: "Bio",
      type: "bio",
      visible: true,
    },
    {
      id: "links",
      title: "Links - Featured Links",
      type: "links",
      visible: true,
    },
    {
      id: "projects",
      title: "Projects - Portfolio",
      type: "projects",
      visible: true,
      projects: [
        {
          id: "default-project-1",
          title: "OpenProfile Platform",
          description: "Open-source links-in-bio platform for modern creators.",
          url: "https://github.com",
        },
      ],
    },
    {
      id: "cta",
      title: "Let's build something",
      type: "experience",
      visible: true,
      subtitle:
        "I'm currently accepting new projects and consulting opportunities for Q3 2026.",
      layout: "1",
      buttonText: "Start a Conversation",
      url: "",
      iconId: "chat",
      iconSrc: "/profilebuilder_home/icons/chat.svg",
      iconLabel: "Chat",
    },
  ]);
  const resolvedSections = sections.map((section) =>
    section.id === "bio"
      ? {
          ...section,
          fullName: section.fullName ?? profile?.fullName ?? "",
          bio: section.bio ?? profile?.bio ?? "",
        }
      : section
  );

  const [activeTab, setActiveTab] = useState<"general" | "section">("general");
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(
    "bio"
  );

  const handleSelectSection = (id: string) => {
    setSelectedSectionId(id);
    setActiveTab("section");
  };

  const handleAddSection = (title: string, type: string) => {
    const newSection: Section = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      type,
      visible: true,
      subtitle: type === "links" ? "" : type === "experience" ? "" : undefined,
      links: type === "links" ? [] : undefined,
      projects: type === "projects" ? [] : undefined,
      layout: type === "experience" ? "1" : undefined,
      buttonText: type === "experience" ? "Start a Conversation" : undefined,
      url: type === "experience" ? "" : undefined,
      iconId: type === "experience" ? "chat" : undefined,
      iconSrc:
        type === "experience"
          ? "/profilebuilder_home/icons/chat.svg"
          : undefined,
      iconLabel: type === "experience" ? "Chat" : undefined,
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

  const handleToggleSectionVisibility = (id: string) => {
    setSections((currentSections) =>
      currentSections.map((section) =>
        section.id === id ? { ...section, visible: !section.visible } : section
      )
    );
  };

  const handleUpdateSection = (id: string, updates: Partial<Section>) => {
    setSections(sections.map((s) => (s.id === id ? { ...s, ...updates } : s)));
  };

  const selectedSection =
    resolvedSections.find((s) => s.id === selectedSectionId) || null;

  return (
    <>
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#FAFAFA] px-6 text-center lg:hidden">
        <h1 className="text-2xl font-bold text-[#050505]">
          Profile editor works best on desktop
        </h1>
        <p className="mt-3 max-w-[420px] text-[#747474]">
          Please use a desktop or large tablet to edit your profile layout.
        </p>
        <Link
          href="/dashboard"
          className="mt-6 rounded-[8px] bg-[#087583] px-5 py-3 font-semibold text-white"
        >
          Back to dashboard
        </Link>
      </div>

      <div className="bg-primary-bg hidden h-screen w-screen flex-col overflow-hidden lg:flex">
        <BuilderHeader />

        <div className="flex flex-1 gap-2 overflow-hidden bg-[#F6F7F9] p-2 px-4">
          <LeftSidebar
            sections={resolvedSections}
            selectedSectionId={selectedSectionId}
            selectedSection={selectedSection}
            onSelectSection={handleSelectSection}
            onAddSection={handleAddSection}
            onRemoveSection={handleRemoveSection}
            onToggleSectionVisibility={handleToggleSectionVisibility}
            onReorderSections={setSections}
            onUpdateSection={handleUpdateSection}
            profile={profile}
          />

          <PreviewCanvas
            font={font}
            textColor={textColor}
            bgColor={bgColor}
            iconColor={iconColor}
            spacing={spacing}
            borderRadius={borderRadius}
            theme={theme}
            sections={resolvedSections}
            profile={profile}
            onToggleSectionVisibility={handleToggleSectionVisibility}
            onRemoveSection={handleRemoveSection}
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
    </>
  );
}

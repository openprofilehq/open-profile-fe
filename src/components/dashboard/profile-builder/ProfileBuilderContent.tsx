"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  dashboardProfileOption,
  profileContentOption,
  draftStateOption,
} from "@/api/profile/profile.options";
import { upsertDraft, publishProfile } from "@/api/profile/profile.service";
import BuilderHeader from "./BuilderHeader";
import LeftSidebar from "./LeftSidebar";
import PreviewCanvas from "./PreviewCanvas";
// import RightPanel from "./RightPanel";
import Link from "next/link";
import type { Section } from "./types";
import { contentToSections, sectionsToContent } from "./builder.utils";
import { ROUTES } from "@/constants/routes";

const createSection = (type: string, customTitle?: string): Section | null => {
  const allowedTypes: Record<string, Section["type"]> = {
    bio: "bio",
    links: "links",
    projects: "projects",
    experience: "experience",
    cta: "experience",
  };

  const resolvedType = allowedTypes[type];
  if (!resolvedType) return null;

  const stableIds: Record<string, string> = {
    bio: "bio",
    links: "links",
    projects: "projects",
    experience: "cta",
    cta: "cta",
  };

  const title =
    customTitle ||
    (resolvedType === "links"
      ? "Links"
      : resolvedType === "projects"
        ? "Portfolio"
        : resolvedType === "bio"
          ? "Profile"
          : "CTA");

  return {
    id: stableIds[type] ?? Math.random().toString(36).substring(2, 11),
    title,
    type: resolvedType,
    visible: true,
    subtitle:
      resolvedType === "links"
        ? ""
        : resolvedType === "experience"
          ? ""
          : undefined,
    links: resolvedType === "links" ? [] : undefined,
    projects: resolvedType === "projects" ? [] : undefined,
    layout: resolvedType === "experience" ? "1" : undefined,
    buttonText:
      resolvedType === "experience" ? "Start a Conversation" : undefined,
    url: resolvedType === "experience" ? "" : undefined,
    iconId: resolvedType === "experience" ? "chat" : undefined,
    iconSrc:
      resolvedType === "experience"
        ? "/profilebuilder_home/icons/chat.svg"
        : undefined,
    iconLabel: resolvedType === "experience" ? "Chat" : undefined,
  };
};

export default function ProfileBuilderContent() {
  const queryClient = useQueryClient();

  const searchParams = useSearchParams();
  const sectionParam = searchParams.get("section"); // e.g. "links" | "projects"

  const [_activeTab, setActiveTab] = useState<"general" | "section">(
    sectionParam ? "section" : "general"
  );
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(
    sectionParam ?? "bio"
  );

  const dashboardProfile = useQuery(dashboardProfileOption());
  const profileContent = useQuery(profileContentOption());
  const draftState = useQuery(draftStateOption());

  const profile = dashboardProfile.data;

  const [font, _setFont] = useState("Afacad");
  const [textColor, _setTextColor] = useState("#050505");
  const [bgColor, _setBgColor] = useState("#FFFFFF");
  const [iconColor, _setIconColor] = useState("#087583");
  const [spacing, _setSpacing] = useState(20);
  const [borderRadius, _setBorderRadius] = useState<
    "sharp" | "medium" | "round"
  >("medium");
  const [theme, _setTheme] = useState<"light" | "dark">("light");
  const [sections, setSections] = useState<Section[]>([]);

  const contentLoadedRef = useRef(false);
  const userEditedRef = useRef(false);
  const draftUpdatedAtRef = useRef<string | null>(null);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (
      contentLoadedRef.current ||
      !profileContent.isSuccess ||
      !draftState.isSuccess ||
      !dashboardProfile.isSuccess
    ) {
      return;
    }

    contentLoadedRef.current = true;
    const loadedSections = contentToSections(
      profileContent.data,
      dashboardProfile.data
    );

    // Automatically initialize section if requested via URL search param and missing
    if (sectionParam) {
      const exists = loadedSections.some((s) => s.id === sectionParam);
      if (!exists) {
        const newSection = createSection(sectionParam);
        if (newSection) {
          loadedSections.push(newSection);
        }
      }
    }

    setSections(loadedSections);
    draftUpdatedAtRef.current = draftState.data.updatedAt ?? null;
  }, [
    profileContent.isSuccess,
    profileContent.data,
    draftState.isSuccess,
    draftState.data,
    dashboardProfile.isSuccess,
    dashboardProfile.data,
    sectionParam,
  ]);

  const { mutate: saveDraft } = useMutation({
    mutationKey: ["profile", "draft", "upsert"],
    mutationFn: (variables: {
      data: Parameters<typeof upsertDraft>[0];
      draftVersion: string | null;
    }) => {
      return upsertDraft(variables.data, variables.draftVersion);
    },
    onSuccess(response) {
      const updatedAt = response?.data?.updatedAt;
      if (updatedAt) {
        draftUpdatedAtRef.current = updatedAt;
      } else {
        console.warn(
          "[draft] Save succeeded but response did not contain an updatedAt timestamp."
        );
      }
      queryClient.invalidateQueries({ queryKey: ["profile", "content"] });
    },
    onError(error: unknown) {
      console.error("[draft] Save FAILED! Full error object:", error);
      if (error instanceof Error) {
        console.error(
          "[draft] Error name:",
          error.name,
          "message:",
          error.message,
          "stack:",
          error.stack
        );
      }
      if (typeof error === "object" && error !== null) {
        console.error(
          "[draft] Error properties:",
          Object.keys(error),
          JSON.stringify(error)
        );
      }

      const errObj = error as Record<string, unknown>;
      if (
        errObj?.status === 409 ||
        errObj?.statusCode === 409 ||
        (error as Error).message?.includes("409")
      ) {
        toast.error(
          "Draft was modified in another session. Reloading latest changes...",
          { duration: 5000 }
        );
        queryClient.invalidateQueries({ queryKey: ["profile", "content"] });
        queryClient.invalidateQueries({ queryKey: ["profile", "draft-state"] });
        return;
      }
      const msg =
        error instanceof Error ? error.message : "Failed to save draft.";
      toast.error(msg);
    },
  });

  const saveDraftRef = useRef(saveDraft);
  useEffect(() => {
    saveDraftRef.current = saveDraft;
  });

  const sectionsRef = useRef(sections);
  // const themeSettingsRef = useRef({
  //   font,
  //   textColor,
  //   bgColor,
  //   iconColor,
  //   spacing,
  //   borderRadius,
  //   theme,
  // });
  useEffect(() => {
    sectionsRef.current = sections;
  }, [sections]);

  // useEffect(() => {
  //   themeSettingsRef.current = {
  //     font,
  //     textColor,
  //     bgColor,
  //     iconColor,
  //     spacing,
  //     borderRadius,
  //     theme,
  //   };
  // }, [font, textColor, bgColor, iconColor, spacing, borderRadius, theme]);

  useEffect(() => {
    if (!contentLoadedRef.current) return;
    if (!userEditedRef.current) {
      userEditedRef.current = true;
      return;
    }

    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
    }

    saveTimerRef.current = setTimeout(() => {
      const bioSection = sections.find((s) => s.type === "bio");
      const updatedAt = draftUpdatedAtRef.current;
      const payload = {
        bio: bioSection?.bio ?? null,
        content: sectionsToContent(sections),
      };
      saveDraftRef.current({ data: payload, draftVersion: updatedAt });
      saveTimerRef.current = null;
    }, 1000);

    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }
    };
  }, [
    sections,
    font,
    textColor,
    bgColor,
    iconColor,
    spacing,
    borderRadius,
    theme,
  ]);

  useEffect(() => {
    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
        const bioSection = sectionsRef.current.find((s) => s.type === "bio");
        const updatedAt = draftUpdatedAtRef.current;
        const payload = {
          bio: bioSection?.bio ?? null,
          content: sectionsToContent(sectionsRef.current),
        };
        upsertDraft(payload, updatedAt).catch((err) => {
          console.error("[draft] Unmount direct save FAILED:", err);
        });
      }
    };
  }, []);

  const { mutate: doPublish, isPending: isPublishing } = useMutation({
    mutationKey: ["profile", "publish"],
    mutationFn: publishProfile,
    onSuccess() {
      draftUpdatedAtRef.current = null;
      queryClient.invalidateQueries({ queryKey: ["profile", "content"] });
      queryClient.invalidateQueries({ queryKey: ["profile", "draft-state"] });
      toast.success("Profile published successfully.");
    },
    onError(error: unknown) {
      const msg =
        error instanceof Error ? error.message : "Failed to publish profile.";
      toast.error(msg);
    },
  });

  const handlePublish = () => doPublish(undefined as never);

  const resolvedSections = sections.map((section) =>
    section.id === "bio"
      ? {
          ...section,
          fullName: section.fullName ?? profile?.fullName ?? "",
          bio: section.bio ?? profile?.bio ?? "",
        }
      : section
  );

  useEffect(() => {
    if (sectionParam) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedSectionId(sectionParam);
      setActiveTab("section");

      setSections((curr) => {
        const exists = curr.some((s) => s.id === sectionParam);
        if (!exists && curr.length > 0) {
          const newSection = createSection(sectionParam);
          if (newSection) {
            return [...curr, newSection];
          }
        }
        return curr;
      });
    }
  }, [sectionParam]);

  const handleSelectSection = (id: string) => {
    setSelectedSectionId(id);
    setActiveTab("section");
  };

  const handleAddSection = (title: string, type: string) => {
    const newSection = createSection(type, title);
    if (!newSection) return;

    setSections((prev) => {
      const exists = prev.some((s) => s.id === newSection.id);
      if (exists) return prev;
      return [...prev, newSection];
    });
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
          href={ROUTES.dashboard.home}
          className="mt-6 rounded-[8px] bg-[#087583] px-5 py-3 font-semibold text-white"
        >
          Back to dashboard
        </Link>
      </div>

      <div className="bg-primary-bg hidden h-screen w-screen flex-col overflow-hidden lg:flex">
        <BuilderHeader onPublish={handlePublish} isPublishing={isPublishing} />

        <div className="flex flex-1 gap-2 overflow-hidden bg-[#F6F7F9] p-2 px-4">
          <LeftSidebar
            sections={resolvedSections}
            selectedSectionId={selectedSectionId}
            selectedSection={selectedSection}
            initialEditingSectionId={sectionParam}
            onSelectSection={handleSelectSection}
            onDeselectSection={() => setSelectedSectionId(null)}
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
            selectedSectionId={selectedSectionId}
            onToggleSectionVisibility={handleToggleSectionVisibility}
            onRemoveSection={handleRemoveSection}
          />

          {/* <RightPanel
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
          /> */}
        </div>
      </div>
    </>
  );
}

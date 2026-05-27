import { mutationOptions, queryOptions } from "@tanstack/react-query";
import type {
  UpsertDraftRequest,
  ProfileAppearanceRequest,
} from "./profile.type";
import {
  createProfile,
  checkUsername,
  getDashboardProfile,
  getProfileContent,
  getDraftState,
  upsertDraft,
  publishProfile,
  updateProfileAppearance,
  getProfileAppearance,
} from "./profile.service";
import { isQueryEnabled } from "@/api/base/base.util";
import { QueryStaleTime } from "@/api/base/base.const";
import { QueryBaseKeys } from "@/constants/query-keys";
import { TemplateType } from "@/components/dashboard/TemplateSelectionModal";

export const createProfileOption = mutationOptions({
  mutationKey: [QueryBaseKeys.profile, "create"],
  mutationFn: createProfile,
});

export function dashboardProfileOption() {
  return queryOptions({
    queryKey: [QueryBaseKeys.profile, "dashboard"],
    queryFn: ({ signal }) => getDashboardProfile(signal),
    staleTime: QueryStaleTime.fiveMins,
  });
}

export function checkUsernameOption(username: string | undefined) {
  return queryOptions({
    queryKey: ["username-availability", username],
    enabled: isQueryEnabled(username),
    queryFn: ({ signal }) => checkUsername(username!, signal),
    staleTime: QueryStaleTime.fiveMins,
  });
}

export function profileContentOption() {
  return queryOptions({
    queryKey: [QueryBaseKeys.profile, "content"],
    queryFn: ({ signal }) => getProfileContent(signal),
    staleTime: 0,
  });
}

export function draftStateOption() {
  return queryOptions({
    queryKey: [QueryBaseKeys.profile, "draft-state"],
    queryFn: ({ signal }) => getDraftState(signal),
    staleTime: 0,
  });
}

export const upsertDraftOption = mutationOptions({
  mutationKey: [QueryBaseKeys.profile, "draft", "upsert"],
  mutationFn: (variables: {
    data: UpsertDraftRequest;
    draftVersion?: string | null;
  }) => upsertDraft(variables.data, variables.draftVersion),
});

export const publishProfileOption = mutationOptions({
  mutationKey: [QueryBaseKeys.profile, "publish"],
  mutationFn: publishProfile,
});

export function profileAppearanceOption() {
  return queryOptions({
    queryKey: [QueryBaseKeys.profile, "appearance"],
    queryFn: ({ signal }) => getProfileAppearance(signal),
    staleTime: QueryStaleTime.fiveMins,
  });
}

export const updateProfileAppearanceOption = mutationOptions({
  mutationKey: [QueryBaseKeys.profile, "appearance", "update"],
  mutationFn: (data: ProfileAppearanceRequest) => updateProfileAppearance(data),
});

export const saveTemplateOption = mutationOptions({
  mutationKey: [QueryBaseKeys.profile, "template", "save"],
  mutationFn: async (templateType: TemplateType) => {
    const template = templateType.toLowerCase();

    // Define cohesive appearance settings for each template variant to provide immediate, wow factor aesthetics
    let accentColour = "#087583";
    let font: "inter" | "lato" | "poppins" | "playfair" | "roboto" = "inter";
    let cornerStyle: "sharp" | "rounded" | "pill" = "rounded";
    let spacing = 20;
    let theme: "light" | "dark" = "light";

    if (template === "creator") {
      accentColour = "#D97706";
      font = "lato";
      cornerStyle = "pill";
      spacing = 24;
      theme = "dark";
    } else if (template === "portfolio") {
      accentColour = "#4F46E5";
      font = "inter";
      cornerStyle = "sharp";
      spacing = 16;
      theme = "light";
    }

    const apiCornerStyle: "sharp" | "medium" | "round" =
      cornerStyle === "sharp"
        ? "sharp"
        : cornerStyle === "pill"
          ? "round"
          : "medium";

    const appearanceRes = await updateProfileAppearance({
      template,
      accentColour,
      font,
      cornerStyle: apiCornerStyle,
      spacing,
      theme,
    });

    // Sync theme settings to the draft state ONLY if live appearance succeeds
    await upsertDraft({
      themeSettings: {
        template,
        accentColour,
        font,
        borderRadius:
          cornerStyle === "sharp" ? 0 : cornerStyle === "pill" ? 16 : 8,
      },
    });

    return { appearanceRes, templateType };
  },
});

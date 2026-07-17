import { mutationOptions, queryOptions } from "@tanstack/react-query";
import type {
  UpsertDraftRequest,
  ProfileAppearanceRequest,
  TemplateType,
  ProfileAppearanceValues,
  ComponentAppearance,
  CreateSkillRequest,
  UpdateSkillRequest,
  ReorderSkillsRequest,
  CreateEducationRequest,
  UpdateEducationRequest,
  ReorderEducationRequest,
  CreateWorkExperienceRequest,
  UpdateWorkExperienceRequest,
  ReorderWorkExperienceRequest,
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
  getProfileSkills,
  createProfileSkill,
  updateProfileSkill,
  deleteProfileSkill,
  reorderProfileSkills,
  getProfileEducation,
  createProfileEducation,
  updateProfileEducation,
  deleteProfileEducation,
  reorderProfileEducation,
  getProfileWorkExperience,
  createProfileWorkExperience,
  updateProfileWorkExperience,
  deleteProfileWorkExperience,
  reorderProfileWorkExperience,
} from "./profile.service";
import { isQueryEnabled } from "@/api/base/base.util";
import { QueryStaleTime } from "@/api/base/base.const";
import { QueryBaseKeys } from "@/constants/query-keys";
import { getAppearanceResponseGlobal } from "@/utils/profileAppearance";

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

    let currentGlobalAppearance: Partial<ProfileAppearanceValues> = {};
    let currentComponents: Record<string, ComponentAppearance> | undefined;
    try {
      const res = await getProfileAppearance();
      currentGlobalAppearance = getAppearanceResponseGlobal(res) ?? {};
      const appearanceEnvelope = res.appearance || res.data;
      if (
        appearanceEnvelope &&
        typeof appearanceEnvelope === "object" &&
        "components" in appearanceEnvelope
      ) {
        currentComponents = (
          appearanceEnvelope as {
            components?: Record<string, ComponentAppearance>;
          }
        ).components;
      }
    } catch (e) {
      console.warn(
        "Could not fetch current appearance, proceeding with minimal payload",
        e
      );
    }

    const appearanceRes = await updateProfileAppearance({
      global: {
        ...currentGlobalAppearance,
        template,
      },
      components: currentComponents as ProfileAppearanceRequest["components"],
    });

    try {
      // TODO: Remove fallback to flat currentAppearance once all profiles migrated to nested global structure
      const {
        cornerStyle: _cornerStyle,
        spacing: _spacing,
        theme: _theme,
        backgroundColour: _backgroundColour,
        textColour: _textColour,
        ...allowedThemeSettings
      } = currentGlobalAppearance as Record<string, unknown>;
      await upsertDraft({
        themeSettings: {
          ...allowedThemeSettings,
          template,
        },
      });
    } catch (error) {
      console.warn("Failed to sync template settings to draft state:", error);
    }

    return { appearanceRes, templateType };
  },
});

export function profileSkillsOption() {
  return queryOptions({
    queryKey: [QueryBaseKeys.profile, "skills"],
    queryFn: ({ signal }) => getProfileSkills(signal),
    staleTime: 0,
  });
}

export const createProfileSkillOption = mutationOptions({
  mutationKey: [QueryBaseKeys.profile, "skills", "create"],
  mutationFn: (data: CreateSkillRequest) => createProfileSkill(data),
});

export const updateProfileSkillOption = mutationOptions({
  mutationKey: [QueryBaseKeys.profile, "skills", "update"],
  mutationFn: (variables: { skillId: string; data: UpdateSkillRequest }) =>
    updateProfileSkill(variables.skillId, variables.data),
});

export const deleteProfileSkillOption = mutationOptions({
  mutationKey: [QueryBaseKeys.profile, "skills", "delete"],
  mutationFn: (skillId: string) => deleteProfileSkill(skillId),
});

export const reorderProfileSkillsOption = mutationOptions({
  mutationKey: [QueryBaseKeys.profile, "skills", "order"],
  mutationFn: (data: ReorderSkillsRequest) => reorderProfileSkills(data),
});

export function profileEducationOption() {
  return queryOptions({
    queryKey: [QueryBaseKeys.profile, "education"],
    queryFn: ({ signal }) => getProfileEducation(signal),
    staleTime: 0,
  });
}

export const createProfileEducationOption = mutationOptions({
  mutationKey: [QueryBaseKeys.profile, "education", "create"],
  mutationFn: (data: CreateEducationRequest) => createProfileEducation(data),
});

export const updateProfileEducationOption = mutationOptions({
  mutationKey: [QueryBaseKeys.profile, "education", "update"],
  mutationFn: (variables: {
    educationId: string;
    data: UpdateEducationRequest;
  }) => updateProfileEducation(variables.educationId, variables.data),
});

export const deleteProfileEducationOption = mutationOptions({
  mutationKey: [QueryBaseKeys.profile, "education", "delete"],
  mutationFn: (educationId: string) => deleteProfileEducation(educationId),
});

export const reorderProfileEducationOption = mutationOptions({
  mutationKey: [QueryBaseKeys.profile, "education", "order"],
  mutationFn: (data: ReorderEducationRequest) => reorderProfileEducation(data),
});

export function profileWorkExperienceOption() {
  return queryOptions({
    queryKey: [QueryBaseKeys.profile, "work-experience"],
    queryFn: ({ signal }) => getProfileWorkExperience(signal),
    staleTime: 0,
  });
}

export const createProfileWorkExperienceOption = mutationOptions({
  mutationKey: [QueryBaseKeys.profile, "work-experience", "create"],
  mutationFn: (data: CreateWorkExperienceRequest) =>
    createProfileWorkExperience(data),
});

export const updateProfileWorkExperienceOption = mutationOptions({
  mutationKey: [QueryBaseKeys.profile, "work-experience", "update"],
  mutationFn: (variables: {
    workExperienceId: string;
    data: UpdateWorkExperienceRequest;
  }) => updateProfileWorkExperience(variables.workExperienceId, variables.data),
});

export const deleteProfileWorkExperienceOption = mutationOptions({
  mutationKey: [QueryBaseKeys.profile, "work-experience", "delete"],
  mutationFn: (workExperienceId: string) =>
    deleteProfileWorkExperience(workExperienceId),
});

export const reorderProfileWorkExperienceOption = mutationOptions({
  mutationKey: [QueryBaseKeys.profile, "work-experience", "order"],
  mutationFn: (data: ReorderWorkExperienceRequest) =>
    reorderProfileWorkExperience(data),
});

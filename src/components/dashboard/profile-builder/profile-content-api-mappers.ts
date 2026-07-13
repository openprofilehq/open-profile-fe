import type {
  CreateEducationRequest,
  CreateSkillRequest,
  CreateWorkExperienceRequest,
  EducationResponseDto,
  SkillResponseDto,
  WorkExperienceResponseDto,
} from "@/api/profile/profile.type";
import type { EducationItem, ExperienceItem, SkillItem } from "./types";

const toStringValue = (value: string | number | null | undefined) =>
  value == null ? "" : String(value);

const toNumberValue = (value: string | number | null | undefined) => {
  if (value == null) return undefined;

  if (typeof value === "string" && value.trim().length === 0) {
    return undefined;
  }

  const numberValue = Number(value);

  return Number.isFinite(numberValue) ? numberValue : undefined;
};

export function skillResponseToItem(skill: SkillResponseDto): SkillItem {
  return {
    id: skill.id,
    name: skill.name,
  };
}

export function skillItemToRequest(skill: SkillItem): CreateSkillRequest {
  return {
    name: skill.name.trim(),
  };
}

export function educationResponseToItem(
  education: EducationResponseDto
): EducationItem {
  return {
    id: education.id,
    institution: education.school,
    degree:
      education.fieldOfStudy && education.fieldOfStudy !== education.degree
        ? `${education.degree} ${education.fieldOfStudy}`.trim()
        : education.degree,
    startMonth: "",
    startYear: toStringValue(education.startYear),
    endMonth: "",
    endYear: toStringValue(education.endYear),
  };
}

export function educationItemToRequest(
  education: EducationItem
): CreateEducationRequest {
  const startYear =
    toNumberValue(education.startYear) ?? new Date().getFullYear();
  const endYear = toNumberValue(education.endYear) ?? startYear;
  const degree = education.degree.trim();

  return {
    school: education.institution.trim(),
    degree,
    // The current Figma form has one academic-program field. The API requires
    // both degree and fieldOfStudy, so use the same user-entered value for now.
    fieldOfStudy: degree,
    startYear,
    endYear: Math.max(endYear, startYear),
  };
}

export function workExperienceResponseToItem(
  workExperience: WorkExperienceResponseDto
): ExperienceItem {
  return {
    id: workExperience.id,
    role: workExperience.jobTitle,
    company: workExperience.companyName,
    // The API exposes location separately from the UI-only employment type.
    // Preserve location without treating it as employmentType.
    employmentType: "",
    location: workExperience.location ?? "",
    startMonth: toStringValue(workExperience.startMonth),
    startYear: toStringValue(workExperience.startYear),
    endMonth: workExperience.isCurrent
      ? ""
      : toStringValue(workExperience.endMonth),
    endYear: workExperience.isCurrent
      ? ""
      : toStringValue(workExperience.endYear),
    currentlyWorking: workExperience.isCurrent,
    description: workExperience.description ?? "",
  };
}

export function workExperienceItemToRequest(
  item: ExperienceItem
): CreateWorkExperienceRequest {
  const isCurrent = item.currentlyWorking === true;

  return {
    companyName: item.company.trim(),
    jobTitle: item.role.trim(),
    location: item.location?.trim() || undefined,
    description: item.description?.trim() || undefined,
    startMonth: toNumberValue(item.startMonth) ?? 1,
    startYear: toNumberValue(item.startYear) ?? new Date().getFullYear(),
    endMonth: isCurrent ? null : (toNumberValue(item.endMonth) ?? null),
    endYear: isCurrent ? null : (toNumberValue(item.endYear) ?? null),
    isCurrent,
  };
}

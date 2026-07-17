import type { CSSProperties, ReactNode } from "react";
import type {
  EducationItem,
  ExperienceItem,
  Section,
  SkillItem,
} from "./types";
import { getSectionStyle } from "@/utils/profile";
import { getFontClass } from "../templates/TemplateAppearanceProvider";

export const isProfileTextSectionType = (type: string) =>
  type === "workExperience" || type === "education" || type === "skills";

const dateRange = ({
  startMonth,
  startYear,
  endMonth,
  endYear,
  currentlyWorking,
}: {
  startMonth?: string;
  startYear?: string;
  endMonth?: string;
  endYear?: string;
  currentlyWorking?: boolean;
}) => {
  const start = [startMonth, startYear].filter(Boolean).join(" ");
  const end = currentlyWorking
    ? "Present"
    : [endMonth, endYear].filter(Boolean).join(" ");

  if (start && end) return `${start} – ${end}`;
  return start || end;
};

const educationDateRange = ({
  startMonth,
  startYear,
  endMonth,
  endYear,
  currentlyStudying,
}: {
  startMonth?: string;
  startYear?: string;
  endMonth?: string;
  endYear?: string;
  currentlyStudying?: boolean;
}) => {
  const start = [startMonth, startYear].filter(Boolean).join(" ");
  const end = currentlyStudying
    ? "Present"
    : [endMonth, endYear].filter(Boolean).join(" ");

  if (start && end) return `${start} – ${end}`;
  return start || end;
};

const profileTextSectionStyle = (section: Section): CSSProperties => {
  const {
    backgroundColor: _backgroundColor,
    gap: _gap,
    ...style
  } = getSectionStyle(section);

  return style;
};

export function ProfileTextSectionBlock({
  section,
  className = "",
  isRegular = false,
}: {
  section: Section;
  className?: string;
  isRegular?: boolean;
}) {
  if (section.type === "workExperience") {
    return (
      <section
        className={`flex w-full flex-col gap-7 ${section.font ? getFontClass(section.font) : ""} ${className}`}
        style={profileTextSectionStyle(section)}
      >
        <SectionTitle
          title={section.title || "Work Experience"}
          isRegular={isRegular}
        />
        {section.subtitle && <SectionSubtitle text={section.subtitle} />}
        <div className="flex flex-col gap-7">
          {(section.experiences ?? []).map((item) => (
            <ExperienceEntry key={item.id} item={item} />
          ))}
          {(section.experiences ?? []).length === 0 && (
            <EmptyText>No experience added yet.</EmptyText>
          )}
        </div>
      </section>
    );
  }

  if (section.type === "education") {
    return (
      <section
        className={`flex w-full flex-col gap-7 ${section.font ? getFontClass(section.font) : ""} ${className}`}
        style={profileTextSectionStyle(section)}
      >
        <SectionTitle
          title={section.title || "Education"}
          isRegular={isRegular}
        />
        {section.subtitle && <SectionSubtitle text={section.subtitle} />}
        <div className="flex flex-col gap-6">
          {(section.education ?? []).map((item) => (
            <EducationEntry key={item.id} item={item} />
          ))}
          {(section.education ?? []).length === 0 && (
            <EmptyText>No education added yet.</EmptyText>
          )}
        </div>
      </section>
    );
  }

  if (section.type === "skills") {
    return (
      <section
        className={`flex w-full flex-col gap-6 ${section.font ? getFontClass(section.font) : ""} ${className}`}
        style={profileTextSectionStyle(section)}
      >
        <SectionTitle title={section.title || "Skills"} isRegular={isRegular} />
        {section.subtitle && <SectionSubtitle text={section.subtitle} />}
        <div className="flex flex-wrap gap-3">
          {(section.skills ?? []).map((item) => (
            <SkillPill key={item.id} item={item} />
          ))}
          {(section.skills ?? []).length === 0 && (
            <EmptyText>No skills added yet.</EmptyText>
          )}
        </div>
      </section>
    );
  }

  return null;
}

function SectionTitle({
  title,
  isRegular = false,
}: {
  title: string;
  isRegular?: boolean;
}) {
  return (
    <h2
      className={`text-primary-text text-[20px] leading-tight ${isRegular ? "font-normal" : "font-semibold"} tracking-tight break-words`}
    >
      {title}
    </h2>
  );
}

function SectionSubtitle({ text }: { text: string }) {
  return (
    <p className="text-secondary-text -mt-4 text-[14px] leading-relaxed break-words whitespace-pre-wrap">
      {text}
    </p>
  );
}

function ExperienceEntry({ item }: { item: ExperienceItem }) {
  const range = dateRange(item);

  return (
    <article className="flex flex-col gap-2">
      <h3 className="text-primary-text text-[18px] leading-snug font-bold break-words">
        {item.role}
      </h3>
      <div className="text-secondary-text flex flex-wrap items-center gap-x-3 gap-y-1 text-[15px]">
        {item.company && <span>{item.company}</span>}
        {item.employmentType && <span>{item.employmentType}</span>}
      </div>
      {range && <p className="text-tertiary-text text-[15px]">{range}</p>}
      {item.description && (
        <p className="text-secondary-text mt-2 text-[15px] leading-relaxed break-words whitespace-pre-wrap">
          {item.description}
        </p>
      )}
    </article>
  );
}

function EducationEntry({ item }: { item: EducationItem }) {
  const range = educationDateRange(item);

  return (
    <article className="flex flex-col gap-1.5">
      <h3 className="text-primary-text text-[18px] leading-snug font-bold break-words">
        {item.degree}
      </h3>
      {item.institution && (
        <p className="text-secondary-text text-[15px] break-words">
          {item.institution}
        </p>
      )}
      {range && <p className="text-tertiary-text text-[15px]">{range}</p>}
    </article>
  );
}

function SkillPill({ item }: { item: SkillItem }) {
  return (
    <span className="border-border bg-background text-primary-text inline-flex rounded-[8px] border px-4 py-2.5 text-[15px] font-medium shadow-sm">
      {item.name}
    </span>
  );
}

function EmptyText({ children }: { children: ReactNode }) {
  return (
    <p className="text-tertiary-text border-border rounded-xl border border-dashed py-4 text-center text-sm">
      {children}
    </p>
  );
}

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
  variant = "default",
  ignoreSectionStyle = false,
}: {
  section: Section;
  className?: string;
  isRegular?: boolean;
  variant?: "default" | "creator" | "professional" | "portfolio";
  ignoreSectionStyle?: boolean;
}) {
  const isCreator = variant === "creator";
  const isProfessional = variant === "professional";
  const isPortfolio = variant === "portfolio";
  const titleRegular = isRegular || isCreator || isProfessional || isPortfolio;
  const blockStyle = ignoreSectionStyle
    ? undefined
    : profileTextSectionStyle(section);

  if (section.type === "workExperience") {
    return (
      <section
        className={`flex w-full flex-col gap-7 ${section.font ? getFontClass(section.font) : ""} ${className}`}
        style={blockStyle}
      >
        <SectionTitle
          title={section.title || "Work Experience"}
          isRegular={titleRegular}
          isCentered={isCreator}
        />
        {section.subtitle && (
          <SectionSubtitle text={section.subtitle} isCentered={isCreator} />
        )}
        {isCreator ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {(section.experiences ?? []).map((item) => (
              <div
                key={item.id}
                className="border-border bg-background rounded-2xl border p-6 text-left"
              >
                <ExperienceEntry item={item} />
              </div>
            ))}
            {(section.experiences ?? []).length === 0 && (
              <div className="col-span-full">
                <EmptyText>No experience added yet.</EmptyText>
              </div>
            )}
          </div>
        ) : (
          <div className={`flex flex-col ${isPortfolio ? "gap-4" : "gap-7"}`}>
            {(section.experiences ?? []).map((item) => (
              <ExperienceEntry key={item.id} item={item} variant={variant} />
            ))}
            {(section.experiences ?? []).length === 0 && (
              <EmptyText>No experience added yet.</EmptyText>
            )}
          </div>
        )}
      </section>
    );
  }

  if (section.type === "education") {
    return (
      <section
        className={`flex w-full flex-col gap-7 ${section.font ? getFontClass(section.font) : ""} ${className}`}
        style={blockStyle}
      >
        <SectionTitle
          title={section.title || "Education"}
          isRegular={titleRegular}
          isCentered={isCreator}
        />
        {section.subtitle && (
          <SectionSubtitle text={section.subtitle} isCentered={isCreator} />
        )}
        {isCreator ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {(section.education ?? []).map((item) => (
              <div
                key={item.id}
                className="border-border bg-background rounded-2xl border p-6 text-left"
              >
                <EducationEntry item={item} />
              </div>
            ))}
            {(section.education ?? []).length === 0 && (
              <div className="col-span-full">
                <EmptyText>No education added yet.</EmptyText>
              </div>
            )}
          </div>
        ) : (
          <div className={`flex flex-col ${isPortfolio ? "gap-4" : "gap-6"}`}>
            {(section.education ?? []).map((item) => (
              <EducationEntry key={item.id} item={item} variant={variant} />
            ))}
            {(section.education ?? []).length === 0 && (
              <EmptyText>No education added yet.</EmptyText>
            )}
          </div>
        )}
      </section>
    );
  }

  if (section.type === "skills") {
    return (
      <section
        className={`flex w-full flex-col gap-6 ${section.font ? getFontClass(section.font) : ""} ${className}`}
        style={blockStyle}
      >
        <SectionTitle
          title={section.title || "Skills"}
          isRegular={titleRegular}
          isCentered={isCreator}
        />
        {section.subtitle && (
          <SectionSubtitle text={section.subtitle} isCentered={isCreator} />
        )}
        <div
          className={`flex flex-wrap gap-3 ${isCreator ? "justify-center" : ""}`}
        >
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
  isCentered = false,
}: {
  title: string;
  isRegular?: boolean;
  isCentered?: boolean;
}) {
  return (
    <h2
      className={`text-primary-text text-[20px] leading-tight ${isRegular ? "font-normal" : "font-semibold"} ${isCentered ? "text-center" : ""} tracking-tight break-words`}
    >
      {title}
    </h2>
  );
}

function SectionSubtitle({
  text,
  isCentered = false,
}: {
  text: string;
  isCentered?: boolean;
}) {
  return (
    <p
      className={`text-secondary-text -mt-4 text-[14px] leading-relaxed break-words whitespace-pre-wrap ${isCentered ? "text-center" : ""}`}
    >
      {text}
    </p>
  );
}

function ExperienceEntry({
  item,
  variant = "default",
}: {
  item: ExperienceItem;
  variant?: "default" | "creator" | "professional" | "portfolio";
}) {
  const range = dateRange(item);

  if (variant === "professional") {
    return (
      <article className="border-border w-full border-b pb-6 text-left">
        <div className="flex w-full flex-col gap-2">
          <div className="flex w-full items-start justify-between gap-4">
            <h3 className="text-primary-text text-[16px] leading-tight font-bold break-words">
              {item.role}
            </h3>
            {range && (
              <p className="text-tertiary-text shrink-0 text-[14px] whitespace-nowrap">
                {range}
              </p>
            )}
          </div>
          <div className="mt-1 grid w-full grid-cols-1 items-start gap-4 md:grid-cols-[180px_1fr] md:gap-8">
            <div className="text-secondary-text text-[14px] font-medium">
              {item.company}
              {item.company && item.employmentType && "  "}
              {item.company && item.employmentType && (
                <span className="text-tertiary-text font-normal">•</span>
              )}
              {item.company && item.employmentType && "  "}
              {item.employmentType}
            </div>
            <div className="text-secondary-text text-justify text-[14px] leading-relaxed break-words whitespace-pre-wrap md:text-justify">
              {item.description}
            </div>
          </div>
        </div>
      </article>
    );
  }

  if (variant === "portfolio") {
    return (
      <article className="border-border bg-background w-full rounded-2xl border p-6 text-left shadow-sm">
        <div className="flex w-full flex-col gap-2">
          <div className="flex w-full items-start justify-between gap-4">
            <h3 className="text-primary-text text-[16px] leading-tight font-bold break-words">
              {item.role}
            </h3>
            {range && (
              <p className="text-tertiary-text shrink-0 text-[14px] whitespace-nowrap">
                {range}
              </p>
            )}
          </div>
          <div className="mt-1 grid w-full grid-cols-1 items-start gap-4 md:grid-cols-[180px_1fr] md:gap-8">
            <div className="text-secondary-text text-[14px] font-medium">
              {item.company}
              {item.company && item.employmentType && "  "}
              {item.company && item.employmentType && (
                <span className="text-tertiary-text font-normal">•</span>
              )}
              {item.company && item.employmentType && "  "}
              {item.employmentType}
            </div>
            <div className="text-secondary-text text-justify text-[14px] leading-relaxed break-words whitespace-pre-wrap md:text-justify">
              {item.description}
            </div>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="flex flex-col gap-2">
      <h3 className="text-primary-text text-[18px] leading-snug font-bold break-words">
        {item.role}
      </h3>
      <div className="text-secondary-text flex flex-wrap items-center gap-x-3 gap-y-1 text-[15px]">
        {item.company && (
          <span>
            {item.company}
            {item.employmentType && ` · ${item.employmentType}`}
          </span>
        )}
        {!item.company && item.employmentType && (
          <span>{item.employmentType}</span>
        )}
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

function EducationEntry({
  item,
  variant = "default",
}: {
  item: EducationItem;
  variant?: "default" | "creator" | "professional" | "portfolio";
}) {
  const range = educationDateRange(item);

  if (variant === "professional") {
    return (
      <article className="border-border w-full border-b pb-6 text-left">
        <div className="flex w-full flex-col gap-2">
          <div className="flex w-full items-start justify-between gap-4">
            <h3 className="text-primary-text text-[16px] leading-tight font-bold break-words">
              {item.degree}
            </h3>
            {range && (
              <p className="text-tertiary-text shrink-0 text-[14px] whitespace-nowrap">
                {range}
              </p>
            )}
          </div>
          {item.institution && (
            <p className="text-secondary-text mt-1 text-[14px] font-medium break-words">
              {item.institution}
            </p>
          )}
        </div>
      </article>
    );
  }

  if (variant === "portfolio") {
    return (
      <article className="border-border bg-background w-full rounded-2xl border p-6 text-left shadow-sm">
        <div className="flex w-full flex-col gap-2">
          <div className="flex w-full items-start justify-between gap-4">
            <h3 className="text-primary-text text-[16px] leading-tight font-bold break-words">
              {item.degree}
            </h3>
            {range && (
              <p className="text-tertiary-text shrink-0 text-[14px] whitespace-nowrap">
                {range}
              </p>
            )}
          </div>
          {item.institution && (
            <p className="text-secondary-text mt-1 text-[14px] font-medium break-words">
              {item.institution}
            </p>
          )}
        </div>
      </article>
    );
  }

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

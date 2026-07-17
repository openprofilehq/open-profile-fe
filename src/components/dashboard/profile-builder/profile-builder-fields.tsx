import { useId } from "react";

export const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export const YEARS = Array.from({ length: 80 }, (_, index) =>
  String(new Date().getFullYear() + 1 - index)
);

export function SectionHeadingFields({
  title,
  subtitle,
  titlePlaceholder,
  onTitleChange,
  onSubtitleChange,
}: {
  title: string;
  subtitle: string;
  titlePlaceholder: string;
  onTitleChange: (value: string) => void;
  onSubtitleChange: (value: string) => void;
}) {
  const subtitleId = useId();

  return (
    <div className="flex flex-col gap-4">
      <TextField
        label="Heading"
        value={title}
        placeholder={titlePlaceholder}
        onChange={onTitleChange}
      />
      <div className="flex flex-col gap-2">
        <label
          htmlFor={subtitleId}
          className="text-primary-text text-xs font-bold"
        >
          Sub-heading
        </label>
        <textarea
          id={subtitleId}
          value={subtitle}
          onChange={(event) => onSubtitleChange(event.target.value)}
          maxLength={200}
          placeholder="Add Text here"
          rows={3}
          className="border-border text-primary-text focus:border-brand-b w-full resize-none rounded-[10px] border px-4 py-3 text-sm outline-none"
        />
        <p className="text-tertiary-text text-right text-[11px]">
          {subtitle.length}/200
        </p>
      </div>
    </div>
  );
}

export function TextField({
  label,
  value,
  placeholder,
  onChange,
  required = false,
}: {
  label: string;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
  required?: boolean;
}) {
  const inputId = useId();

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={inputId} className="text-primary-text text-xs font-bold">
        {label}
        {required && <span className="text-negative-text ml-1">*</span>}
      </label>
      <input
        id={inputId}
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="border-border text-primary-text focus:border-brand-b w-full rounded-[10px] border px-4 py-3 text-sm outline-none"
      />
    </div>
  );
}

export function SelectField({
  label,
  value,
  placeholder,
  options,
  onChange,
}: {
  label: string;
  value: string;
  placeholder: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  const selectId = useId();

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={selectId} className="text-primary-text text-xs font-bold">
        {label}
      </label>
      <select
        id={selectId}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="border-border text-primary-text focus:border-brand-b w-full rounded-[10px] border px-4 py-3 text-sm outline-none"
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

export function DatePair({
  label,
  month,
  year,
  onMonthChange,
  onYearChange,
  required = false,
}: {
  label: string;
  month: string;
  year: string;
  onMonthChange: (value: string) => void;
  onYearChange: (value: string) => void;
  required?: boolean;
}) {
  const monthId = useId();
  const yearId = useId();

  return (
    <div className="flex flex-col gap-2">
      <span className="text-primary-text text-xs font-bold">
        {label}
        {required && <span className="text-negative-text ml-1">*</span>}
      </span>
      <div className="grid grid-cols-2 gap-2">
        <label htmlFor={monthId} className="sr-only">
          {label} month
        </label>
        <select
          id={monthId}
          value={month}
          onChange={(event) => onMonthChange(event.target.value)}
          className="border-border text-primary-text focus:border-brand-b rounded-[10px] border px-3 py-3 text-sm outline-none"
        >
          <option value="">Month</option>
          {MONTHS.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <label htmlFor={yearId} className="sr-only">
          {label} year
        </label>
        <select
          id={yearId}
          value={year}
          onChange={(event) => onYearChange(event.target.value)}
          className="border-border text-primary-text focus:border-brand-b rounded-[10px] border px-3 py-3 text-sm outline-none"
        >
          <option value="">Year</option>
          {YEARS.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export function CompactList({
  label,
  items,
  onEdit,
}: {
  label: string;
  items: { id: string; name: string }[];
  onEdit: (id: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center justify-between text-xs">
        <span className="text-primary-text font-bold">{label}</span>
        <span className="text-tertiary-text font-medium">Tap to edit</span>
      </div>
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onEdit(item.id)}
          className="border-border bg-background text-primary-text flex h-[42px] items-center rounded-[8px] border px-4 text-left text-xs font-medium"
        >
          {item.name || "Untitled"}
        </button>
      ))}
    </div>
  );
}

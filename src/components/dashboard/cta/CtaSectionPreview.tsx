import { cn } from "@/lib/utils";
import { Eye, MessageSquare, Trash2 } from "lucide-react";
import Image from "next/image";

interface Section {
  id: string;
  title: string;
  type: string;
  ctaTitle?: string;
  ctaSubtitle?: string;
  ctaButton?: string;
  ctaLayout?: "center" | "left" | "right";
  ctaSpacingTop?: number;
  ctaSpacingBottom?: number;
  ctaSpacingGap?: number;
  ctaSpacingPadding?: number;
}

interface CTASectionPreviewProps {
  section: Section;
  textColor: string;
  bgColor: string;
  iconColor: string;
  borderRadius: string;
  isDark: boolean;
  fontClass: string;
}

const PORTFOLIO_ITEMS = [
  {
    id: "branding",
    image: "/cta/branding.jpg",
    title: "Branding",
    subtitle: "Brand Identity",
  },
  {
    id: "systems",
    image: "/cta/systems.png",
    title: "Systems",
    subtitle: "Design System",
  },
];

export default function CtaSectionPreview({
  section,
  textColor,
  iconColor,
  borderRadius,
  isDark,
  bgColor,
  fontClass,
}: CTASectionPreviewProps) {
  const isLeft = section.ctaLayout === "left";
  const isRight = section.ctaLayout === "right";

  const spacingTop = section.ctaSpacingTop ?? 24;
  const spacingBottom = section.ctaSpacingBottom ?? 24;
  const spacingGap = section.ctaSpacingGap ?? 20;
  const spacingPadding = section.ctaSpacingPadding ?? 16;

  return (
    <div className="space-y-6 pb-6">
      {/* portfolio cards */}
      <section className="font-afacad bg-neutral-subtle-bg grid grid-cols-2 gap-6 rounded-b-[12px] px-6 pb-6 shadow-sm">
        {PORTFOLIO_ITEMS.map((item) => (
          <div key={item.id} className="border-tertiary-b w-full border">
            <Image
              src={item.image}
              width={354}
              height={163}
              alt={item.title}
              className="h-40.75 w-full object-cover object-bottom"
            />
            <div className="my-6 space-y-6 px-6">
              <div className="space-y-2">
                <p className="text-heading-m text-black">{item.title}</p>
                <p className="text-primary-text">{item.subtitle}</p>
              </div>
              <div className="flex items-center gap-4">
                <p className="text-black">View project</p>
                <Image
                  src="/cta/icon-arrow-right.svg"
                  width={24}
                  height={24}
                  alt=""
                />
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* cta section */}
      <section
        style={{
          backgroundColor:
            bgColor === "#FFFFFF" && isDark ? "#1E1E1E" : bgColor,
          borderRadius,
          borderColor: isDark ? "#2D2D2D" : "#EDEDED",
          paddingTop: spacingTop,
          paddingBottom: spacingBottom,
          paddingLeft: spacingPadding,
          paddingRight: spacingPadding,
        }}
        className="border-tertiary-b bg-neutral-bg relative flex border p-6 shadow-sm transition-all duration-300"
      >
        {/* Action buttons */}
        <div
          className={`border-tertiary-b bg-neutral-subtle-bg absolute top-6 flex items-center gap-3 rounded-[10px] border px-6 py-3 select-none ${isRight ? "left-6" : "right-6"}`}
        >
          <button
            aria-label="Preview section"
            className="text-preview-action-icon transition-opacity hover:opacity-80"
          >
            <Eye size={18} strokeWidth={2} />
          </button>
          <button
            aria-label="Delete section"
            className="text-preview-action-delete transition-opacity hover:opacity-80"
          >
            <Trash2 size={18} strokeWidth={2} />
          </button>
        </div>

        <div
          className={`flex w-full flex-col ${
            isRight
              ? "items-end text-right"
              : isLeft
                ? "items-start text-left"
                : "items-center text-center"
          }`}
          style={{ gap: spacingGap }}
        >
          <div
            className={`flex flex-col ${isRight ? "items-end" : isLeft ? "items-start" : "items-center"}`}
            style={{ gap: spacingGap }}
          >
            <div className="bg-neutral-subtle-bg flex h-16 w-16 items-center justify-center rounded-[16px] border">
              <MessageSquare size={26} style={{ color: iconColor }} />
            </div>

            <h2
              className={cn("text-heading-2xl", fontClass)}
              style={{ color: textColor }}
            >
              {section.ctaTitle || "Let's build something."}
            </h2>

            <p
              className={cn(
                "text-heading-s text-tertiary-text max-w-xs",
                fontClass
              )}
              style={{
                color:
                  textColor === "#050505" && isDark ? "#E0E0E0" : textColor,
                opacity: 0.7,
              }}
            >
              {section.ctaSubtitle ||
                "I'm currently accepting new projects and consulting opportunities."}
            </p>

            <button
              className="text-brand-subtle-text text-m-medium bg-brand-bg h-14.5 w-55 shrink-0 rounded-[6px] px-5 py-2.5 text-sm leading-6 font-semibold transition-opacity hover:opacity-90"
              style={{ backgroundColor: iconColor }}
            >
              {section.ctaButton || "Start a Conversation"}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

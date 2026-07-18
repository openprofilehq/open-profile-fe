"use client";

import Link from "next/link";
import { ChevronRight, MessageSquare } from "lucide-react";
import { sanitizeUrl } from "@/utils/profile";
import { ProfileContentResponse } from "@/api/profile/profile.type";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {
  content?: ProfileContentResponse;
  isLoading?: boolean;
};

export default function YourCTA({ content, isLoading }: Props) {
  const cta = content?.content?.cta;

  return (
    <section className="border-border bg-background w-full rounded-[12px] border p-16">
      {isLoading ? (
        <div className="flex flex-col items-center gap-4">
          <span className="inline-flex items-center gap-2 rounded-md border p-2 text-sm font-medium">
            <MessageSquare size={12} />
          </span>
          <Skeleton className="h-7 w-32" />
          <Skeleton className="h-11 w-28 rounded-xl" />
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <span className="inline-flex items-center gap-2 rounded-md border p-2 text-sm font-medium">
            <MessageSquare size={12} />
          </span>
          <h4 className="text-2xl font-bold">
            {cta?.visible && (cta?.label || cta?.url)
              ? cta.label || "CTA"
              : "Your CTA"}
          </h4>

          {cta?.visible && (cta?.label || cta?.url) ? (
            cta.url ? (
              <a
                href={sanitizeUrl(cta.url)}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-brand-hover-bg hover:bg-button-brand-bg inline-flex h-11 items-center rounded-xl px-8 text-sm font-bold text-white"
              >
                {cta.label || "Visit"}
              </a>
            ) : (
              <span className="bg-brand-hover-bg inline-flex h-11 cursor-not-allowed items-center rounded-xl px-8 text-sm font-bold text-white opacity-60">
                {cta.label}
              </span>
            )
          ) : (
            <Link
              href="/dashboard/profile-builder?section=cta"
              className="text-brand-hover-bg flex items-center gap-1 text-sm font-semibold hover:underline"
            >
              Add your CTA <ChevronRight size={14} />
            </Link>
          )}
        </div>
      )}
    </section>
  );
}

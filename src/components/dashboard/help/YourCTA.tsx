"use client";

import Link from "next/link";
import { ChevronRight, MessageSquare } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { profileContentOption } from "@/api/profile/profile.options";
import { sanitizeUrl } from "@/utils/profile";

export default function YourCTA() {
  const { data: content, isPending } = useQuery(profileContentOption());
  const cta = content?.content?.cta;

  return (
    <section className="w-full rounded-[12px] border border-[#EDEDED] bg-white p-16">
      {isPending ? (
        <div className="flex flex-col items-center gap-4">
          <span className="inline-flex items-center gap-2 rounded-md border p-2 text-sm font-medium">
            <MessageSquare size={12} />
          </span>
          <div className="h-7 w-32 animate-pulse rounded bg-gray-200" />
          <div className="h-11 w-28 animate-pulse rounded-xl bg-gray-200" />
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
                className="inline-flex h-11 items-center rounded-xl bg-[#087583] px-8 text-sm font-bold text-white hover:bg-[#065e69]"
              >
                {cta.label || "Visit"}
              </a>
            ) : (
              <span className="inline-flex h-11 cursor-not-allowed items-center rounded-xl bg-[#087583] px-8 text-sm font-bold text-white opacity-60">
                {cta.label}
              </span>
            )
          ) : (
            <Link
              href="/dashboard/profile-builder?section=cta"
              className="flex items-center gap-1 text-sm font-semibold text-[#087583] hover:underline"
            >
              Add your CTA <ChevronRight size={14} />
            </Link>
          )}
        </div>
      )}
    </section>
  );
}

"use client";

import Image from "next/image";
import { ExternalLink, ImageIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { profileContentOption } from "@/api/profile/profile.options";
import { getImageUrl, sanitizeUrl } from "@/utils/profile";

export default function FeaturedLinks() {
  const { data: content, isPending } = useQuery(profileContentOption());
  const links = (content?.content?.links?.items ?? []) as {
    id?: string;
    title?: string;
    url?: string;
    iconSrc?: string | null;
    imageSrc?: string | null;
  }[];

  return (
    <section className="rounded-[12px] border border-[#EDEDED] bg-white p-6">
      <h2 className="text-2xl font-bold">Featured Links</h2>

      {isPending ? (
        <div className="mt-6 flex flex-col gap-4">
          {Array.from({ length: 1 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-[18px] border border-[#EDEDED] p-4"
            >
              <div className="flex items-center gap-5">
                <div className="h-14 w-14 shrink-0 animate-pulse rounded-[12px] bg-gray-200" />
                <div className="space-y-2">
                  <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
                  <div className="h-3 w-48 animate-pulse rounded bg-gray-200" />
                </div>
              </div>
              <div className="h-10 w-10 shrink-0 animate-pulse rounded-full bg-gray-200" />
            </div>
          ))}
        </div>
      ) : links.length === 0 ? (
        <span className="mt-4 flex items-center justify-between text-sm text-gray-500">
          No links added yet
        </span>
      ) : (
        <div className="mt-6 flex flex-col gap-4">
          {links.map((item, index) => {
            const displayImg = getImageUrl(item.imageSrc);
            return (
              <a
                key={item.id ?? index}
                href={sanitizeUrl(item.url)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between rounded-[18px] border border-[#EDEDED] p-4 no-underline"
              >
                <div className="flex items-center gap-5">
                  <span className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-[12px] border border-[#EDEDED]">
                    {displayImg ? (
                      <Image
                        src={displayImg}
                        alt={item.title ?? "Link"}
                        width={56}
                        height={56}
                        className="object-cover"
                        unoptimized
                      />
                    ) : item.iconSrc ? (
                      // item.iconSrc is guaranteed to be a client preloaded, absolute local SVG asset path
                      <Image
                        src={item.iconSrc}
                        alt={item.title ?? "Link"}
                        width={24}
                        height={24}
                        unoptimized
                      />
                    ) : (
                      <ImageIcon className="text-[#A2A2A2]" size={24} />
                    )}
                  </span>
                  <div>
                    <h3 className="font-bold text-[#050505]">{item.title}</h3>
                    <p className="text-sm text-[#A2A2A2]">{item.url}</p>
                  </div>
                </div>
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#EDEDED]">
                  <ExternalLink className="text-[#A2A2A2]" size={20} />
                </span>
              </a>
            );
          })}
        </div>
      )}
    </section>
  );
}

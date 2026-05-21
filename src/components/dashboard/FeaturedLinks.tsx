"use client";

import Link from "next/link";
import Image from "next/image";
import { ExternalLink, ImageIcon, ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { profileContentOption } from "@/api/profile/profile.options";
import { getImageUrl, sanitizeUrl } from "@/utils/profile";

export default function FeaturedLinks() {
  const { data: content } = useQuery(profileContentOption());
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

      {links.length === 0 ? (
        <Link
          href="/dashboard/profile-builder?section=links"
          className="mt-4 flex items-center justify-between text-sm font-semibold text-[#087583] hover:underline"
        >
          Add your links
          <ChevronRight size={16} />
        </Link>
      ) : (
        <div className="mt-6 flex flex-col gap-4">
          {links.map((item, index) => (
            <a
              key={item.id ?? index}
              href={sanitizeUrl(item.url)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between rounded-[18px] border border-[#EDEDED] p-4 no-underline"
            >
              <div className="flex items-center gap-5">
                <span className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-[12px] border border-[#EDEDED]">
                  {getImageUrl(item.imageSrc) ? (
                    <Image
                      src={getImageUrl(item.imageSrc)}
                      alt={item.title ?? "Link"}
                      width={56}
                      height={56}
                      className="object-cover"
                      unoptimized
                    />
                  ) : item.iconSrc ? (
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
          ))}
        </div>
      )}
    </section>
  );
}

"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { profileContentOption } from "@/api/profile/profile.options";
import { getImageUrl, sanitizeUrl } from "@/utils/profile";

export default function SelectedProject() {
  const { data: content } = useQuery(profileContentOption());
  const projects = (content?.content?.projects?.items ?? []) as {
    id?: string;
    title?: string;
    description?: string;
    url?: string;
    imageSrc?: string | null;
  }[];

  return (
    <section className="w-full rounded-[12px] border border-[#EDEDED] bg-white">
      <h2 className="p-4 text-2xl font-bold">Selected Projects</h2>

      {projects.length === 0 ? (
        <span className="flex items-center justify-between p-4 text-sm text-gray-500">
          No projects added yet
        </span>
      ) : (
        <div className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-2">
          {projects.map((project, index) => {
            const hasUrl = Boolean(project.url);
            const displayImg = getImageUrl(project.imageSrc);

            const card = (
              <div className="flex flex-col gap-4">
                <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-[#EDEDED]">
                  {displayImg ? (
                    <Image
                      src={displayImg}
                      alt={project.title ?? "Project"}
                      className="object-cover"
                      fill
                      unoptimized
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-[#F5F5F5] text-xs text-[#A2A2A2]">
                      No image
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-start">
                  <h5 className="text-xl font-bold text-[#050505]">
                    {project.title}
                  </h5>
                  <p className="text-[#64748B]">{project.description}</p>
                  <span className="mt-2 flex items-center gap-1 text-sm font-semibold text-[#087583]">
                    {hasUrl ? "View project" : "Edit project"}
                    <ChevronRight size={16} />
                  </span>
                </div>
              </div>
            );

            return hasUrl ? (
              <a
                key={project.id ?? index}
                href={sanitizeUrl(project.url)}
                target="_blank"
                rel="noopener noreferrer"
                className="no-underline"
              >
                {card}
              </a>
            ) : (
              <Link
                key={project.id ?? index}
                href="/dashboard/profile-builder?section=projects"
                className="no-underline"
              >
                {card}
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}

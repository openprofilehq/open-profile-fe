"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { profileContentOption } from "@/api/profile/profile.options";
import { getImageUrl } from "@/utils/profile";

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
      <h2 className="p-3 text-2xl font-bold">Selected Projects</h2>

      {projects.length === 0 ? (
        <Link
          href="/dashboard/profile-builder?section=projects"
          className="flex items-center justify-between p-4 text-sm font-semibold text-[#087583] hover:underline"
        >
          Add your projects
          <ChevronRight size={16} />
        </Link>
      ) : (
        <div className="grid grid-cols-2">
          {projects.map((project, index) => {
            const hasUrl = Boolean(project.url);

            const card = (
              <div className="flex flex-col gap-4">
                <div className="h-72.5 w-86 border">
                  {getImageUrl(project.imageSrc) ? (
                    <Image
                      src={getImageUrl(project.imageSrc)}
                      alt={project.title ?? "Project"}
                      className="w-full object-cover"
                      width={300}
                      height={250}
                      unoptimized
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-[#F5F5F5] text-xs text-[#A2A2A2]">
                      No image
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-start p-4">
                  <h5 className="text-xl font-bold">{project.title}</h5>
                  <p className="text-lg">{project.description}</p>
                  <span className="mt-2 flex items-center gap-1 p-0 text-sm font-semibold text-[#087583]">
                    {hasUrl ? "View project" : "Edit project"}
                    <ChevronRight size={16} />
                  </span>
                </div>
              </div>
            );

            return hasUrl ? (
              <a
                key={project.id ?? index}
                href={project.url!}
                target="_blank"
                rel="noopener noreferrer"
              >
                {card}
              </a>
            ) : (
              <Link
                key={project.id ?? index}
                href="/dashboard/profile-builder?section=projects"
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

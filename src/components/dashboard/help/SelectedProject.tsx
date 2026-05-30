"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { getImageUrl, sanitizeUrl } from "@/utils/profile";
import { ProfileContentResponse } from "@/api/profile/profile.type";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {
  content?: ProfileContentResponse;
  isLoading?: boolean;
};

export default function SelectedProject({ content, isLoading }: Props) {
  const projects = (content?.content?.projects?.items ?? []) as {
    id?: string;
    title?: string;
    description?: string;
    url?: string;
    imageSrc?: string | null;
  }[];

  return (
    <section className="w-full rounded-[12px] border border-border bg-background">
      <h2 className="p-4 text-2xl font-bold">Selected Projects</h2>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-4">
              <Skeleton className="aspect-video" />
              <div className="flex flex-col gap-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
          ))}
        </div>
      ) : projects.length === 0 ? (
        <span className="flex items-center justify-between p-4 text-sm text-secondary-text">
          Add your projects
        </span>
      ) : (
        <div className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-2">
          {projects.map((project, index) => {
            const hasUrl = Boolean(project.url);
            const displayImg = getImageUrl(project.imageSrc);

            const card = (
              <div className="flex flex-col gap-4">
                <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-border">
                  {displayImg ? (
                    <Image
                      src={displayImg}
                      alt={project.title ?? "Project"}
                      className="object-cover"
                      fill
                      unoptimized
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-secondary-bg text-xs text-tertiary-text">
                      No image
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-start min-w-0">
                  <h5 className="text-xl font-bold text-primary-text break-all">
                    {project.title}
                  </h5>
                  <p className="text-secondary-text break-all">{project.description}</p>
                  <span className="mt-2 flex items-center gap-1 text-sm font-semibold text-brand-hover-bg">
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

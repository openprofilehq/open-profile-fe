"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import {
  getImageUrl,
  sanitizeUrl,
  isProjectHighlighted,
} from "@/utils/profile";
import { ProfileContentResponse } from "@/api/profile/profile.type";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {
  content?: ProfileContentResponse;
  isLoading?: boolean;
};

export default function SelectedProject({ content, isLoading }: Props) {
  const rawProjects = (content?.content?.projects?.items ?? []) as {
    id?: string;
    title?: string;
    description?: string;
    url?: string;
    imageSrc?: string | null;
    highlighted?: boolean;
    buttonText?: string;
  }[];

  const highlightedProject = rawProjects.find(isProjectHighlighted);
  const projects = rawProjects.filter((p) => p.id !== highlightedProject?.id);

  if (!isLoading && rawProjects.length === 0) {
    return (
      <section className="border-border bg-background w-full rounded-[12px] border">
        <h2 className="p-4 text-2xl font-bold">Selected Projects</h2>
        <span className="text-secondary-text flex items-center justify-between p-4 text-sm">
          Add your projects
        </span>
      </section>
    );
  }

  if (!isLoading && projects.length === 0) {
    return null;
  }

  return (
    <section className="border-border bg-background w-full rounded-[12px] border">
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
      ) : (
        <div className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-2">
          {projects.map((project, index) => {
            const projectUrl =
              project.url || (project as { repoUrl?: string }).repoUrl;
            const hasUrl = Boolean(projectUrl);
            const rawImageSrc = project.imageSrc;
            const displayImg = rawImageSrc
              ? rawImageSrc.startsWith("/profile-preview/")
                ? rawImageSrc
                : getImageUrl(rawImageSrc)
              : null;

            const dummyImages = [
              "/profile-preview/feature1.jpg",
              "/profile-preview/feature2.jpg",
              "/profile-preview/feature3.jpg",
            ];
            const fallbackImg = dummyImages[index % dummyImages.length];

            const card = (
              <div className="flex flex-col gap-4">
                <div className="border-border relative aspect-video w-full overflow-hidden rounded-lg border">
                  {displayImg ? (
                    <Image
                      src={displayImg}
                      alt={project.title ?? "Project"}
                      className="object-cover"
                      fill
                      unoptimized
                    />
                  ) : (
                    <Image
                      src={fallbackImg}
                      alt="Project placeholder"
                      className="object-cover"
                      fill
                      unoptimized
                    />
                  )}
                </div>
                <div className="flex min-w-0 flex-col items-start">
                  <h5 className="text-primary-text text-xl font-bold break-all">
                    {project.title}
                  </h5>
                  <p className="text-secondary-text break-all">
                    {project.description}
                  </p>
                  <span className="text-brand-hover-bg mt-2 flex items-center gap-1 text-sm font-semibold">
                    {hasUrl ? "View project" : "Edit project"}
                    <ChevronRight size={16} />
                  </span>
                </div>
              </div>
            );

            return hasUrl ? (
              <a
                key={project.id ?? index}
                href={sanitizeUrl(projectUrl!)}
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

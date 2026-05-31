import Image from "next/image";
import { getImageUrl, sanitizeUrl, isProjectHighlighted } from "@/utils/profile";
import { ProfileContentDetails } from "@/api/profile/profile.type";
import { ExternalLink } from "lucide-react";

type Props = {
  details?: ProfileContentDetails | null;
};

export default function HighlightCard({ details }: Props) {
  const projects = details?.projects?.items ?? [];
  const highlightedProject = projects.find(isProjectHighlighted);

  if (!highlightedProject) {
    return (
      <section className="rounded-[12px] border border-border bg-background p-4 sm:p-6">
        <h2 className="text-xl font-bold">Highlight</h2>

        <div className="mt-4 flex flex-col gap-6 md:flex-row md:items-center">
          <div className="flex flex-1 justify-center bg-secondary-bg p-4 rounded-[12px]">
            <div className="flex h-[120px] w-full max-w-[160px] items-center justify-center rounded-[12px] bg-neutral-200 text-sm text-tertiary-text">
              No image
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold text-secondary-text">
              No project highlighted
            </h3>
            <p className="mt-2 text-sm text-tertiary-text">
              Edit your projects and check &quot;Highlight&quot; to feature a project here.
            </p>
          </div>
        </div>
      </section>
    );
  }

  const rawImageSrc = highlightedProject.imageSrc;
  const displayImg = rawImageSrc 
    ? (rawImageSrc.startsWith("/profile-preview/") ? rawImageSrc : getImageUrl(rawImageSrc))
    : null;

  return (
    <section className="rounded-[12px] border border-border bg-background p-4 sm:p-6">
      <h2 className="text-xl font-bold">Highlight</h2>

      <div className="mt-4 flex flex-col gap-6 md:flex-row md:items-center">
        <div className="flex flex-1 justify-center bg-secondary-bg p-4 rounded-[12px] overflow-hidden">
          {displayImg ? (
            <Image
              src={displayImg}
              alt={highlightedProject.title ?? "Project highlight"}
              width={160}
              height={120}
              className="h-auto w-full max-w-[160px] rounded-[12px] object-cover"
              unoptimized
            />
          ) : (
            <div className="flex h-[120px] w-full max-w-[160px] items-center justify-center rounded-[12px] bg-background text-sm text-tertiary-text">
              No image
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-bold break-all">
            {highlightedProject.title}
          </h3>
          <p className="mt-2 break-words text-sm text-secondary-text">
            {highlightedProject.description}
          </p>
          {(highlightedProject.url || highlightedProject.url) && (
            <a
              href={sanitizeUrl(highlightedProject.url)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 flex items-center gap-1 text-sm font-semibold text-brand-hover-bg hover:underline"
            >
              {highlightedProject.buttonText || "View project"}
              <ExternalLink size={16} />
            </a>
          )}
        </div>
      </div>
    </section>
  );
}

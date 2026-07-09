import { Button } from "@/components/ui/button";
import { GripVertical, Trash2 } from "lucide-react";
import { Reorder, useDragControls } from "motion/react";
import type { SavedLink } from "./LinkSidebar";

export default function ContentOption({
  title,
  subtitle,
  onTitleChange,
  onSubtitleChange,
  links,
  onReorderLinks,
  onDeleteLink,
  onEditLink,
  switchTab,
  canAddLink,
}: {
  title: string;
  subtitle: string;
  onTitleChange: (value: string) => void;
  onSubtitleChange: (value: string) => void;
  links: SavedLink[];
  onReorderLinks: (links: SavedLink[]) => void;
  onDeleteLink: (id: string) => void;
  onEditLink: (link: SavedLink) => void;
  switchTab: () => void;
  canAddLink: boolean;
}) {
  return (
    <div>
      <div className="flex flex-col gap-4">
        <span className="flex w-full flex-col gap-2">
          <label className="text-sm font-semibold" htmlFor="title">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="Add title"
            className="profile-builder-scrollbar border-accent-foreground/30 focus:ring-accent rounded-md border p-2 focus:ring-2 focus:ring-offset-1 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          />
        </span>
        <span className="flex w-full flex-col gap-2">
          <label className="text-sm font-semibold" htmlFor="subtitle">
            Subtitle
          </label>
          <textarea
            id="subtitle"
            name="subtitle"
            value={subtitle}
            onChange={(e) => onSubtitleChange(e.target.value)}
            placeholder="Add subtitle"
            className="profile-builder-scrollbar border-accent-foreground/30 focus:ring-accent rounded-md border p-2 focus:ring-2 focus:ring-offset-1 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          />
        </span>
        <span className="flex w-full flex-col gap-2">
          <span className="flex items-center justify-between">
            <span className="text-sm font-semibold">Links</span>
            <span className="text-muted-foreground text-xs">
              Tap a link to edit
            </span>
          </span>
          <div className="flex flex-col gap-3">
            {links.length === 0 ? (
              <div className="border-tertiary-b bg-primary-bg text-secondary-text rounded-xl border p-4 text-sm">
                No links saved yet. Create one in the Section tab.
              </div>
            ) : (
              <Reorder.Group
                axis="y"
                values={links}
                onReorder={onReorderLinks}
                layoutScroll
                className="flex flex-col gap-3"
              >
                {links.map((link) => (
                  <SortableLinkItem
                    key={link.id}
                    link={link}
                    onEditLink={onEditLink}
                    onDeleteLink={onDeleteLink}
                  />
                ))}
              </Reorder.Group>
            )}
          </div>
        </span>

        <Button
          type="button"
          size="lg"
          variant="waitlist"
          onClick={switchTab}
          disabled={!canAddLink}
        >
          {canAddLink ? "Add New Link" : "Max 20 Links Reached"}
        </Button>
      </div>
    </div>
  );
}

function SortableLinkItem({
  link,
  onEditLink,
  onDeleteLink,
}: {
  link: SavedLink;
  onEditLink: (link: SavedLink) => void;
  onDeleteLink: (id: string) => void;
}) {
  const dragControls = useDragControls();

  return (
    <Reorder.Item
      value={link}
      dragListener={false}
      dragControls={dragControls}
      whileDrag={{ zIndex: 20 }}
      role="button"
      tabIndex={0}
      aria-label={`Edit link ${link.title}`}
      onClick={() => onEditLink(link)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onEditLink(link);
        }
      }}
      className="group border-tertiary-b relative flex cursor-pointer items-center justify-between overflow-hidden rounded-md border p-3 transition-all duration-200 focus:ring-2 focus:outline-none"
    >
      <div className="flex flex-1 items-center justify-between gap-3 px-4">
        <p className="truncate text-sm text-black">{link.title}</p>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDeleteLink(link.id);
          }}
          className="hover:text-negative-text text-secondary-text mr-10 flex shrink-0 justify-end p-1.5 opacity-0 transition-all group-hover:opacity-100"
          title="Delete link"
          aria-label={`Delete link ${link.title}`}
        >
          <Trash2 size={15} />
        </button>
      </div>

      <button
        type="button"
        onClick={(e) => e.stopPropagation()}
        onPointerDown={(e) => {
          e.stopPropagation();
          dragControls.start(e);
        }}
        className="border-tertiary-b bg-active-bg text-tertiary-text hover:bg-hover-bg absolute top-0 right-0 flex h-full cursor-grab items-center justify-center self-stretch border-l px-3.5 transition-colors active:cursor-grabbing"
        title="Drag to reorder links"
        aria-label={`Drag to reorder ${link.title}`}
      >
        <GripVertical size={16} />
      </button>
    </Reorder.Item>
  );
}

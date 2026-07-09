import { ChevronLeft } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import ContentOption from "./ContentOption";
import SectionOption from "./SectionOption";

import type { SavedLink } from "./types";
export type { SavedLink } from "./types";

type LinkSection = {
  id: string;
  title: string;
  type: string;
  subtitle?: string;
  links?: SavedLink[];
};

const createFallbackLinkId = (link: SavedLink, index: number) => {
  const source = `${link.title || "link"}-${link.url || index}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);

  return `link-${index}-${source || "item"}`;
};

const ensureLinkIds = (savedLinks: SavedLink[]) => {
  const seenIds = new Set<string>();

  return savedLinks.map((link, index) => {
    const existingId = typeof link.id === "string" ? link.id.trim() : "";
    let nextId = existingId || createFallbackLinkId(link, index);

    if (seenIds.has(nextId)) {
      nextId = `${nextId}-${index}`;
    }

    seenIds.add(nextId);

    return { ...link, id: nextId };
  });
};

const LinkSidebar = ({
  returnTab,
  section,
  onUpdateSection,
  mobile = false,
}: {
  returnTab: () => void;
  section: LinkSection | null;
  onUpdateSection: (id: string, updates: Partial<LinkSection>) => void;
  mobile?: boolean;
}) => {
  const [selectedTab, setSelectedTab] = useState<"content" | "section">(
    "content"
  );
  const [links, setLinks] = useState<SavedLink[]>(() =>
    ensureLinkIds(section?.links ?? [])
  );
  const [editingLink, setEditingLink] = useState<SavedLink | null>(null);
  const [sectionTitle, setSectionTitle] = useState(section?.title || "Links");
  const [sectionSubtitle, setSectionSubtitle] = useState(
    section?.subtitle || ""
  );

  useEffect(() => {
    let cancelled = false;

    queueMicrotask(() => {
      if (cancelled) return;

      setLinks(ensureLinkIds(section?.links ?? []));
      setSectionTitle(section?.title || "Links");
      setSectionSubtitle(section?.subtitle || "");
    });

    return () => {
      cancelled = true;
    };
  }, [section?.id, section?.links, section?.subtitle, section?.title]);

  const syncSection = (updates: Partial<LinkSection>) => {
    if (!section) return;

    onUpdateSection(section.id, updates);
  };

  const handleTitleChange = (value: string) => {
    setSectionTitle(value);
    syncSection({ title: value });
  };

  const handleSubtitleChange = (value: string) => {
    setSectionSubtitle(value);
    syncSection({ subtitle: value });
  };

  const handleLinksChange = (
    updateFn: (currentLinks: SavedLink[]) => SavedLink[]
  ) => {
    const nextLinks = updateFn(links);
    setLinks(nextLinks);
    syncSection({ links: nextLinks });
  };

  const handleReorderLinks = (nextLinks: SavedLink[]) => {
    setLinks(nextLinks);
    syncSection({ links: nextLinks });
  };

  const canAddMoreLinks = useMemo(
    () => links.length < 20 || Boolean(editingLink),
    [editingLink, links.length]
  );

  const handleSaveLink = (
    link: Omit<SavedLink, "id">,
    editingId: string | null = null
  ) => {
    if (!editingId && links.length >= 20) {
      return;
    }

    const id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${links.length + 1}`;

    handleLinksChange((currentLinks) => {
      if (editingId) {
        return currentLinks.map((currentLink) =>
          currentLink.id === editingId
            ? { ...currentLink, ...link, id: editingId }
            : currentLink
        );
      }

      return [...currentLinks, { ...link, id }];
    });

    setEditingLink(null);
    setSelectedTab("content");
  };

  const handleDeleteLink = (id: string) => {
    handleLinksChange((currentLinks) =>
      currentLinks.filter((link) => link.id !== id)
    );
  };

  const handleEditLink = (link: SavedLink) => {
    setEditingLink(link);
    setSelectedTab("section");
  };

  return (
    <aside
      className={`border-tertiary-b animate-in fade-in bg-background ${mobile ? "flex w-full border-r-0 p-4" : "flex p-6"} h-full w-72.5 shrink-0 flex-col border-r duration-200 select-none`}
    >
      {/* Back Button — desktop only */}
      <div
        className={`border-tertiary-b border-b pb-4 ${mobile ? "hidden" : ""}`}
      >
        {selectedTab === "content" ? (
          <button
            onClick={returnTab}
            className="text-primary-text hover:text-link-hover-text inline-flex items-center gap-2 text-base font-semibold transition-all"
          >
            <ChevronLeft size={20} />
            <span>Links</span>
          </button>
        ) : (
          <button
            onClick={() => {
              setEditingLink(null);
              setSelectedTab("content");
            }}
            className="text-primary-text hover:text-link-hover-text inline-flex items-center gap-2 text-base font-semibold transition-all"
          >
            <ChevronLeft size={20} />
            <span>Back to Links</span>
          </button>
        )}
      </div>

      <div
        className={`profile-builder-scrollbar flex-1 overflow-y-auto pr-1 ${mobile ? "py-2" : "py-6"}`}
      >
        {selectedTab === "content" ? (
          <ContentOption
            title={sectionTitle}
            subtitle={sectionSubtitle}
            onTitleChange={handleTitleChange}
            onSubtitleChange={handleSubtitleChange}
            links={links}
            onReorderLinks={handleReorderLinks}
            onDeleteLink={handleDeleteLink}
            onEditLink={handleEditLink}
            switchTab={() => {
              setEditingLink(null);
              setSelectedTab("section");
            }}
            canAddLink={canAddMoreLinks}
          />
        ) : (
          <SectionOption
            key={editingLink?.id ?? "new-link"}
            returnTab={() => setSelectedTab("content")}
            editingLink={editingLink}
            onSaveLink={handleSaveLink}
            linkCount={links.length}
            canAddMoreLinks={canAddMoreLinks}
          />
        )}
      </div>
    </aside>
  );
};

export default LinkSidebar;

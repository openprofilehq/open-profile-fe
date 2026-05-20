import { ChevronLeft } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import ContentOption from "./ContentOption";
import SectionOption from "./SectionOption";

export type SavedLink = {
  id: string;
  title: string;
  url: string;
  iconId: string | null;
  iconLabel: string | null;
  iconSrc: string | null;
  imageSrc: string | null;
};

type LinkSection = {
  id: string;
  title: string;
  type: string;
  subtitle?: string;
  links?: SavedLink[];
};

const LinkSidebar = ({
  returnTab,
  section,
  onUpdateSection,
}: {
  returnTab: () => void;
  section: LinkSection | null;
  onUpdateSection: (id: string, updates: Partial<LinkSection>) => void;
}) => {
  const [selectedTab, setSelectedTab] = useState<"content" | "section">(
    "content"
  );
  const [links, setLinks] = useState<SavedLink[]>(section?.links ?? []);
  const [editingLink, setEditingLink] = useState<SavedLink | null>(null);
  const [sectionTitle, setSectionTitle] = useState(section?.title || "Links");
  const [sectionSubtitle, setSectionSubtitle] = useState(
    section?.subtitle || ""
  );

  useEffect(() => {
    if (!section) return;

    onUpdateSection(section.id, {
      title: sectionTitle,
      subtitle: sectionSubtitle,
      links,
    });
  }, [section, sectionTitle, sectionSubtitle, links, onUpdateSection]);

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

    setLinks((currentLinks) => {
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
    setLinks((currentLinks) => currentLinks.filter((link) => link.id !== id));
  };

  const handleEditLink = (link: SavedLink) => {
    setEditingLink(link);
    setSelectedTab("section");
  };

  return (
    <aside className="border-tertiary-b animate-in fade-in flex h-full w-72.5 shrink-0 flex-col border bg-white shadow-sm duration-200 select-none">
      {/* Back Button */}
      <div className="mb-6 p-3">
        <button
          onClick={returnTab}
          className="text-primary-text hover:text-link-hover-text inline-flex items-center gap-2 text-base font-semibold transition-all"
        >
          <ChevronLeft size={20} />
          <span>Links</span>
        </button>
      </div>
      {/* tabs */}

      <div className="border-secondary-border flex border-b">
        <button
          onClick={() => setSelectedTab("content")}
          className={`-mb-px inline-flex flex-1 items-center justify-center gap-2 border-b py-3 text-base transition-all ${selectedTab === "content" ? "text-primary-text border-black" : "text-primary-text/30"} transform transition-transform duration-200`}
        >
          Content
        </button>
        <button
          //   onClick={() => setSelectedTab("section")}
          className={`-mb-px inline-flex flex-1 items-center justify-center gap-2 border-b py-3 text-base transition-all ${selectedTab === "section" ? "text-primary-text border-black" : "text-primary-text/30"} transform transition-transform duration-200`}
        >
          Section
        </button>
      </div>

      <div>
        {selectedTab === "content" ? (
          <ContentOption
            title={sectionTitle}
            subtitle={sectionSubtitle}
            onTitleChange={setSectionTitle}
            onSubtitleChange={setSectionSubtitle}
            links={links}
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

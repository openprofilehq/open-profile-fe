import React from "react";
import { ExternalLink, Globe } from "lucide-react";
import {
  XIcon,
  InstagramIcon,
  LinkedInIcon,
  GithubIcon,
  YoutubeIcon,
} from "@/components/icons/BrandIcons";

const renderMaskIcon = (src: string, size: number) => (
  <div
    className="shrink-0 bg-current"
    style={{
      width: size,
      height: size,
      maskImage: `url(${src})`,
      WebkitMaskImage: `url(${src})`,
      maskSize: "contain",
      WebkitMaskSize: "contain",
      maskRepeat: "no-repeat",
      WebkitMaskRepeat: "no-repeat",
      maskPosition: "center",
      WebkitMaskPosition: "center",
    }}
  />
);

export const getLinkIcon = (title: string = "", size: number = 18) => {
  const t = title.toLowerCase();

  if (t.includes("instagram"))
    return <InstagramIcon style={{ fontSize: size }} />;
  if (t.includes("twitter") || t.includes("x.com") || t === "x")
    return <XIcon style={{ fontSize: size }} />;
  if (t.includes("linkedin"))
    return <LinkedInIcon style={{ fontSize: size }} />;
  if (t.includes("github")) return <GithubIcon style={{ fontSize: size }} />;
  if (t.includes("youtube")) return <YoutubeIcon style={{ fontSize: size }} />;

  if (t.includes("whatsapp") || t.includes("wa.me"))
    return renderMaskIcon("/profilebuilder_home/icons/whatsapp.svg", size);
  if (t.includes("figma"))
    return renderMaskIcon("/profilebuilder_home/icons/figma.svg", size);
  if (t.includes("behance"))
    return renderMaskIcon("/profilebuilder_home/icons/behance.svg", size);
  if (t.includes("flickr"))
    return renderMaskIcon("/profilebuilder_home/icons/flickr.svg", size);
  if (t.includes("pinterest"))
    return renderMaskIcon("/profilebuilder_home/icons/pinterest.svg", size);
  if (t.includes("tiktok"))
    return renderMaskIcon("/profilebuilder_home/icons/tiktok.svg", size);
  if (t.includes("mailto:") || t.includes("mail") || t.includes("@"))
    return renderMaskIcon("/profilebuilder_home/icons/mail.svg", size);
  if (t.includes("chat"))
    return renderMaskIcon("/profilebuilder_home/icons/chat.svg", size);
  if (t.includes("eye"))
    return renderMaskIcon("/profilebuilder_home/icons/eye.svg", size);

  return <Globe size={size} />;
};

interface TemplateLinkCardProps {
  id?: string | number;
  title: string;
  url: string;
}

export function TemplateLinkCard({ id, title, url }: TemplateLinkCardProps) {
  return (
    <a
      key={id}
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group border-border bg-background hover:border-brand-hover-bg/30 flex items-center justify-between rounded-[12px] border p-4 shadow-sm transition-all hover:shadow-md"
    >
      <div className="flex items-center gap-3">
        <div
          className="text-primary-text transition-colors group-hover:opacity-80"
          style={{ color: "var(--brand)" }}
        >
          {getLinkIcon(url + " " + title)}
        </div>
        <span className="text-primary-text max-w-[120px] truncate text-[14px] font-medium">
          {title}
        </span>
      </div>
      <ExternalLink
        size={14}
        className="text-tertiary-text shrink-0 transition-colors group-hover:opacity-80"
        style={{ color: "var(--brand)" }}
      />
    </a>
  );
}

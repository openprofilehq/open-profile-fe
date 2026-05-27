"use client";

import Image from "next/image";
import { ArrowLeft, ArrowRight, Eye } from "lucide-react";

// Custom decorative Chat Bubble SVG to match Figma perfectly
const ChatBubbleDotIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-12 w-12 text-[#087583]"
    aria-hidden="true"
  >
    <rect width="20" height="16" x="2" y="3" rx="4" />
    <path d="M8 11h.01M12 11h.01M16 11h.01" />
    <path d="M12 19v3l-4-3" />
  </svg>
);

export default function PortfolioTemplatePreviewPage() {
  const name = "Micaela Robinsson";

  const dummyData = {
    bio: "I'm a digital creator focusing on the intersection of design, technology, and intentional living. Sharing insights to help you build better products and habits.",
    projects: [
      {
        id: "proj-1",
        title: "Product Design",
        description: "Fintech App Redesign",
        imageSrc: "/profile-preview/feature1.jpg",
        url: "https://github.com",
      },
      {
        id: "proj-2",
        title: "Web Design",
        description: "Creator Platform",
        imageSrc: "/profile-preview/feature2.jpg",
        url: "https://github.com",
      },
      {
        id: "proj-3",
        title: "Workspace",
        description: "Minimalist Workspace",
        imageSrc: "/profile-preview/feature3.jpg",
        url: "https://github.com",
      },
      {
        id: "proj-4",
        title: "Systems",
        description: "Design System 2.0",
        imageSrc: "/profile-preview/feature2.jpg",
        url: "https://github.com",
      },
    ],
    cta: {
      title: "Let's build something.",
      subtitle:
        "I'm currently accepting new projects and consulting opportunities for Q3 2026.",
      label: "Start a Conversation",
    },
  };

  const handleClose = () => {
    window.close();
    setTimeout(() => {
      window.location.href = "/dashboard/profile-builder";
    }, 100);
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#F5F5F5] pb-24 font-sans text-[#050505] antialiased">
      {/* Floating Preview Banner */}
      <div className="sticky top-0 z-50 w-full border-b border-neutral-800 bg-neutral-900/95 px-4 py-3 text-white shadow-md backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 rounded-full bg-[#087583] px-2 py-0.5 text-xs font-bold tracking-wider text-white uppercase">
              <Eye size={12} /> Preview
            </span>
            <p className="text-sm font-medium text-neutral-300">
              Viewing{" "}
              <span className="font-bold text-white">Portfolio Template</span>.
            </p>
          </div>
          <button
            onClick={handleClose}
            className="flex items-center gap-1.5 rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-neutral-700"
          >
            <ArrowLeft size={13} />
            Close Preview
          </button>
        </div>
      </div>

      {/* Centered Brand Header Logo */}
      <div className="flex justify-center pt-10 pb-6">
        <div className="relative h-[32px] w-[140px]">
          <Image
            src="/auth/logo.png"
            alt="Open.Profile"
            width={140}
            height={32}
            priority
          />
        </div>
      </div>

      {/* MAIN CARDS CONTAINER STACK */}
      <main className="mx-auto flex w-full max-w-[800px] flex-1 flex-col gap-8 px-4 sm:px-6">
        {/* CARD 1: BIO HEADER CARD */}
        <section className="flex w-full flex-col items-center gap-8 rounded-[24px] border border-[#EDEDED] bg-white p-8 shadow-sm sm:p-12 md:flex-row md:items-start">
          {/* Avatar container */}
          <div className="relative h-[100px] w-[100px] shrink-0 overflow-hidden rounded-full border border-neutral-200 bg-neutral-50 shadow-sm sm:h-[110px] sm:w-[110px]">
            <Image
              src="/profile-preview/avatar.png"
              alt={name}
              fill
              sizes="(max-width: 640px) 100px, 110px"
              className="object-cover"
            />
          </div>

          {/* Description Details */}
          <div className="flex flex-1 flex-col items-center text-center md:items-start md:text-left">
            <h1 className="mb-4 text-[28px] leading-tight font-extrabold tracking-tight sm:text-[32px]">
              {name}
            </h1>
            <p className="mb-6 text-[16px] leading-relaxed font-normal text-[#454545] sm:text-[17px]">
              {dummyData.bio}
            </p>
            <button className="rounded-[8px] bg-[#087583] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#065e69] active:scale-95">
              Message
            </button>
          </div>
        </section>

        {/* CARD 2: SELECTED PROJECTS */}
        <section className="w-full rounded-[24px] border border-[#EDEDED] bg-white p-8 shadow-sm sm:p-12">
          <h2 className="mb-8 text-center text-[24px] font-extrabold tracking-tight sm:text-[28px] md:text-left">
            Selected Projects
          </h2>

          {/* Grid stack */}
          <div className="grid w-full grid-cols-1 gap-8 sm:grid-cols-2">
            {dummyData.projects.map((project) => (
              <div
                key={project.id}
                className="group flex w-full flex-col items-start"
              >
                {/* Project Aspect Ratio Card */}
                <div className="relative mb-4 aspect-[4/3] w-full overflow-hidden rounded-[16px] border border-[#EDEDED] shadow-sm">
                  <Image
                    src={project.imageSrc}
                    alt={project.title}
                    fill
                    sizes="(max-width: 640px) 100vw, 50vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                </div>

                {/* Project Details */}
                <h3 className="mb-1 text-[20px] font-extrabold tracking-tight">
                  {project.title}
                </h3>
                <p className="mb-3 text-[14px] font-medium text-[#747474]">
                  {project.description}
                </p>
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm font-bold text-[#087583] transition-all hover:gap-2.5 hover:text-[#065e69] focus-visible:underline focus-visible:outline-none"
                >
                  <span>View project</span>
                  <ArrowRight size={14} />
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* CARD 3: LET'S BUILD SOMETHING */}
        <section
          id="portfolio-cta-section"
          className="flex w-full flex-col items-center gap-6 rounded-[24px] border border-[#EDEDED] bg-white p-8 text-center shadow-sm sm:p-12"
        >
          {/* Custom chat bubble svg badge */}
          <div className="rounded-full border border-[#EDEDED] bg-[#FAFAFA] p-4 shadow-sm">
            <ChatBubbleDotIcon />
          </div>

          <h2 className="text-[28px] leading-none font-extrabold tracking-tight sm:text-[32px]">
            {dummyData.cta.title}
          </h2>
          <p className="max-w-[500px] text-[16px] leading-relaxed font-normal text-neutral-600">
            {dummyData.cta.subtitle}
          </p>
          <button className="mt-2 rounded-[8px] bg-[#087583] px-8 py-3 text-sm font-bold text-white shadow-md transition-all hover:scale-105 hover:bg-[#065e69] active:scale-95">
            {dummyData.cta.label}
          </button>
        </section>
      </main>
    </div>
  );
}

"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  query: string;
}

export default function PaginationControls({
  currentPage,
  totalPages,
  query,
}: PaginationControlsProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-12 flex items-center justify-center gap-2">
      <div className="border-secondary-b bg-background flex items-center gap-2 rounded-[8px] border p-2 shadow-sm">
        {[...Array(totalPages)].map((_, i) => {
          const pageNum = i + 1;
          if (
            pageNum === 1 ||
            pageNum === totalPages ||
            (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
          ) {
            return (
              <Link
                key={pageNum}
                href={`/search?q=${encodeURIComponent(query)}&page=${pageNum}`}
                className={`flex h-[32px] w-[32px] items-center justify-center rounded-[6px] text-[13px] font-semibold transition-colors ${
                  currentPage === pageNum
                    ? "bg-brand-hover-bg pointer-events-none text-white"
                    : "bg-brand-subtle-bg text-link-hover-text hover:bg-[#D8F3F6]"
                }`}
              >
                {pageNum}
              </Link>
            );
          } else if (
            pageNum === currentPage - 2 ||
            pageNum === currentPage + 2
          ) {
            return (
              <span
                key={pageNum}
                className="text-link-hover-text px-1 font-bold tracking-wider"
              >
                ...
              </span>
            );
          }
          return null;
        })}

        {currentPage < totalPages && (
          <Link
            href={`/search?q=${encodeURIComponent(query)}&page=${
              currentPage + 1
            }`}
            className="text-link-hover-text hover:text-link-active-text mr-1 ml-2 flex items-center gap-1 text-[13px] font-semibold transition-colors"
          >
            Next <ChevronRight size={16} strokeWidth={2.5} />
          </Link>
        )}
      </div>
    </div>
  );
}

"use client";
import { useRef } from "react";
import type { HeadingItem } from "@/lib/posts";
import TOCSidebar from "./toc-sidebar";

export default function ArticleLayout({
  children,
  headings,
}: {
  children: React.ReactNode;
  headings: HeadingItem[];
}) {
  const mdxRef = useRef<HTMLDivElement>(null);
  const showTOC = headings.length >= 2;

  return (
    <>
      <div className={`article-page-shell article-detail-shell${showTOC ? "" : " article-page-shell-single"}`}>
        <div
          ref={mdxRef}
          className="article-main-column min-w-0 flex flex-col"
        >
          {children}
        </div>
        {showTOC && <TOCSidebar headings={headings} />}
      </div>
    </>
  );
}

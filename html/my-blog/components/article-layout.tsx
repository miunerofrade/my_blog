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
      <div
        className="w-full px-8 flex justify-center"
        style={{
          maxWidth: showTOC ? '1200px' : '1080px',
          margin: '0 auto',
          gap: showTOC ? '5rem' : '0',
        }}
      >
        {showTOC && <TOCSidebar headings={headings} />}
        <div
          ref={mdxRef}
          className="min-w-0 flex-1 flex flex-col"
          style={{
            maxWidth: showTOC ? '720px' : '840px',
            gap: '1.5rem',
          }}
        >
          {children}
        </div>
      </div>
    </>
  );
}

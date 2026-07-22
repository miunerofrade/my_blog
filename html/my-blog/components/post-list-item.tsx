"use client";

import Link from "next/link";
import type { PostData } from "@/lib/posts";
import type { CSSProperties, PointerEvent } from "react";

type HighlightStyle = CSSProperties & {
  "--hover-origin": string;
};

const itemStyle: HighlightStyle = {
  paddingTop: "0.5rem",
  paddingBottom: "1rem",
  "--hover-origin": "50%",
};

const highlightStyle: CSSProperties = {
  transformOrigin: "var(--hover-origin) center",
};

export default function PostListItem({ post }: { post: PostData }) {
  const updateHighlightOrigin = (event: PointerEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const position = ((event.clientX - bounds.left) / bounds.width) * 100;
    event.currentTarget.style.setProperty("--hover-origin", `${position}%`);
  };

  return (
    <Link href={`/article/${post.slug}`} className="">
      <div
        className="group relative flex items-start justify-between transition-colors duration-300"
        style={itemStyle}
        onPointerEnter={updateHighlightOrigin}
        onPointerMove={updateHighlightOrigin}
      >
        <span className="w-28 md:w-36 shrink-0 text-sm font-bold tracking-widest text-foreground/40 uppercase mt-1">
          {post.date}
        </span>
        <div className="flex-1 min-w-0 pr-4 md:pr-8 flex flex-col gap-1.5">
          <h3 className="text-base md:text-lg font-bold truncate text-foreground group-hover:text-terracotta transition-colors duration-300">
            {post.title}
          </h3>
          <p className="text-sm text-foreground/50 line-clamp-1 md:line-clamp-2 leading-relaxed">
            {post.excerpt}
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0 text-sm font-medium text-foreground/40 mt-1">
          <span className="transition-transform duration-300 group-hover:-translate-x-1">{post.readTime}</span>
          <span className="text-terracotta opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-out font-black text-lg" aria-hidden="true">
            →
          </span>
        </div>
        <span
          className="absolute bottom-0 left-0 h-px w-full bg-foreground/10"
          aria-hidden="true"
        />
        <span
          className="absolute bottom-0 left-0 h-[2px] w-full origin-center scale-x-0 bg-terracotta transition-transform duration-500 ease-out group-hover:scale-x-100"
          style={highlightStyle}
          aria-hidden="true"
        />
      </div>
    </Link>
  );
}

"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
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
        <span className="mt-1 w-28 shrink-0 text-sm font-bold uppercase leading-[22px] tracking-widest text-muted md:w-36">
          {post.date}
        </span>
        <div className="flex-1 min-w-0 pr-4 md:pr-8 flex flex-col gap-1.5">
          <h3 className="article-list-title truncate text-base font-bold leading-6 text-foreground transition-colors duration-300 group-hover:text-accent md:text-lg md:leading-7">
            {post.title}
          </h3>
          <p className="font-noto-serif-sc line-clamp-1 text-sm leading-[22px] text-muted md:line-clamp-2">
            {post.excerpt}
          </p>
        </div>
        <div className="mt-1 flex shrink-0 items-center gap-2 text-sm font-medium leading-[22px] text-muted">
          <span className="transition-transform duration-300 group-hover:-translate-x-1">{post.readTime}</span>
          <span className="text-accent opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-out" aria-hidden="true">
            <ArrowRight size={24} strokeWidth={2} />
          </span>
        </div>
        <span
          className="absolute bottom-0 left-0 h-px w-full bg-foreground/10"
          aria-hidden="true"
        />
        <span
          className="absolute bottom-0 left-0 h-[2px] w-full origin-center scale-x-0 bg-accent transition-transform duration-500 ease-out group-hover:scale-x-100"
          style={highlightStyle}
          aria-hidden="true"
        />
      </div>
    </Link>
  );
}

"use client";

import { useEffect, useState } from "react";
import type { HeadingItem } from "@/lib/posts";

const HEADING_OFFSET = 80;

export default function TOCSidebar({ headings }: { headings: HeadingItem[] }) {
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    const elements = headings
      .map((heading) => document.getElementById(heading.id))
      .filter((element): element is HTMLElement => element !== null);
    let animationFrame = 0;

    const updateActiveHeading = () => {
      cancelAnimationFrame(animationFrame);
      animationFrame = requestAnimationFrame(() => {
        let currentId = "";
        for (const element of elements) {
          if (element.getBoundingClientRect().top <= HEADING_OFFSET + 1) currentId = element.id;
          else break;
        }

        const atPageBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
        if (atPageBottom && elements.length > 0) currentId = elements[elements.length - 1].id;
        setActiveId(currentId);
      });
    };

    updateActiveHeading();
    window.addEventListener("scroll", updateActiveHeading, { passive: true });
    window.addEventListener("resize", updateActiveHeading);
    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("scroll", updateActiveHeading);
      window.removeEventListener("resize", updateActiveHeading);
    };
  }, [headings]);

  const navigateToHeading = (event: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    event.preventDefault();
    const target = document.getElementById(id);
    if (!target) return;

    setActiveId(id);
    window.history.pushState(null, "", `#${id}`);
    const top = window.scrollY + target.getBoundingClientRect().top - HEADING_OFFSET;
    window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
  };

  return (
    <aside className="article-sidebar-align article-toc-sidebar sticky top-20 hidden h-fit lg:block">
      <span className="mb-4 block font-playfair text-xs font-black uppercase leading-[18px] tracking-widest text-muted">
        ON THIS PAGE
      </span>
      <nav className="flex flex-col gap-1">
        {headings.map((heading) => {
          const isActive = activeId === heading.id;
          return (
            <a
              key={heading.id}
              href={`#${heading.id}`}
              onClick={(event) => navigateToHeading(event, heading.id)}
              className={`flex min-h-9 items-center rounded-lg py-1 font-noto-serif-sc text-base leading-6 transition-colors hover:bg-surface-hover hover:text-accent ${
                isActive ? "font-semibold text-accent" : "text-muted"
              }`}
              style={{ paddingLeft: heading.level === 3 ? "1rem" : undefined }}
            >
              {heading.text}
            </a>
          );
        })}
      </nav>
    </aside>
  );
}

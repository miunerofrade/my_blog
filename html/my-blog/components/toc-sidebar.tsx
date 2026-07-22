"use client";
import { useEffect, useState } from "react";
import type { HeadingItem } from "@/lib/posts";

const HEADING_OFFSET = 96;

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
          if (element.getBoundingClientRect().top <= HEADING_OFFSET + 1) {
            currentId = element.id;
          } else {
            break;
          }
        }

        const atPageBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
        if (atPageBottom && elements.length > 0) {
          currentId = elements[elements.length - 1].id;
        }

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
    const hash = `#${id}`;
    if (window.location.hash !== hash) {
      window.history.pushState(null, "", hash);
    }

    const top = window.scrollY + target.getBoundingClientRect().top - HEADING_OFFSET;
    window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
  };

  return (
    <aside
      className="hidden lg:block"
      style={{
        width: '12rem',
        flexShrink: 0,
        position: 'sticky',
        top: '15vh',
        height: 'fit-content',
      }}
    >
      <span
        style={{
          display: 'block',
          fontSize: '0.75rem',
          fontWeight: 900,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: 'var(--foreground-rgb, 0, 0, 0)',
          opacity: 0.25,
          marginBottom: '1rem',
        }}
      >
        ON THIS PAGE
      </span>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {headings.map((h) => {
          const isActive = activeId === h.id;
          return (
            <a
              key={h.id}
              href={`#${h.id}`}
              onClick={(event) => navigateToHeading(event, h.id)}
              style={{
                display: 'block',
                fontSize: '0.75rem',
                lineHeight: 1.35,
                letterSpacing: '0.02em',
                paddingLeft: h.level === 3 ? '1rem' : '0',
                paddingTop: '0.25rem',
                paddingBottom: '0.25rem',
                color: isActive
                  ? 'rgb(217, 119, 87)'
                  : 'rgba(128, 128, 128, 0.5)',
                fontWeight: isActive ? 600 : 400,
                textDecoration: 'none',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.color = 'rgb(217, 119, 87)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.color = 'rgba(128, 128, 128, 0.5)';
                }
              }}
            >
              {h.text}
            </a>
          );
        })}
      </nav>
    </aside>
  );
}

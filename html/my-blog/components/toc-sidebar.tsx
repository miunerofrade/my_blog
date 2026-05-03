"use client";
import { useEffect, useState } from "react";
import type { HeadingItem } from "@/lib/posts";

export default function TOCSidebar({ headings }: { headings: HeadingItem[] }) {
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-80px 0px -75% 0px" }
    );

    const elements: Element[] = [];
    for (const h of headings) {
      const el = document.getElementById(h.id);
      if (el) {
        elements.push(el);
        observer.observe(el);
      }
    }

    return () => {
      for (const el of elements) observer.unobserve(el);
    };
  }, [headings]);

  return (
    <aside
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
                  e.currentTarget.style.color = 'rgba(217, 119, 87, 0.5)';
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

"use client";
import { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
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

  const { scrollYProgress } = useScroll({
    target: mdxRef,
    offset: ["start start", "end end"],
  });
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  return (
    <>
      <motion.div
        className="fixed top-[50px] left-0 right-0 h-[2px] bg-terracotta origin-left z-50"
        style={{ scaleX }}
      />
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

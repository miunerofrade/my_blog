"use client";
import { motion, useScroll } from "framer-motion";
import { useRef } from "react";

export default function ReadingProgress({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  return (
    <div ref={ref} className="relative w-full">
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2.5px] bg-terracotta/70 origin-left z-[150] pointer-events-none"
        style={{ scaleX: scrollYProgress }}
      />
      {children}
    </div>
  );
}

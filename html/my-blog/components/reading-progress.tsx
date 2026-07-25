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
        className="pointer-events-none fixed left-0 right-0 top-0 z-[150] h-[2px] origin-left bg-accent"
        style={{ scaleX: scrollYProgress }}
      />
      {children}
    </div>
  );
}

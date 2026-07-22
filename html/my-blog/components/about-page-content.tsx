"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

export default function AboutPageContent({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <main
      className="flex min-h-screen flex-col items-center bg-transparent text-foreground selection:bg-terracotta selection:text-background"
      style={{ paddingBottom: "3rem" }}
    >
      <div className="secondary-page-shell flex w-full max-w-[1080px] flex-col">
        <header style={{ marginTop: "6vh", marginBottom: "4vh" }}>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="font-playfair text-[clamp(2rem,4.5vw,4.5rem)] font-bold tracking-normal uppercase md:text-[clamp(2.5rem,3vw,5rem)]"
          >
            {title}<span className="text-terracotta">.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 max-w-xl text-lg leading-relaxed text-foreground/50"
          >
            {subtitle}
          </motion.p>
        </header>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="about-content prose prose-lg max-w-none prose-neutral dark:prose-invert
          prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-foreground
          prose-a:text-terracotta prose-p:leading-8 prose-p:text-foreground dark:prose-p:text-foreground
          prose-strong:text-foreground prose-ul:list-inside prose-ul:pl-5 prose-li:text-foreground"
          style={{ marginTop: "1rem" }}
        >
          {children}
        </motion.div>
      </div>
    </main>
  );
}

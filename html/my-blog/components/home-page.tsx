"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ExternalLink, GitFork, Star } from "lucide-react";
import NavButton from "@/components/button";
import { BackgroundGlow, BackgroundGrid } from "@/components/background";
import type { GitHubRepository } from "@/lib/github";

const NAME = "Miunerofrade";

const NAVIGATION_ITEMS = [
  { label: "Read My Blogs", href: "/article" },
  { label: "About Me", href: "/about" },
  { label: "Projects", href: "https://github.com/miunerofrade?tab=repositories" },
];

const languageColors: Record<string, string> = {
  Python: "#3572a5",
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Rust: "#dea584",
  Go: "#00add8",
};

function formatRepositoryDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(value));
}

export default function HomePage({ repositories }: { repositories: GitHubRepository[] }) {
  const reduceMotion = useReducedMotion();
  const [typedLength, setTypedLength] = useState(0);
  const [showPeriod, setShowPeriod] = useState(false);
  const visibleLength = reduceMotion ? NAME.length : typedLength;
  const periodVisible = Boolean(reduceMotion) || showPeriod;

  useEffect(() => {
    if (reduceMotion) return;

    let characterIndex = 0;
    let periodTimer: ReturnType<typeof setTimeout> | undefined;

    const typingTimer = setInterval(() => {
      characterIndex += 1;
      setTypedLength(characterIndex);

      if (characterIndex === NAME.length) {
        clearInterval(typingTimer);
        periodTimer = setTimeout(() => setShowPeriod(true), 700);
      }
    }, 105);

    return () => {
      clearInterval(typingTimer);
      if (periodTimer) clearTimeout(periodTimer);
    };
  }, [reduceMotion]);

  return (
    <main className="relative z-10 w-full min-w-0 overflow-x-clip bg-transparent text-foreground selection:bg-terracotta selection:text-background">
      <BackgroundGlow />
      <BackgroundGrid />

      <section className="flex min-h-[calc(100svh-50px)] w-full min-w-0 items-center justify-center px-6 py-10 text-center md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="flex w-full max-w-[1080px] flex-col items-center gap-[3vh]"
        >
          <h1
            aria-label="Miunerofrade."
            className="relative mx-auto max-w-full font-playfair text-4xl font-bold leading-none sm:text-6xl md:text-8xl lg:text-9xl"
          >
            <span className="invisible" aria-hidden="true">
              {NAME}<span>.</span>
            </span>
            <span className="absolute inset-0 text-left" aria-hidden="true">
              {NAME.slice(0, visibleLength)}
              {!periodVisible && (
                <motion.span
                  className="ml-[0.04em] inline-block h-[0.78em] w-[0.035em] bg-current align-[-0.02em]"
                  animate={{ opacity: [1, 1, 0, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                />
              )}
              {periodVisible && (
                <motion.span
                  className="inline-block text-terracotta"
                  initial={reduceMotion ? false : { opacity: 0, y: "-0.45em", scale: 0.25, rotate: -18 }}
                  animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 520, damping: 16, mass: 0.7 }}
                >
                  .
                </motion.span>
              )}
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            transition={{ delay: reduceMotion ? 0 : 1.65, duration: 0.5 }}
            className="max-w-2xl font-playfair text-xl font-normal leading-loose md:text-2xl"
          >
            Welcome.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex w-full max-w-[320px] flex-col items-center gap-[3vh]"
          >
            {NAVIGATION_ITEMS.map((item, index) => (
              <NavButton
                key={item.label}
                label={item.label}
                href={item.href}
                isPrimary={index === 0}
              />
            ))}
          </motion.div>
        </motion.div>
      </section>

      <section
        className="flex min-h-screen w-full min-w-0 items-start justify-center border-t border-foreground/10 px-6 pb-20 md:px-12"
        style={{ paddingTop: "4rem" }}
      >
        <div className="w-full max-w-[1080px]">
          <motion.header
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.7 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-center"
            style={{ marginBottom: "4rem" }}
          >
            <h2 className="font-playfair text-5xl font-bold leading-tight md:text-7xl">
              Recent focus<span className="text-terracotta">.</span>
            </h2>
          </motion.header>

          {repositories.length > 0 && (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.18 }}
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.12 } },
              }}
              className="grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2"
            >
              {repositories.map((repository) => (
                <motion.a
                  key={repository.id}
                  href={repository.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  variants={{
                    hidden: { opacity: 0, y: 30 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                  className="github-repository-card group relative flex min-h-[300px] min-w-0 flex-col items-center justify-center overflow-hidden rounded-2xl border border-foreground/12 bg-foreground/[0.025] px-8 pb-24 pt-10 text-center transition-all duration-500 hover:-translate-y-1 hover:border-terracotta/55 hover:bg-foreground/[0.045] hover:shadow-[0_14px_36px_rgba(0,0,0,0.08)] md:min-h-[330px] md:px-12"
                >
                  <span className="relative min-w-0 pb-7 font-playfair">
                    <span className="block break-words text-3xl font-bold leading-tight transition-colors duration-300 group-hover:text-terracotta md:text-4xl">
                      {repository.name}
                    </span>
                    {repository.description && (
                      <span
                        className="mx-auto block max-w-md font-noto-serif-sc text-base leading-8 text-foreground/55 line-clamp-2 md:text-lg"
                        style={{ marginTop: "1.5rem" }}
                      >
                        {repository.description}
                      </span>
                    )}
                  </span>

                  <span
                    className="absolute flex flex-wrap items-center justify-center gap-x-5 gap-y-2 border-t border-foreground/10 text-xs font-medium text-foreground/45"
                    style={{
                      left: "2rem",
                      right: "2rem",
                      bottom: "0.5rem",
                      paddingTop: "0.5rem",
                    }}
                  >
                    {repository.language && (
                      <span className="inline-flex items-center gap-2">
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: languageColors[repository.language] ?? "var(--color-terracotta)" }}
                          aria-hidden="true"
                        />
                        {repository.language}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1.5" title="Stars">
                      <Star className="h-3.5 w-3.5" aria-hidden="true" />
                      {repository.stars}
                    </span>
                    {repository.forks > 0 && (
                      <span className="inline-flex items-center gap-1.5" title="Forks">
                        <GitFork className="h-3.5 w-3.5" aria-hidden="true" />
                        {repository.forks}
                      </span>
                    )}
                    <time dateTime={repository.pushedAt}>{formatRepositoryDate(repository.pushedAt)}</time>
                  </span>
                </motion.a>
              ))}

              <motion.a
                href="https://github.com/miunerofrade?tab=repositories"
                target="_blank"
                rel="noopener noreferrer"
                variants={{
                  hidden: { opacity: 0, y: 16 },
                  visible: { opacity: 1, y: 0 },
                }}
                className="group mt-7 flex w-fit items-center gap-2 justify-self-center text-sm font-bold text-foreground/50 transition-colors hover:text-terracotta md:col-span-2"
              >
                View all repositories
                <ExternalLink className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" aria-hidden="true" />
              </motion.a>
            </motion.div>
          )}
        </div>
      </section>
    </main>
  );
}

"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ExternalLink } from "lucide-react";
import {
  CupertinoButton,
  CupertinoSection,
} from "@/components/cupertino";
import HomeWritings from "@/components/home-writings";
import HomeRepositories from "@/components/home-repositories";
import type { GitHubRepository } from "@/lib/github";
import type { PostData } from "@/lib/posts";

const NAME = "Miunerofrade";

const NAVIGATION_ITEMS = [
  { label: "Read My Blogs", href: "/article", external: false },
  { label: "About Me", href: "/about", external: false },
  { label: "Projects", href: "https://github.com/miunerofrade?tab=repositories", external: true },
];

export default function HomePage({
  repositories,
  recentPosts,
}: {
  repositories: GitHubRepository[];
  recentPosts: PostData[];
}) {
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
    <main className="cupertino-page">
      <CupertinoSection className="cupertino-hero">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="cupertino-hero-content"
        >
          <h1
            aria-label="Miunerofrade."
            className="cupertino-hero-title"
          >
            <span className="invisible" aria-hidden="true">
              {NAME}<span>.</span>
            </span>
            <span className="absolute inset-0 text-left" aria-hidden="true">
              {NAME.slice(0, visibleLength)}
              {!periodVisible && (
                <motion.span
                  className="cupertino-type-caret"
                  animate={{ opacity: [1, 1, 0, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                />
              )}
              {periodVisible && (
                <motion.span
                  className="cupertino-period"
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
            animate={{ opacity: 1 }}
            transition={{ delay: reduceMotion ? 0 : 1.65, duration: 0.5 }}
            className="cupertino-welcome"
          >
            不定时悲伤
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="cupertino-actions"
          >
            {NAVIGATION_ITEMS.map((item, index) => (
              <CupertinoButton
                key={item.label}
                href={item.href}
                external={item.external}
                className={index === 0 ? "cupertino-button-primary" : ""}
              >
                <span className="cupertino-button-content">
                  <span>{item.label}</span>
                  <span className="cupertino-button-arrow" aria-hidden="true">
                    {item.external ? (
                      <ExternalLink size={24} strokeWidth={2} />
                    ) : (
                      <ArrowRight size={24} strokeWidth={2} />
                    )}
                  </span>
                </span>
              </CupertinoButton>
            ))}
          </motion.div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: reduceMotion ? 0 : 1.9, duration: 0.5 }}
          className="cupertino-direction"
        >
          Software Engineering · AI Applications · Notes
        </motion.p>
      </CupertinoSection>

      <CupertinoSection className="cupertino-focus cupertino-writings">
        <div className="cupertino-focus-content">
          <motion.header
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.7 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="cupertino-focus-header"
          >
            <p className="cupertino-section-label">WRITING</p>
            <h2 className="cupertino-focus-title">
              Recent writings<span className="cupertino-period">.</span>
            </h2>
          </motion.header>

          {recentPosts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="cupertino-writing-list"
            >
              <HomeWritings posts={recentPosts} />
            </motion.div>
          )}
        </div>
      </CupertinoSection>

      <CupertinoSection className="cupertino-focus">
        <div className="cupertino-focus-content">
          <motion.header
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.7 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="cupertino-focus-header"
          >
            <p className="cupertino-section-label">GITHUB</p>
            <h2 className="cupertino-focus-title">
              Recent focus<span className="cupertino-period">.</span>
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
              className="cupertino-repository-grid"
            >
              <HomeRepositories repositories={repositories} />
            </motion.div>
          )}
        </div>
      </CupertinoSection>
    </main>
  );
}

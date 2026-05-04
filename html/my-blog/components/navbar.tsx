"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef, useLayoutEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "./theme-toggle";
import type { PostData } from "@/lib/posts";

const NAV_LINKS = [
  { href: "/", label: "首页" },
  { href: "/article", label: "文章" },
  { href: "/about", label: "关于" },
  { href: "/links", label: "友链" },
];

interface NavbarProps {
  recentPosts?: PostData[];
}

export default function Navbar({ recentPosts = [] }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, opacity: 0 });
  const pathname = usePathname();
  const enterTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const leaveTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const navContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useLayoutEffect(() => {
    setMegaOpen(false);
    if (!navContainerRef.current) return;
    const activeEl = navContainerRef.current.querySelector<HTMLElement>('[data-active="true"]');
    if (activeEl) {
      setIndicatorStyle({ left: activeEl.offsetLeft, width: activeEl.offsetWidth, opacity: 1 });
    }
  }, [pathname]);

  const handleArticleEnter = () => {
    clearTimeout(leaveTimer.current);
    if (recentPosts.length === 0) return;
    enterTimer.current = setTimeout(() => setMegaOpen(true), 250);
  };

  const handleArticleLeave = () => {
    clearTimeout(enterTimer.current);
    leaveTimer.current = setTimeout(() => setMegaOpen(false), 200);
  };

  return (
    <motion.nav
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className={`
        w-full h-[50px] flex justify-center sticky top-0 z-[100] relative
        border-b border-foreground/10
        transition-all duration-300 ease-out
        ${megaOpen
          ? "bg-white dark:bg-zinc-950"
          : isScrolled
            ? "bg-background/70 backdrop-blur-md"
            : "bg-transparent"
        }
      `}
      style={megaOpen ? { backgroundColor: 'var(--background, var(--bg-color))' } : {}}
    >
      <div className="w-full max-w-[1080px] h-full flex items-center justify-between px-6">

        {/* Logo */}
        <div className="flex-1 flex justify-start">
          <Link href="/" className="text-xl font-black tracking-tighter text-foreground">
            Miunerofrade
          </Link>
        </div>

        {/* Nav links */}
        <div
          ref={navContainerRef}
          className="flex-1 h-full flex items-center justify-center gap-12 relative text-base font-bold tracking-widest uppercase"
        >
          {NAV_LINKS.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            const isArticle = link.href === "/article";

            return (
              <div
                key={link.href}
                data-active={isActive}
                onMouseEnter={isArticle ? handleArticleEnter : undefined}
                onMouseLeave={isArticle ? handleArticleLeave : undefined}
              >
                <Link
                  href={link.href}
                  className={`py-1 transition-colors duration-300 block ${
                    isActive
                      ? "text-terracotta"
                      : "text-foreground/80 hover:text-terracotta"
                  }`}
                >
                  {link.label}
                </Link>
              </div>
            );
          })}

          {/* 底部滑动指示器，仅水平方向动画 */}
          <motion.div
            initial={false}
            animate={indicatorStyle}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
            className="absolute bottom-[-1px] h-[2px] bg-terracotta rounded-full pointer-events-none"
          />
        </div>

        {/* Theme toggle */}
        <div className="flex-1 flex justify-end">
          <ThemeToggle />
        </div>
      </div>

      {/* --- 无缝托盘 (Seamless Tray) --- */}
      <AnimatePresence>
        {megaOpen && recentPosts.length > 0 && (
          <motion.div
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] as const }}
            className="absolute top-full left-0 w-full flex justify-center border-b border-foreground/10 z-[60] shadow-sm overflow-hidden bg-white dark:bg-zinc-950"
            style={{ backgroundColor: 'var(--background, var(--bg-color))' }}
            onMouseEnter={() => {
              clearTimeout(leaveTimer.current);
              clearTimeout(enterTimer.current);
              setMegaOpen(true);
            }}
            onMouseLeave={handleArticleLeave}
          >
            <motion.div
              className="w-full max-w-[1080px] px-6 flex flex-row"
              style={{ gap: '4rem', paddingTop: '3rem', paddingBottom: '3rem' }}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.15, ease: "easeOut" }}
            >
              {/* 左侧 Sidebar */}
              <div style={{ width: '200px', flexShrink: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <span className="text-xs font-black tracking-widest text-foreground/40 uppercase">
                  LATEST ARTICLES
                </span>
                <Link
                  href="/article"
                  className="text-xs font-bold tracking-widest text-terracotta hover:text-terracotta/70 transition-colors"
                >
                  查看全部文章 →
                </Link>
              </div>

              {/* 右侧 Grid */}
              <div style={{ flexGrow: 1, display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '3rem' }}>
                {recentPosts.slice(0, 3).map((post) => (
                  <Link
                    key={post.slug}
                    href={`/article/${post.slug}`}
                    className="group"
                    style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
                  >
                    <span className="text-xs font-medium text-foreground/40 border-b border-foreground/10" style={{ paddingBottom: '0.5rem' }}>
                      {post.date}
                    </span>
                    <h3 className="text-sm font-bold leading-relaxed text-foreground group-hover:text-terracotta transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                  </Link>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.nav>
  );
}

"use client";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "./theme-toggle";
import type { PostData } from "@/lib/posts";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { href: "/", label: "首页", routes: ["/"] },
  { href: "/article", label: "文章", routes: ["/article", "/tags"] },
  { href: "/about", label: "关于", routes: ["/about"] },
  { href: "/links", label: "友链", routes: ["/links"] },
] as const;

type NavigationLink = (typeof NAV_LINKS)[number];

function isRouteMatch(pathname: string, route: string) {
  return route === "/" ? pathname === route : pathname === route || pathname.startsWith(`${route}/`);
}

function getActiveNavigationHref(pathname: string) {
  return NAV_LINKS.find((link) =>
    link.routes.some((route) => isRouteMatch(pathname, route)),
  )?.href;
}

interface NavbarProps {
  recentPosts?: PostData[];
}

function NavbarLink({
  link,
  isActive,
  onNavigate,
  onArticleEnter,
  onArticleLeave,
}: {
  link: NavigationLink;
  isActive: boolean;
  onNavigate: () => void;
  onArticleEnter: () => void;
  onArticleLeave: () => void;
}) {
  const isArticle = link.href === "/article";

  return (
    <div
      onMouseEnter={isArticle ? onArticleEnter : undefined}
      onMouseLeave={isArticle ? onArticleLeave : undefined}
    >
      <Link
        href={link.href}
        onClick={onNavigate}
        aria-current={isActive ? "page" : undefined}
        className={`relative block py-1 transition-colors duration-300 ${
          isActive
            ? "text-terracotta"
            : "text-foreground/80 hover:text-terracotta"
        }`}
      >
        {link.label}
        {isActive && (
          <motion.span
            layoutId="primary-navigation-indicator"
            className="absolute bottom-[-1px] left-0 right-0 h-[2px] rounded-full bg-terracotta"
            transition={{ type: "spring", stiffness: 500, damping: 38, mass: 0.7 }}
          />
        )}
      </Link>
    </div>
  );
}

export default function Navbar({ recentPosts = [] }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const enterTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const leaveTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const activeNavigationHref = getActiveNavigationHref(pathname);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    return () => {
      clearTimeout(enterTimer.current);
      clearTimeout(leaveTimer.current);
    };
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [mobileOpen]);

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
          ? "bg-background"
          : isScrolled
            ? "bg-background/70 backdrop-blur-md"
            : "bg-transparent"
        }
      `}
      style={megaOpen ? { backgroundColor: 'var(--background, var(--bg-color))' } : {}}
    >
      <div className="w-full max-w-[1080px] h-full flex items-center justify-between px-8 md:px-6">

        <div className="flex-1 flex justify-start min-w-0">
          <Link href="/" onClick={() => setMobileOpen(false)} className="text-xl font-black tracking-[-0.5px] text-foreground">
            Miunerofrade
          </Link>
        </div>

        <LayoutGroup id="primary-navigation">
          <div className="relative hidden h-full flex-1 items-center justify-center gap-12 text-base font-bold tracking-widest uppercase md:flex">
            {NAV_LINKS.map((link) => (
              <NavbarLink
                key={link.href}
                link={link}
                isActive={activeNavigationHref === link.href}
                onNavigate={() => setMegaOpen(false)}
                onArticleEnter={handleArticleEnter}
                onArticleLeave={handleArticleLeave}
              />
            ))}
          </div>
        </LayoutGroup>

        <div className="flex-1 flex justify-end items-center gap-1">
          <ThemeToggle />
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-full text-foreground/60 transition-colors hover:bg-foreground/10 hover:text-terracotta md:hidden"
            aria-label={mobileOpen ? "关闭导航菜单" : "打开导航菜单"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
            onClick={() => {
              setMobileOpen((open) => !open);
              setMegaOpen(false);
            }}
          >
            {mobileOpen ? <X size={21} strokeWidth={1.8} /> : <Menu size={21} strokeWidth={1.8} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-[200] md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <button
              type="button"
              className="absolute inset-0 h-full w-full cursor-default bg-black/25 backdrop-blur-[2px]"
              aria-label="关闭导航菜单"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              id="mobile-navigation"
              role="dialog"
              aria-modal="true"
              aria-label="移动端导航"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 360, damping: 34 }}
              className="absolute right-0 top-0 flex h-dvh w-[72vw] max-w-[24rem] flex-col border-l border-foreground/10 bg-background/95 px-8 pb-10 pt-8 shadow-2xl backdrop-blur-xl"
            >
              <div className="flex items-center justify-between border-b border-foreground/10 pb-7">
                <span className="font-playfair text-2xl font-bold tracking-wide text-foreground">Navigation<span className="text-terracotta">.</span></span>
                <button
                  type="button"
                  className="flex h-9 w-9 items-center justify-center rounded-full text-foreground/60 transition-colors hover:bg-foreground/10 hover:text-terracotta"
                  aria-label="关闭导航菜单"
                  onClick={() => setMobileOpen(false)}
                >
                  <X size={21} strokeWidth={1.8} />
                </button>
              </div>
              <nav className="flex flex-col pt-6" aria-label="移动端导航">
              {NAV_LINKS.map((link) => {
                const isActive = activeNavigationHref === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    aria-current={isActive ? "page" : undefined}
                    className={`relative border-b border-foreground/10 px-2 py-6 text-2xl font-bold leading-tight tracking-widest transition-colors last:border-b-0 ${
                      isActive ? "text-terracotta" : "text-foreground/75 hover:text-terracotta"
                    }`}
                  >
                    {link.label}
                    {isActive && <span className="absolute bottom-0 left-2 h-0.5 w-8 bg-terracotta" aria-hidden="true" />}
                  </Link>
                );
              })}
              </nav>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {megaOpen && recentPosts.length > 0 && (
          <motion.div
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] as const }}
            className="absolute top-full left-0 hidden w-full justify-center border-b border-foreground/10 z-[60] shadow-sm overflow-hidden bg-background md:flex"
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

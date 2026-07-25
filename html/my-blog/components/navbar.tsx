"use client";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "./theme-toggle";
import CommandMenu, { type SearchPostEntry } from "./command-menu";
import IconButton from "./icon-button";
import type { PostData } from "@/lib/posts";
import { ArrowRight, Menu, Search, X } from "lucide-react";

const NAV_LINKS = [
  { href: "/", label: "首页", routes: ["/"] },
  { href: "/article", label: "文章", routes: ["/article", "/tags"] },
  { href: "/about", label: "关于", routes: ["/about"] },
  { href: "/links", label: "友链", routes: ["/links"] },
] as const;

type NavigationLink = (typeof NAV_LINKS)[number];
type MobileHeading = { id: string; text: string; level: number };

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
  searchPosts: SearchPostEntry[];
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
            ? "text-accent"
            : "text-foreground hover:text-accent"
        }`}
      >
        {link.label}
        {isActive && (
          <motion.span
            layoutId="primary-navigation-indicator"
            className="absolute bottom-[-1px] left-0 right-0 h-[2px] rounded-full bg-accent"
            transition={{ type: "spring", stiffness: 500, damping: 38, mass: 0.7 }}
          />
        )}
      </Link>
    </div>
  );
}

export default function Navbar({ recentPosts = [], searchPosts }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchTriggerRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const enterTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const leaveTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const activeNavigationHref = getActiveNavigationHref(pathname);
  const [mobileHeadings, setMobileHeadings] = useState<MobileHeading[]>([]);
  const [activeMobileHeading, setActiveMobileHeading] = useState("");

  useEffect(() => {
    const frame = requestAnimationFrame(() => setSearchOpen(false));
    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  useEffect(() => {
    if (!pathname.startsWith("/article/") || pathname === "/article/") {
      return;
    }

    const collectHeadings = () => {
      const next = Array.from(document.querySelectorAll<HTMLElement>(".article-content h2, .article-content h3"))
        .filter((heading) => heading.id)
        .map((heading) => ({
          id: heading.id,
          text: heading.textContent?.trim() ?? "",
          level: heading.tagName === "H3" ? 3 : 2,
        }))
        .filter((heading) => heading.text);
      setMobileHeadings(next);
    };

    collectHeadings();
    const observer = new MutationObserver(collectHeadings);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [pathname]);

  const visibleMobileHeadings = pathname.startsWith("/article/") ? mobileHeadings : [];

  useEffect(() => {
    if (mobileHeadings.length === 0) return;
    const updateActive = () => {
      let current = "";
      for (const heading of mobileHeadings) {
        const element = document.getElementById(heading.id);
        if (element && element.getBoundingClientRect().top <= 81) current = heading.id;
      }
      setActiveMobileHeading(current);
    };
    updateActive();
    window.addEventListener("scroll", updateActive, { passive: true });
    return () => window.removeEventListener("scroll", updateActive);
  }, [mobileHeadings]);

  const navigateMobileHeading = (event: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    event.preventDefault();
    const target = document.getElementById(id);
    if (!target) return;
    setActiveMobileHeading(id);
    window.history.pushState(null, "", `#${id}`);
    window.scrollTo({
      top: Math.max(0, window.scrollY + target.getBoundingClientRect().top - 80),
      behavior: "smooth",
    });
    setMobileOpen(false);
  };

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
    if (recentPosts.length === 0 || searchOpen) return;
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
        w-full h-14 flex justify-center sticky top-0 z-[100]
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
      <div className="mobile-navbar-shell w-full max-w-[1080px] h-full flex items-center justify-between">

        <div className="flex-1 flex justify-start min-w-0">
          <Link href="/" onClick={() => setMobileOpen(false)} className="text-xl font-semibold tracking-normal text-foreground">
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

        <div className="flex-1 flex justify-end items-center gap-2">
          <IconButton
            ref={searchTriggerRef}
            label={searchOpen ? "关闭文章搜索" : "打开文章搜索"}
            aria-expanded={searchOpen}
            onClick={() => {
              setSearchOpen((open) => !open);
              setMegaOpen(false);
              setMobileOpen(false);
            }}
          >
            <Search aria-hidden="true" size={24} strokeWidth={2} />
          </IconButton>
          <ThemeToggle />
          <IconButton
            className="md:hidden"
            label={mobileOpen ? "关闭导航菜单" : "打开导航菜单"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
            onClick={() => {
              setMobileOpen((open) => !open);
              setMegaOpen(false);
              setSearchOpen(false);
            }}
          >
            {mobileOpen ? <X aria-hidden="true" size={24} strokeWidth={2} /> : <Menu aria-hidden="true" size={24} strokeWidth={2} />}
          </IconButton>
        </div>
      </div>

      <CommandMenu
        posts={searchPosts}
        open={searchOpen}
        onOpenChange={(open) => {
          setSearchOpen(open);
          if (open) {
            setMegaOpen(false);
            setMobileOpen(false);
          }
        }}
        triggerRef={searchTriggerRef}
      />

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
              className="mobile-drawer-backdrop"
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
              className="mobile-drawer"
            >
              <div className="mobile-drawer-header">
                <span className="mobile-drawer-title">Navigation<span className="text-accent">.</span></span>
                <IconButton
                  label="关闭导航菜单"
                  onClick={() => setMobileOpen(false)}
                >
                  <X aria-hidden="true" size={24} strokeWidth={2} />
                </IconButton>
              </div>
              <nav className="mobile-drawer-nav" aria-label="移动端导航">
              {NAV_LINKS.map((link) => {
                const isActive = activeNavigationHref === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    aria-current={isActive ? "page" : undefined}
                    className={`mobile-drawer-link ${
                      isActive ? "text-accent" : "text-muted hover:text-accent"
                    }`}
                  >
                    {link.label}
                    {isActive && <span className="mobile-drawer-indicator" aria-hidden="true" />}
                  </Link>
                );
              })}
              </nav>
              {visibleMobileHeadings.length > 0 && (
                <section className="mobile-drawer-toc" aria-label="文章目录">
                  <p className="mobile-drawer-toc-title">本页目录</p>
                  <nav className="mobile-drawer-toc-nav">
                    {visibleMobileHeadings.map((heading) => (
                      <a
                        key={heading.id}
                        href={`#${heading.id}`}
                        onClick={(event) => navigateMobileHeading(event, heading.id)}
                        className={`mobile-drawer-toc-link ${activeMobileHeading === heading.id ? "is-active" : ""}`}
                        style={{ paddingLeft: heading.level === 3 ? "1rem" : undefined }}
                      >
                        {heading.text}
                      </a>
                    ))}
                  </nav>
                </section>
              )}
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
                <span className="text-xs font-black uppercase leading-[18px] tracking-widest text-muted">
                  LATEST ARTICLES
                </span>
                <Link
                  href="/article"
                  className="inline-flex min-h-11 items-center rounded-lg text-xs font-bold leading-[18px] tracking-widest text-accent transition-colors hover:bg-surface-hover"
                >
                  <span className="inline-flex items-center gap-2">
                    查看全部文章 <ArrowRight aria-hidden="true" size={24} strokeWidth={2} />
                  </span>
                </Link>
              </div>

              <div style={{ flexGrow: 1, display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '3rem' }}>
                {recentPosts.slice(0, 3).map((post) => (
                  <Link
                    key={post.slug}
                    href={`/article/${post.slug}`}
                    className="group"
                    style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
                  >
                    <span className="border-b border-border pb-2 text-xs font-medium leading-[18px] text-muted">
                      {post.date}
                    </span>
                    <h3 className="line-clamp-2 text-sm font-bold leading-[22px] text-foreground transition-colors group-hover:text-accent">
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

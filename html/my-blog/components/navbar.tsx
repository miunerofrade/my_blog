"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "./theme-toggle";
import type { PostData } from "@/lib/posts";

const NAV_LINKS = [
  { href: "/", label: "首页" },
  { href: "/article", label: "文章" },
  { href: "/links", label: "友链" },
];

interface NavbarProps {
  recentPosts?: PostData[];
}

export default function Navbar({ recentPosts = [] }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const pathname = usePathname();
  const enterTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const leaveTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 路由跳转时关闭 mega menu
  useEffect(() => {
    setMegaOpen(false);
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
        w-full h-[50px] flex justify-center sticky top-0 z-[100]
        transition-all duration-300 ease-out
        ${isScrolled
          ? "bg-background/70 backdrop-blur-md border-b border-foreground/10"
          : "bg-transparent border-transparent"
        }
      `}
    >
      <div className="w-full max-w-[1080px] h-full flex items-center justify-between px-6">

        {/* Logo */}
        <div className="flex-1 flex justify-start">
          <Link href="/" className="text-xl font-black tracking-tighter text-foreground">
            Miunerofrade
          </Link>
        </div>

        {/* Nav links — relative 放这里作为 mega menu 定位基准 */}
        <div className="flex-1 flex justify-center gap-12 text-base font-bold tracking-widest uppercase relative">
          {NAV_LINKS.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            const isArticle = link.href === "/article";

            return (
              <div
                key={link.href}
                className={isArticle ? "relative" : ""}
                onMouseEnter={isArticle ? handleArticleEnter : undefined}
                onMouseLeave={isArticle ? handleArticleLeave : undefined}
              >
                <Link
                  href={link.href}
                  className={`relative py-1 transition-colors duration-300 block ${
                    isActive
                      ? "text-terracotta"
                      : "text-foreground/80 hover:text-terracotta"
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="nav-active-indicator"
                      className="absolute -bottom-1 left-0 right-0 h-[2px] bg-terracotta rounded-full"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>

                {/* Mega menu */}
                <AnimatePresence>
                  {isArticle && megaOpen && recentPosts.length > 0 && (
                    <div className="absolute top-[calc(100%+1rem)] left-1/2"
                      style={{ transform: 'translateX(calc(-50% + 0.75rem))' }}>
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.18, ease: "easeOut" }}
                        className="w-[31.25rem] bg-background/95 backdrop-blur-md border border-foreground/10
                          rounded-xl shadow-xl overflow-hidden"
                      >
                        {/* 箭头 */}
                        <div className="absolute -top-1.5 left-1/2 w-3 h-3
                          bg-background/95 border-l border-t border-foreground/10"
                          style={{ transform: 'translateX(calc(-50% - 0.75rem)) rotate(45deg)' }} />

                        <div className="p-6" style={{ padding: '1.5rem' }}>
                          <p className="text-xs font-bold tracking-widest uppercase text-foreground/30 mb-4">
                            最近文章
                          </p>
                          <div className="grid grid-cols-2 gap-3">
                            {recentPosts.map((post) => (
                              <Link
                                key={post.slug}
                                href={`/article/${post.slug}`}
                                className="group flex flex-col rounded-lg px-0 py-2.5 hover:bg-foreground/5 transition-colors duration-200"
                              >
                                <p className="text-sm font-semibold text-foreground group-hover:text-terracotta
                                  transition-colors duration-200 line-clamp-2 leading-snug">
                                  {post.title}
                                </p>
                                <p className="text-xs text-foreground/40 mt-1">{post.date}</p>
                              </Link>
                            ))}
                          </div>
                          <div className="mt-3 pt-3 border-t border-foreground/8">
                            <Link
                              href="/article"
                              className="text-xs font-bold tracking-widest uppercase text-terracotta/70
                                hover:text-terracotta transition-colors duration-200"
                            >
                              查看全部文章 →
                            </Link>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Theme toggle */}
        <div className="flex-1 flex justify-end">
          <ThemeToggle />
        </div>
      </div>
    </motion.nav>
  );
}
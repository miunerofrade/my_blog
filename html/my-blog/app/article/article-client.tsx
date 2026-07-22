"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import { PostData } from "@/lib/posts";
import PostListItem from "@/components/post-list-item";

interface Props {
  initialData: { year: string; posts: PostData[] }[];
}

export default function ArticleClient({ initialData = [] }: Props) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

  // 防止初次渲染时因为没有数据而崩溃
  if (!initialData || initialData.length === 0) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-foreground/40 font-bold uppercase tracking-widest">
        No articles found.
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center bg-transparent text-foreground"
      style={{ paddingBottom: '3rem' }}>
      <div className="article-page-shell">
        
        {/* 主体内容区 */}
        <div className="article-main-column">
          <header 
            style={{ marginTop: '6vh', marginBottom: '4vh' }} 
            className="flex flex-row items-end justify-between"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="font-playfair text-[clamp(2rem,4.5vw,4.5rem)] md:text-[clamp(2.5rem,3vw,5rem)] font-bold tracking-normal uppercase"
            >
              Articles<span className="text-terracotta">.</span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              className="flex items-center"
            >
              <button
                type="button"
                onClick={() => setViewMode((current) => current === 'list' ? 'grid' : 'list')}
                className="flex h-9 w-9 items-center justify-center text-foreground/40 transition-colors duration-200 hover:text-terracotta"
                aria-label={viewMode === 'list' ? '切换到卡片视图' : '切换到列表视图'}
                aria-pressed={viewMode === 'grid'}
                title={viewMode === 'list' ? '切换到卡片视图' : '切换到列表视图'}
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={viewMode}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.15 }}
                    className="flex"
                    aria-hidden="true"
                  >
                    {viewMode === 'list' ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="7" height="7" rx="1" />
                        <rect x="14" y="3" width="7" height="7" rx="1" />
                        <rect x="3" y="14" width="7" height="7" rx="1" />
                        <rect x="14" y="14" width="7" height="7" rx="1" />
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="8" y1="6" x2="21" y2="6" />
                        <line x1="8" y1="12" x2="21" y2="12" />
                        <line x1="8" y1="18" x2="21" y2="18" />
                        <line x1="3" y1="6" x2="3.01" y2="6" />
                        <line x1="3" y1="12" x2="3.01" y2="12" />
                        <line x1="3" y1="18" x2="3.01" y2="18" />
                      </svg>
                    )}
                  </motion.span>
                </AnimatePresence>
              </button>
            </motion.div>
          </header>

          <div className="flex flex-col gap-16">
            {initialData.map((group, groupIndex) => (
              <motion.section
                key={group.year}
                id={`year-${group.year}`}
                layout
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: groupIndex * 0.1 }}
                className="relative flex flex-col gap-8"
              >
                <div className="absolute -left-6 -top-12 md:-left-12 md:-top-16 text-[clamp(3.5rem,7vw,9rem)] font-black text-foreground/3 pointer-events-none select-none z-0">
                  {group.year}
                </div>

                <motion.h2 layout className="text-3xl font-black tracking-widest text-foreground/90 z-10 relative">
                  {group.year}
                </motion.h2>

                <AnimatePresence mode="wait">
                  <motion.div 
                    key={viewMode}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className={viewMode === 'grid' ? "article-card-grid z-10" : "flex flex-col z-10"}
                  >
                    {group.posts.map((post) =>
                      viewMode === 'grid' ? (
                        <Link
                          key={post.slug}
                          href={`/article/${post.slug}`}
                          className="article-grid-card group"
                        >
                          <span className="article-grid-card-copy">
                              <h3 className="article-grid-card-title">
                                {post.title}
                              </h3>
                              <span className="article-grid-card-description">
                                {post.excerpt}
                              </span>
                          </span>

                          <span className="article-grid-card-metadata">
                            <time dateTime={post.date}>{post.date}</time>
                            <span className="article-grid-card-dot" aria-hidden="true" />
                            <span>{post.readTime}</span>
                          </span>
                        </Link>
                      ) : (
                        <PostListItem key={post.slug} post={post} />
                      )
                    )}
                  </motion.div>
                </AnimatePresence>
              </motion.section>
            ))}
          </div>
        </div>

        {/* 右侧：时间轴侧边栏 */}
        <motion.aside
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          style={{
            marginTop: '6vh',
            fontFamily: 'var(--font-playfair), "Playfair Display", var(--font-noto-serif-sc), "Noto Serif SC", serif',
          }}
          className="article-sidebar-align article-timeline hidden md:flex flex-col sticky top-[15vh] gap-6"
        >
          <span className="text-xs font-black tracking-widest text-foreground/30 uppercase">
            Timeline
          </span>
          <nav className="flex flex-col gap-5">
            {initialData.map((group) => (
              <a
                key={group.year}
                href={`#year-${group.year}`}
                className="text-sm font-bold tracking-widest text-foreground/40 hover:text-terracotta transition-colors"
              >
                {group.year}
              </a>
            ))}
          </nav>
        </motion.aside>
      </div>
    </main>
  );
}

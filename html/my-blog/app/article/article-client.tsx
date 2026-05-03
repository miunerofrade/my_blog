"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import { PostData } from "@/lib/posts";

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
      <div className="w-full max-w-[1080px] px-8 flex flex-col md:flex-row items-start gap-12 md:gap-20">
        
        {/* 左侧：时间轴侧边栏 */}
        <motion.aside 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          style={{ marginTop: '6vh' }}
          className="hidden md:flex flex-col sticky top-[15vh] w-28 shrink-0 gap-6"
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

        {/* 右侧：主体内容区 */}
        <div className="flex-1 flex flex-col w-full max-w-[840px]">
          <header 
            style={{ marginTop: '6vh', marginBottom: '4vh' }} 
            className="flex flex-row items-end justify-between"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="text-[clamp(2rem,4.5vw,4.5rem)] md:text-[clamp(2.5rem,3vw,5rem)] font-black tracking-tighter uppercase"
            >
              Articles<span className="text-terracotta">.</span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              className="flex items-center gap-2"
            >
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 transition-colors duration-300 ${viewMode === 'list' ? 'text-terracotta' : 'text-foreground/30 hover:text-foreground/70'}`}
                aria-label="List view"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="8" y1="6" x2="21" y2="6"></line>
                  <line x1="8" y1="12" x2="21" y2="12"></line>
                  <line x1="8" y1="18" x2="21" y2="18"></line>
                  <line x1="3" y1="6" x2="3.01" y2="6"></line>
                  <line x1="3" y1="12" x2="3.01" y2="12"></line>
                  <line x1="3" y1="18" x2="3.01" y2="18"></line>
                </svg>
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 transition-colors duration-300 ${viewMode === 'grid' ? 'text-terracotta' : 'text-foreground/30 hover:text-foreground/70'}`}
                aria-label="Grid view"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="12" y1="3" x2="12" y2="21"></line>
                </svg>
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
                    className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 gap-6 z-10" : "flex flex-col gap-8 z-10"}
                  >
                    {group.posts.map((post) =>
                      viewMode === 'grid' ? (
                        <Link key={post.slug} href={`/article/${post.slug}`}>
                          <div
                            style={{ padding: '40px' }}
                            className="
                              group relative overflow-hidden cursor-pointer
                              flex flex-col justify-between h-full
                              rounded-3xl border border-foreground/5
                              bg-foreground/2 backdrop-blur-md
                              hover:bg-foreground/4 hover:border-terracotta/30
                              hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)]
                              transition-all duration-500 ease-out hover:-translate-y-1.5
                            "
                          >
                            <div className="absolute inset-0 bg-gradient-to-br from-terracotta/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="absolute -top-12 -right-12 w-48 h-48 bg-terracotta/10 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                            <div className="relative flex flex-col gap-4">
                              <div className="flex items-center gap-3 text-xs font-bold tracking-widest text-foreground/40 uppercase">
                                <span>{post.date}</span>
                                <span className="w-1.5 h-1.5 rounded-full bg-terracotta/40"></span>
                                <span>{post.readTime}</span>
                              </div>

                              <h3 className="relative font-black leading-tight tracking-tight group-hover:text-terracotta transition-colors duration-300 text-2xl">
                                {post.title}
                              </h3>
                            </div>

                            <div className="relative flex items-end justify-between gap-8 mt-10">
                              <p className="text-foreground/60 leading-[1.8] font-medium text-sm line-clamp-2 max-w-[85%]">
                                {post.excerpt}
                              </p>

                              <span className="text-terracotta opacity-0 -translate-x-6 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 ease-out font-black text-3xl shrink-0">
                                →
                              </span>
                            </div>
                          </div>
                        </Link>
                      ) : (
                        <Link key={post.slug} href={`/article/${post.slug}`}>
                          <div className="group relative flex items-start justify-between py-6 transition-colors duration-300">
                            <span className="w-28 md:w-36 shrink-0 text-sm font-bold tracking-widest text-foreground/40 uppercase mt-1">
                              {post.date}
                            </span>
                            <div className="flex-1 min-w-0 pr-4 md:pr-8 flex flex-col gap-1.5">
                              <h3 className="text-base md:text-lg font-bold truncate text-foreground group-hover:text-terracotta transition-colors duration-300">
                                {post.title}
                              </h3>
                              <p className="text-sm text-foreground/50 line-clamp-1 md:line-clamp-2 leading-relaxed">
                                {post.excerpt}
                              </p>
                            </div>
                            <div className="flex items-center gap-3 shrink-0 text-sm font-medium text-foreground/40 mt-1">
                              <span className="transition-transform duration-300 group-hover:-translate-x-1">{post.readTime}</span>
                              <span className="text-terracotta opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-out font-black text-lg">
                                →
                              </span>
                            </div>
                          {/* --- 动态斜向滑入的底部激活线 --- */}
                          <svg
                            className="absolute bottom-0 left-0 w-full h-[2px] -z-10"
                            viewBox="0 0 100 2"
                            preserveAspectRatio="none"
                          >
                            {/* 背景底线 (静态灰色) */}
                            <rect x="0" y="1" width="100" height="1" className="fill-foreground/10" />
                            {/* 激活线 (Terracotta, 初始隐藏在下方) */}
                            <rect
                              x="0"
                              y="1"
                              width="100"
                              height="1"
                              className="fill-terracotta transition-all duration-500 ease-out translate-y-[2px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100"
                            />
                          </svg>
                          </div>
                        </Link>
                      )
                    )}
                  </motion.div>
                </AnimatePresence>
              </motion.section>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
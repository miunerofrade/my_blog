"use client";
import "./article-card-visual.css";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Grid2X2, List } from "lucide-react";
import IconButton from "@/components/icon-button";
import { useSyncExternalStore } from "react";
import Link from "next/link";
import { PostData } from "@/lib/posts";
import PostListItem from "@/components/post-list-item";
import JustifiedPostGrid from "@/components/justified-post-grid";
import PostCardVisual, {
  getPostCardStyle,
} from "@/components/post-card-visual";

interface Props {
  initialData: { year: string; posts: PostData[] }[];
}

type ViewMode = "grid" | "list";

const viewModeStorageKey = "article-view-mode";
const viewModeChangeEvent = "article-view-mode-change";

function getSavedViewMode(): ViewMode {
  const savedViewMode = window.localStorage.getItem(viewModeStorageKey);
  return savedViewMode === "grid" ? "grid" : "list";
}

function subscribeToViewMode(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(viewModeChangeEvent, onStoreChange);

  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(viewModeChangeEvent, onStoreChange);
  };
}

function ArticleGridCard({
  post,
  eager,
  visualHeight,
}: {
  post: PostData;
  eager: boolean;
  visualHeight: number;
}) {
  return (
    <Link
      href={`/article/${post.slug}`}
      className="article-grid-card group"
      style={getPostCardStyle(post)}
    >
      <PostCardVisual
        post={post}
        eager={eager}
        visualHeight={visualHeight}
        className="article-grid-card-visual"
      />

      <span className="article-grid-card-content">
        <span className="article-grid-card-copy">
          <h3 className="article-grid-card-title">{post.title}</h3>
          <span className="article-grid-card-description">{post.excerpt}</span>
        </span>

        <span className="article-grid-card-footer">
          <span className="article-grid-card-metadata">
            <time dateTime={post.date}>{post.date}</time>
            {post.readTime ? (
              <>
                <span className="article-grid-card-dot" aria-hidden="true" />
                <span>{post.readTime}</span>
              </>
            ) : null}
          </span>
          <ArrowUpRight
            className="article-grid-card-arrow"
            aria-hidden="true"
            size={22}
            strokeWidth={2}
          />
        </span>
      </span>
    </Link>
  );
}

export default function ArticleClient({ initialData = [] }: Props) {
  const postCount = initialData.reduce(
    (total, group) => total + group.posts.length,
    0,
  );
  const viewMode = useSyncExternalStore(
    subscribeToViewMode,
    getSavedViewMode,
    () => "list",
  );

  const toggleViewMode = () => {
    const next = viewMode === "list" ? "grid" : "list";
    window.localStorage.setItem(viewModeStorageKey, next);
    window.dispatchEvent(new Event(viewModeChangeEvent));
  };

  // 防止初次渲染时因为没有数据而崩溃
  if (!initialData || initialData.length === 0) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center font-bold uppercase tracking-widest text-muted">
        No articles found.
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center bg-transparent text-foreground"
      style={{ paddingBottom: '3rem' }}>
      <div className={`article-page-shell ${postCount === 1 ? "article-index-shell-single" : ""}`}>
        
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
              className="font-playfair text-5xl font-bold uppercase leading-[60px] tracking-normal md:text-[80px] md:leading-[96px]"
            >
              Articles<span className="text-accent">.</span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              className="flex items-center"
            >
              <IconButton
                onClick={toggleViewMode}
                label={viewMode === 'list' ? '切换到卡片视图' : '切换到列表视图'}
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
                      <Grid2X2 aria-hidden="true" size={24} strokeWidth={2} />
                    ) : (
                      <List aria-hidden="true" size={24} strokeWidth={2} />
                    )}
                  </motion.span>
                </AnimatePresence>
              </IconButton>
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
                <div className="pointer-events-none absolute -left-6 -top-12 z-0 select-none text-[56px] font-black leading-[60px] text-foreground/3 md:-left-12 md:-top-16 md:text-[96px] md:leading-[116px]">
                  {group.year}
                </div>

                <motion.h2 layout className="relative z-10 text-[32px] font-black leading-[40px] tracking-widest text-foreground">
                  {group.year}
                </motion.h2>

                <AnimatePresence mode="wait">
                  <motion.div 
                    key={viewMode}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="z-10"
                  >
                    {viewMode === "grid" ? (
                      <JustifiedPostGrid
                        posts={group.posts}
                        className="article-card-layout"
                        renderItem={(post, layout, postIndex) => (
                          <ArticleGridCard
                            post={post}
                            eager={groupIndex === 0 && postIndex === 0}
                            visualHeight={layout.visualHeight}
                          />
                        )}
                      />
                    ) : (
                      <div className="flex flex-col">
                        {group.posts.map((post) => (
                          <PostListItem key={post.slug} post={post} />
                        ))}
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </motion.section>
            ))}
          </div>
        </div>

        {/* 右侧：时间轴侧边栏 */}
        {initialData.length > 1 ? <motion.aside
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          style={{
            marginTop: '6vh',
            fontFamily: 'var(--font-playfair), "Playfair Display", var(--font-noto-serif-sc), "Noto Serif SC", serif',
          }}
          className="article-sidebar-align article-timeline hidden md:flex flex-col sticky top-[15vh] gap-6"
        >
          <span className="text-xs font-black uppercase leading-[18px] tracking-widest text-muted">
            Timeline
          </span>
          <nav className="flex flex-col gap-5">
            {initialData.map((group) => (
              <a
                key={group.year}
                href={`#year-${group.year}`}
                className="inline-flex min-h-11 items-center rounded-lg text-sm font-bold leading-[22px] tracking-widest text-muted transition-colors hover:bg-surface-hover hover:text-accent"
              >
                {group.year}
              </a>
            ))}
          </nav>
        </motion.aside> : null}
      </div>
    </main>
  );
}

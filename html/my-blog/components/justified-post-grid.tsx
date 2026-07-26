"use client";
import "./justified-post-grid.css";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { PostData } from "@/lib/posts";
import {
  createJustifiedPostRows,
  POST_GRID_GAP,
  POST_GRID_TARGET_HEIGHT,
  type JustifiedPostItem,
} from "@/lib/justified-post-layout";

export default function JustifiedPostGrid({
  posts,
  className = "",
  renderItem,
}: {
  posts: PostData[];
  className?: string;
  renderItem: (
    post: PostData,
    layout: JustifiedPostItem,
    index: number,
  ) => ReactNode;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const observer = new ResizeObserver(([entry]) => {
      setContainerWidth(entry.contentRect.width);
    });
    observer.observe(container);

    return () => observer.disconnect();
  }, []);

  const rows = useMemo(
    () =>
      containerWidth > 0
        ? createJustifiedPostRows(posts, containerWidth)
        : posts.map((_, index) => ({
            top: index,
            items: [
              {
                index,
                width: 0,
                visualHeight: POST_GRID_TARGET_HEIGHT,
                aspectRatio: 1,
              },
            ],
          })),
    [containerWidth, posts],
  );

  return (
    <div
      ref={containerRef}
      className={`justified-post-grid ${className}`.trim()}
      style={{ rowGap: POST_GRID_GAP }}
    >
      {rows.map((row, rowIndex) => (
        <div
          key={`${row.top}-${rowIndex}`}
          className="justified-post-row"
          style={{ columnGap: POST_GRID_GAP }}
          data-justified-row
        >
          {row.items.map((item) => {
            const post = posts[item.index];
            return (
              <div
                key={post.slug}
                className="justified-post-item"
                style={
                  containerWidth > 0
                    ? { flexBasis: item.width, width: item.width }
                    : undefined
                }
                data-justified-index={item.index}
              >
                {renderItem(post, item, item.index)}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

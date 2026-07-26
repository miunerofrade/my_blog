"use client";

import "./post-card-visual.css";
import Image from "next/image";
import {
  useState,
  type CSSProperties,
} from "react";
import type { PostData } from "@/lib/posts";
import { getContrastingForeground } from "@/lib/theme";
import {
  getPostLayoutAspectRatio,
  POST_GRID_MAX_HEIGHT,
} from "@/lib/justified-post-layout";

export type PostCardStyle = CSSProperties & {
  "--post-card-accent": string;
  "--post-card-accent-foreground": string;
  "--post-card-visual": string;
  "--post-card-visual-foreground": string;
};

export function getPostCardStyle(post: PostData): PostCardStyle {
  const visualColor = post.color ?? post.theme;

  return {
    "--post-card-accent": post.theme ?? "var(--accent-color)",
    "--post-card-accent-foreground": post.theme
      ? getContrastingForeground(post.theme)
      : "var(--accent-foreground-color)",
    "--post-card-visual": visualColor ?? "var(--accent-color)",
    "--post-card-visual-foreground": visualColor
      ? getContrastingForeground(visualColor)
      : "var(--accent-foreground-color)",
  };
}

export default function PostCardVisual({
  post,
  eager = false,
  visualHeight,
  className = "",
}: {
  post: PostData;
  eager?: boolean;
  visualHeight?: number;
  className?: string;
}) {
  const [coverFailed, setCoverFailed] = useState(false);
  const showCover = Boolean(post.cover) && !coverFailed;
  const aspectRatio = getPostLayoutAspectRatio(
    showCover ? post : { coverAspectRatio: undefined },
  );
  const style: CSSProperties = visualHeight
    ? { height: Math.min(visualHeight, POST_GRID_MAX_HEIGHT) }
    : { aspectRatio };

  return (
    <span
      className={`post-card-visual ${showCover ? "post-card-visual--cover" : ""} ${className}`.trim()}
      style={style}
    >
      {showCover && post.cover ? (
        <Image
          src={post.cover}
          alt=""
          fill
          sizes="(max-width: 960px) 100vw, (max-width: 1100px) 50vw, 640px"
          className="post-card-cover"
          loading={eager ? "eager" : "lazy"}
          onError={() => setCoverFailed(true)}
        />
      ) : null}
      <span className="post-card-kicker">
        {post.tags?.[0] ?? "Article"}
      </span>
      <span className="post-card-date-mark">
        <span>{post.date.slice(5).replace("-", ".")}</span>
        <span>{post.year}</span>
      </span>
    </span>
  );
}

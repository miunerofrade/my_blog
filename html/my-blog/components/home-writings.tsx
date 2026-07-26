"use client";

import "./home-writings.css";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CupertinoButton } from "@/components/cupertino";
import PostCardVisual, {
  getPostCardStyle,
} from "@/components/post-card-visual";
import type { PostData } from "@/lib/posts";
import type { PointerEvent } from "react";

function updateHighlightOrigin(event: PointerEvent<HTMLElement>) {
  const bounds = event.currentTarget.getBoundingClientRect();
  const position = ((event.clientX - bounds.left) / bounds.width) * 100;
  event.currentTarget.style.setProperty("--hover-origin", `${position}%`);
}

function FeaturedPost({ post }: { post: PostData }) {
  return (
    <Link
      href={`/article/${post.slug}`}
      className="home-featured-post group"
      style={getPostCardStyle(post)}
    >
      <PostCardVisual post={post} eager className="home-featured-visual" />
      <span className="home-featured-copy">
        <span className="home-featured-heading">
          <h3>{post.title}</h3>
          <ArrowRight aria-hidden="true" size={24} strokeWidth={2} />
        </span>
        <span className="home-featured-excerpt">{post.excerpt}</span>
        <span className="home-featured-meta">
          <time dateTime={post.date}>{post.date}</time>
          {post.readTime ? <span>{post.readTime}</span> : null}
        </span>
      </span>
    </Link>
  );
}

function CompactPost({ post }: { post: PostData }) {
  return (
    <Link
      href={`/article/${post.slug}`}
      className="home-compact-post group"
      onPointerEnter={updateHighlightOrigin}
      onPointerMove={updateHighlightOrigin}
    >
      <span className="home-compact-date">
        <time dateTime={post.date}>{post.date}</time>
        {post.readTime ? <span>{post.readTime}</span> : null}
      </span>
      <span className="home-compact-heading">
        <h3>{post.title}</h3>
        <ArrowRight aria-hidden="true" size={22} strokeWidth={2} />
      </span>
      <span className="home-compact-excerpt">{post.excerpt}</span>
      <span className="home-compact-divider" aria-hidden="true" />
    </Link>
  );
}

export default function HomeWritings({ posts }: { posts: PostData[] }) {
  if (posts.length === 0) {
    return null;
  }

  const [featuredPost, ...compactPosts] = posts.slice(0, 4);

  return (
    <div
      className={`home-writings-layout ${
        compactPosts.length === 0 ? "home-writings-layout--single" : ""
      }`.trim()}
    >
      <FeaturedPost post={featuredPost} />

      {compactPosts.length > 0 ? (
        <div className="home-writings-compact">
          <div className="home-writings-items">
            {compactPosts.map((post) => (
              <CompactPost key={post.slug} post={post} />
            ))}
          </div>
        </div>
      ) : null}

      <div className="home-writings-view-all cupertino-view-all-row">
        <CupertinoButton href="/article" className="cupertino-button-link">
          View all writings
          <ArrowRight aria-hidden="true" size={24} strokeWidth={2} />
        </CupertinoButton>
      </div>
    </div>
  );
}

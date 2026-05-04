import Link from "next/link";
import type { PostData } from "@/lib/posts";

export default function PostListItem({ post }: { post: PostData }) {
  return (
    <Link href={`/article/${post.slug}`} className="">
      <div
        className="group relative flex items-start justify-between transition-colors duration-300"
        style={{ paddingTop: '0.5rem', paddingBottom: '1rem' }}
      >
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
          <span className="text-terracotta opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-out font-black text-lg" aria-hidden="true">
            →
          </span>
        </div>
        <svg
          className="absolute bottom-0 left-0 w-full h-[2px] -z-10"
          viewBox="0 0 100 2"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <rect x="0" y="1" width="100" height="1" className="fill-foreground/10" />
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
  );
}

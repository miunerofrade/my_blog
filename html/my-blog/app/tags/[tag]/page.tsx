import { getAllTags, getPostsByTag } from "@/lib/posts";
import Link from "next/link";
import { notFound } from "next/navigation";
import PostListItem from "@/components/post-list-item";
import { ArrowLeft } from "lucide-react";

export async function generateStaticParams() {
  const tags = getAllTags();
  return tags.map(({ tag }) => ({ tag }));
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;
  const posts = getPostsByTag(tag);

  if (posts.length === 0) {
    notFound();
  }

  return (
    <main className="flex min-h-screen flex-col items-center bg-transparent text-foreground"
      style={{ paddingBottom: '3rem' }}>
      <div className="secondary-page-shell w-full max-w-[840px] flex flex-col">
        <header style={{ marginTop: '6vh', marginBottom: '4vh' }}>
          <Link
            href="/article"
            className="mb-4 inline-flex min-h-11 items-center gap-2 rounded-lg px-2 text-xs font-bold uppercase leading-[18px] tracking-widest text-muted transition-colors hover:bg-surface-hover hover:text-accent"
          >
            <ArrowLeft aria-hidden="true" className="inline-block" size={24} strokeWidth={2} /> 所有文章
          </Link>
          <h1 className="font-playfair text-5xl font-bold uppercase leading-[60px] tracking-normal md:text-[80px] md:leading-[96px]">
            <span className="text-accent">#</span>{tag}
          </h1>
          <p className="mt-2 text-sm leading-[22px] text-muted">
            共 {posts.length} 篇文章
          </p>
        </header>

        <div className="flex flex-col">
          {posts.map((post) => (
            <PostListItem key={post.slug} post={post} />
          ))}
        </div>
      </div>
    </main>
  );
}

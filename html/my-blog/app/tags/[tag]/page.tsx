import { getAllTags, getPostsByTag } from "@/lib/posts";
import Link from "next/link";
import { notFound } from "next/navigation";
import PostListItem from "@/components/post-list-item";

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
      <div className="w-full max-w-[840px] px-8 flex flex-col">
        <header style={{ marginTop: '6vh', marginBottom: '4vh' }}>
          <Link
            href="/article"
            className="inline-block text-xs font-bold tracking-widest uppercase text-foreground/40 hover:text-terracotta transition-colors duration-200 mb-4"
          >
            ← 所有文章
          </Link>
          <h1 className="text-[clamp(2rem,4.5vw,4.5rem)] font-black tracking-tighter uppercase">
            <span className="text-terracotta">#</span>{tag}
          </h1>
          <p className="mt-2 text-sm text-foreground/50">
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

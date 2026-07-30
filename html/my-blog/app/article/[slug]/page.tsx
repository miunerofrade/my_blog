import {
  getPostData,
  getAllPostSlugs,
  getGroupedPosts,
} from "@/lib/posts";
import type { Metadata } from "next";
import Link from "next/link";
import "katex/dist/katex.min.css";
import { BackButton } from "@/components/back-button";
import ArticleLayout from "@/components/article-layout";
import ReadingProgress from "@/components/reading-progress";
import MarkdownRenderer from "@/components/markdown-renderer";
import ArticleTheme from "@/components/article-theme";
import { ArrowLeft, ArrowRight } from "lucide-react";

export async function generateStaticParams() {
  const posts = getAllPostSlugs();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params;
  const postData = getPostData(slug);

  return {
    title: `${postData.title} | Miunerofrade`,
    description: postData.excerpt,
    keywords: postData.tags?.join(', '),
  };
}

export default async function PostPage({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params;
  const postData = getPostData(slug);
  const decodedSlug = postData.slug;

  const groups = getGroupedPosts();
  const sortedPosts = groups.flatMap((g) => g.posts);
  const currentIndex = sortedPosts.findIndex((p) => p.slug === decodedSlug);
  const prevPost = currentIndex > 0 ? sortedPosts[currentIndex - 1] : null;
  const nextPost = currentIndex < sortedPosts.length - 1 ? sortedPosts[currentIndex + 1] : null;
  const otherPosts = sortedPosts
    .filter((p) => p.slug !== decodedSlug)
    .slice(0, 5);

  return (
    <ArticleTheme theme={postData.theme}>
      <main className="flex min-h-screen flex-col items-center bg-transparent text-foreground transition-colors duration-300"
      style={{ paddingTop: '2rem', paddingBottom: '5rem' }}>
      <ArticleLayout headings={postData.headings || []}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          <div>
            <BackButton />
          </div>

          <header className="flex flex-col border-b border-foreground/10"
            style={{ gap: '1.25rem', paddingBottom: '1.5rem' }}>
            <div className="flex items-center gap-2 text-sm font-bold uppercase leading-[22px] tracking-widest text-muted">
              <span>{postData.date}</span>
              <span className="h-2 w-2 rounded-full bg-accent"></span>
              <span>{postData.readTime}</span>
            </div>
            <h1 className="text-[32px] font-bold leading-[40px] tracking-normal md:text-5xl md:leading-[60px]">
              {postData.title}
            </h1>
            {postData.tags && postData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {postData.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/tags/${tag}`}
                    className="inline-flex h-8 items-center rounded-full border border-border text-xs leading-[18px] text-muted transition-colors duration-200 hover:border-accent hover:text-accent"
                    style={{ paddingInline: "0.75rem" }}
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            )}
          </header>

          <ReadingProgress>
            <div className="article-content prose prose-lg dark:prose-invert prose-neutral max-w-none
            prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-foreground dark:prose-headings:text-foreground
            prose-a:text-accent dark:prose-a:text-accent
            prose-p:leading-8 prose-p:text-foreground dark:prose-p:text-foreground
            prose-li:text-foreground dark:prose-li:text-foreground
            prose-strong:text-foreground dark:prose-strong:text-foreground
            prose-table:text-[1.05rem] prose-table:mb-10
            prose-th:text-foreground dark:prose-th:text-foreground
            prose-td:text-foreground dark:prose-td:text-foreground
            prose-pre:p-0 prose-pre:bg-transparent prose-pre:m-0
            prose-code:before:content-none prose-code:after:content-none
            prose-code:text-foreground dark:prose-code:text-foreground"
          >
            <MarkdownRenderer source={postData.content} />
          </div>
          </ReadingProgress>

          <div className="flex flex-col" style={{ marginTop: '2.5rem', gap: '2rem' }}>

          <div>
            <hr className="border-t border-foreground/10" />
            <nav className="grid grid-cols-2" style={{ gap: '1rem', marginTop: '1.5rem' }}>
              {prevPost ? (
                <Link href={`/article/${prevPost.slug}`}
                  className="group flex min-h-11 flex-col gap-2 py-2 transition-colors duration-300">
                  <div className="flex items-center text-xs font-bold uppercase leading-[18px] tracking-widest text-muted"
                    style={{ gap: '0.5rem' }}>
                    <ArrowLeft className="transition-transform duration-300 group-hover:-translate-x-1" aria-hidden="true" size={24} strokeWidth={2} />
                    <span>上一篇</span>
                  </div>
                  <span className="text-sm font-semibold text-foreground group-hover:text-accent
                    transition-colors duration-200 line-clamp-2">
                    {prevPost.title}
                  </span>
                </Link>
              ) : <div />}

              {nextPost ? (
                <Link href={`/article/${nextPost.slug}`}
                  className="group flex min-h-11 flex-col gap-2 py-2 text-right transition-colors duration-300">
                  <div className="flex items-center justify-end text-xs font-bold uppercase leading-[18px] tracking-widest text-muted"
                    style={{ gap: '0.5rem' }}>
                    <span>下一篇</span>
                    <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" size={24} strokeWidth={2} />
                  </div>
                  <span className="text-sm font-semibold text-foreground group-hover:text-accent
                    transition-colors duration-200 line-clamp-2">
                    {nextPost.title}
                  </span>
                </Link>
              ) : <div />}
            </nav>
          </div>

          {otherPosts.length > 0 && (
            <div style={{ marginTop: '1.5rem' }}>
              <p className="text-xl font-black uppercase leading-[30px] tracking-widest text-muted md:text-2xl"
                style={{ marginBottom: '1.5rem' }}>
                更多文章
              </p>
              <div className="flex flex-col" style={{ gap: '0' }}>
                {otherPosts.map((post) => (
                  <Link key={post.slug} href={`/article/${post.slug}`}
                    className="group flex min-h-11 items-center justify-between border-b border-border py-2 transition-colors duration-200 hover:bg-surface-hover">
                    <span className="text-base font-medium text-foreground group-hover:text-accent
                      transition-colors duration-200">
                      {post.title}
                    </span>
                    <span className="ml-4 shrink-0 text-xs leading-[18px] text-muted">{post.date}</span>
                  </Link>
                ))}
              </div>
              <Link href="/article"
                className="inline-flex min-h-11 items-center gap-2 rounded-lg text-sm font-bold uppercase leading-[22px] tracking-widest text-accent transition-colors duration-200 hover:bg-surface-hover"
                style={{ marginTop: '1rem' }}>
                查看全部 <ArrowRight aria-hidden="true" className="inline-block" size={24} strokeWidth={2} />
              </Link>
            </div>
          )}

          </div>

        </div>
      </ArticleLayout>
      </main>
    </ArticleTheme>
  );
}

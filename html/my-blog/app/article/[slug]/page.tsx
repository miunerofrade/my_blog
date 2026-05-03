import { getPostData, getAllPostSlugs, getGroupedPosts } from "@/lib/posts";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import rehypePrettyCode from "rehype-pretty-code";
import { visit } from "unist-util-visit";
import "katex/dist/katex.min.css";
import { Mermaid } from "@/components/mermaid";
import { CodeBlock } from "@/components/code-block";
import { BackButton } from "@/components/back-button";
import { Spacer } from "@/components/spacer";
import { remarkImgAttrs } from "@/lib/remark-img-attrs";
import ArticleLayout from "@/components/article-layout";

export async function generateStaticParams() {
  const posts = getAllPostSlugs();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

const preProcessMermaid = () => (tree: Record<string, unknown>) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  visit(tree, 'element', (node: any) => {
    if (node.tagName === 'pre') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const codeNode = node.children?.find((c: any) => c.tagName === 'code');
      if (codeNode && codeNode.properties?.className?.includes('language-mermaid')) {
        node.tagName = 'div';
        node.properties.className = ['mermaid-container'];
        const textNode = codeNode.children?.[0];
        if (textNode && textNode.type === 'text') {
          node.properties['data-chart'] = textNode.value;
        }
        node.children = [];
      }
    }
  });
};

const rehypeAddIds = () => (tree: Record<string, unknown>) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  visit(tree, 'element', (node: any) => {
    if (node.tagName === 'h2' || node.tagName === 'h3') {
      const textNode = node.children?.[0];
      const text = textNode?.value || textNode?.children?.[0]?.value || '';
      const id = text
        .toLowerCase()
        .replace(/[^\w一-鿿]+/g, '-')
        .replace(/^-+|-+$/g, '');
      node.properties = { ...node.properties, id };
    }
  });
};

export default async function PostPage({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params;
  const postData = getPostData(slug);

  const groups = getGroupedPosts();
  const sortedPosts = groups.flatMap((g) => g.posts);
  const currentIndex = sortedPosts.findIndex((p) => p.slug === slug);
  const prevPost = currentIndex > 0 ? sortedPosts[currentIndex - 1] : null;
  const nextPost = currentIndex < sortedPosts.length - 1 ? sortedPosts[currentIndex + 1] : null;
  const otherPosts = sortedPosts.filter((p) => p.slug !== slug).slice(0, 5);

  const components = {
    h1: (props: any) => <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-tight text-foreground" style={{ marginTop: '2rem', marginBottom: '1rem' }} {...props} />,
    h2: (props: any) => <h2 className="text-2xl md:text-3xl font-bold tracking-tight leading-snug text-foreground" style={{ marginTop: '1.5rem', marginBottom: '0.75rem' }} {...props} />,
    h3: (props: any) => <h3 className="text-xl md:text-2xl font-bold tracking-tight leading-snug text-foreground" style={{ marginTop: '1.25rem', marginBottom: '0.5rem' }} {...props} />,
    pre: CodeBlock,
    img: (props: any) => {
      const { src, alt, title, ...rest } = props;

      let width: number | undefined;
      let height: number | undefined;
      let align: string | undefined;
      let displayTitle: string | undefined;

      if (title) {
        try {
          const p = JSON.parse(title);
          width        = p.w      ? Number(p.w)      : undefined;
          height       = p.h      ? Number(p.h)      : undefined;
          align        = p.align  ?? undefined;
          displayTitle = p.title  ?? undefined;
        } catch {
          displayTitle = title;
        }
      }

      const style: React.CSSProperties = {
        maxWidth: "100%",
        height: height ? `${height}px` : "auto",
        ...(align === "center" && { display: "block", margin: "0 auto" }),
        ...(align === "left"   && { float: "left",  marginRight: "1.5rem" }),
        ...(align === "right"  && { float: "right", marginLeft: "1.5rem" }),
      };

      return (
        <img
          src={src}
          alt={alt}
          title={displayTitle}
          width={width}
          height={height}
          style={style}
          {...rest}
        />
      );
    },
    Spacer,
    div: ({ className, "data-chart": chart, children, ...props }: any) => {
      if (className && className.includes("mermaid-container") && chart) {
        return <Mermaid chart={chart} />;
      }
      return <div className={className} {...props}>{children}</div>;
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center bg-transparent text-foreground transition-colors duration-300"
      style={{ paddingTop: '2rem', paddingBottom: '5rem' }}>
      <ArticleLayout headings={postData.headings || []}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          <div>
            <BackButton />
          </div>

          <header className="flex flex-col border-b border-foreground/10"
            style={{ gap: '1.25rem', paddingBottom: '1.5rem' }}>
            <div className="flex items-center gap-3 text-sm font-bold tracking-widest text-foreground/40 uppercase">
              <span>{postData.date}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-terracotta/40"></span>
              <span>{postData.readTime}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">
              {postData.title}
            </h1>
            {postData.tags && postData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {postData.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/tags/${tag}`}
                    className="text-xs border border-foreground/10 rounded-full text-foreground/60 hover:text-terracotta hover:border-terracotta/30 transition-colors duration-200"
                    style={{ padding: '0.25rem 0.875rem' }}
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            )}
          </header>

          <div className="prose prose-lg dark:prose-invert prose-neutral max-w-none [&>*:first-child]:!mt-0
            prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-foreground dark:prose-headings:text-foreground
            prose-a:text-terracotta dark:prose-a:text-terracotta
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
            <MDXRemote
              source={postData.content}
              components={components}
              options={{
                mdxOptions: {
                  remarkPlugins: [remarkMath, remarkGfm, remarkImgAttrs],
                  rehypePlugins: [
                    preProcessMermaid,
                    rehypeAddIds,
                    rehypeKatex,
                    [rehypePrettyCode, {
                      theme: { light: "github-light", dark: "github-dark" },
                      keepBackground: true
                    }]
                  ],
                }
              }}
            />
          </div>

          <div className="flex flex-col" style={{ marginTop: '2.5rem', gap: '2rem' }}>

          <div>
            <hr className="border-t border-foreground/10" />
            <nav className="grid grid-cols-2" style={{ gap: '1rem', marginTop: '1.5rem' }}>
              {prevPost ? (
                <Link href={`/article/${prevPost.slug}`}
                  className="group flex flex-col transition-colors duration-300"
                  style={{ gap: '0.5rem', paddingTop: '0.75rem', paddingBottom: '0.75rem' }}>
                  <div className="flex items-center text-xs font-bold tracking-widest uppercase text-foreground/30"
                    style={{ gap: '0.375rem' }}>
                    <span className="inline-block transition-transform duration-300 group-hover:-translate-x-1">←</span>
                    <span>上一篇</span>
                  </div>
                  <span className="text-sm font-semibold text-foreground group-hover:text-terracotta
                    transition-colors duration-200 line-clamp-2">
                    {prevPost.title}
                  </span>
                </Link>
              ) : <div />}

              {nextPost ? (
                <Link href={`/article/${nextPost.slug}`}
                  className="group flex flex-col transition-colors duration-300 text-right"
                  style={{ gap: '0.5rem', paddingTop: '0.75rem', paddingBottom: '0.75rem' }}>
                  <div className="flex items-center justify-end text-xs font-bold tracking-widest uppercase text-foreground/30"
                    style={{ gap: '0.375rem' }}>
                    <span>下一篇</span>
                    <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </div>
                  <span className="text-sm font-semibold text-foreground group-hover:text-terracotta
                    transition-colors duration-200 line-clamp-2">
                    {nextPost.title}
                  </span>
                </Link>
              ) : <div />}
            </nav>
          </div>

          {otherPosts.length > 0 && (
            <div style={{ marginTop: '1.5rem' }}>
              <p className="text-xl md:text-2xl font-black tracking-widest uppercase text-foreground/60"
                style={{ marginBottom: '1.5rem' }}>
                更多文章
              </p>
              <div className="flex flex-col" style={{ gap: '0' }}>
                {otherPosts.map((post) => (
                  <Link key={post.slug} href={`/article/${post.slug}`}
                    className="group flex items-center justify-between border-b border-foreground/6
                      hover:border-foreground/20 transition-colors duration-200"
                    style={{ paddingTop: '0.5rem', paddingBottom: '0.5rem' }}>
                    <span className="text-base font-medium text-foreground/80 group-hover:text-foreground
                      transition-colors duration-200">
                      {post.title}
                    </span>
                    <span className="text-xs text-foreground/40 shrink-0" style={{ marginLeft: '1rem' }}>{post.date}</span>
                  </Link>
                ))}
              </div>
              <Link href="/article"
                className="inline-block text-sm font-bold tracking-widest uppercase
                  text-terracotta/70 hover:text-terracotta transition-colors duration-200"
                style={{ marginTop: '1rem' }}>
                查看全部 →
              </Link>
            </div>
          )}

          </div>

        </div>
      </ArticleLayout>
    </main>
  );
}
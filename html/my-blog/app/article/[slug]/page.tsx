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

// 1. 生成静态路径逻辑保持不变
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
        node.children = []; // clear children
      }
    }
  });
};

// 2. 页面组件：在 Next.js 15 中 params 是 Promise
export default async function PostPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  // CRITICAL: 必须 await params 才能拿到 slug
  const { slug } = await params;
  
  // 现在 slug 不再是 undefined 了
  const postData = getPostData(slug);

  // 获取排序后的文章列表，用于上下篇和结尾列表
  const groups = getGroupedPosts();
  const sortedPosts = groups.flatMap((g) => g.posts);
  const currentIndex = sortedPosts.findIndex((p) => p.slug === slug);
  const prevPost = currentIndex < sortedPosts.length - 1 ? sortedPosts[currentIndex + 1] : null;
  const nextPost = currentIndex > 0 ? sortedPosts[currentIndex - 1] : null;
  const otherPosts = sortedPosts.filter((p) => p.slug !== slug).slice(0, 5);

  const components = {
    // 拦截原生的 pre，换成我们带一键复制的特制代码块组件
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
          displayTitle = p.title  ?? undefined;  // 真实 tooltip 文字
        } catch {
          // title 不是 JSON（降级），直接显示原始 title
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
    <main className="flex min-h-screen flex-col items-center bg-background text-foreground py-20 transition-colors duration-300">
      <article className="w-full max-w-270 px-8 flex flex-col gap-10">
        
        <div>
          <BackButton />
        </div>

        <header className="flex flex-col gap-6 border-b border-foreground/10 pb-10">
          <div className="flex items-center gap-3 text-sm font-bold tracking-widest text-foreground/40 uppercase">
            <span>{postData.date}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-terracotta/40"></span>
            <span>{postData.readTime}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">
            {postData.title}
          </h1>
        </header>

        {/* 优化后的排版，类似 Deepseek：更干净的字体颜色，去除 prose 对代码的强制背景 */}
        <div className="prose prose-lg dark:prose-invert prose-neutral max-w-none 
          prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-foreground dark:prose-headings:text-foreground
          prose-h1:mt-10 prose-h1:mb-4
          prose-h2:mt-8 prose-h2:mb-3
          prose-h3:mt-6 prose-h3:mb-2
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

        {/* 底部导航区域，统一管理间距 */}
        <div className="mt-16 flex flex-col gap-12">

        {/* 上一篇 / 下一篇 */}
        <nav className="grid grid-cols-2 gap-4 border-t border-foreground/10 pt-14">
          {prevPost ? (
            <Link href={`/article/${prevPost.slug}`}
              className="group flex flex-col gap-1 p-4 rounded-xl border border-foreground/10
                hover:border-terracotta/40 hover:bg-foreground/3 transition-all duration-200">
              <span className="text-xs font-bold tracking-widest uppercase text-foreground/30">← 上一篇</span>
              <span className="text-sm font-semibold text-foreground group-hover:text-terracotta
                transition-colors duration-200 line-clamp-2">
                {prevPost.title}
              </span>
            </Link>
          ) : <div />}

          {nextPost ? (
            <Link href={`/article/${nextPost.slug}`}
              className="group flex flex-col gap-1 p-4 rounded-xl border border-foreground/10
                hover:border-terracotta/40 hover:bg-foreground/3 transition-all duration-200 text-right">
              <span className="text-xs font-bold tracking-widest uppercase text-foreground/30">下一篇 →</span>
              <span className="text-sm font-semibold text-foreground group-hover:text-terracotta
                transition-colors duration-200 line-clamp-2">
                {nextPost.title}
              </span>
            </Link>
          ) : <div />}
        </nav>

        {/* 更多文章 */}
        {otherPosts.length > 0 && (
          <div className="border-t border-foreground/10 pt-10 mt-2">
            <p className="text-xs font-bold tracking-widest uppercase text-foreground/30 mb-4">
              更多文章
            </p>
            <div className="flex flex-col gap-2">
              {otherPosts.map((post) => (
                <Link key={post.slug} href={`/article/${post.slug}`}
                  className="group flex items-center justify-between py-4 border-b border-foreground/6
                    hover:border-foreground/20 transition-colors duration-200">
                  <span className="text-sm font-medium text-foreground/80 group-hover:text-foreground
                    transition-colors duration-200">
                    {post.title}
                  </span>
                  <span className="text-xs text-foreground/30 shrink-0 ml-4">{post.date}</span>
                </Link>
              ))}
            </div>
            <Link href="/article"
              className="inline-block mt-4 text-xs font-bold tracking-widest uppercase
                text-terracotta/70 hover:text-terracotta transition-colors duration-200">
              查看全部 →
            </Link>
          </div>
        )}

        </div>

      </article>
    </main>
  );
}
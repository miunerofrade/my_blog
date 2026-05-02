import { getPostData, getAllPostSlugs } from "@/lib/posts";
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
import { remarkImageSize } from "@/lib/remark-img-size";

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

  const components = {
    // 拦截原生的 pre，换成我们带一键复制的特制代码块组件
    pre: CodeBlock,
    img: (props: any) => {
      // 简化 img 组件：只保留基本的响应式，去掉复杂的宽高解析逻辑
      const { src, alt, title, width, height, ...rest } = props;
      return (
        <img
          src={src}
          alt={alt}
          title={title}
          width={width}
          height={height}
          style={{
            display: "block",
            maxWidth: "100%",
            height: "auto",
          }}
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
          prose-a:text-blue-600 dark:prose-a:text-blue-400 
          prose-p:leading-8 prose-p:text-foreground dark:prose-p:text-foreground
          prose-li:text-foreground dark:prose-li:text-foreground
          prose-strong:text-foreground dark:prose-strong:text-foreground
          prose-table:text-[1.05rem] prose-table:mb-10
          prose-pre:p-0 prose-pre:bg-transparent prose-pre:m-0
          prose-code:before:content-none prose-code:after:content-none
          prose-code:text-foreground dark:prose-code:text-foreground"
        >
          <MDXRemote 
            source={postData.content} 
            components={components}
            options={{
              mdxOptions: {
                remarkPlugins: [remarkMath, remarkGfm, remarkImageSize],
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

      </article>
    </main>
  );
}
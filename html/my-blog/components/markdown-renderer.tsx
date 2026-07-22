import { MDXRemote } from "next-mdx-remote/rsc";
import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex";
import rehypePrettyCode from "rehype-pretty-code";
import { visit } from "unist-util-visit";
import type { Element, ElementContent, Root } from "hast";
import type { ComponentPropsWithoutRef, CSSProperties } from "react";
import { Mermaid } from "@/components/mermaid";
import { CodeBlock } from "@/components/code-block";
import { Spacer } from "@/components/spacer";
import ImageZoom from "@/components/image-zoom";
import { remarkImgAttrs } from "@/lib/remark-img-attrs";

const isElement = (node: ElementContent): node is Element => node.type === "element";

const getTextContent = (node: ElementContent): string => {
  if (node.type === "text") return node.value;
  if (node.type === "element") return node.children.map(getTextContent).join("");
  return "";
};

const preProcessMermaid = () => (tree: Root) => {
  visit(tree, "element", (node: Element) => {
    if (node.tagName !== "pre") return;
    const codeNode = node.children.find(
      (child): child is Element => isElement(child) && child.tagName === "code",
    );
    const classNames = codeNode?.properties.className;
    const isMermaid = Array.isArray(classNames)
      ? classNames.includes("language-mermaid")
      : classNames === "language-mermaid";

    if (!codeNode || !isMermaid) return;
    node.tagName = "div";
    node.properties.className = ["mermaid-container"];
    const textNode = codeNode.children[0];
    if (textNode?.type === "text") node.properties["data-chart"] = textNode.value;
    node.children = [];
  });
};

const copyDataLanguageToFigure = () => (tree: Root) => {
  visit(tree, "element", (node: Element) => {
    if (node.tagName !== "figure" || node.properties?.["data-rehype-pretty-code-figure"] === undefined) return;
    const pre = node.children.find(
      (child): child is Element => isElement(child) && child.tagName === "pre",
    );
    if (pre?.properties?.["data-language"]) {
      node.properties["data-language"] = pre.properties["data-language"];
    }
  });
};

const rehypeAddIds = () => (tree: Root) => {
  visit(tree, "element", (node: Element) => {
    if (node.tagName !== "h2" && node.tagName !== "h3") return;
    const text = node.children.map(getTextContent).join("");
    node.properties = {
      ...node.properties,
      id: text.toLowerCase().replace(/[^\w一-鿿]+/g, "-").replace(/^-+|-+$/g, ""),
    };
  });
};

const markdownComponents = {
  h1: (props: ComponentPropsWithoutRef<"h1">) => (
    <h1 className="markdown-heading-h1 text-3xl font-black leading-tight tracking-tight text-foreground md:text-4xl" {...props} />
  ),
  h2: (props: ComponentPropsWithoutRef<"h2">) => (
    <h2 className="markdown-heading-h2 text-2xl font-bold leading-snug tracking-tight text-foreground md:text-3xl" {...props} />
  ),
  h3: (props: ComponentPropsWithoutRef<"h3">) => (
    <h3 className="markdown-heading-h3 text-xl font-bold leading-snug tracking-tight text-foreground md:text-2xl" {...props} />
  ),
  pre: CodeBlock,
  img: ({ src, alt, title }: ComponentPropsWithoutRef<"img">) => {
    let width: number | undefined;
    let height: number | undefined;
    let align: string | undefined;
    let displayTitle: string | undefined;

    if (title) {
      try {
        const parsed = JSON.parse(title) as Record<string, unknown>;
        width = parsed.w ? Number(parsed.w) : undefined;
        height = parsed.h ? Number(parsed.h) : undefined;
        align = typeof parsed.align === "string" ? parsed.align : undefined;
        displayTitle = typeof parsed.title === "string" ? parsed.title : undefined;
      } catch {
        displayTitle = title;
      }
    }

    const style: CSSProperties = {
      maxWidth: "100%",
      height: "auto",
      ...((!align || align === "center") && { width: "100%", display: "block", margin: "0 auto" }),
      ...(align === "left" && { float: "left", marginRight: "1.5rem" }),
      ...(align === "right" && { float: "right", marginLeft: "1.5rem" }),
    };

    return <ImageZoom src={src} alt={alt} title={displayTitle} width={width} height={height} style={style} />;
  },
  Spacer,
  div: ({ className, "data-chart": chart, children, ...props }: ComponentPropsWithoutRef<"div"> & { "data-chart"?: string }) => {
    if (className?.includes("mermaid-container") && chart) return <Mermaid chart={chart} />;
    return <div className={className} {...props}>{children}</div>;
  },
};

export default function MarkdownRenderer({ source }: { source: string }) {
  return (
    <MDXRemote
      source={source}
      components={markdownComponents}
      options={{
        mdxOptions: {
          remarkPlugins: [remarkMath, remarkGfm, remarkImgAttrs],
          rehypePlugins: [
            preProcessMermaid,
            rehypeAddIds,
            rehypeKatex,
            [rehypePrettyCode, { theme: { light: "github-light", dark: "one-dark-pro" }, keepBackground: true }],
            copyDataLanguageToFigure,
          ],
        },
      }}
    />
  );
}

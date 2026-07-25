"use client";

import { useRef, useState, type ComponentPropsWithoutRef } from "react";
import { Check, Copy } from "lucide-react";
import IconButton from "./icon-button";

type CodeBlockProps = ComponentPropsWithoutRef<"pre">;

export function CodeBlock({ children, className, ...props }: CodeBlockProps) {
  const preRef = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (preRef.current) {
      const text = preRef.current.innerText;
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      className="group my-8 shadow-sm"
      style={{
        position: "relative",
        borderRadius: "var(--radius-card)",
        overflow: "hidden",
        border: "1px solid var(--border-color)",
        marginTop: "2rem",
        marginBottom: "2rem",
      }}
    >
      <pre
        ref={preRef}
        className={`${className || ""} overflow-x-auto text-sm leading-[22px] font-mono`}
        style={{ margin: 0 }}
        {...props}
      >
        {children}
      </pre>
      <IconButton
        onClick={handleCopy}
        className="code-copy-button absolute right-2 top-2 border border-border bg-background opacity-0 group-hover:opacity-100 focus-visible:opacity-100"
        label={copied ? "已复制代码" : "复制代码"}
      >
        {copied ? (
          <Check aria-hidden="true" size={24} strokeWidth={2} />
        ) : (
          <Copy aria-hidden="true" size={24} strokeWidth={2} />
        )}
      </IconButton>
    </div>
  );
}

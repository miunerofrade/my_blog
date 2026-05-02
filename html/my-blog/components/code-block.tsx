"use client";

import { useRef, useState } from "react";

export function CodeBlock({ children, className, ...props }: any) {
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
      className="relative group my-8 shadow-sm"
      style={{ 
        position: "relative",
        borderRadius: "0.5rem", 
        overflow: "hidden", 
        border: "1px solid rgba(128, 128, 128, 0.2)" 
      }}
    >
      <pre
        ref={preRef}
        className={`${className || ""} overflow-x-auto text-[0.9rem] leading-relaxed font-mono`}
        style={{ margin: 0 }}
        {...props}
      >
        {children}
      </pre>
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 px-2.5 py-1.5 text-xs rounded border border-foreground/20 bg-background/80 text-foreground/80 hover:bg-foreground/10 hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-200 backdrop-blur-sm cursor-pointer"
        aria-label="Copy code"
      >
        {copied ? "Copied!" : "Copy"}
      </button>
    </div>
  );
}
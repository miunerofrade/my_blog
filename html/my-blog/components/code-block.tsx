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

  const buttonStyle: React.CSSProperties = {
    position: "absolute",
    top: "0.5rem",
    right: "0.5rem",
    padding: "0.4rem",
    borderRadius: "0.375rem",
    backgroundColor: "var(--color-background)",
    color: "var(--color-foreground)",
    border: "1px solid rgba(150, 150, 150, 0.2)",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    lineHeight: 1,
  };

  return (
    <div
      className="group my-8 shadow-sm"
      style={{
        position: "relative",
        borderRadius: "0.5rem",
        overflow: "hidden",
        border: "1px solid rgba(128, 128, 128, 0.2)",
        marginTop: "2rem",
        marginBottom: "2rem",
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
        style={buttonStyle}
        className="opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity duration-200"
        aria-label={copied ? "Copied" : "Copy code"}
      >
        {copied ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
          </svg>
        )}
      </button>
    </div>
  );
}

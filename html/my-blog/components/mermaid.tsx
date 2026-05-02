"use client";

import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";
import { useTheme } from "@teispace/next-themes";

export function Mermaid({ chart }: { chart: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [rendered, setRendered] = useState<string>("");
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    // 监听 next-themes 并将对应的主题传给 Mermaid 渲染引擎
    const isDark = resolvedTheme === "dark";
    mermaid.initialize({ 
      startOnLoad: false, 
      theme: isDark ? 'dark' : 'default',
      themeVariables: {
        background: 'transparent'
      }
    });

    const id = `mermaid-${Math.random().toString(36).substring(2, 9)}`;
    mermaid.render(id, chart).then((result) => {
      setRendered(result.svg);
    }).catch((e) => {
      console.error(e);
      setRendered(`<div class="text-red-500">Mermaid Error</div>`);
    });
  }, [chart, resolvedTheme]);

  return <div ref={ref} dangerouslySetInnerHTML={{ __html: rendered }} /> ;
}

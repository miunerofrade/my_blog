"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useTheme } from "@teispace/next-themes";
import { motion } from "framer-motion";
import MediaLightbox from "@/components/media-lightbox";
import { useArticleTheme } from "@/components/article-theme";
import { getMermaidThemeVariables } from "@/lib/mermaid-theme";

function normalizeSvgSize(svg: string) {
  const document = new DOMParser().parseFromString(svg, "image/svg+xml");
  const svgElement = document.documentElement;
  const viewBox = svgElement.getAttribute("viewBox")?.trim().split(/\s+/).map(Number);

  if (
    svgElement.tagName.toLowerCase() === "svg" &&
    viewBox?.length === 4 &&
    Number.isFinite(viewBox[2]) &&
    Number.isFinite(viewBox[3])
  ) {
    svgElement.setAttribute("width", String(viewBox[2]));
    svgElement.setAttribute("height", String(viewBox[3]));
    svgElement.setAttribute("preserveAspectRatio", "xMidYMid meet");
    svgElement.style.removeProperty("width");
    svgElement.style.removeProperty("max-width");
  }

  return new XMLSerializer().serializeToString(svgElement);
}

export function Mermaid({ chart }: { chart: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [rendered, setRendered] = useState<string>("");
  const [isZoomed, setIsZoomed] = useState(false);
  const [hasError, setHasError] = useState(false);
  const layoutId = `mermaid-zoom-${useId()}`;
  const { resolvedTheme } = useTheme();
  const articleTheme = useArticleTheme();

  useEffect(() => {
    let cancelled = false;

    const renderChart = async () => {
      try {
        setHasError(false);
        const mermaid = (await import("mermaid")).default;
        const isDark = resolvedTheme === "dark";
        mermaid.initialize({
          startOnLoad: false,
          theme: isDark ? "base" : "default",
          themeVariables: getMermaidThemeVariables(isDark),
          flowchart: { useMaxWidth: false },
          sequence: { useMaxWidth: false },
          class: { useMaxWidth: false },
          state: { useMaxWidth: false },
          gantt: { useMaxWidth: false },
        });

        const id = `mermaid-${Math.random().toString(36).substring(2, 9)}`;
        const result = await mermaid.render(id, chart);
        if (!cancelled) setRendered(normalizeSvgSize(result.svg));
      } catch (error) {
        console.error(error);
        if (!cancelled) {
          setHasError(true);
          setRendered(`<div class="text-red-500">Mermaid Error</div>`);
        }
      }
    };

    void renderChart();
    return () => {
      cancelled = true;
    };
  }, [articleTheme, chart, resolvedTheme]);

  const openZoom = () => {
    if (rendered && !hasError) setIsZoomed(true);
  };

  return (
    <>
      <motion.div
        layoutId={layoutId}
        ref={ref}
        role={rendered && !hasError ? "button" : undefined}
        tabIndex={rendered && !hasError ? 0 : undefined}
        aria-label={rendered && !hasError ? "点击放大 Mermaid 图表" : undefined}
        onClick={openZoom}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openZoom();
          }
        }}
        className="my-8 flex cursor-zoom-in justify-center overflow-x-auto rounded-lg border border-[var(--border-color)] bg-transparent p-4 transition-shadow hover:shadow-md [&_svg]:block [&_svg]:h-auto [&_svg]:max-w-full"
        dangerouslySetInnerHTML={{ __html: rendered }}
      />

      <MediaLightbox
        isOpen={isZoomed}
        onClose={() => setIsZoomed(false)}
        label="放大的 Mermaid 图表"
      >
        <motion.span
          layoutId={layoutId}
          transition={{ type: "spring", stiffness: 320, damping: 30 }}
          className="relative z-10 flex max-h-[90vh] max-w-[90vw] items-center justify-center overflow-auto rounded-2xl bg-background/60 p-6 shadow-2xl [&_svg]:block [&_svg]:h-auto [&_svg]:max-h-[82vh] [&_svg]:max-w-[84vw]"
          dangerouslySetInnerHTML={{ __html: rendered }}
        />
      </MediaLightbox>
    </>
  );
}

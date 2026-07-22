"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "@teispace/next-themes";

const oneDarkTheme = {
  background: "transparent",
  mainBkg: "#3b3245",
  primaryColor: "#3b3245",
  primaryTextColor: "#f0f2f4",
  primaryBorderColor: "#c678dd",
  secondaryColor: "#253d45",
  secondaryTextColor: "#f0f2f4",
  secondaryBorderColor: "#56b6c2",
  tertiaryColor: "#34402f",
  tertiaryTextColor: "#f0f2f4",
  tertiaryBorderColor: "#98c379",
  textColor: "#f0f2f4",
  lineColor: "#c8cdd5",
  edgeLabelBackground: "#282c34",
  nodeBorder: "#c678dd",
  clusterBkg: "transparent",
  clusterBorder: "#7f8795",
  titleColor: "#f0f2f4",

  actorBkg: "#3b3245",
  actorBorder: "#d97757",
  actorTextColor: "#f0f2f4",
  actorLineColor: "#7f8795",
  signalColor: "#c8cdd5",
  signalTextColor: "#f0f2f4",
  labelBoxBkgColor: "#253d45",
  labelBoxBorderColor: "#56b6c2",
  labelTextColor: "#f0f2f4",
  loopTextColor: "#f0f2f4",
  activationBkgColor: "#34402f",
  activationBorderColor: "#98c379",
  noteBkgColor: "#4a402c",
  noteTextColor: "#fff4cf",
  noteBorderColor: "#e5c07b",

  classText: "#f0f2f4",

  sectionBkgColor: "#253d45",
  altSectionBkgColor: "transparent",
  sectionBkgColor2: "#3b3245",
  taskBkgColor: "#d97757",
  taskBorderColor: "#e5a087",
  taskTextColor: "#21252b",
  taskTextDarkColor: "#f0f2f4",
  taskTextLightColor: "#21252b",
  activeTaskBkgColor: "#98c379",
  activeTaskBorderColor: "#b5d99c",
  doneTaskBkgColor: "#5c6370",
  doneTaskBorderColor: "#abb2bf",
  critBkgColor: "#e06c75",
  critBorderColor: "#ef9a9f",
  todayLineColor: "#e5c07b",
  gridColor: "#7f8795",
};

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
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    let cancelled = false;

    const renderChart = async () => {
      try {
        const mermaid = (await import("mermaid")).default;
        const isDark = resolvedTheme === "dark";
        mermaid.initialize({
          startOnLoad: false,
          theme: isDark ? "base" : "default",
          themeVariables: isDark
            ? oneDarkTheme
            : { background: "transparent" },
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
        if (!cancelled) setRendered(`<div class="text-red-500">Mermaid Error</div>`);
      }
    };

    void renderChart();
    return () => {
      cancelled = true;
    };
  }, [chart, resolvedTheme]);

  return (
    <div
      ref={ref}
      className="my-8 flex justify-center overflow-x-auto rounded-lg border border-[var(--border-color)] bg-transparent p-4 [&_svg]:block [&_svg]:h-auto [&_svg]:max-w-full"
      dangerouslySetInnerHTML={{ __html: rendered }}
    />
  );
}

import { afterEach, describe, expect, it } from "vitest";
import { getMermaidThemeVariables } from "@/lib/mermaid-theme";

const root = document.documentElement;

afterEach(() => {
  root.removeAttribute("style");
});

describe("getMermaidThemeVariables", () => {
  it("uses the current accent for Mermaid accent slots", () => {
    root.style.setProperty("--accent-color", "#3B82F6");
    root.style.setProperty("--mermaid-background", "transparent");

    expect(getMermaidThemeVariables(false)).toMatchObject({
      background: "transparent",
      actorBorder: "#3B82F6",
      taskBkgColor: "#3B82F6",
    });
  });

  it("reads the dark palette from centralized CSS tokens", () => {
    root.style.setProperty("--accent-color", "#D97757");
    root.style.setProperty("--mermaid-main-background", "#101820");
    root.style.setProperty("--mermaid-primary-color", "#182430");

    expect(getMermaidThemeVariables(true)).toMatchObject({
      mainBkg: "#101820",
      primaryColor: "#182430",
    });
  });
});

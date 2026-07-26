import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ArticleTheme from "./article-theme";

describe("ArticleTheme", () => {
  it("renders root-level accent overrides for a themed article", () => {
    const { container } = render(
      <ArticleTheme theme="#FFFF00">
        <div>Article</div>
      </ArticleTheme>,
    );
    const style = container.querySelector("style[data-article-theme]");

    expect(style).toHaveAttribute("data-article-theme", "#FFFF00");
    expect(style).toHaveTextContent("--accent-color: #FFFF00");
    expect(style).toHaveTextContent("--accent-foreground-color: #000000");
  });

  it("does not render an override without article metadata", () => {
    const { container } = render(
      <ArticleTheme>
        <div>Article</div>
      </ArticleTheme>,
    );

    expect(container.querySelector("style[data-article-theme]")).toBeNull();
  });
});

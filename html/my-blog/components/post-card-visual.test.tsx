import { fireEvent, render, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import PostCardVisual, { getPostCardStyle } from "./post-card-visual";
import type { PostData } from "@/lib/posts";

const post: PostData = {
  slug: "color-only",
  title: "Color only",
  date: "2026-07-26",
  excerpt: "A card color without an article theme.",
  year: "2026",
  color: "#66CCFF",
};

describe("PostCardVisual", () => {
  it("uses color only for the visual surface", () => {
    expect(getPostCardStyle(post)).toMatchObject({
      "--post-card-accent": "var(--accent-color)",
      "--post-card-accent-foreground": "var(--accent-foreground-color)",
      "--post-card-visual": "#66CCFF",
      "--post-card-visual-foreground": "#000000",
    });
  });

  it("falls back from a failed cover to the configured color", async () => {
    const { container } = render(
      <div style={getPostCardStyle(post)}>
        <PostCardVisual
          post={{ ...post, cover: "/images/missing.webp", coverAspectRatio: 2 }}
        />
      </div>,
    );
    const visual = container.querySelector(".post-card-visual");
    const image = container.querySelector("img");

    expect(visual).toHaveClass("post-card-visual--cover");
    fireEvent.error(image as HTMLImageElement);

    await waitFor(() => {
      expect(container.querySelector("img")).not.toBeInTheDocument();
      expect(visual).not.toHaveClass("post-card-visual--cover");
    });
    expect(
      (visual?.parentElement as HTMLElement).style.getPropertyValue(
        "--post-card-visual",
      ),
    ).toBe("#66CCFF");
  });
});

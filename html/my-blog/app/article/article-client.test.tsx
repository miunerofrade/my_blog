import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import ArticleClient from "./article-client";
import type { PostData } from "@/lib/posts";

const themedPost: PostData = {
  slug: "themed-post",
  title: "Themed post",
  date: "2026-07-22",
  excerpt: "A short article excerpt.",
  readTime: "4 min read",
  year: "2026",
  tags: ["Design"],
  theme: "#66CCFF",
};

describe("ArticleClient card view", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("persists the view and exposes the article theme to the whole card", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <ArticleClient initialData={[{ year: "2026", posts: [themedPost] }]} />,
    );

    expect(screen.queryByText("Timeline")).not.toBeInTheDocument();
    expect(container.querySelector(".article-index-shell-single")).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: "切换到卡片视图" }),
    );

    await waitFor(() => {
      expect(container.querySelector(".article-grid-card")).toBeInTheDocument();
    });

    const card = container.querySelector<HTMLElement>(".article-grid-card");
    expect(card).not.toBeNull();
    expect(window.localStorage.getItem("article-view-mode")).toBe("grid");
    expect(card?.style.getPropertyValue("--post-card-accent")).toBe("#66CCFF");
    expect(
      card?.style.getPropertyValue("--post-card-accent-foreground"),
    ).toBe("#000000");
    expect(
      screen.getByRole("button", { name: "切换到列表视图" }),
    ).toHaveAttribute("aria-pressed", "true");
  });

  it("falls back to the theme visual when a cover cannot load", async () => {
    window.localStorage.setItem("article-view-mode", "grid");
    const postWithCover = {
      ...themedPost,
      cover: "/photos/cover.webp",
      coverAspectRatio: 3 / 2,
    };
    const { container } = render(
      <ArticleClient initialData={[{ year: "2026", posts: [postWithCover] }]} />,
    );

    const visual = container.querySelector(".post-card-visual");
    const cover = container.querySelector("img");

    expect(visual).toHaveClass("post-card-visual--cover");
    expect(visual).toHaveStyle({ height: "260px" });
    expect(cover).toHaveAttribute("src", expect.stringContaining("cover.webp"));

    fireEvent.error(cover as HTMLImageElement);

    await waitFor(() => {
      expect(container.querySelector("img")).not.toBeInTheDocument();
      expect(visual).not.toHaveClass("post-card-visual--cover");
    });
  });

  it("uses color for the visual without changing the card accent", async () => {
    window.localStorage.setItem("article-view-mode", "grid");
    const { container } = render(
      <ArticleClient
        initialData={[
          {
            year: "2026",
            posts: [{ ...themedPost, color: "#2563EB" }],
          },
        ]}
      />,
    );

    const card = container.querySelector<HTMLElement>(".article-grid-card");
    expect(card?.style.getPropertyValue("--post-card-accent")).toBe("#66CCFF");
    expect(card?.style.getPropertyValue("--post-card-visual")).toBe("#2563EB");
    expect(
      card?.style.getPropertyValue("--post-card-visual-foreground"),
    ).toBe("#FFFFFF");
  });

  it("only enables the single-card layout for one actual post", () => {
    const { container } = render(
      <ArticleClient
        initialData={[
          {
            year: "2026",
            posts: [
              themedPost,
              { ...themedPost, slug: "second-post", title: "Second post" },
            ],
          },
        ]}
      />,
    );

    expect(
      container.querySelector(".article-index-shell-single"),
    ).not.toBeInTheDocument();
  });
});

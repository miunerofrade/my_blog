import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import HomeWritings from "./home-writings";
import type { PostData } from "@/lib/posts";

const posts: PostData[] = Array.from({ length: 4 }, (_, index) => ({
  slug: `post-${index + 1}`,
  title: `Post ${index + 1}`,
  date: `2026-07-2${6 - index}`,
  excerpt: `Excerpt ${index + 1}`,
  readTime: `${index + 2} min read`,
  year: "2026",
  color: index === 0 ? "#2563EB" : undefined,
}));

describe("HomeWritings", () => {
  it("renders nothing when there are no posts", () => {
    const { container } = render(<HomeWritings posts={[]} />);

    expect(container).toBeEmptyDOMElement();
  });

  it("lets a single featured post occupy the layout", () => {
    const { container } = render(<HomeWritings posts={posts.slice(0, 1)} />);

    expect(container.querySelector(".home-writings-layout")).toHaveClass(
      "home-writings-layout--single",
    );
    expect(screen.getByRole("link", { name: /Post 1/ })).toHaveAttribute(
      "href",
      "/article/post-1",
    );
    expect(screen.getByRole("link", { name: /View all writings/ })).toBeVisible();
  });

  it("renders one compact row when there are two posts", () => {
    const { container } = render(<HomeWritings posts={posts.slice(0, 2)} />);
    const compact = container.querySelector(".home-writings-items");

    expect(compact).not.toBeNull();
    expect(within(compact as HTMLElement).getByText("Post 2")).toBeVisible();
    expect(within(compact as HTMLElement).queryByText("Post 3")).toBeNull();
  });

  it("keeps the latest post featured and the next three compact", () => {
    const { container } = render(<HomeWritings posts={posts} />);
    const featured = container.querySelector(".home-featured-post");
    const compact = container.querySelector(".home-writings-items");

    expect(within(featured as HTMLElement).getByText("Post 1")).toBeVisible();
    expect(within(compact as HTMLElement).getByText("Post 2")).toBeVisible();
    expect(within(compact as HTMLElement).getByText("Post 3")).toBeVisible();
    expect(within(compact as HTMLElement).getByText("Post 4")).toBeVisible();
    expect(featured).toHaveStyle({
      "--post-card-visual": "#2563EB",
      "--post-card-accent": "var(--accent-color)",
    });
  });
});

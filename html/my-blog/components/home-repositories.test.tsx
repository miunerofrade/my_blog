import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import HomeRepositories from "./home-repositories";
import type { GitHubRepository } from "@/lib/github";
import { siteConfig } from "@/lib/site-config";

const repositories: GitHubRepository[] = Array.from(
  { length: 4 },
  (_, index) => ({
    id: index + 1,
    name:
      index === 3
        ? siteConfig.github.featuredRepository
        : `Repository ${index + 1}`,
    description: `Description ${index + 1}`,
    url: `https://github.com/example/repository-${index + 1}`,
    language: index === 0 ? "TypeScript" : "Python",
    stars: index + 2,
    forks: index,
    pushedAt: `2026-07-2${6 - index}T12:00:00Z`,
  }),
);

describe("HomeRepositories", () => {
  it("renders nothing without repositories", () => {
    const { container } = render(<HomeRepositories repositories={[]} />);

    expect(container).toBeEmptyDOMElement();
  });

  it("renders a single repository as the featured project", () => {
    const { container } = render(
      <HomeRepositories repositories={repositories.slice(0, 1)} />,
    );
    const featured = container.querySelector(".home-repository-featured");

    expect(featured).not.toBeNull();
    expect(
      within(featured as HTMLElement).getByText("Repository 1"),
    ).toBeVisible();
    expect(featured).toHaveAttribute("target", "_blank");
    expect(container.querySelector(".home-repository-compact")).toBeNull();
    expect(
      screen.getByRole("link", { name: /View all repositories/ }),
    ).toBeVisible();
  });

  it("uses the configured repository as featured and keeps three compact", () => {
    const { container } = render(
      <HomeRepositories repositories={repositories} />,
    );
    const featured = container.querySelector(".home-repository-featured");
    const compact = container.querySelectorAll(".home-repository-compact");

    expect(
      within(featured as HTMLElement).getByText(
        siteConfig.github.featuredRepository,
      ),
    ).toBeVisible();
    expect(compact).toHaveLength(3);
    expect(within(compact[0] as HTMLElement).getByText("Repository 1")).toBeVisible();
    expect(within(compact[2] as HTMLElement).getByText("Repository 3")).toBeVisible();
    expect(featured).toHaveStyle({
      "--repository-accent": "#3572a5",
    });
  });
});

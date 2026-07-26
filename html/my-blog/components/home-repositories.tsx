"use client";

import "./home-repositories.css";

import Link from "next/link";
import {
  ExternalLink,
  GitFork,
  Star,
} from "lucide-react";
import { CupertinoButton } from "@/components/cupertino";
import type { GitHubRepository } from "@/lib/github";
import { siteConfig } from "@/lib/site-config";
import type { CSSProperties, PointerEvent } from "react";

const languageColors: Record<string, string> = {
  Python: "#3572a5",
  TypeScript: "#3178c6",
  JavaScript: "#b08b00",
  Rust: "#b56a32",
  Go: "#008aa8",
};

type RepositoryStyle = CSSProperties & {
  "--repository-accent": string;
  "--hover-origin"?: string;
};

function formatRepositoryDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(value));
}

function getRepositoryStyle(
  repository: GitHubRepository,
  includeHoverOrigin = false,
): RepositoryStyle {
  return {
    "--repository-accent":
      languageColors[repository.language ?? ""] ?? "var(--accent-color)",
    ...(includeHoverOrigin ? { "--hover-origin": "50%" } : {}),
  };
}

function updateHighlightOrigin(event: PointerEvent<HTMLElement>) {
  const bounds = event.currentTarget.getBoundingClientRect();
  const position = ((event.clientX - bounds.left) / bounds.width) * 100;
  event.currentTarget.style.setProperty("--hover-origin", `${position}%`);
}

function RepositoryMetadata({
  repository,
  featured = false,
}: {
  repository: GitHubRepository;
  featured?: boolean;
}) {
  return (
    <span
      className={
        featured
          ? "home-repository-featured-meta"
          : "home-repository-compact-meta"
      }
    >
      {repository.language ? (
        <span className="home-repository-language">
          <span className="home-repository-language-dot" aria-hidden="true" />
          {repository.language}
        </span>
      ) : null}
      <span>
        <Star aria-hidden="true" size={16} strokeWidth={2} />
        {repository.stars}
      </span>
      {repository.forks > 0 ? (
        <span>
          <GitFork aria-hidden="true" size={16} strokeWidth={2} />
          {repository.forks}
        </span>
      ) : null}
      <time dateTime={repository.pushedAt}>
        {formatRepositoryDate(repository.pushedAt)}
      </time>
    </span>
  );
}

function FeaturedRepository({
  repository,
}: {
  repository: GitHubRepository;
}) {
  return (
    <Link
      href={repository.url}
      target="_blank"
      rel="noopener noreferrer"
      className="home-repository-featured group"
      style={getRepositoryStyle(repository, true)}
      onPointerEnter={updateHighlightOrigin}
      onPointerMove={updateHighlightOrigin}
    >
      <span className="home-repository-featured-copy">
        <span className="home-repository-label">Featured</span>
        <span className="home-repository-featured-heading">
          <h3>{repository.name}</h3>
          <ExternalLink aria-hidden="true" size={26} strokeWidth={2} />
        </span>
        {repository.description ? (
          <span className="home-repository-featured-description">
            {repository.description}
          </span>
        ) : null}
      </span>
      <RepositoryMetadata repository={repository} featured />
      <span className="home-repository-divider" aria-hidden="true" />
    </Link>
  );
}

function CompactRepository({
  repository,
}: {
  repository: GitHubRepository;
}) {
  return (
    <Link
      href={repository.url}
      target="_blank"
      rel="noopener noreferrer"
      className="home-repository-compact group"
      style={getRepositoryStyle(repository, true)}
      onPointerEnter={updateHighlightOrigin}
      onPointerMove={updateHighlightOrigin}
    >
      <span className="home-repository-compact-copy">
        <span className="home-repository-compact-heading">
          <h3>{repository.name}</h3>
          <ExternalLink aria-hidden="true" size={20} strokeWidth={2} />
        </span>
        {repository.description ? (
          <span className="home-repository-compact-description">
            {repository.description}
          </span>
        ) : null}
      </span>
      <RepositoryMetadata repository={repository} />
      <span className="home-repository-divider" aria-hidden="true" />
    </Link>
  );
}

export default function HomeRepositories({
  repositories,
}: {
  repositories: GitHubRepository[];
}) {
  if (repositories.length === 0) {
    return null;
  }

  const configuredFeaturedRepository = repositories.find(
    (repository) =>
      repository.name === siteConfig.github.featuredRepository,
  );
  const featuredRepository = configuredFeaturedRepository ?? repositories[0];
  const compactRepositories = repositories
    .filter((repository) => repository.id !== featuredRepository.id)
    .slice(0, 3);

  return (
    <div className="home-repositories">
      <FeaturedRepository repository={featuredRepository} />

      {compactRepositories.length > 0 ? (
        <div className="home-repository-list">
          {compactRepositories.map((repository) => (
            <CompactRepository
              key={repository.id}
              repository={repository}
            />
          ))}
        </div>
      ) : null}

      <div className="cupertino-view-all-row">
        <CupertinoButton
          href="https://github.com/miunerofrade?tab=repositories"
          external
          className="cupertino-button-link"
        >
          View all repositories
          <ExternalLink aria-hidden="true" size={24} strokeWidth={2} />
        </CupertinoButton>
      </div>
    </div>
  );
}

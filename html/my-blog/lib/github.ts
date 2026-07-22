export interface GitHubRepository {
  id: number;
  name: string;
  description: string | null;
  url: string;
  language: string | null;
  stars: number;
  forks: number;
  pushedAt: string;
}

interface GitHubApiRepository {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  pushed_at: string;
  fork: boolean;
  archived: boolean;
}

export async function getRecentRepositories(): Promise<GitHubRepository[]> {
  try {
    const response = await fetch(
      "https://api.github.com/users/miunerofrade/repos?sort=pushed&direction=desc&per_page=12",
      {
        headers: {
          Accept: "application/vnd.github+json",
          "User-Agent": "miunerofrade-blog",
          "X-GitHub-Api-Version": "2022-11-28",
        },
        next: { revalidate: 3600 },
      },
    );

    if (!response.ok) throw new Error(`GitHub API returned ${response.status}`);

    const repositories = (await response.json()) as GitHubApiRepository[];
    return repositories
      .filter((repository) => !repository.fork && !repository.archived)
      .slice(0, 4)
      .map((repository) => ({
        id: repository.id,
        name: repository.name,
        description: repository.description,
        url: repository.html_url,
        language: repository.language,
        stars: repository.stargazers_count,
        forks: repository.forks_count,
        pushedAt: repository.pushed_at,
      }));
  } catch (error) {
    console.error("Unable to load recent GitHub repositories", error);
    return [];
  }
}

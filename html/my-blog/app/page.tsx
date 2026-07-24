import HomePage from "@/components/home-page";
import { getRecentRepositories } from "@/lib/github";
import { getAllPosts } from "@/lib/posts";

export default async function Home() {
  const repositories = await getRecentRepositories();
  const recentPosts = getAllPosts().slice(0, 3);

  return <HomePage repositories={repositories} recentPosts={recentPosts} />;
}

import HomePage from "@/components/home-page";
import { getRecentRepositories } from "@/lib/github";

export default async function Home() {
  const repositories = await getRecentRepositories();
  return <HomePage repositories={repositories} />;
}

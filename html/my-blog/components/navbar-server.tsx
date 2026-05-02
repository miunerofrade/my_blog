import { getGroupedPosts } from "@/lib/posts";
import Navbar from "./navbar";

export default async function NavbarServer() {
  const groups = getGroupedPosts();
  const recentPosts = groups.flatMap((g) => g.posts).slice(0, 6);
  return <Navbar recentPosts={recentPosts} />;
}
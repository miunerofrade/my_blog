import { getAllPosts } from "@/lib/posts";
import Navbar from "./navbar";

export default async function NavbarServer() {
  const posts = getAllPosts();
  const recentPosts = posts.slice(0, 6);
  const searchPosts = posts.map(({ title, slug }) => ({ title, slug }));
  return <Navbar recentPosts={recentPosts} searchPosts={searchPosts} />;
}

import ArticleClient from "./article-client";
import { getGroupedPosts } from "@/lib/posts";

export default function BlogPage() {
  const initialData = getGroupedPosts();

  return <ArticleClient initialData={initialData} />;
}
import { PostList } from "@/components/PostList";
import { getAllPosts } from "@/lib/content";
import { siteConfig } from "@/lib/siteConfig";

export const metadata = {
  title: siteConfig.title,
  description: siteConfig.tagline,
};

export default function HomePage() {
  const posts = getAllPosts();

  return <PostList posts={posts} title="Latest Posts" />;
}

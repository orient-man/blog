import { PostList } from "@/components/PostList";
import { getAllPosts } from "@/lib/content";

export const metadata = {
  title: "Just A Programmer",
  description: "Don Quixote fighting entropy",
};

export default function HomePage() {
  const posts = getAllPosts();

  return <PostList posts={posts} title="Latest Posts" />;
}

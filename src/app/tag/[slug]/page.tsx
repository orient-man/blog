import { notFound } from "next/navigation";

import { PostList } from "@/components/PostList";
import { getPostsByTag, getAllTags } from "@/lib/content";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  const tags = getAllTags();
  return tags.map((tag) => ({ slug: tag.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const tags = getAllTags();
  const tag = tags.find((t) => t.slug === slug);
  if (!tag) return {};
  return { title: `Posts tagged "${tag.name}" — Just A Programmer` };
}

export default async function TagPage({ params }: Props) {
  const { slug } = await params;
  const tags = getAllTags();
  const tag = tags.find((t) => t.slug === slug);
  if (!tag) notFound();

  const posts = getPostsByTag(slug);

  return <PostList posts={posts} title={`Posts tagged "${tag.name}"`} />;
}

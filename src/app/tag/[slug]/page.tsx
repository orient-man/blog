import { notFound } from "next/navigation";

import { PostList } from "@/components/PostList";
import { getPostsByTag, getAllTags } from "@/lib/content";

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  const tags = getAllTags();
  return tags.map((tag) => ({ slug: tag.slug }));
}

export function generateMetadata({ params }: Props) {
  const tags = getAllTags();
  const tag = tags.find((t) => t.slug === params.slug);
  if (!tag) return {};
  return { title: `Posts tagged "${tag.name}" — Just A Programmer` };
}

export default function TagPage({ params }: Props) {
  const tags = getAllTags();
  const tag = tags.find((t) => t.slug === params.slug);
  if (!tag) notFound();

  const posts = getPostsByTag(params.slug);

  return <PostList posts={posts} title={`Posts tagged "${tag.name}"`} />;
}

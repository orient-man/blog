import { notFound } from "next/navigation";

import { PostList } from "@/components/PostList";
import { getPostsByCategory } from "@/lib/content";
import { CATEGORIES, CategorySlug } from "@/lib/types";

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  return CATEGORIES.map((cat) => ({ slug: cat.slug }));
}

export function generateMetadata({ params }: Props) {
  const category = CATEGORIES.find((c) => c.slug === params.slug);
  if (!category) return {};
  return { title: `${category.name} — Just A Programmer` };
}

export default function CategoryPage({ params }: Props) {
  const category = CATEGORIES.find((c) => c.slug === params.slug);
  if (!category) notFound();

  const posts = getPostsByCategory(params.slug as CategorySlug);

  return <PostList posts={posts} title={`Category: ${category.name}`} />;
}

import { notFound } from "next/navigation";

import { PostList } from "@/components/PostList";
import { getPostsByCategory } from "@/lib/content";
import { CATEGORIES, CategorySlug } from "@/lib/types";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return CATEGORIES.map((cat) => ({ slug: cat.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const category = CATEGORIES.find((c) => c.slug === slug);
  if (!category) return {};
  return { title: `${category.name} — Just A Programmer` };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = CATEGORIES.find((c) => c.slug === slug);
  if (!category) notFound();

  const posts = getPostsByCategory(slug as CategorySlug);

  return <PostList posts={posts} title={`Category: ${category.name}`} />;
}

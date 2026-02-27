import { notFound } from 'next/navigation';
import { getPostsByCategory, getAllCategories } from '@/lib/content';
import { PostList } from '@/components/PostList';
import { CATEGORIES } from '@/lib/types';

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

  const posts = getPostsByCategory(params.slug as any);

  return (
    <PostList
      posts={posts}
      title={`Category: ${category.name}`}
    />
  );
}

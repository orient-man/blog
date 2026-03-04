import Link from 'next/link';
import { getAllTags } from '@/lib/content';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tags',
  description: 'Browse all tags used across blog posts.',
};

export default function TagsIndexPage() {
  const tags = getAllTags();

  // Sort alphabetically by display name (case-insensitive)
  const sorted = [...tags].sort((a, b) =>
    a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
  );

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Tags</h1>
      <div className="flex flex-wrap gap-2">
        {sorted.map((tag) => (
          <Link
            key={tag.slug}
            href={`/tag/${tag.slug}/`}
            className="text-sm px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-900 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
          >
            {tag.name}{' '}
            <span className="text-gray-400 dark:text-gray-500">
              ({tag.count})
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

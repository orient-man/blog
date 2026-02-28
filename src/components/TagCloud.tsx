import Link from 'next/link';
import type { Tag } from '@/lib/types';

interface TagCloudProps {
  tags: Tag[];
  maxTags?: number;
}

/**
 * Renders a tag cloud where each tag is a pill linked to /tag/{slug}/.
 * Font weight and size varies by post count relative to the max count.
 */
export default function TagCloud({ tags, maxTags = 20 }: TagCloudProps) {
  const sorted = [...tags].sort((a, b) => b.count - a.count);
  const displayed = sorted.slice(0, maxTags);
  const hasMore = tags.length > maxTags;
  const maxCount = displayed[0]?.count ?? 1;

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {displayed.map((tag) => {
          const ratio = tag.count / maxCount;
          // Scale between text-xs (ratio ≈ 0) and text-base (ratio ≈ 1)
          const sizeClass =
            ratio > 0.7
              ? 'text-sm font-semibold'
              : ratio > 0.4
              ? 'text-sm font-medium'
              : ratio > 0.15
              ? 'text-xs font-medium'
              : 'text-xs font-normal';

          return (
            <Link
              key={tag.slug}
              href={`/tag/${tag.slug}/`}
              className={`${sizeClass} px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-900 hover:text-blue-700 dark:hover:text-blue-300 transition-colors`}
              title={`${tag.count} post${tag.count === 1 ? '' : 's'}`}
            >
              {tag.name}
            </Link>
          );
        })}
      </div>
      {hasMore && (
        <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
          Showing top {maxTags} of {tags.length} tags
        </p>
      )}
    </div>
  );
}

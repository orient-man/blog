import Link from "next/link";

import type { Tag } from "@/lib/types";
import { tagFontSize } from "@/lib/utils";

interface TagCloudProps {
  tags: Tag[];
  maxTags?: number;
}

/**
 * Renders a tag cloud where each tag is a pill linked to /tag/{slug}/.
 * Font size varies continuously by post count using a logarithmic scale.
 */
export default function TagCloud({ tags, maxTags = 20 }: TagCloudProps) {
  const sorted = [...tags].sort((a, b) => b.count - a.count);
  const displayed = sorted.slice(0, maxTags);
  const hasMore = tags.length > maxTags;
  const minCount =
    displayed.length > 0 ? displayed[displayed.length - 1].count : 1;
  const maxCount = displayed[0]?.count ?? 1;

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        {displayed.map((tag) => {
          const size = tagFontSize(tag.count, minCount, maxCount);
          return (
            <Link
              key={tag.slug}
              href={`/tag/${tag.slug}/`}
              className="inline-flex items-center px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-900 hover:text-blue-700 dark:hover:text-blue-300 transition-colors leading-snug"
              style={{ fontSize: `${size.toFixed(2)}rem` }}
              title={`${tag.count} post${tag.count === 1 ? "" : "s"}`}
            >
              {tag.name}
            </Link>
          );
        })}
      </div>
      {hasMore && (
        <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
          <Link
            href="/tags/"
            className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            Showing top {maxTags} of {tags.length} tags
          </Link>
        </p>
      )}
    </div>
  );
}

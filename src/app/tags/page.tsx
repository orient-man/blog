import type { Metadata } from "next";
import Link from "next/link";

import { getAllTags } from "@/lib/content";
import { tagFontSize } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Tags",
  description: "Browse all tags used across blog posts.",
};

export default function TagsIndexPage() {
  const tags = getAllTags();

  // Sort alphabetically by display name (case-insensitive)
  const sorted = [...tags].sort((a, b) =>
    a.name.localeCompare(b.name, undefined, { sensitivity: "base" }),
  );

  // Compute min/max counts across all tags for proportional sizing
  const counts = sorted.map((t) => t.count);
  const minCount = Math.min(...counts, 1);
  const maxCount = Math.max(...counts, 1);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Tags</h1>
      <div className="flex flex-wrap items-center gap-2">
        {sorted.map((tag) => {
          const size = tagFontSize(tag.count, minCount, maxCount);
          return (
            <Link
              key={tag.slug}
              href={`/tag/${tag.slug}/`}
              className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-brand-100 dark:hover:bg-brand-900 hover:text-brand-700 dark:hover:text-brand-300 transition-colors leading-snug"
              style={{ fontSize: `${size.toFixed(2)}rem` }}
            >
              {tag.name}{" "}
              <span className="text-gray-400 dark:text-gray-500">
                ({tag.count})
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

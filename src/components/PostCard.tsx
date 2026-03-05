import Link from "next/link";

import type { Post } from "@/lib/types";
import { formatDate, postUrlPath, slugify } from "@/lib/utils";

interface PostCardProps {
  post: Pick<
    Post,
    | "title"
    | "date"
    | "slug"
    | "excerpt"
    | "category"
    | "tags"
    | "format"
    | "wordpressUrl"
  >;
}

const MAX_TAGS = 5;

export function PostCard({ post }: PostCardProps) {
  const { title, date, slug, excerpt, category, tags, format } = post;
  const url = postUrlPath(date, slug);
  const visibleTags = tags.slice(0, MAX_TAGS);
  const extraTags = tags.length - MAX_TAGS;

  return (
    <article
      className={`rounded-lg border bg-white dark:bg-gray-800 p-5 shadow-sm transition-shadow hover:shadow-md ${
        format === "quote"
          ? "border-l-4 border-l-blue-500 dark:border-l-blue-400 border-gray-200 dark:border-gray-700"
          : "border-gray-200 dark:border-gray-700"
      }`}
    >
      {format === "quote" && (
        <span
          className="text-blue-500 dark:text-blue-400 text-2xl font-serif leading-none select-none"
          aria-hidden="true"
        >
          &ldquo;
        </span>
      )}

      <h2 className="text-xl font-semibold mt-1 mb-2">
        <Link
          href={url}
          className="text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          {title}
        </Link>
      </h2>

      <time
        dateTime={date}
        className="text-sm text-gray-500 dark:text-gray-400"
      >
        {formatDate(date)}
      </time>

      {excerpt && (
        <p className="mt-3 text-gray-600 dark:text-gray-300 text-sm leading-relaxed line-clamp-3">
          {excerpt}
        </p>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {/* Category badge */}
        <Link
          href={`/category/${category}/`}
          className="inline-block rounded bg-blue-100 dark:bg-blue-900 px-2 py-0.5 text-xs font-medium text-blue-800 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
        >
          {category === "posts-in-english" ? "English" : "Polish"}
        </Link>

        {/* Tag pills */}
        {visibleTags.map((tag) => (
          <Link
            key={tag}
            href={`/tag/${slugify(tag)}/`}
            className="inline-block rounded-full bg-gray-100 dark:bg-gray-700 px-2 py-0.5 text-xs text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            {tag}
          </Link>
        ))}

        {extraTags > 0 && (
          <span className="text-xs text-gray-400 dark:text-gray-500">
            +{extraTags} more
          </span>
        )}
      </div>
    </article>
  );
}

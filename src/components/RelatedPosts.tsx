import Link from "next/link";

import type { Post } from "@/lib/types";
import { formatDate, postUrlPath, slugify } from "@/lib/utils";

interface RelatedPostsProps {
  posts: Post[];
}

export function RelatedPosts({ posts }: RelatedPostsProps) {
  if (posts.length < 2) return null;

  return (
    <section className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
      <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
        Related Posts
      </h2>
      <ul className="space-y-3">
        {posts.map((post) => {
          const url = postUrlPath(post.date, post.slug);
          return (
            <li key={post.slug}>
              <Link
                href={url}
                className="font-medium text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                {post.title}
              </Link>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <time
                  dateTime={post.date}
                  className="text-sm text-gray-500 dark:text-gray-400"
                >
                  {formatDate(post.date)}
                </time>
                {post.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/tag/${slugify(tag)}/`}
                    className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-900 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

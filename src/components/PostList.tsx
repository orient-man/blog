'use client';

import type { Post } from '@/lib/types';
import { PostCard } from './PostCard';
import { usePageParam } from '@/hooks/use-page-param';

interface PostListProps {
  posts: Post[];
  pageSize?: number;
  title?: string;
}

const DEFAULT_PAGE_SIZE = 10;

export function PostList({ posts, pageSize = DEFAULT_PAGE_SIZE, title }: PostListProps) {
  const totalPages = Math.ceil(posts.length / pageSize);
  const [page, setPage] = usePageParam(totalPages);

  const start = page * pageSize;
  const end = Math.min(start + pageSize, posts.length);
  const pagePosts = posts.slice(start, end);

  const hasPrev = page > 0;
  const hasNext = page < totalPages - 1;

  return (
    <section>
      {title && (
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          {title}
        </h1>
      )}

      {posts.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No posts found.</p>
      ) : (
        <>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Showing {start + 1}–{end} of {posts.length} {posts.length === 1 ? 'post' : 'posts'}
          </p>

          <div className="space-y-6">
            {pagePosts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>

          {totalPages > 1 && (
            <nav
              className="mt-8 flex items-center justify-between"
              aria-label="Post pagination"
            >
              <button
                onClick={() => { setPage(page - 1); window.scrollTo(0, 0); }}
                disabled={!hasPrev}
                className="px-4 py-2 rounded bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm font-medium disabled:opacity-40 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                &larr; Newer
              </button>

              <span className="text-sm text-gray-500 dark:text-gray-400">
                Page {page + 1} of {totalPages}
              </span>

              <button
                onClick={() => { setPage(page + 1); window.scrollTo(0, 0); }}
                disabled={!hasNext}
                className="px-4 py-2 rounded bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm font-medium disabled:opacity-40 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Older &rarr;
              </button>
            </nav>
          )}
        </>
      )}
    </section>
  );
}

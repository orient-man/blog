import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import * as runtime from 'react/jsx-runtime';
import { evaluate } from '@mdx-js/mdx';
import rehypePrettyCode from 'rehype-pretty-code';
import remarkGfm from 'remark-gfm';
import { getAllPosts, getPostBySlug } from '@/lib/content';
import { formatDate, postUrlPath, slugify } from '@/lib/utils';
import { CATEGORIES } from '@/lib/types';
import QuotePost from '@/components/QuotePost';
import GistEmbed from '@/components/GistEmbed';
import TweetEmbed from '@/components/TweetEmbed';
import CommentList from '@/components/CommentList';

// ── Shared rehype-pretty-code options ─────────────────────────────────────────

const prettyCodeOptions = {
  theme: {
    dark: 'github-dark',
    light: 'github-light',
  },
  keepBackground: false,
};

// ── Static params ─────────────────────────────────────────────────────────────

export function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => {
    const d = new Date(post.date + 'T00:00:00Z');
    return {
      year: String(d.getUTCFullYear()),
      month: String(d.getUTCMonth() + 1).padStart(2, '0'),
      day: String(d.getUTCDate()).padStart(2, '0'),
      slug: post.slug,
    };
  });
}

// ── Metadata ──────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: { year: string; month: string; day: string; slug: string };
}): Promise<Metadata> {
  const post = getPostBySlug(params.slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
    },
  };
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function PostPage({
  params,
}: {
  params: { year: string; month: string; day: string; slug: string };
}) {
  const post = getPostBySlug(params.slug);
  if (!post) notFound();

  const allPosts = getAllPosts();
  const currentIndex = allPosts.findIndex((p) => p.slug === post.slug);
  const olderPost = allPosts[currentIndex + 1] ?? null;
  const newerPost = allPosts[currentIndex - 1] ?? null;

  const category = CATEGORIES.find((c) => c.slug === post.category);

  // Compile post content at build time.
  // Use format:'md' (plain Markdown) so that arbitrary HTML/XML in migrated
  // WordPress posts is never parsed as JSX components. No posts currently use
  // <GistEmbed> or <TweetEmbed> in their content, so MDX JSX is not needed.
  let PostContent: React.ComponentType<{ components?: Record<string, React.ComponentType<any>> }> | null = null;
  try {
    const { default: Content } = await evaluate(post.content, {
      ...(runtime as any),
      format: 'md',
      remarkPlugins: [remarkGfm],
      rehypePlugins: [[rehypePrettyCode as any, prettyCodeOptions]],
      development: false,
    });
    PostContent = Content as React.ComponentType<{ components?: Record<string, React.ComponentType<any>> }>;
  } catch (err) {
    console.error(`Failed to compile MDX for post "${post.slug}":`, err);
    PostContent = null;
  }

  // MDX component mapping — makes GistEmbed and TweetEmbed available without imports
  const mdxComponents = {
    GistEmbed,
    TweetEmbed,
  };

  return (
    <article
      className="max-w-prose mx-auto"
      data-pagefind-body
    >
      {/* ── Post header ──────────────────────────────────────────────────── */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold leading-tight mb-3">{post.title}</h1>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500 dark:text-gray-400">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span>&middot;</span>
          <span>{post.author}</span>
          {post.readingTime && (
            <>
              <span>&middot;</span>
              <span>{post.readingTime} min read</span>
            </>
          )}
          {category && (
            <>
              <span>&middot;</span>
              <Link
                href={`/category/${category.slug}/`}
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                {category.name}
              </Link>
            </>
          )}
        </div>

        {post.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Link
                key={tag}
                href={`/tag/${tag}/`}
                className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-900 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
              >
                {tag}
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* ── Post content ─────────────────────────────────────────────────── */}
      <div className="prose prose-gray dark:prose-invert max-w-none">
        {post.format === 'quote' ? (
          <QuotePost>
            {PostContent ? (
              <PostContent components={mdxComponents as any} />
            ) : (
              <p className="whitespace-pre-wrap">{post.content}</p>
            )}
          </QuotePost>
        ) : PostContent ? (
          <PostContent components={mdxComponents as any} />
        ) : (
          <p className="whitespace-pre-wrap text-sm text-gray-500">{post.content}</p>
        )}
      </div>

      {/* ── Comments ─────────────────────────────────────────────────────── */}
      {post.comments && post.comments.length > 0 && (
        <CommentList comments={post.comments} />
      )}

      {/* ── Post navigation ───────────────────────────────────────────────── */}
      <nav className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800 flex justify-between gap-4 text-sm">
        <div className="flex-1 text-left">
          {olderPost && (
            <>
              <span className="block text-gray-400 dark:text-gray-500 mb-1">&larr; Older</span>
              <Link
                href={postUrlPath(olderPost.date, olderPost.slug)}
                className="font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                {olderPost.title}
              </Link>
            </>
          )}
        </div>
        <div className="flex-1 text-right">
          {newerPost && (
            <>
              <span className="block text-gray-400 dark:text-gray-500 mb-1">Newer &rarr;</span>
              <Link
                href={postUrlPath(newerPost.date, newerPost.slug)}
                className="font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                {newerPost.title}
              </Link>
            </>
          )}
        </div>
      </nav>
    </article>
  );
}

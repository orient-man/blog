import { evaluate } from "@mdx-js/mdx";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import * as runtime from "react/jsx-runtime";
import rehypePrettyCode from "rehype-pretty-code";
import remarkGfm from "remark-gfm";

import CommentList from "@/components/CommentList";
import GiscusComments from "@/components/GiscusComments";
import GistEmbed from "@/components/GistEmbed";
import QuotePost from "@/components/QuotePost";
import { RelatedPosts } from "@/components/RelatedPosts";
import ShareButtons from "@/components/ShareButtons";
import { StarRating } from "@/components/StarRating";
import TweetEmbed from "@/components/TweetEmbed";
import { getAllPosts, getPostBySlug, getRelatedPosts } from "@/lib/content";
import { rehypeCopyButton } from "@/lib/rehype-copy-button";
import { siteConfig } from "@/lib/siteConfig";
import { CATEGORIES } from "@/lib/types";
import { formatDate, postUrlPath } from "@/lib/utils";

// ── Shared rehype-pretty-code options ─────────────────────────────────────────

const prettyCodeOptions = {
  theme: {
    dark: "github-dark",
    light: "github-light",
  },
  keepBackground: false,
};

// ── Static params ─────────────────────────────────────────────────────────────

export function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => {
    const d = new Date(post.date + "T00:00:00Z");
    return {
      year: String(d.getUTCFullYear()),
      month: String(d.getUTCMonth() + 1).padStart(2, "0"),
      day: String(d.getUTCDate()).padStart(2, "0"),
      slug: post.slug,
    };
  });
}

// ── Metadata ──────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ year: string; month: string; day: string; slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
    },
  };
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function PostPage({
  params,
}: {
  params: Promise<{ year: string; month: string; day: string; slug: string }>;
}) {
  const { year, month, day, slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const canonicalUrl = `${siteConfig.siteUrl}/${year}/${month}/${day}/${slug}/`;

  const allPosts = getAllPosts();
  const currentIndex = allPosts.findIndex((p) => p.slug === post.slug);
  const olderPost = allPosts[currentIndex + 1] ?? null;
  const newerPost = allPosts[currentIndex - 1] ?? null;

  const category = CATEGORIES.find((c) => c.slug === post.category);

  // Compile post content at build time.
  // Use format:'md' (plain Markdown) so that arbitrary HTML/XML in migrated
  // WordPress posts is never parsed as JSX components. No posts currently use
  // <GistEmbed> or <TweetEmbed> in their content, so MDX JSX is not needed.
  let PostContent: React.ComponentType<{
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    components?: Record<string, React.ComponentType<any>>;
  }> | null = null;
  try {
    const { default: Content } = await evaluate(post.content, {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ...(runtime as any),
      format: "md",
      remarkPlugins: [remarkGfm],
      rehypePlugins: [
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        [rehypePrettyCode as any, prettyCodeOptions],
        rehypeCopyButton,
      ],
      development: false,
    });
    PostContent = Content as React.ComponentType<{
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      components?: Record<string, React.ComponentType<any>>;
    }>;
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
    <article className="max-w-prose mx-auto" data-pagefind-body>
      {/* ── Post header ──────────────────────────────────────────────────── */}
      <header className="mb-8">
        <h1
          className="text-3xl font-bold font-serif leading-tight mb-3"
          data-pagefind-meta="title"
        >
          {post.title}
        </h1>

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
                className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
              >
                {category.name}
              </Link>
            </>
          )}
        </div>

        {/* Source links (external origins) */}
        {post.externalLinks && post.externalLinks.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm">
            {post.externalLinks.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
              >
                Also on {link.label} &rarr;
              </a>
            ))}
          </div>
        )}

        {post.rating != null && (
          <div className="mt-2">
            <StarRating rating={post.rating} />
          </div>
        )}

        {post.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Link
                key={tag}
                href={`/tag/${tag}/`}
                className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-brand-100 dark:hover:bg-brand-900 hover:text-brand-700 dark:hover:text-brand-300 transition-colors"
              >
                {tag}
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* ── Cover image (review posts) ───────────────────────────────── */}
      {post.coverImage && (
        <figure className="my-8 flex justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element -- static export, next/image optimisation unavailable */}
          <img
            src={post.coverImage}
            alt={post.title}
            loading="lazy"
            className="max-w-xs rounded shadow-sm"
          />
        </figure>
      )}

      {/* ── Post content ─────────────────────────────────────────────────── */}
      <div className="prose prose-gray dark:prose-invert max-w-none">
        {post.format === "quote" ? (
          <QuotePost>
            {PostContent ? (
              <PostContent
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                components={mdxComponents as any}
              />
            ) : (
              <p className="whitespace-pre-wrap">{post.content}</p>
            )}
          </QuotePost>
        ) : PostContent ? (
          <PostContent
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            components={mdxComponents as any}
          />
        ) : (
          <p className="whitespace-pre-wrap text-sm text-gray-500">
            {post.content}
          </p>
        )}
      </div>

      {/* ── Share buttons ────────────────────────────────────────────────── */}
      <div
        className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-800"
        data-pagefind-ignore
      >
        <ShareButtons url={canonicalUrl} title={post.title} />
      </div>

      {/* ── Comments ─────────────────────────────────────────────────────── */}
      {post.comments && post.comments.length > 0 ? (
        <div data-pagefind-ignore>
          <CommentList comments={post.comments} />
        </div>
      ) : (
        <div data-pagefind-ignore>
          <GiscusComments />
        </div>
      )}

      {/* ── Related Posts ──────────────────────────────────────────────────── */}
      <div data-pagefind-ignore>
        <RelatedPosts posts={getRelatedPosts(post.slug, 3)} />
      </div>

      {/* ── Post navigation ───────────────────────────────────────────────── */}
      <nav
        className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800 flex justify-between gap-4 text-sm"
        data-pagefind-ignore
      >
        <div className="flex-1 text-left">
          {olderPost && (
            <>
              <span className="block text-gray-400 dark:text-gray-500 mb-1">
                &larr; Older
              </span>
              <Link
                href={postUrlPath(olderPost.date, olderPost.slug)}
                className="font-medium hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
              >
                {olderPost.title}
              </Link>
            </>
          )}
        </div>
        <div className="flex-1 text-right">
          {newerPost && (
            <>
              <span className="block text-gray-400 dark:text-gray-500 mb-1">
                Newer &rarr;
              </span>
              <Link
                href={postUrlPath(newerPost.date, newerPost.slug)}
                className="font-medium hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
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

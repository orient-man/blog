import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import * as runtime from 'react/jsx-runtime';
import { evaluate } from '@mdx-js/mdx';
import rehypePrettyCode from 'rehype-pretty-code';
import remarkGfm from 'remark-gfm';
import { getAllPages, getPageBySlug } from '@/lib/content';

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
  return getAllPages().map((page) => ({ slug: page.slug }));
}

// ── Metadata ──────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const page = getPageBySlug(params.slug);
  if (!page) return {};
  return { title: page.title };
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function StaticPage({
  params,
}: {
  params: { slug: string };
}) {
  const page = getPageBySlug(params.slug);
  if (!page) notFound();

  // Compile page content as plain Markdown (format:'md') to avoid any
  // HTML/XML in content being treated as JSX.
  let PageContent: React.ComponentType | null = null;
  try {
    const { default: Content } = await evaluate(page.content, {
      ...(runtime as any),
      format: 'md',
      remarkPlugins: [remarkGfm],
      rehypePlugins: [[rehypePrettyCode as any, prettyCodeOptions]],
      development: false,
    });
    PageContent = Content as React.ComponentType;
  } catch (err) {
    console.error(`Failed to compile page "${page.slug}":`, err);
    PageContent = null;
  }

  return (
    <article className="max-w-prose mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold leading-tight">{page.title}</h1>
      </header>

      <div className="prose prose-gray dark:prose-invert max-w-none">
        {PageContent ? (
          <PageContent />
        ) : (
          <p className="whitespace-pre-wrap text-sm text-gray-500">{page.content}</p>
        )}
      </div>
    </article>
  );
}

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import type {
  Post,
  StaticPage,
  Tag,
  Category,
  BlogrollEntry,
  ArchiveMonth,
  CategorySlug,
  Comment,
} from './types';
import { CATEGORIES, TAG_SLUG_MAP } from './types';
import { slugify, estimateReadingTime, generateExcerpt } from './utils';

// ── Paths ─────────────────────────────────────────────────────────────────────

const POSTS_DIR = path.join(process.cwd(), 'content', 'posts');
const PAGES_DIR = path.join(process.cwd(), 'content', 'pages');
const BLOGROLL_PATH = path.join(process.cwd(), 'content', 'data', 'blogroll.json');

// ── Internal helpers ──────────────────────────────────────────────────────────

function readMdxFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.mdx') || f.endsWith('.md'))
    .map((f) => path.join(dir, f));
}

// ── Posts ─────────────────────────────────────────────────────────────────────

let _postsCache: Post[] | null = null;

function loadPosts(): Post[] {
  if (_postsCache) return _postsCache;

  const files = readMdxFiles(POSTS_DIR);
  const posts: Post[] = files.map((filePath) => {
    const raw = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(raw);

    // Resolve tag slugs to display names: frontmatter stores slugs like "fsharp"
    // or original names like "F#" — normalise to slug form for URLs.
    // Coerce to string first: YAML may parse numeric-looking tags (e.g. "2013") as numbers.
    const tagSlugs: string[] = (data.tags ?? []).map((t: unknown) => {
      const s = String(t);
      if (TAG_SLUG_MAP[s]) return TAG_SLUG_MAP[s];
      return slugify(s);
    });

    const post: Post = {
      title: data.title ?? '(Untitled)',
      // YAML may parse bare date strings (2012-02-06) as Date objects — coerce to ISO string
      date: data.date instanceof Date
        ? data.date.toISOString().slice(0, 10)
        : String(data.date ?? '1970-01-01'),
      author: data.author ?? 'Marcin Malinowski',
      category: (data.category ?? 'posts-in-english') as CategorySlug,
      tags: tagSlugs,
      format: data.format ?? 'standard',
      slug: data.slug ?? path.basename(filePath, path.extname(filePath)),
      excerpt: data.excerpt ?? generateExcerpt(content),
      wordpressUrl: data.wordpressUrl ?? '',
      comments: Array.isArray(data.comments)
        ? data.comments.map((c: Record<string, unknown>) => ({
            ...(c as unknown as Comment),
            date: c.date instanceof Date
              ? c.date.toISOString().slice(0, 10)
              : String(c.date ?? ''),
          }))
        : undefined,
      content,
      readingTime: estimateReadingTime(content),
    };
    return post;
  });

  // Sort newest-first
  posts.sort((a, b) => b.date.localeCompare(a.date));
  _postsCache = posts;
  return posts;
}

export function getAllPosts(): Post[] {
  return loadPosts();
}

export function getPostBySlug(slug: string): Post | undefined {
  return loadPosts().find((p) => p.slug === slug);
}

export function getPostsByCategory(categorySlug: CategorySlug): Post[] {
  return loadPosts().filter((p) => p.category === categorySlug);
}

export function getPostsByTag(tagSlug: string): Post[] {
  return loadPosts().filter((p) => p.tags.includes(tagSlug));
}

export function getPostsByMonth(year: number, month: number): Post[] {
  const prefix = `${year}-${String(month).padStart(2, '0')}`;
  return loadPosts().filter((p) => p.date.startsWith(prefix));
}

// ── Tags ──────────────────────────────────────────────────────────────────────

let _tagsCache: Tag[] | null = null;

export function getAllTags(): Tag[] {
  if (_tagsCache) return _tagsCache;

  // Reverse map: slug → display name
  const slugToName: Record<string, string> = {};
  // Build reverse from TAG_SLUG_MAP
  for (const [name, slug] of Object.entries(TAG_SLUG_MAP)) {
    slugToName[slug] = name;
  }

  const counts: Record<string, number> = {};
  for (const post of loadPosts()) {
    for (const slug of post.tags) {
      counts[slug] = (counts[slug] ?? 0) + 1;
    }
  }

  _tagsCache = Object.entries(counts).map(([slug, count]) => ({
    slug,
    name: slugToName[slug] ?? slug, // Fall back to slug if no display name
    count,
  }));

  // Sort by count descending, then alphabetically
  _tagsCache.sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
  return _tagsCache;
}

// ── Categories ────────────────────────────────────────────────────────────────

export function getAllCategories(): Category[] {
  return CATEGORIES;
}

// ── Archive months ────────────────────────────────────────────────────────────

let _archiveCache: ArchiveMonth[] | null = null;

export function getArchiveMonths(): ArchiveMonth[] {
  if (_archiveCache) return _archiveCache;

  const counts: Record<string, number> = {};
  for (const post of loadPosts()) {
    const key = post.date.slice(0, 7); // "YYYY-MM"
    counts[key] = (counts[key] ?? 0) + 1;
  }

  _archiveCache = Object.entries(counts)
    .map(([key, count]) => {
      const [y, m] = key.split('-');
      return { year: Number(y), month: Number(m), count };
    })
    .sort((a, b) => b.year - a.year || b.month - a.month);

  return _archiveCache;
}

// ── Static pages ──────────────────────────────────────────────────────────────

let _pagesCache: StaticPage[] | null = null;

export function getAllPages(): StaticPage[] {
  if (_pagesCache) return _pagesCache;

  const files = readMdxFiles(PAGES_DIR);
  _pagesCache = files.map((filePath) => {
    const raw = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(raw);
    return {
      title: data.title ?? '(Untitled)',
      slug: data.slug ?? path.basename(filePath, path.extname(filePath)),
      content,
    };
  });

  return _pagesCache;
}

export function getPageBySlug(slug: string): StaticPage | undefined {
  return getAllPages().find((p) => p.slug === slug);
}

// ── Blogroll ──────────────────────────────────────────────────────────────────

let _blogrollCache: BlogrollEntry[] | null = null;

export function getBlogroll(): BlogrollEntry[] {
  if (_blogrollCache) return _blogrollCache;
  if (!fs.existsSync(BLOGROLL_PATH)) return [];
  const raw = fs.readFileSync(BLOGROLL_PATH, 'utf8');
  _blogrollCache = JSON.parse(raw) as BlogrollEntry[];
  return _blogrollCache;
}

import fs from "fs";
import path from "path";

import matter from "gray-matter";

import { siteConfig } from "./siteConfig";
import type {
  Post,
  StaticPage,
  Tag,
  Category,
  BlogrollEntry,
  ArchiveMonth,
  CategorySlug,
  Comment,
  CurrentlyReadingData,
} from "./types";
import { CATEGORIES } from "./types";
import {
  slugify,
  estimateReadingTime,
  generateExcerpt,
  generateHtmlExcerpt,
} from "./utils";

// ── Paths ─────────────────────────────────────────────────────────────────────

const POSTS_DIR = path.join(process.cwd(), "content", "posts");
const PAGES_DIR = path.join(process.cwd(), "content", "pages");
const BLOGROLL_PATH = path.join(
  process.cwd(),
  "content",
  "data",
  "blogroll.json",
);
const CURRENTLY_READING_PATH = path.join(
  process.cwd(),
  "content",
  "data",
  "currently-reading.json",
);

// ── Internal helpers ──────────────────────────────────────────────────────────

function readMdxFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"))
    .map((f) => path.join(dir, f));
}

// ── Posts ─────────────────────────────────────────────────────────────────────

let _postsCache: Post[] | null = null;

function loadPosts(): Post[] {
  if (_postsCache) return _postsCache;

  const files = readMdxFiles(POSTS_DIR);
  const posts: Post[] = files.map((filePath) => {
    const raw = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(raw);

    // Normalise frontmatter tags to slug form.
    // Coerce to string first: YAML may parse numeric-looking tags (e.g. "2013") as numbers.
    const tagSlugs: string[] = (data.tags ?? []).map((t: unknown) => {
      return slugify(String(t));
    });

    const post: Post = {
      title: data.title ?? "(Untitled)",
      // YAML may parse bare date strings (2012-02-06) as Date objects — coerce to ISO string
      date:
        data.date instanceof Date
          ? data.date.toISOString().slice(0, 10)
          : String(data.date ?? "1970-01-01"),
      author: data.author ?? siteConfig.author,
      category: (data.category ?? "posts-in-english") as CategorySlug,
      tags: tagSlugs,
      format: data.format ?? "standard",
      slug: data.slug ?? path.basename(filePath, path.extname(filePath)),
      excerpt: data.excerpt ?? generateExcerpt(content),
      htmlExcerpt: generateHtmlExcerpt(raw),
      wordpressUrl: data.wordpressUrl ?? "",
      externalLinks: Array.isArray(data.externalLinks)
        ? (data.externalLinks as { label: string; url: string }[])
        : undefined,
      coverImage: data.coverImage ? String(data.coverImage) : undefined,
      coverSize: data.coverSize === "full" ? "full" : undefined,
      rating: data.rating != null ? Number(data.rating) : undefined,
      comments: Array.isArray(data.comments)
        ? data.comments.map((c: Record<string, unknown>) => ({
            ...(c as unknown as Comment),
            date:
              c.date instanceof Date
                ? c.date.toISOString().slice(0, 10)
                : String(c.date ?? ""),
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
  const prefix = `${year}-${String(month).padStart(2, "0")}`;
  return loadPosts().filter((p) => p.date.startsWith(prefix));
}

// ── Related posts ─────────────────────────────────────────────────────────────

export function getRelatedPosts(slug: string, count: number = 3): Post[] {
  const allPosts = loadPosts();
  const current = allPosts.find((p) => p.slug === slug);
  if (!current || current.tags.length === 0) return [];

  const currentTagSet = new Set(current.tags);

  const scored = allPosts
    .filter((p) => p.slug !== slug)
    .map((candidate) => {
      // Score = number of shared tags
      let score = candidate.tags.filter((t) => currentTagSet.has(t)).length;
      if (score === 0) return null;

      // +0.5 bonus for same category
      if (candidate.category === current.category) {
        score += 0.5;
      }

      return { post: candidate, score };
    })
    .filter((entry): entry is { post: Post; score: number } => entry !== null);

  // Sort by score descending, then by date descending (recency tiebreak)
  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return b.post.date.localeCompare(a.post.date);
  });

  return scored.slice(0, count).map((entry) => entry.post);
}

// ── Tags ──────────────────────────────────────────────────────────────────────

let _tagsCache: Tag[] | null = null;

export function getAllTags(): Tag[] {
  if (_tagsCache) return _tagsCache;

  const counts: Record<string, number> = {};
  for (const post of loadPosts()) {
    for (const slug of post.tags) {
      counts[slug] = (counts[slug] ?? 0) + 1;
    }
  }

  _tagsCache = Object.entries(counts).map(([slug, count]) => ({
    slug,
    name: slug,
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
      const [y, m] = key.split("-");
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
    const raw = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(raw);
    return {
      title: data.title ?? "(Untitled)",
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
  const raw = fs.readFileSync(BLOGROLL_PATH, "utf8");
  _blogrollCache = JSON.parse(raw) as BlogrollEntry[];
  return _blogrollCache;
}

// ── Currently Reading ─────────────────────────────────────────────────────────

const EMPTY_CURRENTLY_READING: CurrentlyReadingData = {
  books: [],
  shelfUrl: "",
  fetchedAt: "",
};

let _currentlyReadingCache: CurrentlyReadingData | null = null;

export function getCurrentlyReading(): CurrentlyReadingData {
  if (_currentlyReadingCache) return _currentlyReadingCache;
  if (!fs.existsSync(CURRENTLY_READING_PATH)) return EMPTY_CURRENTLY_READING;
  const raw = fs.readFileSync(CURRENTLY_READING_PATH, "utf8");
  _currentlyReadingCache = JSON.parse(raw) as CurrentlyReadingData;
  return _currentlyReadingCache;
}

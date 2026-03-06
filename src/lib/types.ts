// ── Category ─────────────────────────────────────────────────────────────────

export type CategorySlug = "posts-in-english" | "wpisy-po-polsku";

export interface Category {
  slug: CategorySlug;
  name: string;
  description?: string;
}

export const CATEGORIES: Category[] = [
  {
    slug: "posts-in-english",
    name: "Posts In English (Wpisy po angielsku)",
  },
  {
    slug: "wpisy-po-polsku",
    name: "Wpisy po polsku (Posts In Polish)",
  },
];

// ── Tag ───────────────────────────────────────────────────────────────────────

export interface Tag {
  slug: string;
  name: string;
  count: number;
}

// ── Comment ───────────────────────────────────────────────────────────────────

export interface Comment {
  author: string;
  date: string; // ISO 8601 datetime string
  content: string; // Plain text or simple HTML
  avatarUrl?: string;
}

// ── Post ──────────────────────────────────────────────────────────────────────

export interface Post {
  // Frontmatter fields
  title: string;
  date: string; // ISO 8601 date string
  author: string;
  category: CategorySlug;
  tags: string[];
  format: "standard" | "quote";
  slug: string;
  excerpt?: string;
  htmlExcerpt?: string;
  wordpressUrl: string;
  linkedinUrl?: string;
  librarythingUrl?: string;
  rating?: number;
  comments?: Comment[];

  // Computed at load time
  content: string; // Raw MDX string
  readingTime?: number; // Estimated minutes
}

// ── Static Page ───────────────────────────────────────────────────────────────

export interface StaticPage {
  title: string;
  slug: string;
  content: string; // Raw MDX string
}

// ── Blogroll Entry ────────────────────────────────────────────────────────────

export interface BlogrollEntry {
  name: string;
  url: string;
}

// ── Archive Month ─────────────────────────────────────────────────────────────

export interface ArchiveMonth {
  year: number;
  month: number;
  count: number;
}

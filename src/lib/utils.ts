import { TAG_SLUG_MAP } from './types';

// ── Date formatting ───────────────────────────────────────────────────────────

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

/**
 * Format an ISO 8601 date string to a human-readable form.
 * e.g. "2017-08-15" → "August 15, 2017"
 */
export function formatDate(isoDate: string): string {
  const d = new Date(isoDate + 'T00:00:00Z');
  return `${MONTH_NAMES[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
}

/**
 * Format an ISO 8601 date to "Month Year".
 * e.g. "2017-08" → "August 2017"
 */
export function formatMonthYear(year: number, month: number): string {
  return `${MONTH_NAMES[month - 1]} ${year}`;
}

// ── Slug generation ───────────────────────────────────────────────────────────

/**
 * Convert a display name to a URL-safe slug.
 * Consults TAG_SLUG_MAP first; falls back to lower-case + hyphenation.
 */
export function slugify(name: string): string {
  if (TAG_SLUG_MAP[name]) return TAG_SLUG_MAP[name];
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// ── Reading time ──────────────────────────────────────────────────────────────

const WORDS_PER_MINUTE = 200;

/**
 * Estimate reading time in minutes from raw content text.
 * Minimum 1 minute.
 */
export function estimateReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}

// ── Excerpt generation ────────────────────────────────────────────────────────

/**
 * Generate a plain-text excerpt from raw MDX/Markdown content.
 * Strips Markdown syntax, frontmatter delimiters, and JSX tags,
 * then truncates to `maxLength` characters (default 160).
 */
export function generateExcerpt(content: string, maxLength = 160): string {
  const stripped = content
    // Remove frontmatter
    .replace(/^---[\s\S]*?---\n?/, '')
    // Remove JSX/HTML tags
    .replace(/<[^>]+>/g, '')
    // Remove MDX component usage like <GistEmbed id="..." />
    .replace(/^<\w[^>]*\/>$/gm, '')
    // Remove Markdown headings
    .replace(/^#{1,6}\s+/gm, '')
    // Remove bold/italic
    .replace(/\*{1,2}([^*]+)\*{1,2}/g, '$1')
    // Remove inline code
    .replace(/`[^`]+`/g, '')
    // Remove code fences
    .replace(/```[\s\S]*?```/g, '')
    // Remove links — keep text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Collapse whitespace
    .replace(/\s+/g, ' ')
    .trim();

  if (stripped.length <= maxLength) return stripped;
  const cut = stripped.lastIndexOf(' ', maxLength);
  return stripped.slice(0, cut > 0 ? cut : maxLength) + '…';
}

// ── URL helpers ───────────────────────────────────────────────────────────────

/**
 * Build the canonical post URL path from a post's date and slug.
 * e.g. date="2017-08-15", slug="my-post" → "/2017/08/15/my-post/"
 */
export function postUrlPath(date: string, slug: string): string {
  const d = new Date(date + 'T00:00:00Z');
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `/${y}/${m}/${day}/${slug}/`;
}

/**
 * Zero-pad a number to two digits.
 */
export function pad2(n: number): string {
  return String(n).padStart(2, '0');
}

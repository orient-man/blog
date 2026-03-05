import { toHtml } from "hast-util-to-html";
import type { Root, RootContent } from "mdast";
import { toString as mdastToString } from "mdast-util-to-string";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

// ── Date formatting ───────────────────────────────────────────────────────────

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/**
 * Format an ISO 8601 date string to a human-readable form.
 * e.g. "2017-08-15" → "August 15, 2017"
 */
export function formatDate(isoDate: string): string {
  const d = new Date(isoDate + "T00:00:00Z");
  return `${MONTH_NAMES[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
}

/**
 * Format an ISO 8601 datetime string to a human-readable form with time.
 * e.g. "2013-09-25T12:27:01" → "September 25, 2013 at 12:27 PM"
 * Falls back gracefully for date-only strings (shows midnight time).
 */
export function formatDateTime(isoDateTime: string): string {
  const normalized = isoDateTime.includes("T")
    ? isoDateTime + "Z"
    : isoDateTime + "T00:00:00Z";
  const d = new Date(normalized);
  const hours = d.getUTCHours();
  const minutes = d.getUTCMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  const h = hours % 12 || 12;
  const mm = String(minutes).padStart(2, "0");
  return `${MONTH_NAMES[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()} at ${h}:${mm} ${ampm}`;
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
 * Lower-cases the input, replaces non-alphanumeric runs with hyphens,
 * and trims leading/trailing hyphens.
 */
export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
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
 * then truncates to `maxLength` characters (default 500).
 */
export function generateExcerpt(content: string, maxLength = 500): string {
  const stripped = content
    // Remove frontmatter
    .replace(/^---[\s\S]*?---\n?/, "")
    // Remove JSX/HTML tags
    .replace(/<[^>]+>/g, "")
    // Remove MDX component usage like <GistEmbed id="..." />
    .replace(/^<\w[^>]*\/>$/gm, "")
    // Remove Markdown headings
    .replace(/^#{1,6}\s+/gm, "")
    // Remove bold/italic
    .replace(/\*{1,2}([^*]+)\*{1,2}/g, "$1")
    // Remove inline code
    .replace(/`[^`]+`/g, "")
    // Remove code fences
    .replace(/```[\s\S]*?```/g, "")
    // Remove links — keep text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    // Collapse whitespace
    .replace(/\s+/g, " ")
    .trim();

  if (stripped.length <= maxLength) return stripped;
  const cut = stripped.lastIndexOf(" ", maxLength);
  return stripped.slice(0, cut > 0 ? cut : maxLength) + "…";
}

// ── HTML excerpt generation ───────────────────────────────────────────────

/**
 * Strip YAML frontmatter (`---...---`) from raw file content.
 * `gray-matter` does this when parsing metadata, but `post.content`
 * in the codebase is the raw file string and may still include it.
 */
function stripFrontmatter(raw: string): string {
  return raw.replace(/^---[\s\S]*?---\n?/, "");
}

/**
 * Custom remark plugin that transforms the mdast for excerpt extraction:
 * - Keep paragraphs, blockquotes, lists (count text toward ~maxLen limit).
 * - Replace code fences with a `...` placeholder paragraph (collapse consecutive).
 * - Strip headings, images, HTML, JSX, and thematic breaks.
 * - Stop collecting once accumulated text length >= maxLen.
 * - Truncate the last node at a word boundary if it pushes over the limit.
 */
function remarkExcerptTransform(maxLen: number) {
  return () => (tree: Root) => {
    const kept: RootContent[] = [];
    let textLen = 0;
    let lastWasPlaceholder = false;

    for (const node of tree.children) {
      if (textLen >= maxLen) break;

      // Strip these node types entirely
      if (
        node.type === "heading" ||
        node.type === "html" ||
        node.type === "thematicBreak" ||
        node.type === "mdxJsxFlowElement"
      ) {
        lastWasPlaceholder = false;
        continue;
      }

      // Strip image-only paragraphs (a paragraph whose sole child is an image)
      if (node.type === "paragraph") {
        const children = (
          node as { children: Array<{ type: string }> }
        ).children.filter((c) => c.type !== "image");
        if (children.length === 0) {
          lastWasPlaceholder = false;
          continue;
        }
        // Remove inline images from paragraph children
        (node as { children: Array<{ type: string }> }).children = children;
      }

      // Replace code blocks with `...` placeholder, collapse consecutive
      if (node.type === "code") {
        if (!lastWasPlaceholder) {
          kept.push({
            type: "paragraph",
            children: [{ type: "text", value: "\u2026" }],
          } as RootContent);
          lastWasPlaceholder = true;
        }
        continue;
      }

      lastWasPlaceholder = false;

      // Kept node types: paragraph, blockquote, list
      const nodeText = mdastToString(node);
      textLen += nodeText.length;
      kept.push(node);

      // If we've exceeded the limit, truncate the last text in this node
      if (textLen > maxLen) {
        truncateNode(node, textLen - maxLen);
      }
    }

    tree.children = kept;
  };
}

/**
 * Recursively find the last text node in a subtree and truncate it
 * at a word boundary, removing `excessChars` characters and appending `...`.
 */
function truncateNode(node: RootContent, excessChars: number): void {
  if (node.type === "text") {
    const text = (node as { value: string }).value;
    const target = text.length - excessChars;
    if (target <= 0) {
      (node as { value: string }).value = "\u2026";
      return;
    }
    const cut = text.lastIndexOf(" ", target);
    (node as { value: string }).value =
      text.slice(0, cut > 0 ? cut : target) + "\u2026";
    return;
  }

  // Recurse into children (paragraph, blockquote, list, listItem, etc.)
  const children = (node as { children?: RootContent[] }).children;
  if (children && children.length > 0) {
    truncateNode(children[children.length - 1], excessChars);
  }
}

/**
 * Generate an HTML excerpt from raw MDX/Markdown content.
 * Uses a unified/remark pipeline to produce formatted HTML preserving
 * inline formatting (bold, italic, strikethrough, links, inline code)
 * and blockquote structure. Code fences are replaced with `...`.
 */
export function generateHtmlExcerpt(
  rawContent: string,
  maxLength = 500,
): string {
  const content = stripFrontmatter(rawContent);

  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkExcerptTransform(maxLength))
    .use(remarkRehype);

  const mdast = processor.parse(content);
  const hast = processor.runSync(mdast);
  return toHtml(hast);
}

// ── Tag font sizing ───────────────────────────────────────────────────────

/**
 * Compute a proportional font size for a tag based on its post count.
 * Uses a logarithmic scale (matching WordPress wp_tag_cloud behavior)
 * to spread mid-range tags visually while compressing the high end.
 *
 * When all tags have the same count, returns the midpoint size.
 *
 * @returns Font size in rem units.
 */
export function tagFontSize(
  count: number,
  minCount: number,
  maxCount: number,
  minSize = 0.75,
  maxSize = 1.5,
): number {
  if (minCount === maxCount) return (minSize + maxSize) / 2;
  const ratio =
    (Math.log(count) - Math.log(minCount)) /
    (Math.log(maxCount) - Math.log(minCount));
  return minSize + ratio * (maxSize - minSize);
}

// ── URL helpers ───────────────────────────────────────────────────────────────

/**
 * Build the canonical post URL path from a post's date and slug.
 * e.g. date="2017-08-15", slug="my-post" → "/2017/08/15/my-post/"
 */
export function postUrlPath(date: string, slug: string): string {
  const d = new Date(date + "T00:00:00Z");
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `/${y}/${m}/${day}/${slug}/`;
}

/**
 * Zero-pad a number to two digits.
 */
export function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

#!/usr/bin/env tsx
/**
 * scripts/import-goodreads.ts
 *
 * Fetches the Goodreads public RSS feed, matches entries to existing
 * book-review MDX posts, and injects Goodreads URLs into the
 * `externalLinks` frontmatter array.
 *
 * Usage:
 *   npx tsx scripts/import-goodreads.ts
 *   npx tsx scripts/import-goodreads.ts --dry-run
 */

import fs from "fs";
import path from "path";

import matter from "gray-matter";

// ── Constants ────────────────────────────────────────────────────────────────

const RSS_BASE =
  "https://www.goodreads.com/review/list_rss/13930842?shelf=read";
const POSTS_DIR = path.join(process.cwd(), "content", "posts");
const DRY_RUN = process.argv.includes("--dry-run");

/**
 * Manual override map: post slug → Goodreads book_id.
 * Used when automatic title/author matching fails due to language
 * differences, series annotations, or ALL CAPS titles in the RSS feed.
 */
const MANUAL_OVERRIDES: Record<string, string> = {
  // Goodreads title: "The Gifts of Imperfection" — post title matches directly
  // Add overrides here as: "post-slug": "goodreads_book_id"
};

// ── Types ────────────────────────────────────────────────────────────────────

interface GoodreadsItem {
  bookId: string;
  reviewUrl: string; // https://www.goodreads.com/review/show/{review_id}
  title: string;
  authorName: string;
  userReadAt: string; // ISO date or empty
}

interface ReviewPost {
  filePath: string;
  slug: string;
  rawTitle: string; // full frontmatter title
  bookTitle: string; // parsed book title (without author)
  authorName: string; // parsed author name
  date: string; // frontmatter date (YYYY-MM-DD)
  hasGoodreads: boolean; // already has a Goodreads externalLink
}

// ── RSS Fetching & Parsing ───────────────────────────────────────────────────

/**
 * Fetch all pages of the Goodreads RSS feed.
 */
async function fetchAllRssItems(): Promise<GoodreadsItem[]> {
  const allItems: GoodreadsItem[] = [];
  let page = 1;

  while (true) {
    const url = `${RSS_BASE}&page=${page}`;
    console.log(`Fetching RSS page ${page}...`);

    const response = await fetch(url, {
      headers: { "User-Agent": "orientman-blog-goodreads-import/1.0" },
    });

    if (!response.ok) {
      throw new Error(`RSS fetch failed: HTTP ${response.status} for ${url}`);
    }

    const xml = await response.text();
    const items = parseRssItems(xml);

    if (items.length === 0) {
      console.log(`  Page ${page}: 0 items — stopping pagination.`);
      break;
    }

    console.log(`  Page ${page}: ${items.length} items`);
    allItems.push(...items);
    page++;
  }

  return allItems;
}

/**
 * Parse RSS XML into GoodreadsItem[].
 * Uses simple regex-based extraction (no XML library dependency).
 */
function parseRssItems(xml: string): GoodreadsItem[] {
  const items: GoodreadsItem[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;

  while ((match = itemRegex.exec(xml)) !== null) {
    const itemXml = match[1];

    const bookId = extractTag(itemXml, "book_id");
    const title = extractTag(itemXml, "title");
    const authorName = extractTag(itemXml, "author_name");
    const userReadAt = extractTag(itemXml, "user_read_at");
    const rawLink = extractTag(itemXml, "link");

    if (!bookId || !title) continue;

    // <link> contains the review URL with UTM params — strip them
    const reviewUrl = stripCdata(rawLink)
      .replace(/\?utm_medium=.*$/, "")
      .trim();

    items.push({
      bookId,
      reviewUrl,
      title: stripCdata(title),
      authorName: stripCdata(authorName),
      userReadAt: parseGoodreadsDate(stripCdata(userReadAt)),
    });
  }

  return items;
}

/**
 * Extract a single XML tag's content. Handles CDATA.
 */
function extractTag(xml: string, tag: string): string {
  const regex = new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`);
  const match = xml.match(regex);
  return match ? match[1].trim() : "";
}

/**
 * Strip CDATA wrappers.
 */
function stripCdata(text: string): string {
  return text
    .replace(/^\s*<!\[CDATA\[/, "")
    .replace(/\]\]>\s*$/, "")
    .trim();
}

/**
 * Parse Goodreads date format "Wed, 25 Feb 2026 00:00:00 +0000" → "2026-02-25"
 */
function parseGoodreadsDate(dateStr: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

// ── Normalisation ────────────────────────────────────────────────────────────

const DIACRITICS: Record<string, string> = {
  ą: "a",
  ć: "c",
  ę: "e",
  ł: "l",
  ń: "n",
  ó: "o",
  ś: "s",
  ź: "z",
  ż: "z",
  é: "e",
  è: "e",
  ê: "e",
  ë: "e",
  à: "a",
  â: "a",
  ä: "a",
  î: "i",
  ï: "i",
  ô: "o",
  ö: "o",
  ù: "u",
  û: "u",
  ü: "u",
  ç: "c",
};

function stripDiacritics(text: string): string {
  return text.replace(
    /[ąćęłńóśźżéèêëàâäîïôöùûüç]/g,
    (ch) => DIACRITICS[ch] ?? ch,
  );
}

/**
 * Normalize a title for comparison:
 * - lowercase
 * - strip diacritics
 * - strip punctuation
 * - strip series annotations like "(Orlęta i orły, #1)"
 * - collapse whitespace
 */
function normalizeTitle(title: string): string {
  let t = title.toLowerCase();
  // Remove series annotations in parens, e.g. "(Orlęta i orły, #1)"
  t = t.replace(/\s*\([^)]*#\d+\)\s*/g, " ");
  t = stripDiacritics(t);
  // Remove all punctuation except spaces
  t = t.replace(/[^a-z0-9\s]/g, "");
  // Collapse whitespace
  t = t.replace(/\s+/g, " ").trim();
  return t;
}

// ── Post Loading ─────────────────────────────────────────────────────────────

/**
 * Parse the frontmatter title into book title and author.
 * Format: '"Book Title" - Author Name' or '"Book Title"'
 */
function parseTitleAndAuthor(rawTitle: string): {
  bookTitle: string;
  author: string;
} {
  const match = rawTitle.match(/^[""\u201C](.+?)[""\u201D]\s*[-–—]\s*(.+)$/);
  if (match) {
    return { bookTitle: match[1].trim(), author: match[2].trim() };
  }
  const titleOnly = rawTitle.replace(/^[""\u201C]|[""\u201D]$/g, "").trim();
  return { bookTitle: titleOnly, author: "" };
}

/**
 * Load all book review posts (those with a LibraryThing externalLink).
 */
function loadReviewPosts(): ReviewPost[] {
  const files = fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"))
    .map((f) => path.join(POSTS_DIR, f));

  const posts: ReviewPost[] = [];

  for (const filePath of files) {
    const raw = fs.readFileSync(filePath, "utf8");
    const { data } = matter(raw);

    // Only process posts with externalLinks containing LibraryThing
    const externalLinks: { label: string; url: string }[] =
      data.externalLinks ?? [];
    const hasLibraryThing = externalLinks.some(
      (l) => l.label === "LibraryThing",
    );
    if (!hasLibraryThing) continue;

    const slug = data.slug || path.basename(filePath, path.extname(filePath));
    const rawTitle = String(data.title || "");
    const { bookTitle, author } = parseTitleAndAuthor(rawTitle);
    const date = data.date
      ? new Date(data.date).toISOString().slice(0, 10)
      : "";
    const hasGoodreads = externalLinks.some((l) => l.label === "Goodreads");

    posts.push({
      filePath,
      slug,
      rawTitle,
      bookTitle,
      authorName: author,
      date,
      hasGoodreads,
    });
  }

  return posts;
}

// ── Matching ─────────────────────────────────────────────────────────────────

interface MatchResult {
  post: ReviewPost;
  item: GoodreadsItem;
  method: "override" | "title" | "author-date";
}

/**
 * Normalize an author name for comparison (lowercase, strip diacritics, first+last only).
 */
function normalizeAuthor(name: string): string {
  let n = name.toLowerCase().trim();
  n = stripDiacritics(n);
  n = n.replace(/[^a-z\s]/g, "");
  n = n.replace(/\s+/g, " ").trim();
  return n;
}

/**
 * Check if two author names likely refer to the same person.
 * Compares last name exactly, first name by prefix (handles initials).
 */
function authorsMatch(postAuthor: string, grAuthor: string): boolean {
  const a = normalizeAuthor(postAuthor);
  const b = normalizeAuthor(grAuthor);
  if (a === b) return true;

  // Split into parts; compare last name exactly
  const aParts = a.split(" ");
  const bParts = b.split(" ");
  if (aParts.length < 2 || bParts.length < 2) return false;

  const aLast = aParts[aParts.length - 1];
  const bLast = bParts[bParts.length - 1];
  if (aLast !== bLast) return false;

  // First name: one must start with the other (handles "w.g." vs "winfried")
  const aFirst = aParts.slice(0, -1).join(" ");
  const bFirst = bParts.slice(0, -1).join(" ");
  if (aFirst.startsWith(bFirst) || bFirst.startsWith(aFirst)) return true;

  return false;
}

/**
 * Check if two dates are within 365 days of each other.
 */
function datesAreClose(d1: string, d2: string, maxDays = 365): boolean {
  if (!d1 || !d2) return false;
  const diff = Math.abs(new Date(d1).getTime() - new Date(d2).getTime());
  return diff <= maxDays * 86400000;
}

/**
 * Two-pass matching plus manual overrides.
 */
function matchItems(
  posts: ReviewPost[],
  items: GoodreadsItem[],
): { matched: MatchResult[]; unmatched: GoodreadsItem[] } {
  const matched: MatchResult[] = [];
  const unmatchedPosts = new Set(posts.map((_, i) => i));
  const unmatchedItems = new Set(items.map((_, i) => i));

  // Pass 0: Manual overrides (slug → book_id)
  for (const [slug, bookId] of Object.entries(MANUAL_OVERRIDES)) {
    const postIdx = posts.findIndex((p) => p.slug === slug);
    const itemIdx = items.findIndex((i) => i.bookId === bookId);
    if (postIdx >= 0 && itemIdx >= 0 && unmatchedPosts.has(postIdx)) {
      matched.push({
        post: posts[postIdx],
        item: items[itemIdx],
        method: "override",
      });
      unmatchedPosts.delete(postIdx);
      unmatchedItems.delete(itemIdx);
    }
  }

  // Pass 1: Normalized title matching
  // Build a lookup from normalized title → item index
  const titleToItems = new Map<string, number[]>();
  for (const itemIdx of unmatchedItems) {
    const norm = normalizeTitle(items[itemIdx].title);
    const list = titleToItems.get(norm) ?? [];
    list.push(itemIdx);
    titleToItems.set(norm, list);
  }

  for (const postIdx of [...unmatchedPosts]) {
    const post = posts[postIdx];
    const normBookTitle = normalizeTitle(post.bookTitle);

    // Try exact normalized title match
    const candidates = titleToItems.get(normBookTitle);
    if (candidates && candidates.length > 0) {
      // Pick the first unmatched candidate
      const itemIdx = candidates.find((i) => unmatchedItems.has(i));
      if (itemIdx !== undefined) {
        matched.push({
          post,
          item: items[itemIdx],
          method: "title",
        });
        unmatchedPosts.delete(postIdx);
        unmatchedItems.delete(itemIdx);
        continue;
      }
    }

    // Also try: see if any RSS title *contains* the post book title or vice versa
    for (const itemIdx of unmatchedItems) {
      const normItemTitle = normalizeTitle(items[itemIdx].title);
      if (
        normItemTitle.includes(normBookTitle) ||
        normBookTitle.includes(normItemTitle)
      ) {
        matched.push({
          post,
          item: items[itemIdx],
          method: "title",
        });
        unmatchedPosts.delete(postIdx);
        unmatchedItems.delete(itemIdx);
        break;
      }
    }
  }

  // Pass 2: Author + date proximity fallback
  for (const postIdx of [...unmatchedPosts]) {
    const post = posts[postIdx];
    let bestItemIdx: number | null = null;
    let bestDateDiff = Infinity;

    for (const itemIdx of unmatchedItems) {
      const item = items[itemIdx];
      if (!authorsMatch(post.authorName, item.authorName)) continue;
      if (!datesAreClose(post.date, item.userReadAt)) continue;

      const diff = Math.abs(
        new Date(post.date).getTime() - new Date(item.userReadAt).getTime(),
      );
      if (diff < bestDateDiff) {
        bestDateDiff = diff;
        bestItemIdx = itemIdx;
      }
    }

    if (bestItemIdx !== null) {
      matched.push({
        post,
        item: items[bestItemIdx],
        method: "author-date",
      });
      unmatchedPosts.delete(postIdx);
      unmatchedItems.delete(bestItemIdx);
    }
  }

  // Collect unmatched items that have no corresponding post
  // (Many Goodreads books won't have blog posts — that's expected)
  const unmatchedItemsList = [...unmatchedItems].map((i) => items[i]);

  // Log unmatched *posts* (these are the ones we care about)
  for (const postIdx of unmatchedPosts) {
    const post = posts[postIdx];
    console.warn(
      `  [warn] No Goodreads match for post: "${post.rawTitle}" (slug: ${post.slug})`,
    );
  }

  return { matched, unmatched: unmatchedItemsList };
}

// ── Frontmatter Injection ────────────────────────────────────────────────────

/**
 * Add a Goodreads externalLink entry to a post's frontmatter.
 * Uses targeted text replacement to preserve exact file formatting.
 */
function injectGoodreadsLink(filePath: string, goodreadsUrl: string): boolean {
  const raw = fs.readFileSync(filePath, "utf8");

  // Check if already has Goodreads link (idempotency)
  if (raw.includes(goodreadsUrl)) return false;

  // Find the externalLinks block and append the Goodreads entry
  // The externalLinks block looks like:
  //   externalLinks:
  //     - label: "LibraryThing"
  //       url: https://...
  // We need to insert after the last entry in the array (before `category:`)
  const newEntry = `  - label: "Goodreads"\n    url: ${goodreadsUrl}`;

  // Strategy: insert the new entry before the `category:` line
  // (which comes right after the externalLinks block)
  const modified = raw.replace(/^(category:)/m, `${newEntry}\n$1`);

  if (modified === raw) {
    console.warn(
      `  [warn] Could not inject Goodreads link into ${path.basename(filePath)}`,
    );
    return false;
  }

  if (!DRY_RUN) {
    fs.writeFileSync(filePath, modified, "utf8");
  }
  return true;
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("=== Goodreads Import Script ===\n");

  if (DRY_RUN) console.log("(--dry-run: no files will be written)\n");

  // 1. Fetch RSS feed
  const rssItems = await fetchAllRssItems();
  console.log(`\nTotal RSS items fetched: ${rssItems.length}\n`);

  // 2. Load review posts
  const posts = loadReviewPosts();
  console.log(`Book review posts found: ${posts.length}\n`);

  // 3. Match
  console.log("Matching Goodreads items to posts...\n");
  const { matched } = matchItems(posts, rssItems);

  // 4. Inject URLs
  let injected = 0;
  let skipped = 0;

  console.log("\nInjecting Goodreads URLs:\n");

  for (const { post, item, method } of matched) {
    const goodreadsUrl = item.reviewUrl;
    const fileName = path.basename(post.filePath);

    if (post.hasGoodreads) {
      console.log(`  [skip] ${fileName} — already has Goodreads link`);
      skipped++;
      continue;
    }

    const ok = injectGoodreadsLink(post.filePath, goodreadsUrl);
    if (ok) {
      console.log(
        `  [ok] ${fileName} ← ${goodreadsUrl} (matched by ${method}: "${item.title}")`,
      );
      injected++;
    } else {
      console.log(
        `  [skip] ${fileName} — URL already present or injection failed`,
      );
      skipped++;
    }
  }

  // 5. Summary
  const unmatchedPosts = posts.filter(
    (p) => !matched.some((m) => m.post.slug === p.slug) && !p.hasGoodreads,
  );

  console.log(`\n${"─".repeat(60)}`);
  console.log("Summary:");
  console.log(`  RSS items fetched:  ${rssItems.length}`);
  console.log(`  Review posts:       ${posts.length}`);
  console.log(`  Matched:            ${matched.length}`);
  console.log(`  Injected:           ${injected}`);
  console.log(`  Skipped (present):  ${skipped}`);
  console.log(`  Unmatched posts:    ${unmatchedPosts.length}`);

  if (unmatchedPosts.length > 0) {
    console.log("\nUnmatched posts (need manual override):");
    for (const p of unmatchedPosts) {
      console.log(`  - ${p.slug}: "${p.rawTitle}"`);
    }
  }

  if (DRY_RUN) console.log("\n(--dry-run: no files were written)");
}

main().catch((err) => {
  console.error("Unexpected error:", err);
  process.exit(1);
});

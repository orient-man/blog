#!/usr/bin/env tsx
/**
 * scripts/import-covers.ts
 *
 * One-time migration script: downloads book cover images for review posts
 * and inserts a Markdown image at the top of each review's MDX body.
 *
 * Uses the Open Library Search + Covers API to find and download covers
 * based on book title and author extracted from frontmatter.
 *
 * Usage:
 *   npx tsx scripts/import-covers.ts
 *
 * Options:
 *   --dry-run   Print what would be done without writing files
 */

import fs from "fs";
import http from "http";
import https from "https";
import path from "path";
import { URL } from "url";

import matter from "gray-matter";

// ── Config ────────────────────────────────────────────────────────────────────

const POSTS_DIR = path.join(process.cwd(), "content", "posts");
const PUBLIC_DIR = path.join(process.cwd(), "public");
const DRY_RUN = process.argv.includes("--dry-run");

/** Delay between Open Library API requests (ms) to be respectful */
const API_DELAY = 1000;

// ── Types ─────────────────────────────────────────────────────────────────────

interface ReviewPost {
  filePath: string;
  slug: string;
  title: string; // raw frontmatter title, e.g. '"Thinking, fast and slow" - Daniel Kahneman'
  bookTitle: string; // parsed book title
  author: string; // parsed author name
  librarythingUrl: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Parse the frontmatter title into book title and author.
 * Format: '"Book Title" - Author Name'  or  '"Book Title"'
 */
function parseTitleAndAuthor(rawTitle: string): {
  bookTitle: string;
  author: string;
} {
  // Title is typically: "Book Title" - Author Name
  // The quotes may be smart quotes or straight quotes
  const match = rawTitle.match(/^[""\u201C](.+?)[""\u201D]\s*[-–—]\s*(.+)$/);
  if (match) {
    return { bookTitle: match[1].trim(), author: match[2].trim() };
  }
  // Fallback: no author separator found
  const titleOnly = rawTitle.replace(/^[""\u201C]|[""\u201D]$/g, "").trim();
  return { bookTitle: titleOnly, author: "" };
}

/**
 * Execute a single Open Library search query and return the first cover URL found.
 */
async function olSearch(query: string): Promise<string | null> {
  const encodedQuery = encodeURIComponent(query);
  const url = `https://openlibrary.org/search.json?q=${encodedQuery}&limit=5&fields=title,author_name,cover_i`;

  const response = await fetch(url, {
    headers: { "User-Agent": "orientman-blog-cover-import/1.0" },
  });

  if (!response.ok) {
    throw new Error(`Open Library API returned ${response.status}`);
  }

  const data = (await response.json()) as {
    docs: Array<{
      title: string;
      author_name?: string[];
      cover_i?: number;
    }>;
  };

  for (const doc of data.docs) {
    if (doc.cover_i) {
      return `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg`;
    }
  }

  return null;
}

/**
 * Search Open Library for a book cover using multiple strategies:
 * 1. Title + author combined query
 * 2. Author-only query (finds other editions/translations with covers)
 * 3. Title-only query (for unique titles)
 *
 * Returns the cover image URL (large size) or null if not found.
 */
async function searchOpenLibraryCover(
  bookTitle: string,
  author: string,
): Promise<string | null> {
  // Strategy 1: title + author
  const query1 = author ? `${bookTitle} ${author}` : bookTitle;
  const result1 = await olSearch(query1);
  if (result1) return result1;

  // Strategy 2: author only (broader — finds other editions with covers)
  if (author) {
    await sleep(API_DELAY);
    const result2 = await olSearch(author);
    if (result2) return result2;
  }

  return null;
}

/**
 * Download a file from a URL to a local path, following one redirect.
 */
function download(imageUrl: string, destPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const parsed = new URL(imageUrl);
    const client = parsed.protocol === "https:" ? https : http;

    const req = client.get(imageUrl, { timeout: 15000 }, (res) => {
      // Follow one redirect
      if (
        (res.statusCode === 301 || res.statusCode === 302) &&
        res.headers.location
      ) {
        download(res.headers.location, destPath).then(resolve, reject);
        return;
      }

      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode} for ${imageUrl}`));
        return;
      }

      const file = fs.createWriteStream(destPath);
      res.pipe(file);
      file.on("finish", () => file.close(() => resolve()));
      file.on("error", (err) => {
        fs.unlink(destPath, () => reject(err));
      });
    });

    req.on("error", reject);
    req.on("timeout", () => {
      req.destroy();
      reject(new Error(`Timeout downloading ${imageUrl}`));
    });
  });
}

/**
 * Insert a Markdown cover image line at the top of the MDX body
 * (immediately after the frontmatter closing `---`).
 * Idempotent: skips if the image line is already present.
 */
function insertCoverImageLine(
  filePath: string,
  postTitle: string,
  imagePath: string,
): boolean {
  const content = fs.readFileSync(filePath, "utf8");
  const imageLine = `!["${postTitle}"](${imagePath})`;

  // Idempotency: check if the image line is already present
  if (content.includes(imagePath)) {
    return false; // already inserted
  }

  // Find the closing frontmatter delimiter (second `---`)
  // gray-matter uses `---` as delimiter; find the end of frontmatter
  const firstDelim = content.indexOf("---");
  if (firstDelim === -1) return false;

  const secondDelim = content.indexOf("---", firstDelim + 3);
  if (secondDelim === -1) return false;

  const endOfFrontmatter = secondDelim + 3;
  const before = content.substring(0, endOfFrontmatter);
  const after = content.substring(endOfFrontmatter);

  // Insert the image line with a blank line after, before existing body
  // The body may start with a newline or directly with content
  const trimmedAfter = after.replace(/^\n*/, ""); // remove leading newlines
  const newContent = `${before}\n\n${imageLine}\n\n${trimmedAfter}`;

  if (!DRY_RUN) {
    fs.writeFileSync(filePath, newContent, "utf8");
  }
  return true;
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  if (!fs.existsSync(POSTS_DIR)) {
    console.error(`Posts directory not found: ${POSTS_DIR}`);
    process.exit(1);
  }

  // 1. Read all MDX files with librarythingUrl in frontmatter
  const mdxFiles = fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"))
    .map((f) => path.join(POSTS_DIR, f));

  const reviews: ReviewPost[] = [];

  for (const filePath of mdxFiles) {
    const raw = fs.readFileSync(filePath, "utf8");
    const { data: frontmatter } = matter(raw);

    if (!frontmatter.librarythingUrl) continue;

    const slug =
      frontmatter.slug || path.basename(filePath, path.extname(filePath));
    const rawTitle = String(frontmatter.title || "");
    const { bookTitle, author } = parseTitleAndAuthor(rawTitle);

    reviews.push({
      filePath,
      slug,
      title: rawTitle,
      bookTitle,
      author,
      librarythingUrl: frontmatter.librarythingUrl,
    });
  }

  console.log(`Found ${reviews.length} review posts with librarythingUrl`);
  if (DRY_RUN) console.log("(--dry-run: no files will be written)\n");

  let downloaded = 0;
  let skipped = 0;
  let inserted = 0;
  let failed = 0;

  for (let i = 0; i < reviews.length; i++) {
    const review = reviews[i];
    const imageDir = path.join(PUBLIC_DIR, "images", "posts", review.slug);
    const localImagePath = `/images/posts/${review.slug}/cover.jpg`;
    const destPath = path.join(PUBLIC_DIR, localImagePath);

    console.log(`\n[${i + 1}/${reviews.length}] ${review.slug}`);
    console.log(`  Title: ${review.bookTitle}`);
    console.log(`  Author: ${review.author}`);

    // Check if image already exists
    if (fs.existsSync(destPath)) {
      console.log(`  [skip] Cover already exists: ${localImagePath}`);
      skipped++;

      // Still insert the image line if not present
      if (insertCoverImageLine(review.filePath, review.title, localImagePath)) {
        console.log(`  [insert] Added cover image line to MDX`);
        inserted++;
      }
      continue;
    }

    // Search Open Library for cover
    try {
      if (i > 0) await sleep(API_DELAY); // rate limiting

      console.log(`  Searching Open Library...`);
      const coverUrl = await searchOpenLibraryCover(
        review.bookTitle,
        review.author,
      );

      if (!coverUrl) {
        console.log(`  [warn] No cover image found on Open Library`);
        failed++;
        continue;
      }

      console.log(`  Found cover: ${coverUrl}`);

      if (DRY_RUN) {
        console.log(`  [dry] Would download to ${localImagePath}`);
        skipped++;
        continue;
      }

      // Create directory and download
      fs.mkdirSync(imageDir, { recursive: true });
      await download(coverUrl, destPath);
      console.log(`  [ok] Downloaded to ${localImagePath}`);
      downloaded++;

      // Insert image line into MDX
      if (insertCoverImageLine(review.filePath, review.title, localImagePath)) {
        console.log(`  [insert] Added cover image line to MDX`);
        inserted++;
      }
    } catch (err) {
      console.error(`  [fail] ${(err as Error).message}`);
      failed++;
    }
  }

  // Summary
  console.log(`\n${"─".repeat(60)}`);
  console.log(`Cover import complete:`);
  console.log(`  Total reviews:    ${reviews.length}`);
  console.log(`  Downloaded:       ${downloaded}`);
  console.log(`  Skipped (cached): ${skipped}`);
  console.log(`  MDX lines added:  ${inserted}`);
  console.log(`  Failed:           ${failed}`);

  if (failed > 0) {
    console.error(`\n${failed} cover(s) failed. Check warnings above.`);
    // Don't exit with error — partial success is expected since
    // not all books may have covers on Open Library
  }
}

main().catch((err) => {
  console.error("Unexpected error:", err);
  process.exit(1);
});

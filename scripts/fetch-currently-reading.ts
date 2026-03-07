#!/usr/bin/env tsx
/**
 * scripts/fetch-currently-reading.ts
 *
 * Fetches the Goodreads public RSS feed for the "currently-reading" shelf,
 * parses book data, and writes content/data/currently-reading.json.
 *
 * Fallback behaviour:
 *   - On fetch failure with existing JSON → log warning, keep existing file
 *   - On fetch failure with no JSON → write empty books array
 *   - Always exits 0 (never breaks the build)
 *
 * Usage:
 *   npx tsx scripts/fetch-currently-reading.ts
 */

import fs from "fs";
import path from "path";

// ── Constants ────────────────────────────────────────────────────────────────

const USER_ID = "13930842";
const RSS_URL = `https://www.goodreads.com/review/list_rss/${USER_ID}?shelf=currently-reading`;
const SHELF_URL = `https://www.goodreads.com/review/list/${USER_ID}?shelf=currently-reading`;
const OUTPUT_PATH = path.join(
  process.cwd(),
  "content",
  "data",
  "currently-reading.json",
);

// ── Types ────────────────────────────────────────────────────────────────────

interface CurrentlyReadingBook {
  title: string;
  author: string;
  coverUrl: string | null;
  url: string;
}

interface CurrentlyReadingData {
  books: CurrentlyReadingBook[];
  shelfUrl: string;
  fetchedAt: string;
}

// ── RSS Parsing (regex-based, reuses import-goodreads.ts pattern) ────────────

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
 * Detect Goodreads placeholder cover images.
 * All placeholders use URLs containing "nophoto".
 */
function isNophotoCover(url: string): boolean {
  return url.includes("nophoto");
}

/**
 * Parse RSS XML into book entries.
 */
function parseRssItems(xml: string): CurrentlyReadingBook[] {
  const books: CurrentlyReadingBook[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;

  while ((match = itemRegex.exec(xml)) !== null) {
    const itemXml = match[1];

    const title = stripCdata(extractTag(itemXml, "title"));
    const author = stripCdata(extractTag(itemXml, "author_name"));
    const coverImageUrl = stripCdata(
      extractTag(itemXml, "book_medium_image_url"),
    );
    const rawLink = stripCdata(extractTag(itemXml, "link"));

    if (!title) continue;

    // Strip UTM parameters from the link
    const url = rawLink.replace(/\?utm_medium=.*$/, "").trim();

    // Detect nophoto placeholders and set coverUrl to null
    const coverUrl =
      coverImageUrl && !isNophotoCover(coverImageUrl) ? coverImageUrl : null;

    books.push({ title, author, coverUrl, url });
  }

  return books;
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("Fetching Goodreads currently-reading shelf...");

  try {
    const response = await fetch(RSS_URL, {
      headers: { "User-Agent": "orientman-blog-currently-reading/1.0" },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const xml = await response.text();
    const books = parseRssItems(xml);

    const data: CurrentlyReadingData = {
      books,
      shelfUrl: SHELF_URL,
      fetchedAt: new Date().toISOString(),
    };

    // Ensure output directory exists
    const dir = path.dirname(OUTPUT_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(data, null, 2) + "\n", "utf8");
    console.log(
      `Wrote ${books.length} book(s) to ${path.relative(process.cwd(), OUTPUT_PATH)}`,
    );
  } catch (err) {
    console.warn(
      `[warn] Failed to fetch currently-reading shelf: ${err instanceof Error ? err.message : err}`,
    );

    if (fs.existsSync(OUTPUT_PATH)) {
      console.warn("[warn] Keeping existing cached JSON file.");
    } else {
      // No cached file exists — write an empty books array so the build can proceed
      const emptyData: CurrentlyReadingData = {
        books: [],
        shelfUrl: SHELF_URL,
        fetchedAt: new Date().toISOString(),
      };

      const dir = path.dirname(OUTPUT_PATH);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      fs.writeFileSync(
        OUTPUT_PATH,
        JSON.stringify(emptyData, null, 2) + "\n",
        "utf8",
      );
      console.warn("[warn] Wrote empty books array as no cached file existed.");
    }
  }
}

main().catch((err) => {
  // Catch-all: never fail the build
  console.error("Unexpected error in fetch-currently-reading:", err);
  // Always exit 0
});

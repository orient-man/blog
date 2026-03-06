#!/usr/bin/env tsx
/**
 * scripts/import-librarything.ts
 *
 * One-time migration script: converts LibraryThing book reviews into MDX posts.
 *
 * Usage:
 *   npx tsx scripts/import-librarything.ts [path-to-html]
 *
 * Default HTML path: scripts/data/librarything-reviews.html
 *
 * Output:
 *   content/posts/{slug}-review.mdx — one file per review
 */

import fs from "fs";
import path from "path";

import { parse as parseHTML } from "node-html-parser";
import TurndownService from "turndown";

// ── Constants ─────────────────────────────────────────────────────────────────

const DEFAULT_HTML = path.join(
  process.cwd(),
  "scripts",
  "data",
  "librarything-reviews.html",
);
const POSTS_OUT = path.join(process.cwd(), "content", "posts");
const LT_BASE = "https://www.librarything.com";

// ── Turndown setup ────────────────────────────────────────────────────────────

const td = new TurndownService({
  headingStyle: "atx",
  bulletListMarker: "-",
});

// ── Slugify (mirrors src/lib/utils.ts, plus Polish diacritic stripping) ──────

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
  Ą: "A",
  Ć: "C",
  Ę: "E",
  Ł: "L",
  Ń: "N",
  Ó: "O",
  Ś: "S",
  Ź: "Z",
  Ż: "Z",
};

function stripDiacritics(text: string): string {
  return text.replace(/[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/g, (ch) => DIACRITICS[ch] ?? ch);
}

function slugify(text: string): string {
  return stripDiacritics(text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// ── Language detection heuristic ──────────────────────────────────────────────

const POLISH_MARKERS = [
  // Common Polish words unlikely in English
  "jest",
  "się",
  "nie",
  "ale",
  "jak",
  "przez",
  "który",
  "która",
  "które",
  "tego",
  "jest",
  "przy",
  "tak",
  "już",
  "nad",
  "pod",
  "bez",
  "dla",
  "tej",
  "tym",
  "tych",
  "bardzo",
  "tylko",
  "może",
  "będzie",
  "mnie",
  "nam",
  "jeszcze",
  "nawet",
  "kiedy",
  "gdzie",
  "więc",
  "jednak",
  "także",
  "tutaj",
  "każdy",
  "wszystko",
  "można",
  "czas",
  "książka",
  "książki",
  "autor",
  "dobrze",
  "warto",
  "czytać",
  "świat",
  "prze",
];

// Polish diacritical characters that don't appear in other common Latin-script
// languages. If the text contains several of these it is almost certainly Polish.
const POLISH_DIACRITICS = /[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/g;

function detectLanguage(
  title: string,
  reviewHtml: string,
): "posts-in-english" | "wpisy-po-polsku" {
  // Combine title and review text for analysis.
  // Strip HTML tags to get plain text but preserve diacritics.
  const plainText = (title + " " + reviewHtml).replace(/<[^>]+>/g, "");

  // Count Polish-specific diacritics
  const diacriticMatches = plainText.match(POLISH_DIACRITICS);
  const diacriticCount = diacriticMatches ? diacriticMatches.length : 0;

  // Even a single Polish diacritic in a short text is a strong signal
  if (diacriticCount >= 1) return "wpisy-po-polsku";

  // Count Polish marker words (case-insensitive, word boundaries)
  const lower = plainText.toLowerCase();
  let polishWordCount = 0;
  for (const word of POLISH_MARKERS) {
    const regex = new RegExp(`\\b${word}\\b`, "g");
    const matches = lower.match(regex);
    if (matches) polishWordCount += matches.length;
  }

  // If 2+ Polish words found, classify as Polish
  if (polishWordCount >= 2) return "wpisy-po-polsku";

  return "posts-in-english";
}

// ── HTML parsing ──────────────────────────────────────────────────────────────

interface ReviewData {
  title: string;
  author: string;
  rating: number;
  date: string; // ISO 8601
  reviewHtml: string;
  librarythingUrl: string;
}

function parseReviews(html: string): ReviewData[] {
  const root = parseHTML(html, {
    blockTextElements: {
      script: true,
      noscript: true,
      style: true,
    },
  });

  const items = root.querySelectorAll(".mr_item");
  const reviews: ReviewData[] = [];

  for (const item of items) {
    // ── Title ──
    const titleEl = item.querySelector(".mr_title");
    if (!titleEl) continue;
    const title = titleEl.text.trim();

    // ── Author ──
    const authorEl = item.querySelector(".mr_author");
    const author = authorEl ? authorEl.text.trim() : "";

    // ── Rating (form_rating hidden input) ──
    const ratingInput = item.querySelector('input[name="form_rating"]');
    const formRating = ratingInput
      ? parseInt(ratingInput.getAttribute("value") ?? "0", 10)
      : 0;
    const rating = formRating / 2;

    // ── Review text ──
    const reviewContent = item.querySelector(".mr_review_content");
    if (!reviewContent) continue;

    // Clone and remove the rating/date div from review content to get pure text
    let reviewHtml = reviewContent.innerHTML;
    // Remove the mr_rate_or_date div and everything after it within this element
    const rateDateIdx = reviewHtml.indexOf('<div class="mr_rate_or_date"');
    if (rateDateIdx !== -1) {
      reviewHtml = reviewHtml.substring(0, rateDateIdx);
    }
    reviewHtml = reviewHtml.trim();

    // Handle jQuery truncator: the LibraryThing HTML structure is:
    //   ...visible text<a class="showmore_link" ...>show more</a>
    //   <span class="hideme" id="...">hidden text</span>
    //   <a class="hideme showlessmore_link" ...>show less</a>
    // We need to: keep visible text + hidden text, remove the links.
    if (
      reviewHtml.includes("showmore_link") ||
      reviewHtml.includes("show more")
    ) {
      // Remove "show more" links
      reviewHtml = reviewHtml.replace(
        /<a[^>]*class="[^"]*showmore_link[^"]*"[^>]*>.*?<\/a>/gi,
        "",
      );
      // Remove "show less" links
      reviewHtml = reviewHtml.replace(
        /<a[^>]*class="[^"]*showlessmore_link[^"]*"[^>]*>.*?<\/a>/gi,
        "",
      );
      // Unwrap <span class="hideme"> but keep its content
      reviewHtml = reviewHtml.replace(
        /<span[^>]*class="[^"]*hideme[^"]*"[^>]*>([\s\S]*?)<\/span>/gi,
        "$1",
      );
    }

    // ── Date ──
    const noteDiv = item.querySelector(".mr_reviewinfo .note");
    let dateStr = "";
    if (noteDiv) {
      const firstLink = noteDiv.querySelector("a");
      if (firstLink) {
        dateStr = firstLink.text.trim();
      }
    }
    const isoDate = parseDate(dateStr);

    // ── URL (permalink to review) ──
    const workId = titleEl.getAttribute("data-workid") ?? "";
    const href = titleEl.getAttribute("href") ?? "";
    // href is like /work/{workId}/{bookId}
    const bookIdMatch = href.match(/\/work\/\d+\/(\d+)/);
    const bookId = bookIdMatch ? bookIdMatch[1] : "";
    const librarythingUrl = bookId
      ? `${LT_BASE}/work/${workId}/reviews/${bookId}`
      : `${LT_BASE}${href}`;

    reviews.push({
      title,
      author,
      rating,
      date: isoDate,
      reviewHtml,
      librarythingUrl,
    });
  }

  return reviews;
}

// ── Date parsing ──────────────────────────────────────────────────────────────

const MONTHS: Record<string, string> = {
  Jan: "01",
  Feb: "02",
  Mar: "03",
  Apr: "04",
  May: "05",
  Jun: "06",
  Jul: "07",
  Aug: "08",
  Sep: "09",
  Oct: "10",
  Nov: "11",
  Dec: "12",
};

function parseDate(dateStr: string): string {
  // Format: "Jan 8, 2026" or "Aug 22, 2025"
  const match = dateStr.match(/^(\w{3})\s+(\d{1,2}),\s+(\d{4})$/);
  if (!match) return "1970-01-01";
  const [, mon, day, year] = match;
  const mm = MONTHS[mon] ?? "01";
  const dd = day.padStart(2, "0");
  return `${year}-${mm}-${dd}`;
}

// ── HTML to Markdown conversion ───────────────────────────────────────────────

function reviewToMarkdown(html: string): string {
  // The review content uses <br><br> for paragraph breaks.
  // Turndown collapses \n inside block elements, so we split on <br><br>
  // and wrap each segment in <p> tags so Turndown treats them as paragraphs.
  const segments = html.split(/<br\s*\/?>\s*<br\s*\/?>/i);

  const paragraphs = segments
    .map((seg) => {
      // Convert remaining single <br> to Turndown-friendly line breaks
      const cleaned = seg.replace(/<br\s*\/?>/gi, "<br>");
      return `<p>${cleaned.trim()}</p>`;
    })
    .filter((p) => p !== "<p></p>");

  const wrappedHtml = paragraphs.join("");
  const markdown = td.turndown(`<div>${wrappedHtml}</div>`);

  return markdown.trim();
}

// ── Tag generation ────────────────────────────────────────────────────────────

function generateTags(): string[] {
  // Every review gets these base tags (FR-008)
  return ["books", "reviews"];
}

// ── MDX generation ────────────────────────────────────────────────────────────

function generateMdx(review: ReviewData, category: string): string {
  const slug = slugify(review.title) + "-review";
  const postTitle =
    review.author !== ""
      ? `"${review.title}" - ${review.author}`
      : `"${review.title}"`;
  const tags = generateTags();
  const markdown = reviewToMarkdown(review.reviewHtml);

  const frontmatter = [
    "---",
    `title: '${postTitle.replace(/'/g, "''")}'`,
    `date: ${review.date}`,
    `author: orientman`,
    `slug: ${slug}`,
    `wordpressUrl: ""`,
    `librarythingUrl: ${review.librarythingUrl}`,
    `category: ${category}`,
    `tags:`,
    ...tags.map((t) => `  - ${t}`),
    `format: standard`,
    `rating: ${review.rating}`,
    "---",
    "",
  ].join("\n");

  return frontmatter + markdown + "\n";
}

// ── Main ──────────────────────────────────────────────────────────────────────

function main() {
  const htmlPath = process.argv[2] ?? DEFAULT_HTML;

  if (!fs.existsSync(htmlPath)) {
    console.error(`HTML file not found: ${htmlPath}`);
    console.error(
      "Save the LibraryThing reviews page to scripts/data/librarything-reviews.html",
    );
    process.exit(1);
  }

  console.log(`Reading: ${htmlPath}`);
  const html = fs.readFileSync(htmlPath, "utf8");

  console.log("Parsing reviews...");
  const reviews = parseReviews(html);
  console.log(`Found ${reviews.length} reviews`);

  if (reviews.length === 0) {
    console.error("No reviews found. Check the HTML file.");
    process.exit(1);
  }

  // Ensure output directory exists
  fs.mkdirSync(POSTS_OUT, { recursive: true });

  let created = 0;
  const slugs = new Set<string>();

  for (const review of reviews) {
    const slug = slugify(review.title) + "-review";

    // Check for duplicate slugs
    if (slugs.has(slug)) {
      console.warn(`  ⚠ Duplicate slug: ${slug} — skipping`);
      continue;
    }
    slugs.add(slug);

    // Detect language for category assignment
    const category = detectLanguage(review.title, review.reviewHtml);

    const mdx = generateMdx(review, category);
    const outPath = path.join(POSTS_OUT, `${slug}.mdx`);

    fs.writeFileSync(outPath, mdx, "utf8");
    console.log(
      `  ✓ ${slug}.mdx (${review.date}, ${review.rating}★, ${category})`,
    );
    created++;
  }

  console.log(`\nDone: ${created} MDX files created in content/posts/`);
}

main();

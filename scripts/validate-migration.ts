#!/usr/bin/env tsx
/**
 * scripts/validate-migration.ts
 *
 * Validates the migrated MDX content against the original WXR export.
 *
 * Checks:
 *  1. Post count matches WXR published posts (SC-001)
 *  2. All posts have required frontmatter fields
 *  3. No broken local image references (SC-003)
 *  4. No unhandled WordPress shortcodes remain in content
 *  5. All code blocks have a language tag (SC-002)
 *
 * Usage:
 *   tsx scripts/validate-migration.ts [<path-to-wxr.xml>]
 *
 * If no WXR path is given, skips post-count check.
 */

import fs from "fs";
import path from "path";

import matter from "gray-matter";

// ── Config ────────────────────────────────────────────────────────────────────

const POSTS_DIR = path.join(process.cwd(), "content", "posts");
const PAGES_DIR = path.join(process.cwd(), "content", "pages");
const PUBLIC_DIR = path.join(process.cwd(), "public");

const REQUIRED_POST_FIELDS = ["title", "date", "slug", "category", "tags"];
const REQUIRED_PAGE_FIELDS = ["title", "slug"];

// Shortcode pattern: [word ...] — any remaining WP shortcodes
const SHORTCODE_RE = /\[[a-z_][\w-]*[^\]]*\]/gi;
// Fenced code block without a language tag
const UNLABELED_CODE_RE = /^```\s*$/m;

// ── Types ─────────────────────────────────────────────────────────────────────

interface ValidationIssue {
  file: string;
  severity: "error" | "warning";
  message: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function readMdxFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"))
    .map((f) => path.join(dir, f));
}

function parseWxrPostCount(wxrPath: string): number {
  // Lightweight count — no full parse, just count <wp:status>publish</wp:status>
  // adjacent to <wp:post_type>post</wp:post_type>
  const raw = fs.readFileSync(wxrPath, "utf8");
  // Find all <item> blocks and check publish + post type
  let count = 0;
  const itemRe = /<item>([\s\S]*?)<\/item>/gi;
  let match: RegExpExecArray | null;
  while ((match = itemRe.exec(raw)) !== null) {
    const block = match[1];
    const isPublished =
      /<wp:status><!\[CDATA\[publish\]\]><\/wp:status>|<wp:status>publish<\/wp:status>/.test(
        block,
      );
    const isPost =
      /<wp:post_type><!\[CDATA\[post\]\]><\/wp:post_type>|<wp:post_type>post<\/wp:post_type>/.test(
        block,
      );
    if (isPublished && isPost) count++;
  }
  return count;
}

// ── Main ──────────────────────────────────────────────────────────────────────

function main() {
  const wxrPath = process.argv[2] ?? null;
  const issues: ValidationIssue[] = [];

  // ── 1. Post count check (SC-001) ──────────────────────────────────────────

  const postFiles = readMdxFiles(POSTS_DIR);
  const pageFiles = readMdxFiles(PAGES_DIR);

  console.log(
    `Found ${postFiles.length} posts and ${pageFiles.length} pages in content/`,
  );

  if (wxrPath) {
    if (!fs.existsSync(wxrPath)) {
      console.error(`WXR file not found: ${wxrPath}`);
      process.exit(1);
    }
    const wxrCount = parseWxrPostCount(wxrPath);
    console.log(`WXR published post count: ${wxrCount}`);
    if (postFiles.length !== wxrCount) {
      issues.push({
        file: "(global)",
        severity: "error",
        message: `Post count mismatch: MDX has ${postFiles.length}, WXR has ${wxrCount}`,
      });
    } else {
      console.log(`✓ Post count matches WXR (${wxrCount})`);
    }
  } else {
    console.log("(no WXR path given — skipping post count check)");
  }

  // ── 2. Frontmatter validation ─────────────────────────────────────────────

  for (const filePath of [...postFiles, ...pageFiles]) {
    const rel = path.relative(process.cwd(), filePath);
    const raw = fs.readFileSync(filePath, "utf8");
    let data: Record<string, unknown>;
    let content: string;

    try {
      const parsed = matter(raw);
      data = parsed.data as Record<string, unknown>;
      content = parsed.content;
    } catch (err) {
      issues.push({
        file: rel,
        severity: "error",
        message: `Failed to parse frontmatter: ${(err as Error).message}`,
      });
      continue;
    }

    const isPost = filePath.startsWith(POSTS_DIR);
    const requiredFields = isPost ? REQUIRED_POST_FIELDS : REQUIRED_PAGE_FIELDS;

    for (const field of requiredFields) {
      if (!data[field] && data[field] !== 0) {
        issues.push({
          file: rel,
          severity: "error",
          message: `Missing required field: ${field}`,
        });
      }
    }

    // Date format check
    if (
      data.date &&
      typeof data.date === "string" &&
      !/^\d{4}-\d{2}-\d{2}$/.test(data.date)
    ) {
      issues.push({
        file: rel,
        severity: "warning",
        message: `Date format unexpected: "${data.date}" (expected YYYY-MM-DD)`,
      });
    }

    // ── 3. Broken local image check (SC-003) ────────────────────────────────

    const localImageRe = /!\[[^\]]*\]\((\/images\/[^\s)"]+)/g;
    let imgMatch: RegExpExecArray | null;
    while ((imgMatch = localImageRe.exec(content)) !== null) {
      const imgPath = path.join(PUBLIC_DIR, imgMatch[1]);
      if (!fs.existsSync(imgPath)) {
        issues.push({
          file: rel,
          severity: "error",
          message: `Broken image reference: ${imgMatch[1]}`,
        });
      }
    }

    // ── 4. Unhandled shortcodes ──────────────────────────────────────────────

    // Ignore JSX-style angle bracket components and MDX components
    const shortcodeMatches = Array.from(content.matchAll(SHORTCODE_RE));
    for (const m of shortcodeMatches) {
      // Ignore markdown footnotes [^1], link references [link][ref], and inline links [text](url)
      if (/^\[\^/.test(m[0]) || /^\[[^\]]+\]\[/.test(m[0])) continue;
      // Check character immediately after the match — if it's '(' it's a Markdown link
      const afterMatch = content.slice(
        (m.index ?? 0) + m[0].length,
        (m.index ?? 0) + m[0].length + 1,
      );
      if (afterMatch === "(") continue;
      issues.push({
        file: rel,
        severity: "warning",
        message: `Possible unhandled shortcode: ${m[0].slice(0, 60)}`,
      });
    }

    // ── 5. Unlabeled code blocks (SC-002) ────────────────────────────────────

    const unlabeled = content.match(UNLABELED_CODE_RE);
    if (unlabeled) {
      issues.push({
        file: rel,
        severity: "warning",
        message: `Has ${content.match(new RegExp(UNLABELED_CODE_RE.source, "gm"))?.length ?? 1} code block(s) without a language tag`,
      });
    }
  }

  // ── Report ─────────────────────────────────────────────────────────────────

  const errors = issues.filter((i) => i.severity === "error");
  const warnings = issues.filter((i) => i.severity === "warning");

  if (issues.length === 0) {
    console.log("\n✓ All checks passed. Migration looks clean.");
  } else {
    console.log(
      `\nValidation results: ${errors.length} error(s), ${warnings.length} warning(s)`,
    );
    console.log("");

    for (const issue of issues) {
      const prefix = issue.severity === "error" ? "✗ ERROR" : "⚠ WARN ";
      console.log(`${prefix}  ${issue.file}`);
      console.log(`         ${issue.message}`);
    }
  }

  if (errors.length > 0) {
    console.error(
      `\nFailed with ${errors.length} error(s). Fix before proceeding.`,
    );
    process.exit(1);
  }
}

main();

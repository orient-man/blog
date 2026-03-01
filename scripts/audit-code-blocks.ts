#!/usr/bin/env tsx
/**
 * scripts/audit-code-blocks.ts
 *
 * Read-only diagnostic tool: scans all MDX posts in content/posts/ and
 * identifies content that likely needs to be wrapped in fenced code blocks.
 *
 * Usage:
 *   npx tsx scripts/audit-code-blocks.ts [--json] [--paths-only] [--help]
 *
 * Exit codes:
 *   0  Script ran successfully (flagged posts may exist)
 *   1  Script error (unreadable files, unexpected exception)
 */

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// ── Types ────────────────────────────────────────────────────────────────────

type HeuristicType = 'shell-command' | 'indented-block' | 'long-inline-code' | 'raw-xml-html';

interface Heuristic {
  type: HeuristicType;
  lineNumber: number;
  excerpt: string;
}

interface PostAuditResult {
  filePath: string;
  slug: string;
  flagged: boolean;
  existingFencedBlocks: number;
  heuristics: Heuristic[];
}

interface AuditReport {
  generatedAt: string;
  totalPosts: number;
  flaggedCount: number;
  posts: PostAuditResult[];
}

// ── Heuristic detection ───────────────────────────────────────────────────────

const SHELL_PREFIXES = /^(\$|>|npm |npx |paket |nuget |mono |dotnet |git |curl |wget )/;

function detectHeuristics(content: string): { heuristics: Heuristic[]; existingFencedBlocks: number } {
  const lines = content.split('\n');
  const heuristics: Heuristic[] = [];
  let insideFence = false;
  let existingFencedBlocks = 0;

  for (let i = 0; i < lines.length; i++) {
    const lineNumber = i + 1;
    const raw = lines[i];
    const trimmed = raw.trim();

    // Track fenced code block boundaries
    if (/^```/.test(trimmed)) {
      if (!insideFence) {
        insideFence = true;
        existingFencedBlocks++;
      } else {
        insideFence = false;
      }
      continue;
    }

    // Skip lines inside fenced blocks
    if (insideFence) continue;

    const excerpt = raw.slice(0, 80);

    // shell-command: line (trimmed) starts with $ / > / known CLI prefix
    if (SHELL_PREFIXES.test(trimmed)) {
      heuristics.push({ type: 'shell-command', lineNumber, excerpt });
      continue; // only flag once per line
    }

    // indented-block: starts with 4+ spaces or a tab (not front matter)
    if (/^(    |\t)/.test(raw) && trimmed.length > 0) {
      heuristics.push({ type: 'indented-block', lineNumber, excerpt });
      continue;
    }

    // long-inline-code: inline backtick span > 30 chars
    const backtickMatches = raw.matchAll(/`([^`]+)`/g);
    for (const match of backtickMatches) {
      if (match[1].length > 30) {
        heuristics.push({ type: 'long-inline-code', lineNumber, excerpt });
        break; // one flag per line
      }
    }

    // raw-xml-html: contains an XML/HTML tag pattern outside fenced block
    if (/<[A-Za-z]/.test(raw)) {
      heuristics.push({ type: 'raw-xml-html', lineNumber, excerpt });
    }
  }

  return { heuristics, existingFencedBlocks };
}

// ── File scanning ─────────────────────────────────────────────────────────────

function auditPosts(postsDir: string): AuditReport {
  const files = fs
    .readdirSync(postsDir)
    .filter((f) => f.endsWith('.mdx'))
    .sort();

  const flaggedPosts: PostAuditResult[] = [];

  for (const file of files) {
    const filePath = path.join('content/posts', file);
    const fullPath = path.join(postsDir, file);
    const raw = fs.readFileSync(fullPath, 'utf8');

    // Strip frontmatter before analysis
    const { content } = matter(raw);

    const slug = file.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/\.mdx$/, '');
    const { heuristics, existingFencedBlocks } = detectHeuristics(content);

    if (heuristics.length > 0) {
      flaggedPosts.push({
        filePath,
        slug,
        flagged: true,
        existingFencedBlocks,
        heuristics,
      });
    }
  }

  return {
    generatedAt: new Date().toISOString(),
    totalPosts: files.length,
    flaggedCount: flaggedPosts.length,
    posts: flaggedPosts,
  };
}

// ── Output formatting ─────────────────────────────────────────────────────────

function printHumanReadable(report: AuditReport): void {
  console.log('Audit: Code Block Coverage');
  console.log('==========================');
  console.log(`Scanned:  ${report.totalPosts} posts`);
  console.log(`Flagged:   ${report.flaggedCount} posts requiring review`);

  if (report.flaggedCount === 0) {
    console.log('\nNo posts flagged. All code blocks appear to be fenced.');
    return;
  }

  console.log('\nFLAGGED POSTS:');
  for (const post of report.posts) {
    console.log(`\n  ${post.filePath}`);
    console.log(`    Existing fenced blocks: ${post.existingFencedBlocks}`);
    for (const h of post.heuristics) {
      const typeLabel = h.type.padEnd(18);
      console.log(`    Line ${String(h.lineNumber).padStart(4)}  [${typeLabel}]  ${h.excerpt}`);
    }
  }

  console.log('\nRun with --json for machine-readable output.');
}

// ── Main ──────────────────────────────────────────────────────────────────────

function printUsage(): void {
  console.log(`Usage: npx tsx scripts/audit-code-blocks.ts [OPTIONS]

Options:
  --json          Output machine-readable JSON to stdout
  --paths-only    Output only the file paths of flagged posts, one per line
  --help, -h      Print this usage message

Exit codes:
  0   Script ran successfully (flagged posts may or may not exist)
  1   Script error (unreadable files, unexpected exception)`);
}

function main(): void {
  const args = process.argv.slice(2);

  if (args.includes('--help') || args.includes('-h')) {
    printUsage();
    process.exit(0);
  }

  const jsonMode = args.includes('--json');
  const pathsOnly = args.includes('--paths-only');

  try {
    const repoRoot = path.resolve(path.dirname(process.argv[1]), '..');
    const postsDir = path.join(repoRoot, 'content', 'posts');

    if (!fs.existsSync(postsDir)) {
      process.stderr.write(`ERROR: posts directory not found: ${postsDir}\n`);
      process.exit(1);
    }

    const report = auditPosts(postsDir);

    if (jsonMode) {
      console.log(JSON.stringify(report, null, 2));
    } else if (pathsOnly) {
      for (const post of report.posts) {
        console.log(post.filePath);
      }
    } else {
      printHumanReadable(report);
    }

    process.exit(0);
  } catch (err) {
    process.stderr.write(`ERROR: ${err instanceof Error ? err.message : String(err)}\n`);
    process.exit(1);
  }
}

main();

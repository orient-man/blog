#!/usr/bin/env tsx
/**
 * scripts/migrate-external-links.ts
 *
 * One-shot migration: replaces `librarythingUrl` and `linkedinUrl` frontmatter
 * fields with a generic `externalLinks` array in all affected MDX files.
 *
 * Uses targeted text replacement to preserve exact file formatting.
 *
 * Usage:
 *   npx tsx scripts/migrate-external-links.ts
 *   npx tsx scripts/migrate-external-links.ts --dry-run
 */

import fs from "fs";
import path from "path";

import matter from "gray-matter";

const POSTS_DIR = path.join(process.cwd(), "content", "posts");
const DRY_RUN = process.argv.includes("--dry-run");

interface ExternalLink {
  label: string;
  url: string;
}

function main() {
  if (!fs.existsSync(POSTS_DIR)) {
    console.error(`Posts directory not found: ${POSTS_DIR}`);
    process.exit(1);
  }

  const files = fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"))
    .map((f) => path.join(POSTS_DIR, f));

  let migrated = 0;
  let skipped = 0;

  for (const filePath of files) {
    const raw = fs.readFileSync(filePath, "utf8");
    const { data } = matter(raw);

    const hasLibraryThing = !!data.librarythingUrl;
    const hasLinkedIn = !!data.linkedinUrl;

    if (!hasLibraryThing && !hasLinkedIn) {
      skipped++;
      continue;
    }

    // Build the externalLinks array
    const externalLinks: ExternalLink[] = [];

    if (hasLibraryThing) {
      externalLinks.push({
        label: "LibraryThing",
        url: String(data.librarythingUrl),
      });
    }

    if (hasLinkedIn) {
      externalLinks.push({
        label: "LinkedIn",
        url: String(data.linkedinUrl),
      });
    }

    // Build the externalLinks YAML block
    const externalLinksYaml = externalLinks
      .map((link) => `  - label: "${link.label}"\n    url: ${link.url}`)
      .join("\n");
    const newField = `externalLinks:\n${externalLinksYaml}`;

    // Do targeted text replacement in the raw file
    let modified = raw;

    // Remove old fields (match the whole line including newline)
    modified = modified.replace(/^librarythingUrl:.*\n/m, "");
    modified = modified.replace(/^linkedinUrl:.*\n/m, "");

    // Insert externalLinks before the `category:` line (which always exists)
    modified = modified.replace(/^(category:)/m, `${newField}\n$1`);

    const fileName = path.basename(filePath);

    if (DRY_RUN) {
      console.log(
        `  [dry] ${fileName}: ${externalLinks.map((l) => l.label).join(", ")}`,
      );
    } else {
      fs.writeFileSync(filePath, modified, "utf8");
      console.log(
        `  [ok] ${fileName}: ${externalLinks.map((l) => l.label).join(", ")}`,
      );
    }

    migrated++;
  }

  console.log(
    `\nDone: ${migrated} files migrated, ${skipped} files skipped (no links to migrate)`,
  );
  if (DRY_RUN) console.log("(--dry-run: no files were written)");
}

main();

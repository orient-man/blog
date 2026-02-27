#!/usr/bin/env tsx
/**
 * scripts/download-images.ts
 *
 * Scans migrated MDX files for WordPress-hosted image URLs, downloads
 * each image to public/images/posts/{slug}/, and rewrites the MDX
 * source to reference the local path.
 *
 * Usage:
 *   tsx scripts/download-images.ts
 *
 * Options:
 *   --dry-run   Print what would be downloaded without writing files
 */

import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';
import { URL } from 'url';

// ── Config ────────────────────────────────────────────────────────────────────

const POSTS_DIR = path.join(process.cwd(), 'content', 'posts');
const IMAGES_DIR = path.join(process.cwd(), 'public', 'images', 'posts');
const DRY_RUN = process.argv.includes('--dry-run');

// WordPress-hosted image URL patterns to capture
const WP_IMAGE_RE =
  /https?:\/\/(?:[a-z0-9-]+\.(?:wordpress\.com|wp\.com|files\.wordpress\.com))[^\s"')]+\.(?:png|jpg|jpeg|gif|webp|svg)(?:\?[^\s"')]*)?/gi;

// ── Helpers ───────────────────────────────────────────────────────────────────

function download(imageUrl: string, destPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const parsed = new URL(imageUrl);
    const client = parsed.protocol === 'https:' ? https : http;

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
      file.on('finish', () => file.close(() => resolve()));
      file.on('error', (err) => {
        fs.unlink(destPath, () => reject(err));
      });
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error(`Timeout downloading ${imageUrl}`));
    });
  });
}

function slugFromFilePath(filePath: string): string {
  return path.basename(filePath, path.extname(filePath));
}

function localImagePath(imageUrl: string, postSlug: string): string {
  const parsed = new URL(imageUrl);
  const basename = path.basename(parsed.pathname);
  return `/images/posts/${postSlug}/${basename}`;
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  if (!fs.existsSync(POSTS_DIR)) {
    console.error(`Posts directory not found: ${POSTS_DIR}`);
    console.error('Run scripts/migrate.ts first.');
    process.exit(1);
  }

  const mdxFiles = fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith('.mdx') || f.endsWith('.md'))
    .map((f) => path.join(POSTS_DIR, f));

  console.log(`Scanning ${mdxFiles.length} MDX files for WordPress image URLs…`);
  if (DRY_RUN) console.log('(--dry-run: no files will be written)');

  let totalImages = 0;
  let downloaded = 0;
  let skipped = 0;
  let failed = 0;

  for (const filePath of mdxFiles) {
    const postSlug = slugFromFilePath(filePath);
    const original = fs.readFileSync(filePath, 'utf8');

    const matches = Array.from(original.matchAll(WP_IMAGE_RE));
    if (matches.length === 0) continue;

    // Deduplicate URLs
    const uniqueUrls = Array.from(new Set(matches.map((m) => m[0])));
    totalImages += uniqueUrls.length;

    let updated = original;
    const postImagesDir = path.join(IMAGES_DIR, postSlug);

    for (const imageUrl of uniqueUrls) {
      const localPath = localImagePath(imageUrl, postSlug);
      const destPath = path.join(process.cwd(), 'public', localPath);

      if (!DRY_RUN) {
        fs.mkdirSync(path.dirname(destPath), { recursive: true });
      }

      if (!DRY_RUN && fs.existsSync(destPath)) {
        console.log(`  [skip] ${localPath} (already exists)`);
        skipped++;
      } else if (DRY_RUN) {
        console.log(`  [dry] ${imageUrl} → ${localPath}`);
        skipped++;
      } else {
        try {
          await download(imageUrl, destPath);
          console.log(`  [ok]   ${localPath}`);
          downloaded++;
        } catch (err) {
          console.error(`  [fail] ${imageUrl}: ${(err as Error).message}`);
          failed++;
          // Don't rewrite broken URLs — leave original
          continue;
        }
      }

      // Rewrite URL in MDX (replaceAll occurrences of this URL)
      updated = updated.split(imageUrl).join(localPath);
    }

    if (updated !== original) {
      if (!DRY_RUN) {
        fs.writeFileSync(filePath, updated, 'utf8');
        console.log(`  [rewrite] ${path.basename(filePath)}`);
      }
    }
  }

  console.log(`\nImage download complete:`);
  console.log(`  Total URLs found: ${totalImages}`);
  console.log(`  Downloaded:       ${downloaded}`);
  console.log(`  Skipped (cached): ${skipped}`);
  console.log(`  Failed:           ${failed}`);

  if (failed > 0) {
    console.error(`\n${failed} image(s) failed to download. Check URLs above.`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Unexpected error:', err);
  process.exit(1);
});

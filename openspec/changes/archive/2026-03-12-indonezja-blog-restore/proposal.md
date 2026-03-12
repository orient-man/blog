## Why

The author's Indonesia travel blog from March 2004 — originally hosted at `indonezja.piatka.pl` on the CuteNews flat-file PHP platform — has been offline for nearly two decades.
The Wayback Machine preserved partial snapshots of the site, including all 16 blog posts and a 57-photo gallery.
Importing this content as static MDX posts consolidates the author's earliest online writing into the current blog, aligning with Constitution Principle II (Content-First: Markdown is the canonical format) and Principle I (Simplicity: static site, no server dependencies).

## What Changes

- Add 16 new MDX post files and 1 photo gallery MDX file in `content/posts/`, following existing frontmatter and slug conventions.
- Download and store 51 recovered photos in `public/images/posts/` (7 of 57 gallery photos had no Wayback capture).
- Download and distribute 9 per-post inline images to individual post image directories.
- Assign `wpisy-po-polsku` category and `travel`, `indonezja` tags to all posts.
- Add Wayback Machine archive links as `externalLinks` in each post's frontmatter.
- Convert CuteNews emoticons to Unicode emoji.
- Mark summary-only posts (where full text was not archived) with a Polish-language disclaimer.

## Capabilities

### New Capabilities

- `indonezja-blog-restore`: Recovering and importing 16 blog posts and 57 photos from a CuteNews-based travel blog (indonezja.piatka.pl, March 2004) via Wayback Machine archives, including photo gallery, mojibake correction, emoticon-to-emoji conversion, and partial-content disclaimers.

### Modified Capabilities

_(none — no existing spec-level requirements change)_

## Impact

- **Content**: 17 new MDX files added to `content/posts/` (16 posts + 1 gallery).
- **Images**: 60 JPEG files added across 11 directories under `public/images/posts/`.
- **Build**: Static export size increases by ~17 pages; no architectural change.
- **Dependencies**: No new runtime dependencies.
- **Types**: No schema changes — uses existing frontmatter fields (`externalLinks`, `category`, `tags`).

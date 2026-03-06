## Why

Book reviews are the largest content category (27 of 62 posts) but are visually indistinguishable from technical posts — they are text-only with no imagery.
Showing a book cover alongside each review immediately communicates what the post is about and makes the review feel complete, aligning with the Content-First principle (constitution II) by improving the reading experience.

## What Changes

- Download cover images from LibraryThing work pages and store them in `public/images/posts/{slug}/` following the existing per-post image directory convention.
- Insert a plain Markdown cover image at the top of each review's MDX body (after the frontmatter closing delimiter).
- The existing prose rendering pipeline handles display — no new components, type changes, or frontmatter fields required.

## Capabilities

### New Capabilities

- `book-cover-import`: One-time migration script that scrapes cover image URLs from LibraryThing work pages, downloads them to `public/images/posts/{slug}/`, and inserts a Markdown image at the top of each review's MDX body.

### Modified Capabilities

_(none — no existing spec requirements change)_

## Impact

- **Content**: 27 review MDX files updated with a cover image line at the top of the body.
- **Assets**: ~27 cover images added to `public/images/posts/{slug}/cover.{ext}`.
- **Scripts**: New one-time migration script at `scripts/import-covers.ts`.
- **Dependencies**: No new npm dependencies.
- **Build**: Static export size increases by the total size of cover images (estimated ~1-3 MB for 27 images at reasonable resolution).

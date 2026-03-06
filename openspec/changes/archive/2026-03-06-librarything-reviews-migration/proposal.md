## Why

The blog already hosts 36 posts migrated from WordPress and LinkedIn, but the author's 27 book reviews on LibraryThing (https://www.librarything.com/reviews/orientman) remain siloed on a third-party platform.
Importing them as static MDX posts consolidates all written content in one place, aligns with Constitution Principle II (Content-First: Markdown is the canonical format), and keeps the site fully static per Principle I (Simplicity).

## What Changes

- Add 27 new MDX files in `content/posts/`, one per book review, following the existing frontmatter and slug conventions.
- Introduce a `librarythingUrl` frontmatter field to link back to the original review (mirrors the `linkedinUrl` precedent from the LinkedIn import).
- Add the `librarythingUrl` optional field to the TypeScript `Post` interface and content loader.
- Assign a `book-reviews` category (or reuse an existing category) and populate tags derived from review content (e.g., `books`, `reviews`, language-specific tags).
- Map LibraryThing star ratings (1-5, including half-stars) to a `rating` frontmatter field for each review post.
- Convert review HTML to valid Markdown, preserving paragraph breaks and any links.

## Capabilities

### New Capabilities

- `librarything-reviews-import`: Importing 27 book reviews from LibraryThing as MDX blog posts, including frontmatter schema extension (librarythingUrl, rating), HTML-to-Markdown conversion, rating mapping, and category/tag assignment.

### Modified Capabilities

_(none — no existing spec-level requirements change)_

## Impact

- **Content**: 27 new MDX files added to `content/posts/`.
- **TypeScript types**: `Post` interface gains optional `librarythingUrl: string` and optional `rating: number` fields.
- **Content loader**: Must pass through the two new frontmatter fields.
- **Dependencies**: No new runtime dependencies required.
  HTML-to-Markdown conversion is a one-time migration step (script or manual), not a runtime concern.
- **Build**: Static export size increases by ~27 pages; no architectural change.

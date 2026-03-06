## Context

Book reviews (27 of 62 posts) are text-only with no imagery.
Each review has a `librarythingUrl` linking to the original review on LibraryThing.
LibraryThing work pages display a primary cover image sourced from Amazon (e.g., `https://images-na.ssl-images-amazon.com/images/P/{ISBN}...`).
The site uses `output: 'export'` (static HTML) with `images: { unoptimized: true }` — no Next.js image optimization is available.
Posts are rendered via `@next/mdx` with `format: "md"` — standard Markdown images (`![alt](src)`) render as plain `<img>` tags through the existing prose pipeline.

## Goals / Non-Goals

**Goals:**

- Download book cover images from LibraryThing work pages and store them locally.
- Insert a plain Markdown image at the top of each review's MDX body so covers render through the existing prose pipeline.
- Zero engine changes: no new components, no type changes, no frontmatter fields, no content loader modifications.

**Non-Goals:**

- Fetching covers at build time or runtime (covers are downloaded once via a migration script, then committed).
- New `coverImage` frontmatter field or `Post` type changes.
- PostCard thumbnails or any list-view changes.
- OpenGraph metadata changes.
- A `BookCover` component or any new React components.
- Supporting multiple cover images per book.
- Lazy loading optimization or responsive `srcset` (premature for 27 images).

## Decisions

### D1: Local images, not hotlinked

**Decision**: Download cover images to `public/images/posts/{slug}/cover.{ext}` and reference them via local paths.
This follows the existing convention where each post's images live in its own subdirectory under `public/images/posts/`.

**Alternatives considered**:
- Hotlink directly to Amazon/LibraryThing image URLs at runtime.
  Rejected: fragile (URLs change), violates Simplicity principle (external runtime dependency), slower page loads.
- Use a CDN or image proxy.
  Rejected: adds infrastructure complexity, violates "no server-side runtime" constraint.

**Rationale**: Local images are the simplest approach for a static site — they are committed to the repo, served directly, and have zero runtime dependencies.

### D2: Plain Markdown image in MDX body, not frontmatter

**Decision**: Insert a `!["<title>"](/images/posts/<slug>/cover.<ext>)` line at the top of the MDX body (immediately after the frontmatter `---`), rather than adding a frontmatter field.

**Alternatives considered**:
- `coverImage` frontmatter field + dedicated `BookCover` component.
  Rejected: requires type changes, content loader changes, new component — over-engineered for 27 static images.
- Convention-based lookup (e.g., always check for `cover.*` in the post's image directory).
  Rejected: implicit, harder to debug, requires content loader changes.

**Rationale**: A plain Markdown image is the simplest possible approach.
The existing prose rendering pipeline already handles `![alt](src)` — no code changes needed.
The image becomes visible content in the MDX file, making it easy to inspect and edit.

### D3: Cover image not linked to LibraryThing

**Decision**: The cover image is a plain `![alt](src)` without any wrapping link.

**Alternatives considered**:
- Wrap in `[![alt](src)](librarythingUrl)` to link to the LibraryThing page.
  Rejected by user: the existing "Originally on LibraryThing" text link is sufficient.

**Rationale**: Simpler markup, no need for linked images in Markdown.

### D4: One-time migration script using Node.js built-ins

**Decision**: A standalone TypeScript script (`scripts/import-covers.ts`) that:
1. Reads all MDX files with `librarythingUrl` in frontmatter.
2. Derives the LibraryThing work URL from the review URL (strip `/reviews/{id}` suffix).
3. Fetches the work page HTML and extracts the `<img>` src from `#lt2_mainimage_container`.
4. Downloads the image to `public/images/posts/{slug}/cover.{ext}` with directory creation.
5. Inserts a Markdown image line (`!["<title>"](...)`) at the top of the MDX body, after the frontmatter closing `---`.

Uses only built-in `fetch`, `fs/promises`, `path`, and `gray-matter` (already a project dependency).

**Alternatives considered**:
- Manual download of 27 images.
  Rejected: tedious, error-prone.
- Puppeteer/Playwright for JS-rendered pages.
  Rejected: overkill — the cover image URL is in the initial HTML response.

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| LibraryThing work pages may not always have a cover image | Script logs a warning and skips — post renders fine without cover |
| Amazon image URLs on LibraryThing may vary in format | Script extracts whatever `src` is in the main image container — format-agnostic |
| Cover images increase repo size (~1-3 MB for 27 images) | Acceptable for a static blog with few images; can add to `.gitattributes` LFS later if needed |
| LibraryThing may block automated fetches | Script uses reasonable delays between requests; only 27 requests total |
| Markdown image line could be accidentally deleted during editing | Easily re-added by re-running the script (idempotent) |

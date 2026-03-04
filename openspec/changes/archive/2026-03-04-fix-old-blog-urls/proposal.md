## Why

The blog migrated from WordPress to a static site at `blog.orientman.com`, but references to the old `orientman.wordpress.com` domain remain in multiple places.
The feed generator (`scripts/generate-feeds.ts`) uses the old domain as `SITE_URL`, causing every link in `sitemap.xml` and `feed.xml` to point to WordPress instead of the live site.
Several MDX content files contain internal cross-links and image URLs that still reference WordPress.
Three CV page images are hotlinked from WordPress uploads and could break if WordPress removes them.
This undermines the migration's purpose — the canonical domain is `blog.orientman.com` and all user-facing links MUST point there (Constitution Principle II: Content-First).

## What Changes

- Update `SITE_URL` in `scripts/generate-feeds.ts` from `https://orientman.wordpress.com` to `https://blog.orientman.com`.
- Replace internal cross-post links in MDX content files that use `orientman.wordpress.com/YYYY/MM/DD/slug/` with relative paths matching the blog's URL structure.
- Download the 3 CV page images still hosted on `orientman.wordpress.com/wp-content/uploads/` to `public/images/pages/` and update references in `content/pages/curriculum-vitae-pl.mdx`.
- Update the "Blog" link in the CV page to point to `https://blog.orientman.com/`.
- Leave `wordpressUrl` frontmatter fields unchanged — they are historical metadata, not user-facing links.
- Leave the WordPress XML export in `specs/` unchanged — it is a read-only archive.
- Leave URLs inside migrated comment `content` fields as-is — these are historical records and editing them would alter the original commenter's words.

## Capabilities

### New Capabilities

- `url-migration`: Rules and inventory for replacing old WordPress URLs with canonical blog domain URLs across content and build scripts.

### Modified Capabilities

(none)

## Impact

- **Build scripts**: `scripts/generate-feeds.ts` — single constant change; regenerated `sitemap.xml` and `feed.xml` will have correct URLs.
- **Content files**: 3 post MDX files (4 link occurrences) + 1 page MDX file (8 URL occurrences + 2 internal blog links).
- **Static assets**: 3 new image files downloaded to `public/images/pages/`.
- **No dependency changes, no API changes, no breaking changes.**

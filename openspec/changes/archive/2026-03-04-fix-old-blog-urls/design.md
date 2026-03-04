## Context

The blog was migrated from `orientman.wordpress.com` to a static Next.js site at `blog.orientman.com`.
The migration (spec 001) preserved WordPress URL structure and downloaded post images, but left some references to the old domain:

- `scripts/generate-feeds.ts` line 16: `SITE_URL` still set to WordPress domain.
- 3 post MDX files contain 4 internal cross-links using absolute WordPress URLs.
- `content/pages/curriculum-vitae-pl.mdx` contains 3 image URLs pointing to WordPress uploads (not downloaded during migration) and 2 blog links using the old domain.

The WordPress XML export in `specs/` and `wordpressUrl` frontmatter fields are historical metadata and not user-facing.

## Goals / Non-Goals

**Goals:**

- All generated feed URLs (sitemap, RSS) use `https://blog.orientman.com`.
- All internal cross-post links in content use relative paths.
- All content images are self-hosted under `public/images/`.
- CV page blog link points to the canonical domain.

**Non-Goals:**

- Full dead-link audit across all content (external links to third-party sites).
- Modifying the WordPress XML archive in `specs/`.
- Editing migrated comment text.
- Redirecting the old WordPress domain (WordPress.com handles that).

## Decisions

### D1: Relative paths for internal links

**Choice**: Use relative paths (`/YYYY/MM/DD/slug/`) instead of absolute URLs (`https://blog.orientman.com/YYYY/MM/DD/slug/`).

**Rationale**: Relative paths work regardless of domain.
They are simpler and won't need updating if the domain ever changes again.
The blog already uses `trailingSlash: true` in Next.js config, so relative paths with trailing slashes are consistent.

**Alternative considered**: Absolute URLs with new domain — rejected because it couples content to a specific domain.

### D2: CV images in `public/images/pages/`

**Choice**: Store downloaded CV images in `public/images/pages/` using original WordPress filenames.

**Rationale**: Follows the existing convention of `public/images/posts/<slug>/` for post images.
Pages get their own parallel directory.
Original filenames are preserved for traceability back to the WordPress source.

**Alternative considered**: Putting them in `public/images/cv/` — rejected because the `pages/` directory mirrors the content structure (`content/pages/`).

### D3: Leave comment content and wordpressUrl untouched

**Choice**: Do not modify URLs inside comment `content` fields or frontmatter `wordpressUrl` values.

**Rationale**: Comments are historical records written by other people.
`wordpressUrl` is metadata documenting the original source.
Neither is rendered as a navigable link in the current UI (comments render content as text, `wordpressUrl` is not displayed).

## Risks / Trade-offs

- **[WordPress image unavailability]** The 3 CV images are currently hotlinked from WordPress.
  If WordPress removes them before this change lands, the download step will fail.
  Mitigation: This is a small, fast change — implement promptly.

- **[Relative path correctness]** Relative paths must exactly match the existing post URL structure (`/YYYY/MM/DD/slug/`).
  Mitigation: Each replacement is manually verified against the target post's frontmatter date and slug.

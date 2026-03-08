# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/),
and this project adheres to [Semantic Versioning](https://semver.org/).

> **Versioning scheme:** MAJOR for platform-level overhauls, MINOR for
> new user-visible features and content migrations, PATCH for bug fixes,
> content corrections, and developer tooling changes.

## [1.20.0] - 2026-03-07

### Added

- Social share buttons (X/Twitter, Facebook, LinkedIn, copy-link) below each post
- Extracted sidebar SVG icons into a shared module for reuse

## [1.19.0] - 2026-03-07

### Added

- Giscus comment system (GitHub Discussions-backed) for posts without legacy WordPress comments
- Lazy loading via `IntersectionObserver` and dark mode synchronisation
- New dependency: `@giscus/react`

## [1.18.0] - 2026-03-07

### Added

- Centralised `siteConfig.ts` replacing ~30 hardcoded site metadata occurrences
- Social media icon links (X, Facebook, LinkedIn, GitHub, RSS) in sidebar About section

## [1.17.0] - 2026-03-07

### Added

- GoatCounter privacy-first analytics via `next/script` (afterInteractive strategy)
- Zero npm dependencies, no cookies, no consent banner required

## [1.16.0] - 2026-03-07

### Added

- "Currently Reading" sidebar widget fetching up to 5 books from Goodreads shelf via RSS at build time
- Book covers, titles, authors, and link to full shelf

## [1.15.0] - 2026-03-07

### Added

- "Search" link in site header navigation between CV and dark mode toggle
- Accessible from all pages including mobile viewports

## [1.14.1] - 2026-03-07

### Fixed

- Pagefind search results now show clean post titles instead of site-wide HTML `<title>` template
- Added `data-pagefind-ignore` to non-content sections (nav, related posts, comments)

## [1.14.0] - 2026-03-07

### Changed

- Replaced single-purpose `librarythingUrl` and `linkedinUrl` frontmatter fields with generic `externalLinks` array (`{ label, url }[]`)
- Migrated all 30 affected posts to new format

### Added

- Goodreads links for 27 book reviews via RSS-based import script

## [1.13.0] - 2026-03-07

### Changed

- Moved book cover images from inline Markdown body to explicit `coverImage` frontmatter field

### Added

- Cover thumbnails in PostCard list views
- Larger cover image in post detail page header

## [1.12.0] - 2026-03-06

### Added

- Book cover images downloaded from LibraryThing for 27 reviews into `public/images/posts/{slug}/`
- Inline Markdown cover images at the top of each review's MDX body via migration script

## [1.11.0] - 2026-03-06

### Added

- Reusable `StarRating` component rendering filled, half-filled, and empty stars from `rating` frontmatter field
- Star ratings displayed on both individual post pages and post cards for book reviews

## [1.10.0] - 2026-03-06

### Added

- 27 book reviews imported from LibraryThing as MDX blog posts
- `librarythingUrl` frontmatter field for provenance tracking
- `rating` frontmatter field (1–5, half-star increments)

## [1.9.0] - 2026-03-06

### Added

- 2 long-form LinkedIn articles and 1 short LinkedIn post migrated as MDX blog posts
- Optional `linkedinUrl` frontmatter field for provenance tracking
- New AI/technology tags

## [1.8.0] - 2026-03-06

### Changed

- Upgraded Next.js 14 → 16 and React 18 → 19
- Migrated 5 dynamic route files from synchronous to async `params` access
- Added `--webpack` build flag (Turbopack incompatible with MDX)
- Updated `@next/mdx` to v16

## [1.7.0] - 2026-03-05

### Added

- HTML-rendered post excerpts preserving inline Markdown formatting (bold, italic, links, blockquotes)
- remark/rehype pipeline for excerpt rendering
- Plain-text excerpts retained for SEO and RSS

## [1.6.2] - 2026-03-05

### Fixed

- Quote-format posts no longer produce double-nested `<blockquote>` elements
- Replaced outer `<blockquote>` wrapper in `QuotePost.tsx` with a non-semantic `<div>`

## [1.6.1] - 2026-03-05

### Changed

- Increased post excerpt length from 160 to 500 characters in listing pages and RSS feeds

## [1.6.0] - 2026-03-05

### Changed

- Overhauled visual identity to match original WordPress Chateau theme
- Replaced blue accent colour with green (`#88c34b`)
- Added serif headings, editorial date blocks on post cards, green top border
- Added subtitle tilde prefix, longer card excerpts, and CV nav link

## [1.5.1] - 2026-03-05

### Added

- ESLint v9 flat config with TypeScript, React, and Next.js rules
- Prettier code formatter with npm scripts for linting/formatting
- CI lint step in GitHub Actions deploy workflow
- Fixed all existing lint violations

## [1.5.0] - 2026-03-05

### Added

- "Related Posts" section on individual post pages showing 2–3 posts with most shared-tag overlap
- Computed at build time with no new dependencies

## [1.4.0] - 2026-03-05

### Changed

- Replaced `useState`-based pagination with URL search parameter (`?page=N`) synchronisation
- Page state now survives refresh, back-navigation, and can be shared via URL

## [1.3.1] - 2026-03-04

### Removed

- `TAG_SLUG_MAP` hardcoded lookup table for 6 special display names (`F#`, `C#`, `.NET`, etc.)
- Tags like `F#` now display as their slug form (`fsharp`)

## [1.3.0] - 2026-03-04

### Changed

- Replaced flat four-tier tag sizing with continuous logarithmic font-size scale matching WordPress `wp_tag_cloud` behaviour
- Preserved hyphenated tag display names across all tag rendering surfaces

## [1.2.0] - 2026-03-04

### Added

- `/tags/` route displaying all tags alphabetically with post counts
- Links to individual tag pages for improved content discoverability

## [1.1.1] - 2026-03-04

### Fixed

- Replaced leftover `orientman.wordpress.com` URLs in build scripts, MDX content, and CV page with canonical `blog.orientman.com` domain
- Downloaded 3 externally-hosted CV images to local storage

## [1.1.0] - 2026-03-03

### Added

- Author Gravatar avatar image in sidebar "About" section
- Restores visual parity with original WordPress blog

## [1.0.7] - 2026-03-03

### Changed

- Migrated development workflow from spec-kit to OpenSpec
- Added OpenSpec CLI commands, skills, and prompt files

## [1.0.6] - 2026-03-01

### Fixed

- Comment timestamps now show time alongside date on historical comments
- Corrected datetime format in frontmatter and `Comment.tsx`

## [1.0.5] - 2026-03-01

### Fixed

- Comment dates no longer display as "undefined NaN, NaN"
- Fixed date parsing in `content.ts` and `Comment.tsx`

## [1.0.4] - 2026-03-01

### Added

- Syntax highlighting with Shiki via `rehype-pretty-code`
- Code copy button, line numbers, and dual light/dark theme
- Audit script for code block language tags

## [1.0.3] - 2026-03-01

### Fixed

- GFM strikethrough rendering now works correctly
- Added `remark-gfm` plugin to MDX pipeline

## [1.0.2] - 2026-02-28

### Fixed

- Replaced bare GitHub Gist URLs with inline fenced code blocks in 5 posts
- Gist embeds now render as static syntax-highlighted code

## [1.0.1] - 2026-02-28

### Added

- GitHub Pages deployment workflow (GitHub Actions)
- Custom domain configuration (`blog.orientman.com`)
- CNAME file and deploy pipeline with Node.js 20 LTS

## [1.0.0] - 2026-02-28

### Added

- WordPress-to-Next.js 14 static site migration
- MDX content pipeline with `@next/mdx` and `gray-matter` frontmatter
- 40+ blog posts migrated from WordPress export
- Tailwind CSS styling with `@tailwindcss/typography`
- Pagefind client-side search
- Tag-based navigation and paginated post listings
- Legacy WordPress comment preservation
- Static export (`output: 'export'`) for GitHub Pages hosting

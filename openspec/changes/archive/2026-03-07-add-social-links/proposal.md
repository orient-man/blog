## Why

Author identity (name, site title, tagline, URLs, avatar hash) is hardcoded across 8+ source files (~30 occurrences), making updates error-prone.
The blog has no social media links anywhere in the layout -- the author's profiles (GitHub, X, LinkedIn, Facebook) are only mentioned on the CV page content.
Adding social links requires a place to store them; consolidating scattered site metadata at the same time is a natural fit.
This supports the Content-First principle by keeping authored content separate from site configuration, and respects Simplicity by avoiding new dependencies.

## What Changes

- Create a centralized `siteConfig.ts` with author name, site title, tagline, site URL, gravatar hash, GoatCounter ID, and social link definitions.
- Replace hardcoded values in `src/` components and `scripts/generate-feeds.ts` with imports from the config.
- Add a row of social media icons (X, Facebook, LinkedIn, GitHub, RSS) to the sidebar About section, below the bio text.
- Icons rendered as inline SVGs (consistent with existing `DarkModeToggle` and `StarRating` patterns) -- no new dependencies.

## Capabilities

### New Capabilities

- `site-config`: Centralized site metadata and social link definitions, replacing values scattered across multiple files.
- `social-links`: Social media icon links in the sidebar About section (X, Facebook, LinkedIn, GitHub, RSS).

### Modified Capabilities

_(none -- no existing spec-level requirements are changing)_

## Impact

- **Files modified**: `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/tag/[slug]/page.tsx`, `src/app/category/[slug]/page.tsx`, `src/app/archive/[year]/[month]/page.tsx`, `src/components/Sidebar.tsx`, `src/lib/content.ts`, `scripts/generate-feeds.ts`.
- **New file**: `src/lib/siteConfig.ts`.
- **Dependencies**: None added.
- **Risk**: Low -- purely additive (social links) plus mechanical refactoring (config consolidation).
  The one-off import scripts (`migrate.ts`, `import-librarything.ts`, etc.) are intentionally left unchanged.

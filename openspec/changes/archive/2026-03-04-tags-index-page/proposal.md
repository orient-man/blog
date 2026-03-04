## Why

The sidebar tag cloud displays only the top 20 tags.
There is no way for readers to browse the full set of tags used across all posts.
A dedicated `/tags/` page gives visitors a complete overview of all topics covered on the blog, improving content discoverability.

## What Changes

- Add a new `/tags/` route that renders every tag with its post count.
- Tags are displayed alphabetically, each linking to its existing `/tag/:slug/` page.
- The page is statically generated at build time, consistent with the blog's static-export architecture.

## Capabilities

### New Capabilities

- `tags-index`: A standalone page at `/tags/` listing all tags with counts and links to individual tag pages.

### Modified Capabilities

_None. No existing spec-level requirements change._

## Impact

- **New route**: `src/app/tags/page.tsx` — static page, no new dynamic params needed.
- **Existing data layer**: Reuses `getAllTags()` from `src/lib/content.ts` — no changes required.
- **Navigation**: The sidebar tag cloud "Showing top N of M tags" text could link to the new page (optional enhancement, not a new capability).
- **Dependencies**: No new dependencies. Uses existing Tailwind CSS utilities.

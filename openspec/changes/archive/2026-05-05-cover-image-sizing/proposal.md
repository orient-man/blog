## Why

Cover images on non-review posts (e.g., landscape diagrams, wide illustrations) render at 320px max-width — the same constraint designed for portrait book covers.
This makes them illegibly small on the detail page and uselessly tiny on the front-page card.
The reading experience for non-book posts suffers (Content-First principle).

## What Changes

- Add an optional `coverSize` frontmatter field (`"full"`) to opt specific posts into larger rendering.
- Default behavior (no `coverSize`) remains compact — no change for the ~20+ existing review posts.
- Detail page: `coverSize: full` images render at content-width (up to `max-w-2xl`), centered.
- PostCard: `coverSize: full` images get a wider thumbnail slot in the same row layout.
- Update existing `review-cover-display` spec requirements to account for the new sizing mode.

## Capabilities

### New Capabilities

_None_ — this extends the existing `review-cover-display` capability rather than introducing a new one.

### Modified Capabilities

- `review-cover-display`: FR-003 (detail page sizing) and FR-005 (PostCard thumbnail sizing) need to support a second mode for wide/landscape images via `coverSize: full`.

## Impact

- `src/lib/types.ts` — add `coverSize?: "full"` to `Post` type
- `src/lib/content.ts` — read `coverSize` from frontmatter
- `src/app/[year]/[month]/[day]/[slug]/page.tsx` — conditional classes based on `coverSize`
- `src/components/PostCard.tsx` — wider thumbnail when `coverSize` is `full`
- `content/posts/agentic-frameworks-vs-agentic-coding-tools.mdx` — add `coverSize: full`
- `content/posts/you-dont-need-an-app-for-that.mdx` — add `coverSize: full` (if it has a coverImage)

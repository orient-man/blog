## Why

The blog's pagination state lives entirely in React `useState`, so the current page is lost on refresh, back-navigation, and cannot be shared via URL.
Readers who browse to page 3 and then click a post lose their place when they return; sharing a link to an interesting batch of older posts is impossible.
URL-aware pagination fixes this with zero server-side requirements, keeping the site fully static per Constitution Principle I (Simplicity).

## What Changes

- Replace `useState`-based page tracking in `PostList` with URL search-parameter (`?page=N`) synchronization.
- Derive current page from `window.location` search params; update URL on page change using `history.replaceState` (no full navigation).
- Preserve existing pagination UI (Newer / Older buttons, page counter, post range indicator).
- Default to page 1 when `?page` is absent or invalid, maintaining backward compatibility with existing bookmarks and links.
- Ensure page parameter works identically across all listing surfaces: homepage, category, tag, and archive pages.

## Capabilities

### New Capabilities

- `url-pagination`: Client-side pagination that reads and writes page state to URL search parameters, enabling bookmarkable and shareable paginated views.

### Modified Capabilities

_(none -- no existing spec-level requirements change; this is a new behavioral capability)_

## Impact

- **Code**: `src/components/PostList.tsx` -- primary change target; replace `useState(0)` with URL-derived state.
- **Routes**: No new routes or `generateStaticParams` changes required -- search params are client-side only and do not affect static export.
- **Dependencies**: No new dependencies; uses built-in browser APIs (`URLSearchParams`, `history.replaceState`) and standard React hooks.
- **Testing**: Manual verification across homepage, category, tag, and archive listing pages; confirm page param survives refresh and back-navigation.
- **SEO**: Search params are not indexed for static-export sites by default; no SEO regression.

## Context

The blog currently paginates post listings using React `useState(0)` in `src/components/PostList.tsx`.
All posts are loaded at build time and sliced client-side.
The page state is invisible to the URL, so it is lost on refresh, cannot be bookmarked, and cannot be shared.

The site uses Next.js 14 with `output: 'export'` (fully static).
There is no server runtime, no API routes, and no middleware.
URL search parameters (`?page=N`) are the only mechanism that works without changing the static export model.

Four listing pages consume the `PostList` component: homepage, category, tag, and archive.

## Goals / Non-Goals

**Goals:**

- Make pagination state bookmarkable and shareable via `?page=N` search parameter.
- Preserve page state across browser refresh and back-navigation.
- Zero new runtime dependencies.
- No changes to routing, static export, or build process.

**Non-Goals:**

- Server-side pagination or route-based pagination (e.g., `/page/2/`) -- this would require `generateStaticParams` changes and complicate the static export.
- Infinite scroll or load-more patterns.
- Preloading or prefetching adjacent pages.
- Analytics or tracking of page views by page number.

## Decisions

### 1. URL mechanism: search params over route segments

**Choice**: `?page=N` search parameter.

**Alternatives considered**:
- Route-based (`/page/2/`): Would require new dynamic route segments, `generateStaticParams` for every listing surface, and multiply the number of static HTML files generated. Rejected per Constitution Principle I (Simplicity).
- Hash fragment (`#page=2`): Not sent to server (irrelevant for static site, but non-standard for pagination). Worse discoverability. Rejected.

**Rationale**: Search params are client-side only in a static export.
They require no build changes, no new routes, and are the standard web convention for filtering/pagination state.

### 2. History API: replaceState over pushState

**Choice**: `history.replaceState` when user clicks Newer/Older.

**Alternatives considered**:
- `pushState`: Creates a new history entry per page click. A user browsing 4 pages would need 4 back-button presses to leave the listing page. Rejected as poor UX.
- `router.push` / `router.replace` (Next.js): Triggers React re-rendering through Next.js navigation. Heavier than needed for a search-param-only change. May cause unexpected Suspense boundary issues in static export. Rejected for simplicity.

**Rationale**: `replaceState` updates the URL without adding history entries, keeping browser history clean.
The component re-renders through normal React state flow.

### 3. Implementation: custom hook over inline logic

**Choice**: Extract a `usePageParam(totalPages)` hook in `src/hooks/use-page-param.ts`.

**Alternatives considered**:
- Inline in `PostList.tsx`: Keeps everything in one file but mixes URL concerns with rendering. Harder to test independently.
- Next.js `useSearchParams()`: Requires wrapping in `<Suspense>` for static export, adds framework coupling for a single parameter read.

**Rationale**: A focused hook isolates URL read/write logic, is reusable if other components need URL state, and keeps `PostList.tsx` clean.
The hook returns `[page, setPage]` -- same interface as `useState` -- so the refactor in `PostList` is minimal.

### 4. Page numbering: 1-based in URL, 0-based internal

**Choice**: URL shows `?page=1` for the first page; internal state remains 0-indexed.

**Rationale**: Users expect 1-based page numbers in URLs.
The hook handles the translation: reads `?page=N` and returns `N - 1` internally; writes `page + 1` to the URL.
Page 1 removes the `?page` param entirely for clean default URLs.

### 5. Invalid values: clamp, not error

**Choice**: Clamp out-of-range values to `[0, totalPages - 1]` (internal) silently.

**Rationale**: A user manually editing the URL to `?page=999` should see the last page, not an error.
Non-numeric values default to page 0 (first page).
This matches how most pagination systems behave on the web.

## Risks / Trade-offs

**[Risk] URL parameter not read on client-side hydration** -- In static export, the HTML is pre-rendered without search params. The hook reads the URL only after hydration in a `useEffect`, so there is a brief flash where page 1 content shows before switching to the correct page.
Mitigation: This is a single-frame flash and acceptable for a static blog. If it becomes noticeable, a loading skeleton could mask it, but this is unlikely to be needed with 33 posts.

**[Risk] Browser compatibility** -- `URLSearchParams` and `history.replaceState` are supported in all modern browsers (ES2017+). No IE11 concern for this project.
Mitigation: None needed.

**[Trade-off] replaceState means no per-page history** -- Users cannot use back/forward to navigate between pages within a listing. They must use the Newer/Older buttons.
Accepted: This is standard pagination behavior and avoids history pollution.

## Open Questions

None -- the scope is narrow and well-understood.

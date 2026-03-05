## 1. Create usePageParam hook

- [ ] 1.1 Create `src/hooks/use-page-param.ts` with a `usePageParam(totalPages: number)` hook that returns `[page, setPage]` (0-based internally, 1-based in URL) (P1)
- [ ] 1.2 Read `?page=N` from `window.location.search` via `URLSearchParams` inside a `useEffect` on mount (P1)
- [ ] 1.3 Clamp invalid values: non-numeric, zero, negative, and out-of-range values default to first/last page as appropriate (P1)
- [ ] 1.4 Write URL updates via `history.replaceState`; remove `?page` param when on page 1 for clean default URLs (P1)

## 2. Refactor PostList component

- [ ] 2.1 Replace `useState(0)` in `src/components/PostList.tsx` with `usePageParam(totalPages)` (P1)
- [ ] 2.2 Preserve existing pagination UI: Newer/Older buttons, page counter, range indicator, scroll-to-top (P1)
- [ ] 2.3 Verify `PostList` still works as a client component (`'use client'` directive) with the new hook (P2)

## 3. Verification

- [ ] 3.1 Build the site (`npm run build`) and confirm no build errors (P1)
- [ ] 3.2 Test homepage pagination: navigate pages, verify URL updates, refresh preserves page (P1)
- [ ] 3.3 Test category page (`/category/[slug]/`): verify `?page=N` works correctly (P2)
- [ ] 3.4 Test tag page (`/tag/[slug]/`): verify `?page=N` works correctly (P2)
- [ ] 3.5 Test archive page (`/archive/[year]/[month]/`): verify `?page=N` works correctly (P2)
- [ ] 3.6 Test edge cases: `?page=abc`, `?page=0`, `?page=-1`, `?page=999`, no `?page` param (P2)
- [ ] 3.7 Test back-navigation: view page 3, click a post, press back -- confirm page 3 is restored (P2)

## Why

Individual post pages offer only chronological Older/Newer navigation, giving readers no topical discovery path.
A "Related Posts" section surfaces 2–3 posts that share tags with the current post, keeping readers engaged with content they care about — without adding any runtime dependencies or server-side logic (Principle I: Simplicity).

## What Changes

- Add a `getRelatedPosts(slug, count)` function to the content library that scores posts by shared-tag overlap.
- Add a `RelatedPosts` component that renders a compact list of related post cards.
- Integrate the component into the individual post page, between comments and the Older/Newer navigation.
- Gracefully degrade: if fewer than 2 related posts exist (e.g., a post with no tags), the section is omitted entirely.

## Capabilities

### New Capabilities

- `related-posts`: Tag-based relatedness scoring and UI section on individual post pages, showing 2–3 related posts.

### Modified Capabilities

(none)

## Impact

- **Code:** `src/lib/content.ts` (new function), new component in `src/components/`, post page template in `src/app/[year]/[month]/[day]/[slug]/page.tsx`.
- **APIs:** None — all computation happens at build time during static export.
- **Dependencies:** None added — plain TypeScript tag-overlap scoring.
- **Performance:** Negligible build-time cost; 33 posts × O(n) scoring is trivial.

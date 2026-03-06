## 1. StarRating Component

- [x] 1.1 Create `src/components/StarRating.tsx` with inline SVG stars (filled, half, empty) accepting `rating: number` and optional `size?: "sm" | "md"` props (FR-001)
- [x] 1.2 Add visually-hidden accessible label "Rating: X out of 5" and `aria-hidden` on star icons (FR-002)
- [x] 1.3 Display numeric rating value as text next to the stars (D6)
- [x] 1.4 Style stars with `text-amber-400` filled / `text-gray-300 dark:text-gray-600` empty; verify both light and dark mode (FR-006)

## 2. Post Page Integration

- [x] 2.1 Import `StarRating` in `src/app/[year]/[month]/[day]/[slug]/page.tsx` and render below source links when `post.rating` is defined (FR-003)
- [x] 2.2 Verify book review post (e.g., `/2025/08/16/thinking-fast-and-slow-review`) shows correct stars and non-review post shows none

## 3. PostCard Integration

- [x] 3.1 Add `rating` to `PostCard` props `Pick<Post, ...>` type union (FR-004)
- [x] 3.2 Render `StarRating` with `size="sm"` in the metadata footer row when `post.rating` is defined (FR-004)
- [x] 3.3 Pass `rating` from post data in all call sites that render `PostCard`

## 4. Verification

- [x] 4.1 Run `npm run build` and confirm static export succeeds with no errors (FR-005, no new dependencies)
- [x] 4.2 Run `npm run lint` and confirm no linting errors
- [x] 4.3 Spot-check rendered HTML for accessibility attributes (aria-hidden, sr-only label)

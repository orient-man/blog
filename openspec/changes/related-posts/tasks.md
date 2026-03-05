## 1. Relatedness Scoring (P1)

- [x] 1.1 Add `getRelatedPosts(slug: string, count?: number): Post[]` function to `src/lib/content.ts` that scores candidates by shared-tag count, applies a +0.5 same-category bonus, tiebreaks by recency, excludes the current post, and returns the top `count` results (default 3). (FR-002, FR-003, FR-004, FR-005)

## 2. Related Posts Component (P1)

- [x] 2.1 Create `src/components/RelatedPosts.tsx` component that accepts a `Post[]` prop and renders a "Related Posts" heading with a compact list of entries: linked title, formatted date, and tag pills (no excerpt). (FR-007)
- [x] 2.2 Component MUST render nothing when the posts array has fewer than 2 items. (FR-006)

## 3. Post Page Integration (P1)

- [x] 3.1 Import and wire `RelatedPosts` into `src/app/[year]/[month]/[day]/[slug]/page.tsx`: call `getRelatedPosts(post.slug, 3)` and render the component between the comments section and the Older/Newer navigation. (FR-001)

## 4. Verification (P2)

- [x] 4.1 Run `npm run build` and confirm static export succeeds with no errors.
- [x] 4.2 Spot-check 3–4 post pages in the build output to verify related posts appear with correct content and that posts with no tags omit the section.

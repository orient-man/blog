## 1. Pagefind Title Metadata (FR-001)

- [x] 1.1 Add `data-pagefind-meta="title"` attribute to the post `<h1>` element in `src/app/[year]/[month]/[day]/[slug]/page.tsx` (P1)

## 2. Exclude Non-Content Sections (FR-002)

- [x] 2.1 Add `data-pagefind-ignore` to the prev/next post navigation block in `src/app/[year]/[month]/[day]/[slug]/page.tsx` (P2)
- [x] 2.2 Add `data-pagefind-ignore` to the `<RelatedPosts>` wrapper in `src/app/[year]/[month]/[day]/[slug]/page.tsx` (P2)
- [x] 2.3 Add `data-pagefind-ignore` to the `<CommentList>` wrapper in `src/app/[year]/[month]/[day]/[slug]/page.tsx` (P2)

## 3. Verification (FR-001, FR-002, FR-003)

- [x] 3.1 Run `npm run build` to produce static output and trigger Pagefind indexing (P1)
- [x] 3.2 Run `npm run lint` and fix any warnings or errors (P1)

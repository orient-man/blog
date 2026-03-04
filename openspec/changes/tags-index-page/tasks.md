## 1. Tags Index Page

- [x] 1.1 Create `src/app/tags/page.tsx` — server component that calls `getAllTags()`, sorts alphabetically by display name, and renders all tags as pill-styled links with post counts
- [x] 1.2 Add page metadata (title: "Tags — Orient Man", description)
- [x] 1.3 Style the tags list using Tailwind utilities (pill layout with flex-wrap, consistent with existing tag cloud styling)

## 2. Sidebar Tag Cloud Enhancement

- [x] 2.1 Update `src/components/TagCloud.tsx` — change the "Showing top N of M tags" text to a `<Link>` pointing to `/tags/`

## 3. Verification

- [x] 3.1 Run `npm run build` and confirm `out/tags/index.html` is generated
- [x] 3.2 Verify all tags are displayed on the page with correct display names and counts
- [x] 3.3 Verify each tag links to `/tag/:slug/` correctly
- [x] 3.4 Verify sidebar "Showing top N of M tags" links to `/tags/`

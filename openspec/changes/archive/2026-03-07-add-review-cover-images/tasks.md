## 1. Type system and content loader

- [x] T001 (P1) Add `coverImage?: string` to the `Post` interface in `src/lib/types.ts`
- [x] T002 (P1) Read `coverImage` from frontmatter in `loadPosts()` in `src/lib/content.ts`

## 2. PostCard thumbnail

- [x] T003 (P2) Add `"coverImage"` to `PostCardProps` `Pick<>` in `src/components/PostCard.tsx`
- [x] T004 (P2) Render conditional thumbnail on the right side of the card, linked to the post URL; desktop ~60-80px wide, mobile ~48px wide; no placeholder when absent

## 3. Post detail page cover

- [x] T005 (P2) Render `coverImage` in a `<figure>` between `</header>` and the prose `<div>` in `src/app/[year]/[month]/[day]/[slug]/page.tsx`; centered, max-width constrained, hidden when absent

## 4. Content migration — review post MDX files

- [x] T006 (P3) Add `coverImage: /images/posts/<slug>/cover.jpg` to frontmatter of the 25 review posts that have cover files
- [x] T007 (P3) Remove the inline `![...]()` cover image line from the MDX body of those 25 review posts
- [x] T008 (P3) Verify the 2 review posts without covers (`kiczery-podroz-przez-bieszczady-review`, `zmierzch-husajna-burza-nad-irakiem-review`) have no `coverImage` field and render unchanged

## 5. Verification

- [x] T009 (P2) Build the site (`npm run build`) and confirm no errors
- [x] T010 (P3) Spot-check listing pages: review cards show thumbnail, non-review cards unchanged
- [x] T011 (P3) Spot-check a review post detail page: cover image appears between header and prose, no duplicate image in body

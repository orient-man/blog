## 1. Cover Image Import Script

- [ ] 1.1 Create `scripts/import-covers.ts` that reads all MDX files in `content/posts/` with `librarythingUrl` in frontmatter
- [ ] 1.2 Implement LibraryThing work URL derivation from the review URL (strip `/reviews/{id}` suffix)
- [ ] 1.3 Implement HTML fetching and cover image URL extraction from `#lt2_mainimage_container img[src]`
- [ ] 1.4 Implement image download to `public/images/posts/{slug}/cover.{ext}` with directory creation and skip-if-exists logic
- [ ] 1.5 Implement MDX body image insertion: add `!["<title>"](/images/posts/<slug>/cover.<ext>)` as the first line after the frontmatter `---`, with idempotency check (skip if already present)
- [ ] 1.6 Add progress logging and summary output (processed, downloaded, skipped, failed)

## 2. Run Import and Verify

- [ ] 2.1 Run the script to import all 27 cover images and verify results
- [ ] 2.2 Build the site (`npm run build`) and verify no errors
- [ ] 2.3 Spot-check a few review posts to confirm cover images render correctly in prose
- [ ] 2.4 Verify a non-review post is unaffected

## 1. Type System Extension

- [ ] 1.1 Add optional `librarythingUrl: string` field to `Post` interface in `src/lib/types.ts` (FR-007)
- [ ] 1.2 Add optional `rating: number` field to `Post` interface in `src/lib/types.ts` (FR-007)

## 2. Content Loader Update

- [ ] 2.1 Update `loadPosts()` in `src/lib/content.ts` to pass through `librarythingUrl` from frontmatter (FR-007)
- [ ] 2.2 Update `loadPosts()` in `src/lib/content.ts` to pass through `rating` as a number from frontmatter (FR-007)

## 3. Migration Script

- [ ] 3.1 Create `scripts/import-librarything.ts` that reads the saved LibraryThing HTML file (FR-010)
- [ ] 3.2 Implement HTML parsing to extract review metadata: book title, author, form_rating, date, review text (FR-001, FR-002, FR-003)
- [ ] 3.3 Implement rating mapping: `form_rating / 2` → star rating (FR-003)
- [ ] 3.4 Implement slug generation: kebab-case book title + `-review` suffix, Polish diacritics stripped to ASCII (FR-001)
- [ ] 3.5 Implement HTML-to-Markdown conversion for review text: paragraph breaks, HTML entity decoding, link conversion (FR-005)
- [ ] 3.6 Implement frontmatter generation with all required fields: title, date, author, slug, category, tags, format, wordpressUrl, librarythingUrl, rating (FR-002, FR-004, FR-008, FR-009)
- [ ] 3.7 Implement language detection heuristic for category assignment (FR-004)
- [ ] 3.8 Write MDX files to `content/posts/` (FR-010)

## 4. Run Migration and Verify

- [ ] 4.1 Run the import script and verify 27 MDX files are created (FR-010)
- [ ] 4.2 Verify frontmatter fields are correct across all generated files (FR-002)
- [ ] 4.3 Verify the blog builds successfully with `npm run build` (no type errors, no broken pages)
- [ ] 4.4 Spot-check that review posts render correctly and appear in archive, tag cloud, and search

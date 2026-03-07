## 1. Data Model & Content Loading (P1)

- [x] 1.1 Update `Post` interface in `src/lib/types.ts`: add `externalLinks?: { label: string; url: string }[]`, remove `librarythingUrl` and `linkedinUrl`
- [x] 1.2 Update content loader in `src/lib/content.ts`: read `externalLinks` from frontmatter, stop reading `librarythingUrl` and `linkedinUrl`

## 2. Post Detail Rendering (P1)

- [x] 2.1 Replace per-field link conditionals in `src/app/[year]/[month]/[day]/[slug]/page.tsx` with a generic loop over `externalLinks`, rendering each as "Also on {label} →"

## 3. Frontmatter Migration Script (P1)

- [x] 3.1 Create `scripts/migrate-external-links.ts`: read all 30 MDX files with `librarythingUrl` or `linkedinUrl`, replace with `externalLinks` array, preserve all other frontmatter and body content
- [x] 3.2 Run the migration script and verify all 30 files are updated correctly

## 4. Goodreads Import Script (P2)

- [x] 4.1 Create `scripts/import-goodreads.ts`: fetch and parse the Goodreads RSS feed (all pages), extract `book_id`, `title`, `author_name` per item
- [x] 4.2 Implement two-pass matching: normalized title match, then author + date fallback, with a manual override map for edge cases
- [x] 4.3 Inject matched Goodreads URLs into `externalLinks` arrays in the 27 review MDX files
- [x] 4.4 Run the import script — 17/27 reviews received Goodreads links (10 books not on Goodreads shelf, accepted)

## 5. Update Existing Scripts (P3)

- [x] 5.1 Update `scripts/import-librarything.ts` to emit `externalLinks` with `{ label: "LibraryThing", url: ... }` instead of `librarythingUrl`
- [x] 5.2 Update `scripts/import-covers.ts` to identify review posts by `externalLinks` entry with `label: "LibraryThing"` instead of `librarythingUrl`

## 6. Verification (P1)

- [x] 6.1 Run `npm run lint` and fix any errors or warnings
- [x] 6.2 Run `npm run build` and verify successful static export with no errors

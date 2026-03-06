## Context

The blog currently hosts 36 MDX posts migrated from WordPress and LinkedIn.
The `Post` interface in `src/lib/types.ts` already supports optional `linkedinUrl` — a precedent set by the LinkedIn content import.
The content loader (`src/lib/content.ts:49-98`) reads `content/posts/*.mdx`, parses frontmatter with `gray-matter`, normalises tags and dates, and returns sorted `Post[]`.

The author has 27 book reviews on LibraryThing that should live alongside the existing posts.
Reviews include: title, author, star rating (1-5, half-star granularity), date, and review text (Polish or English).
The raw HTML has been fetched and saved; ratings are encoded as hidden `form_rating` inputs (value / 2 = stars).

## Goals / Non-Goals

**Goals:**

- Import all 27 book reviews as first-class MDX blog posts.
- Extend the `Post` type with optional `librarythingUrl` and `rating` fields.
- Keep the migration a one-time, build-time-independent process (a script that produces committed MDX files).
- Integrate reviews into existing tag cloud, archive, and search (Pagefind) with no special-casing.

**Non-Goals:**

- Real-time sync with LibraryThing — this is a one-shot import.
- A dedicated "book reviews" section or page layout — reviews are standard blog posts.
- Fetching cover images from LibraryThing or other APIs.
- Adding a new category slug — reviews will use the existing `posts-in-english` or `wpisy-po-polsku` categories based on review language.

## Decisions

### D1: One-time TypeScript migration script (not a runtime feature)

**Choice:** A standalone `scripts/import-librarything.ts` script run with `npx tsx`.

**Rationale:** Constitution Principle I (Simplicity) — the blog must remain static with no dynamic backends.
The script reads the saved HTML file, extracts review data, generates MDX files, and exits.
No new runtime dependency; `tsx` is a dev dependency only.

**Alternatives considered:**
- Manual creation of 27 MDX files — error-prone and tedious.
- A build-time plugin — adds permanent complexity for a one-shot task.

### D2: Extend frontmatter with `librarythingUrl` and `rating`

**Choice:** Add two optional fields to `Post`:
- `librarythingUrl?: string` — link to the original LibraryThing review.
- `rating?: number` — star rating (1-5, half-star precision, e.g. 3.5).

**Rationale:** Follows the `linkedinUrl` precedent.
The `rating` field is numeric rather than a string to enable future sorting or display.
Both fields are optional so existing posts are unaffected.

**Alternatives considered:**
- Encoding rating in tags (e.g. `rating-4`) — loses numeric precision and pollutes the tag namespace.
- A separate `reviews` content type — adds complexity with no benefit; reviews are just posts.

### D3: Slug derived from book title

**Choice:** `{kebab-case-book-title}-review` (e.g. `clean-code-review.mdx`).

**Rationale:** Consistent with existing slug conventions.
The `-review` suffix disambiguates from a potential future post about the same book.
Polish diacritics are stripped to ASCII (same rule as LinkedIn import: FR-001 scenario 2).

### D4: Rating mapping from HTML form values

**Choice:** `form_rating` hidden input value divided by 2 equals the star rating.
Values observed: 2→1★, 3→1.5★, 4→2★, 5→2.5★, 7→3.5★, 8→4★, 9→4.5★, 10→5★.

**Rationale:** Direct arithmetic mapping; no lookup table needed.

### D5: Category assignment by review language

**Choice:** Reuse existing `CategorySlug` values.
Polish reviews → `wpisy-po-polsku`; English reviews → `posts-in-english`.

**Rationale:** No new category needed; keeps the type system unchanged.
Language detection is manual (the author knows which reviews are in which language) or based on simple heuristics (Polish diacritics, common Polish words).

### D6: Date handling

**Choice:** Use the LibraryThing review date as the post date.
Format as ISO 8601 (`YYYY-MM-DD`) in frontmatter.

**Rationale:** Preserves chronological accuracy.
Reviews will appear at their original date in the archive and sort order.

## Risks / Trade-offs

- **Truncated review text** — The HTML read had a 2000-char truncation for some reviews.
  → Mitigation: The full HTML is saved locally; the import script reads the complete file.

- **Half-star ratings may not render** — No UI component exists for displaying ratings.
  → Mitigation: The `rating` field is stored in frontmatter for future use; display can be added later.
  For now it is metadata-only, consistent with `wordpressUrl` which is stored but not rendered.

- **Polish diacritic stripping in slugs** — Must match the same `slugify` function used by the existing content loader.
  → Mitigation: Reuse the existing `slugify` utility from `src/lib/content.ts` or replicate its logic.

- **27 new pages increase build size** — Minimal risk; each review is a short page.
  → No mitigation needed.

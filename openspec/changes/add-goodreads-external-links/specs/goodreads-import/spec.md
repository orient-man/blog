## ADDED Requirements

### Requirement: FR-001 Goodreads RSS feed fetched and parsed
The script MUST fetch the Goodreads public RSS feed at `https://www.goodreads.com/review/list_rss/13930842?shelf=read`.
The script MUST handle pagination (appending `?page=N` or `&page=N`) and fetch all pages until no more items are returned.
Each RSS item MUST be parsed for at least `book_id`, `title`, and `author_name`.

#### Scenario: Multi-page feed fetched
- **WHEN** the Goodreads RSS feed spans 2 pages
- **THEN** the script fetches both pages and combines all items into a single list

#### Scenario: Empty page terminates pagination
- **WHEN** page 3 of the RSS feed returns zero items
- **THEN** the script stops fetching and proceeds with items from pages 1 and 2

### Requirement: FR-002 Goodreads URL constructed from book_id
The canonical Goodreads book URL MUST be constructed as `https://www.goodreads.com/book/show/{book_id}`.
The `book_id` MUST be extracted from the RSS item's `book_id` element.

#### Scenario: URL construction
- **WHEN** an RSS item has `book_id` of `44919` (Clean Code)
- **THEN** the constructed URL is `https://www.goodreads.com/book/show/44919`

### Requirement: FR-003 Two-pass matching to existing posts
The script MUST match Goodreads RSS items to existing book-review MDX posts.
First pass: normalized title comparison (lowercase, stripped punctuation and diacritics).
Second pass (fallback for unmatched): author name matching combined with date proximity.
The script MUST support a manual override map for titles that cannot be matched automatically.

#### Scenario: Exact normalized title match
- **WHEN** a Goodreads item has title "Clean Code" and a post exists with title containing "Clean Code"
- **THEN** the item is matched to that post

#### Scenario: Cross-language title match via fallback
- **WHEN** a Goodreads item has a Polish title (e.g., "Dary niedoskonałości") and no normalized title match exists
- **THEN** the script falls back to author + date matching and finds the corresponding post

#### Scenario: Unmatched item logged
- **WHEN** a Goodreads item cannot be matched to any existing post
- **THEN** the script logs a warning with the item's title, author, and book_id for manual review

### Requirement: FR-004 Goodreads URL injected into externalLinks
For each matched post, the script MUST add a `{ label: "Goodreads", url: <constructed URL> }` entry to the post's `externalLinks` array.
If the post already has an `externalLinks` array, the Goodreads entry MUST be appended.
If the post already has a Goodreads entry in `externalLinks`, it MUST NOT be duplicated.

#### Scenario: Goodreads link added to post with existing LibraryThing link
- **WHEN** a matched post already has `externalLinks` with a LibraryThing entry
- **THEN** the script appends a Goodreads entry to the array
- **AND** the LibraryThing entry is preserved

#### Scenario: Idempotent re-run
- **WHEN** the script is run a second time on a post that already has a Goodreads entry
- **THEN** no duplicate entry is added

### Requirement: FR-005 All 27 review posts matched
The script MUST match and add Goodreads URLs to all 27 existing book-review posts.
The script MUST print a summary showing total matched, unmatched, and skipped (already present).

#### Scenario: Complete matching
- **WHEN** the script is run against all book-review posts
- **THEN** all 27 posts receive a Goodreads entry in `externalLinks`

#### Scenario: Summary output
- **WHEN** the script completes
- **THEN** it prints: total RSS items fetched, matched count, unmatched count, skipped count

### Requirement: FR-006 Standalone script with no new dependencies
The script MUST be a standalone TypeScript file at `scripts/import-goodreads.ts`, runnable via `npx tsx scripts/import-goodreads.ts`.
The script MUST NOT add any new npm dependencies (use built-in `fetch`, `fs`, `path`, and existing `gray-matter`).

#### Scenario: Script execution
- **WHEN** a developer runs `npx tsx scripts/import-goodreads.ts`
- **THEN** the script fetches RSS, matches posts, injects URLs, and prints a summary

#### Scenario: No new dependencies
- **WHEN** the script is implemented
- **THEN** no new entries are added to `package.json`

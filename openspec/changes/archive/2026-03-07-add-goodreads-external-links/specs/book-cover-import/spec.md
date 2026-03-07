## MODIFIED Requirements

### Requirement: FR-001 Cover images extracted from LibraryThing work pages
A migration script SHALL extract the primary cover image URL from each LibraryThing work page referenced by the LibraryThing entry in the review posts' `externalLinks` frontmatter field.
The script MUST find the LibraryThing URL by looking for an entry with `label: "LibraryThing"` in the `externalLinks` array.
The script MUST parse the LibraryThing work URL from the review URL (e.g., `https://www.librarything.com/work/11559588/reviews/288110008` yields work page `https://www.librarything.com/work/11559588`).
The script MUST locate the main cover image on the work page.

#### Scenario: Cover image URL extracted from work page
- **WHEN** the script processes a review with `externalLinks` containing `{ label: "LibraryThing", url: "https://www.librarything.com/work/11559588/reviews/288110008" }`
- **THEN** it fetches `https://www.librarything.com/work/11559588` and extracts the primary cover image URL from the page HTML

#### Scenario: Work page with no cover image
- **WHEN** the script encounters a LibraryThing work page without a cover image
- **THEN** it logs a warning and skips the download for that review

### Requirement: FR-005 All 27 review posts processed
The script SHALL process all MDX files in `content/posts/` that have a LibraryThing entry in their `externalLinks` frontmatter field.
A post is considered a review post if its `externalLinks` array contains an entry with `label: "LibraryThing"`.
The total count of processed files MUST equal the number of reviews with a LibraryThing external link (27 at time of writing).

#### Scenario: Complete processing
- **WHEN** the script is run
- **THEN** it attempts to find and download cover images for all 27 review posts with a LibraryThing entry in `externalLinks`

#### Scenario: Summary output
- **WHEN** the script completes
- **THEN** it prints a summary: total processed, successful downloads, skipped (already exists), failed

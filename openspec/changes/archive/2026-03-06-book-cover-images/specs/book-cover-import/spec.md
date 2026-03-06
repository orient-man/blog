## ADDED Requirements

### Requirement: FR-001 Cover images extracted from LibraryThing work pages

A migration script SHALL extract the primary cover image URL from each LibraryThing work page referenced by `librarythingUrl` in the review posts' frontmatter.
The script MUST parse the LibraryThing work URL from the review URL (e.g., `https://www.librarything.com/work/11559588/reviews/288110008` yields work page `https://www.librarything.com/work/11559588`).
The script MUST locate the main cover image on the work page.

#### Scenario: Cover image URL extracted from work page

- **WHEN** the script processes a review with `librarythingUrl: https://www.librarything.com/work/11559588/reviews/288110008`
- **THEN** it fetches `https://www.librarything.com/work/11559588` and extracts the primary cover image URL from the page HTML

#### Scenario: Work page with no cover image

- **WHEN** the script encounters a LibraryThing work page without a cover image
- **THEN** it logs a warning and skips the download for that review

### Requirement: FR-002 Cover images downloaded to local filesystem

The script SHALL download each extracted cover image and save it to `public/images/posts/{slug}/` using `cover.{ext}` as the filename (e.g., `public/images/posts/thinking-fast-and-slow-review/cover.jpg`).
The file extension MUST match the source image format.
The script MUST create the post's image directory if it does not already exist.
Existing files MUST NOT be overwritten unless explicitly requested (idempotent re-runs).

#### Scenario: Image downloaded and saved

- **WHEN** the script extracts a cover URL for the review with slug `thinking-fast-and-slow-review`
- **THEN** it downloads the image and saves it as `public/images/posts/thinking-fast-and-slow-review/cover.jpg`

#### Scenario: Re-running the script does not overwrite existing images

- **WHEN** the script is run a second time and `public/images/posts/thinking-fast-and-slow-review/cover.jpg` already exists
- **THEN** it skips the download and logs that the file already exists

### Requirement: FR-003 Cover image inserted at top of MDX body

After downloading a cover image, the script SHALL insert a Markdown image line at the top of the MDX body (immediately after the frontmatter closing `---` delimiter).
The image MUST use the format `!["<post title>"](/images/posts/<slug>/cover.<ext>)`.
Existing frontmatter fields and post content MUST be preserved exactly.
If the MDX body already contains the cover image line, the script MUST skip insertion.

#### Scenario: Image line inserted after download

- **WHEN** the script downloads a cover image for `thinking-fast-and-slow-review.mdx` with title `"Thinking, fast and slow" - Daniel Kahneman`
- **THEN** the first line after the frontmatter `---` is `!["Thinking, fast and slow" - Daniel Kahneman](/images/posts/thinking-fast-and-slow-review/cover.jpg)`
- **AND** the original post body follows after a blank line

#### Scenario: No image inserted when download fails

- **WHEN** the script cannot find or download a cover image for a review
- **THEN** the MDX file is not modified

#### Scenario: Idempotent re-run does not duplicate image line

- **WHEN** the script is run a second time on a file that already has the cover image line
- **THEN** the image line is not duplicated

### Requirement: FR-004 Script is a standalone Node.js script

The migration script SHALL be a standalone TypeScript/Node.js script runnable via `npx tsx scripts/import-covers.ts` or similar.
The script MUST NOT require any new npm dependencies beyond what is already in the project (use built-in `fetch`, `fs`, `path`).
The script MUST provide progress output indicating which reviews are being processed.

#### Scenario: Script execution

- **WHEN** a developer runs `npx tsx scripts/import-covers.ts`
- **THEN** the script processes all 27 review posts and logs progress for each

#### Scenario: Script uses no new dependencies

- **WHEN** the import script is implemented
- **THEN** no new entries are added to `package.json` dependencies or devDependencies

### Requirement: FR-005 All 27 review posts processed

The script SHALL process all MDX files in `content/posts/` that have a `librarythingUrl` frontmatter field.
The total count of processed files MUST equal the number of reviews with `librarythingUrl` (27 at time of writing).

#### Scenario: Complete processing

- **WHEN** the script is run
- **THEN** it attempts to find and download cover images for all 27 review posts with `librarythingUrl`

#### Scenario: Summary output

- **WHEN** the script completes
- **THEN** it prints a summary: total processed, successful downloads, skipped (already exists), failed

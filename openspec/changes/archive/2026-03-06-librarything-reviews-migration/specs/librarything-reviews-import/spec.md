## ADDED Requirements

### Requirement: FR-001 LibraryThing reviews converted to MDX posts
Each LibraryThing book review MUST be converted to an MDX file in `content/posts/`.
The file MUST follow the naming convention `{slug}.mdx` where slug is a kebab-case identifier derived from the book title with a `-review` suffix.

#### Scenario: Standard review conversion
- **WHEN** a LibraryThing review for "Clean Code" by Robert C. Martin is migrated
- **THEN** the system creates `content/posts/clean-code-review.mdx` with the full review text in Markdown format

#### Scenario: Polish title with diacritics
- **WHEN** a LibraryThing review for a book with Polish diacritics in the title is migrated
- **THEN** the slug MUST be ASCII-only kebab-case (diacritics stripped, e.g. "Błyskawiczny" becomes "blyskawiczny")

### Requirement: FR-002 Frontmatter includes all standard fields plus librarythingUrl and rating
Every migrated review post MUST include all standard frontmatter fields: `title`, `date`, `author`, `slug`, `category`, `tags`, `format`.
Every migrated review post MUST include a `librarythingUrl` field containing the original LibraryThing review URL.
Every migrated review post MUST include a `rating` field containing the star rating as a number.
The `wordpressUrl` field MUST be set to an empty string for LibraryThing-sourced posts.

#### Scenario: Complete frontmatter for a review
- **WHEN** a review rated 4 stars and published on Mar 15, 2020 is migrated
- **THEN** frontmatter includes `date: 2020-03-15`, `author: orientman`, `format: standard`, `librarythingUrl: https://www.librarything.com/...`, `rating: 4`, and `wordpressUrl: ""`

#### Scenario: Half-star rating preserved
- **WHEN** a review with a form_rating value of 9 is migrated
- **THEN** frontmatter includes `rating: 4.5`

### Requirement: FR-003 Rating mapping from LibraryThing form values
The star rating MUST be computed as `form_rating / 2` where `form_rating` is the hidden input value from the LibraryThing HTML.
Valid ratings MUST be in the range 0.5 to 5.0 in 0.5 increments.

#### Scenario: Rating value 10
- **WHEN** the form_rating hidden input value is 10
- **THEN** the rating field is set to 5

#### Scenario: Rating value 7
- **WHEN** the form_rating hidden input value is 7
- **THEN** the rating field is set to 3.5

#### Scenario: Rating value 2
- **WHEN** the form_rating hidden input value is 2
- **THEN** the rating field is set to 1

### Requirement: FR-004 Category assignment by review language
English-language reviews MUST be assigned `category: posts-in-english`.
Polish-language reviews MUST be assigned `category: wpisy-po-polsku`.

#### Scenario: English review categorization
- **WHEN** a review written in English is migrated
- **THEN** frontmatter includes `category: posts-in-english`

#### Scenario: Polish review categorization
- **WHEN** a review written in Polish is migrated
- **THEN** frontmatter includes `category: wpisy-po-polsku`

### Requirement: FR-005 Review content preserved as valid Markdown
Review text MUST be converted from HTML to valid Markdown.
Paragraph breaks MUST be preserved.
Links MUST use Markdown `[text](url)` syntax if present.
Section headings (if any) MUST use appropriate `##`/`###` levels consistent with the existing blog.

#### Scenario: Paragraph preservation
- **WHEN** a review containing multiple paragraphs is migrated
- **THEN** each paragraph is separated by a blank line in the Markdown output

#### Scenario: HTML entities decoded
- **WHEN** a review contains HTML entities (e.g. `&amp;`, `&quot;`)
- **THEN** the entities are decoded to their plain text equivalents in the Markdown output

### Requirement: FR-006 Date-based URL structure
Migrated review posts MUST use the existing date-based URL scheme: `/{year}/{month}/{day}/{slug}/`.
The date components MUST be derived from the original LibraryThing review date.

#### Scenario: URL generation for migrated review
- **WHEN** a review published on Mar 15, 2020 with slug `clean-code-review` is migrated
- **THEN** the post is accessible at `/2020/03/15/clean-code-review/`

### Requirement: FR-007 librarythingUrl and rating fields added to Post type
The TypeScript `Post` interface MUST include an optional `librarythingUrl` field of type `string`.
The TypeScript `Post` interface MUST include an optional `rating` field of type `number`.
The content loader MUST pass through both field values from frontmatter when present.

#### Scenario: Post type supports librarythingUrl
- **WHEN** a post MDX file includes `librarythingUrl` in frontmatter
- **THEN** the loaded Post object includes the `librarythingUrl` value

#### Scenario: Post type supports rating
- **WHEN** a post MDX file includes `rating: 4.5` in frontmatter
- **THEN** the loaded Post object includes `rating` with numeric value `4.5`

#### Scenario: Existing posts without new fields
- **WHEN** an existing WordPress-migrated post (without `librarythingUrl` or `rating`) is loaded
- **THEN** both fields are `undefined` (no runtime error)

### Requirement: FR-008 Tags reflect book review topics
Each migrated review MUST include a `books` tag.
Each migrated review MUST include a `reviews` tag.
Additional tags MAY be added to reflect the book's subject area (e.g. `programming`, `software-architecture`, `management`).
Tags MUST be slugified consistently with existing posts (lowercase, hyphens).

#### Scenario: Base tags for every review
- **WHEN** any book review is migrated
- **THEN** tags include at least `books` and `reviews`

#### Scenario: Subject-specific tags
- **WHEN** a review of a programming book is migrated
- **THEN** tags include topic-relevant slugs (e.g. `programming`) in addition to `books` and `reviews`

### Requirement: FR-009 Book title and author in post title
The post title MUST include the book title.
The post title SHOULD include the book author name.
The format MUST be `"<Book Title>" - <Author Name>` or `"<Book Title>"` if the author is not available.

#### Scenario: Title with author
- **WHEN** a review for "Clean Code" by Robert C. Martin is migrated
- **THEN** the post title is `"Clean Code" - Robert C. Martin`

#### Scenario: Title format
- **WHEN** any review is migrated
- **THEN** the post title includes the book title in quotes

### Requirement: FR-010 All 27 reviews imported
The migration MUST produce exactly one MDX file per review found on the LibraryThing profile page.
The total count of generated files MUST equal the number of reviews on the source page (27 as of the time of extraction).

#### Scenario: Complete import
- **WHEN** the migration script is run against the saved HTML
- **THEN** 27 new MDX files are created in `content/posts/`

#### Scenario: No duplicate posts
- **WHEN** the migration script is run
- **THEN** each review produces exactly one MDX file with a unique slug

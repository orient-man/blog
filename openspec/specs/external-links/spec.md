## Requirements

### Requirement: FR-001 externalLinks frontmatter field
Every post MAY include an `externalLinks` field in its YAML frontmatter.
The field MUST be an array of objects, each with `label` (string) and `url` (string).
The `label` MUST be a human-readable platform name (e.g., "LibraryThing", "Goodreads", "LinkedIn").
The `url` MUST be a valid absolute URL.

#### Scenario: Post with multiple external links
- **WHEN** a post's frontmatter contains `externalLinks` with two entries (LibraryThing and Goodreads)
- **THEN** the loaded Post object includes both entries in the `externalLinks` array

#### Scenario: Post with no external links
- **WHEN** a post's frontmatter does not contain `externalLinks`
- **THEN** the loaded Post object has `externalLinks` as `undefined` or an empty array
- **AND** the post renders without any external link section

### Requirement: FR-002 Post type includes externalLinks
The TypeScript `Post` interface MUST include an optional `externalLinks` field of type `{ label: string; url: string }[]`.
The `Post` interface MUST NOT include `librarythingUrl` or `linkedinUrl` fields.

#### Scenario: Type definition
- **WHEN** the `Post` interface is defined in `src/lib/types.ts`
- **THEN** it includes `externalLinks?: { label: string; url: string }[]`
- **AND** it does NOT include `librarythingUrl` or `linkedinUrl`

### Requirement: FR-003 Content loader reads externalLinks from frontmatter
The content loading function MUST read the `externalLinks` array from frontmatter and include it in the returned `Post` object.
The content loader MUST NOT read `librarythingUrl` or `linkedinUrl` from frontmatter.

#### Scenario: External links loaded from frontmatter
- **WHEN** a post MDX file includes `externalLinks` with a LibraryThing entry
- **THEN** the loaded Post object includes the entry with correct `label` and `url`

#### Scenario: Backward compatibility for posts without externalLinks
- **WHEN** a post MDX file does not include `externalLinks`
- **THEN** the loaded Post object has `externalLinks` as `undefined`
- **AND** no runtime error occurs

### Requirement: FR-004 External links rendered generically on post detail page
The post detail page MUST render each entry in `externalLinks` as a link with the text "Also on {label} →".
Links MUST open in a new tab (`target="_blank"`, `rel="noopener noreferrer"`).
The rendering MUST NOT use per-platform conditionals (no `if librarythingUrl` / `if linkedinUrl`).
If `externalLinks` is empty or undefined, no link section SHALL be rendered.

#### Scenario: Two external links rendered
- **WHEN** a post has `externalLinks` containing LibraryThing and Goodreads entries
- **THEN** the page displays "Also on LibraryThing →" and "Also on Goodreads →" as clickable links

#### Scenario: Single external link rendered
- **WHEN** a post has `externalLinks` containing only a LinkedIn entry
- **THEN** the page displays "Also on LinkedIn →" as a single clickable link

#### Scenario: No external links
- **WHEN** a post has no `externalLinks`
- **THEN** no external link section is displayed

### Requirement: FR-005 Frontmatter migration from named fields to externalLinks
All 27 book review posts MUST have their `librarythingUrl` field replaced with an `externalLinks` entry of `{ label: "LibraryThing", url: <original value> }`.
All 3 LinkedIn posts MUST have their `linkedinUrl` field replaced with an `externalLinks` entry of `{ label: "LinkedIn", url: <original value> }`.
The old `librarythingUrl` and `linkedinUrl` fields MUST be removed from all MDX files.
All other frontmatter fields and body content MUST be preserved exactly.

#### Scenario: LibraryThing URL migrated
- **WHEN** the migration script processes a review post with `librarythingUrl: https://www.librarything.com/work/123/reviews/456`
- **THEN** the post's frontmatter contains `externalLinks` with `{ label: "LibraryThing", url: "https://www.librarything.com/work/123/reviews/456" }`
- **AND** the `librarythingUrl` field is no longer present

#### Scenario: LinkedIn URL migrated
- **WHEN** the migration script processes a LinkedIn post with `linkedinUrl: https://www.linkedin.com/pulse/...`
- **THEN** the post's frontmatter contains `externalLinks` with `{ label: "LinkedIn", url: "https://www.linkedin.com/pulse/..." }`
- **AND** the `linkedinUrl` field is no longer present

#### Scenario: Non-link frontmatter preserved
- **WHEN** the migration script processes any post
- **THEN** all non-link frontmatter fields (`title`, `date`, `tags`, `rating`, `coverImage`, etc.) are preserved exactly
- **AND** the post body content is preserved exactly

## MODIFIED Requirements

### Requirement: FR-002 Frontmatter includes all standard fields plus externalLinks and rating
Every migrated review post MUST include all standard frontmatter fields: `title`, `date`, `author`, `slug`, `category`, `tags`, `format`.
Every migrated review post MUST include an `externalLinks` array containing at minimum `{ label: "LibraryThing", url: <review URL> }`.
Every migrated review post MUST include a `rating` field containing the star rating as a number.
The `wordpressUrl` field MUST be set to an empty string for LibraryThing-sourced posts.
The `librarythingUrl` field MUST NOT be emitted.

#### Scenario: Complete frontmatter for a review
- **WHEN** a review rated 4 stars and published on Mar 15, 2020 is migrated
- **THEN** frontmatter includes `date: 2020-03-15`, `author: orientman`, `format: standard`, `externalLinks` with `{ label: "LibraryThing", url: "https://www.librarything.com/..." }`, `rating: 4`, and `wordpressUrl: ""`
- **AND** frontmatter does NOT include `librarythingUrl`

#### Scenario: Half-star rating preserved
- **WHEN** a review with a form_rating value of 9 is migrated
- **THEN** frontmatter includes `rating: 4.5`

### Requirement: FR-007 externalLinks field replaces librarythingUrl in Post type
The TypeScript `Post` interface MUST include an optional `externalLinks` field of type `{ label: string; url: string }[]`.
The TypeScript `Post` interface MUST NOT include a `librarythingUrl` field.
The content loader MUST pass through `externalLinks` from frontmatter when present.

#### Scenario: Post type supports externalLinks
- **WHEN** a post MDX file includes `externalLinks` with a LibraryThing entry in frontmatter
- **THEN** the loaded Post object includes the entry in its `externalLinks` array

#### Scenario: Post type supports rating
- **WHEN** a post MDX file includes `rating: 4.5` in frontmatter
- **THEN** the loaded Post object includes `rating` with numeric value `4.5`

#### Scenario: Existing posts without new fields
- **WHEN** an existing WordPress-migrated post (without `externalLinks` or `rating`) is loaded
- **THEN** both fields are `undefined` (no runtime error)

## REMOVED Requirements

### Requirement: FR-002 Frontmatter includes all standard fields plus librarythingUrl and rating
**Reason**: Replaced by the generic `externalLinks` array pattern. The `librarythingUrl` field is superseded by `externalLinks` with `label: "LibraryThing"`.
**Migration**: All 27 review posts have `librarythingUrl` replaced with an `externalLinks` entry. The `import-librarything.ts` script emits `externalLinks` instead of `librarythingUrl`.

### Requirement: FR-007 librarythingUrl and rating fields added to Post type
**Reason**: The `librarythingUrl` field on the Post type is replaced by the generic `externalLinks` field. The `rating` field remains unchanged.
**Migration**: `Post` interface updated to replace `librarythingUrl` with `externalLinks`. Content loader updated accordingly.

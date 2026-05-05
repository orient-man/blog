## ADDED Requirements

### Requirement: FR-006 coverSize frontmatter field

The `Post` type SHALL include an optional `coverSize` field accepting the string literal `"full"`.
The content loader SHALL read `coverSize` from YAML frontmatter and pass it through to the `Post` object.
When `coverSize` is absent or empty in frontmatter, the field MUST be `undefined` on the Post object.
The absence of `coverSize` (or any value other than `"full"`) SHALL be treated as compact mode.

#### Scenario: Post with coverSize set to full

- **WHEN** a post's frontmatter includes `coverSize: full`
- **THEN** the loaded `Post` object has `coverSize` equal to `"full"`

#### Scenario: Post without coverSize in frontmatter

- **WHEN** a post's frontmatter does not include a `coverSize` field
- **THEN** the loaded `Post` object has `coverSize` equal to `undefined`

### Requirement: FR-007 PostCard thumbnail wider for full-size covers

The PostCard component SHALL render a wider thumbnail when the post has `coverSize` equal to `"full"`.
The wider thumbnail MUST be approximately 128–160px wide on desktop viewports.
On mobile, the wider thumbnail MUST shrink to approximately 80–96px wide.
The thumbnail MUST maintain `object-cover` behavior to crop to fill the allocated space.

#### Scenario: PostCard with full-size cover on desktop

- **WHEN** a listing page renders a PostCard for a post with `coverSize: full`
- **THEN** the thumbnail is approximately 128–160px wide

#### Scenario: PostCard with full-size cover on mobile

- **WHEN** a listing page renders a PostCard for a post with `coverSize: full` on a mobile viewport
- **THEN** the thumbnail shrinks to approximately 80–96px wide

## MODIFIED Requirements

### Requirement: FR-003 Cover image sizing on post detail page

The cover image on the post detail page MUST be rendered in one of two modes based on the `coverSize` field:

- **Compact mode** (default, when `coverSize` is absent): The image MUST be constrained to a max-width appropriate for portrait-oriented book covers (approximately 384px).
  The image MUST NOT stretch to the full prose column width.
  The image MUST be centered horizontally within the content area.

- **Full mode** (when `coverSize` is `"full"`): The image MUST be allowed to render up to the content column width (approximately `max-w-2xl` / 672px).
  The image MUST be centered horizontally within the content area.
  The image MUST NOT exceed its natural pixel width.

#### Scenario: Book cover renders at compact width

- **WHEN** a post's cover image is displayed on the detail page and `coverSize` is absent
- **THEN** the image is horizontally centered and does not exceed approximately 384px width

#### Scenario: Full-size cover renders at content width

- **WHEN** a post's cover image is displayed on the detail page and `coverSize` is `"full"`
- **THEN** the image is horizontally centered and may render up to approximately 672px width
- **AND** the image does not exceed its natural pixel width

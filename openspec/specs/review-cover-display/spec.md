## Requirements

### Requirement: FR-001 coverImage frontmatter field

The `Post` type SHALL include an optional `coverImage` field of type `string`.
The content loader SHALL read `coverImage` from YAML frontmatter and pass it through to the `Post` object.
When `coverImage` is absent or empty in frontmatter, the field MUST be `undefined` on the Post object.

#### Scenario: Post with coverImage in frontmatter

- **WHEN** a post's frontmatter includes `coverImage: /images/posts/anomalia-review/cover.jpg`
- **THEN** the loaded `Post` object has `coverImage` equal to `/images/posts/anomalia-review/cover.jpg`

#### Scenario: Post without coverImage in frontmatter

- **WHEN** a post's frontmatter does not include a `coverImage` field
- **THEN** the loaded `Post` object has `coverImage` equal to `undefined`

### Requirement: FR-002 Cover image on post detail page

The post detail page SHALL render the `coverImage` as an `<img>` element between the header metadata and the prose content area.
The image MUST be wrapped in a `<figure>` element.
The image `alt` attribute MUST be set to the post title.
When `coverImage` is `undefined`, the post detail page MUST NOT render any image element or empty placeholder in that position.

#### Scenario: Review post with cover image

- **WHEN** a visitor opens a review post that has `coverImage` set
- **THEN** the cover image is displayed below the title/metadata header and above the review text

#### Scenario: Post without cover image

- **WHEN** a visitor opens a post that does not have `coverImage` set
- **THEN** no image element or empty space appears between header and content

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

### Requirement: FR-004 PostCard thumbnail for review posts

The PostCard component SHALL render a thumbnail of the cover image on the right side of the card when `coverImage` is present.
The thumbnail MUST link to the post (same destination as the title link).
When `coverImage` is `undefined`, the PostCard MUST render identically to its current layout with no gap or placeholder.

#### Scenario: PostCard with cover image

- **WHEN** a listing page renders a PostCard for a review post that has `coverImage`
- **THEN** a clickable thumbnail appears on the right side of the card beside the excerpt

#### Scenario: PostCard without cover image

- **WHEN** a listing page renders a PostCard for a post without `coverImage`
- **THEN** the card renders with no image and no empty space on the right

### Requirement: FR-005 PostCard thumbnail responsive behavior

The PostCard thumbnail MUST shrink on mobile viewports rather than being hidden.
On desktop, the thumbnail MUST be approximately 60-80px wide.
On mobile, the thumbnail MUST shrink to approximately 48px wide.

#### Scenario: Desktop thumbnail size

- **WHEN** a PostCard with cover image is viewed on a desktop viewport
- **THEN** the thumbnail is approximately 60-80px wide

#### Scenario: Mobile thumbnail size

- **WHEN** a PostCard with cover image is viewed on a mobile viewport
- **THEN** the thumbnail shrinks to approximately 48px wide

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

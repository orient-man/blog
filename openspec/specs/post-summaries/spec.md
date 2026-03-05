## Requirements

### Requirement: FR-001 Excerpt length
The `generateExcerpt()` utility MUST produce plain-text excerpts of up to 500 characters by default.
Truncation MUST occur at a word boundary (the last space before the limit) and append an ellipsis character (`…`).
Content shorter than the limit MUST be returned in full without an ellipsis.

#### Scenario: Long post excerpt
- **WHEN** a post's stripped content exceeds 500 characters
- **THEN** the excerpt is truncated at the last word boundary before 500 characters and ends with `…`

#### Scenario: Short post excerpt
- **WHEN** a post's stripped content is 500 characters or fewer
- **THEN** the excerpt is the full stripped content with no trailing ellipsis

### Requirement: FR-002 RSS feed excerpt length
The RSS/Atom feed generation script MUST produce excerpts of up to 500 characters, consistent with the main application excerpt length.

#### Scenario: RSS feed item description
- **WHEN** a feed entry is generated for a post
- **THEN** the item description contains up to 500 characters of plain text, truncated at a word boundary with `…` if needed

### Requirement: FR-003 Markdown stripping
The excerpt generator MUST strip the following Markdown and MDX constructs before measuring length:
frontmatter delimiters, JSX/HTML tags, self-closing MDX components, Markdown headings, bold/italic markers, inline code backticks, fenced code blocks, and link syntax (preserving link text).

#### Scenario: Post with code blocks and headings
- **WHEN** a post contains fenced code blocks, headings, and inline code
- **THEN** the excerpt contains only plain text with those constructs removed

### Requirement: FR-004 PostCard display
The PostCard component MUST display the full excerpt text.
The CSS line-clamp MUST allow enough visible lines to accommodate ~500 characters of text at the rendered font size.

#### Scenario: Excerpt visible on listing page
- **WHEN** a listing page renders a PostCard with a 500-character excerpt
- **THEN** the excerpt is fully visible without unexpected truncation by CSS

### Requirement: FR-005 SEO metadata excerpt
Post detail pages MUST use the same excerpt for `description` and `og:description` meta tags.
Search engines may truncate longer descriptions on their end; the application MUST NOT apply a separate shorter limit for SEO.

#### Scenario: Meta description length
- **WHEN** a post detail page is rendered
- **THEN** the `description` meta tag contains the full excerpt (up to 500 characters)

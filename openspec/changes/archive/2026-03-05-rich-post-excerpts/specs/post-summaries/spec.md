## ADDED Requirements

### Requirement: FR-006 HTML excerpt generation
The `generateHtmlExcerpt()` utility MUST compile the first ~500 characters of text content from a post's Markdown through a remark pipeline, producing an HTML string.
The pipeline MUST preserve inline formatting: bold, italic, strikethrough, links, and inline code.
The pipeline MUST preserve blockquote structure and nesting.

#### Scenario: Post with bold and links
- **WHEN** a post's opening paragraph contains `**bold text**` and `[link text](url)`
- **THEN** the HTML excerpt contains `<strong>bold text</strong>` and `<a href="url">link text</a>`

#### Scenario: Post with blockquote
- **WHEN** a post's content begins with or contains a blockquote within the excerpt range
- **THEN** the HTML excerpt contains a `<blockquote>` element with the quoted content

#### Scenario: Post with inline code
- **WHEN** a post's content contains `` `inline code` `` within the excerpt range
- **THEN** the HTML excerpt contains `<code>inline code</code>`

### Requirement: FR-007 Code block replacement
Fenced code blocks within the excerpt range MUST be replaced with a single paragraph containing the text `...`.
Consecutive code block placeholders MUST be collapsed into a single placeholder.

#### Scenario: Post opens with prose then code block
- **WHEN** a post has a paragraph followed by a fenced code block within the excerpt range
- **THEN** the HTML excerpt contains the paragraph followed by a `<p>...</p>` placeholder

#### Scenario: Adjacent code blocks
- **WHEN** a post has two or more consecutive fenced code blocks within the excerpt range
- **THEN** the HTML excerpt contains a single `<p>...</p>` placeholder for the entire group

### Requirement: FR-008 Block element stripping
Headings, images, raw HTML blocks, and MDX/JSX components MUST be stripped from the HTML excerpt.
Stripping MUST NOT affect text content of surrounding nodes.

#### Scenario: Post with heading and image
- **WHEN** a post contains a heading and an image within the excerpt range
- **THEN** the HTML excerpt omits both without leaving empty space or broken markup

### Requirement: FR-009 HTML excerpt rendering in PostCard
PostCard MUST render `htmlExcerpt` using Tailwind Typography `prose prose-sm` classes.
If `htmlExcerpt` is unavailable, PostCard MUST fall back to the plain-text `excerpt` in a `<p>` tag.

#### Scenario: PostCard with HTML excerpt
- **WHEN** a post has an `htmlExcerpt` value
- **THEN** PostCard renders the excerpt as styled HTML inside a `<div>` with `prose prose-sm` classes

#### Scenario: PostCard without HTML excerpt
- **WHEN** a post has no `htmlExcerpt` but has a plain-text `excerpt`
- **THEN** PostCard renders the excerpt as plain text in a `<p>` tag

## MODIFIED Requirements

### Requirement: FR-003 Markdown stripping
The plain-text excerpt generator MUST strip the following Markdown and MDX constructs before measuring length:
frontmatter delimiters, JSX/HTML tags, self-closing MDX components, Markdown headings, bold/italic markers, inline code backticks, fenced code blocks, and link syntax (preserving link text).
This plain-text excerpt is used for SEO meta descriptions and RSS feed entries only.
PostCard display uses the HTML excerpt (FR-009) instead.

#### Scenario: Post with code blocks and headings
- **WHEN** a post contains fenced code blocks, headings, and inline code
- **THEN** the plain-text excerpt contains only plain text with those constructs removed

### Requirement: FR-004 PostCard display
The PostCard component MUST display the HTML excerpt when available, falling back to the plain-text excerpt.
The CSS `line-clamp` MUST allow enough visible lines to accommodate the rendered excerpt at the displayed font size.

#### Scenario: Excerpt visible on listing page
- **WHEN** a listing page renders a PostCard with an HTML excerpt
- **THEN** the excerpt is rendered with Markdown formatting intact and visible without broken markup from CSS truncation

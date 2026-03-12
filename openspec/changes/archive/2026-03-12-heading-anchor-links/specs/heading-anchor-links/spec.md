## ADDED Requirements

### Requirement: Heading ID generation
The system SHALL automatically generate a URL-safe `id` attribute for every `h2`–`h6` heading in post and page content.
The `id` value MUST be a kebab-case slug derived from the heading text (e.g., "My Heading" becomes `my-heading`).
The `h1` heading MUST NOT receive an anchor link because it represents the page title, which is rendered separately by the layout.

#### Scenario: Simple heading text
- **WHEN** a post contains a heading `## Getting Started`
- **THEN** the rendered heading element has `id="getting-started"`

#### Scenario: Heading with special characters
- **WHEN** a heading contains punctuation or non-alphanumeric characters (e.g., `## What's New?`)
- **THEN** special characters are stripped and the `id` is a clean slug (e.g., `id="whats-new"`)

#### Scenario: Duplicate heading text
- **WHEN** two or more headings in the same page have identical text
- **THEN** subsequent headings receive a numeric suffix to ensure uniqueness (e.g., `id="overview"`, `id="overview-1"`)

### Requirement: Heading anchor link
Each `h2`–`h6` heading SHALL be wrapped in or contain an anchor element (`<a>`) whose `href` is the fragment identifier `#<id>` of that heading.
Clicking the anchor link MUST update the browser URL to include the fragment without triggering a full page reload.

#### Scenario: Click heading anchor
- **WHEN** a reader clicks a heading's anchor link
- **THEN** the browser URL updates to include `#<heading-id>` and the page scrolls to that heading

#### Scenario: Copy link for sharing
- **WHEN** a reader copies the URL after clicking a heading anchor
- **THEN** the URL contains the `#<heading-id>` fragment that navigates directly to that section

### Requirement: Visual anchor indicator
A visual indicator (e.g., a `#` symbol or link icon) MUST appear when the reader hovers over a heading to signal that it is linkable.
The indicator MUST NOT be visible by default to avoid cluttering the reading experience.

#### Scenario: Hover reveals indicator
- **WHEN** a reader hovers over a heading
- **THEN** a link indicator becomes visible adjacent to the heading text

#### Scenario: No indicator at rest
- **WHEN** a heading is not being hovered
- **THEN** no link indicator is visible

### Requirement: Fragment scroll offset
When the page loads with a `#fragment` URL or when a heading anchor is clicked, the page MUST scroll to the target heading with enough offset so it is not hidden behind any fixed-position header.

#### Scenario: Direct fragment URL navigation
- **WHEN** a reader navigates to a post URL with a `#heading-id` fragment
- **THEN** the page scrolls to that heading, and the heading is fully visible below any fixed header

#### Scenario: Offset accounts for header
- **WHEN** a fixed top bar or header is present
- **THEN** the scroll position includes a `scroll-margin-top` offset so the heading is not obscured

### Requirement: Consistent across content types
Heading anchor links MUST work identically on blog post pages and static pages.
Both the `@next/mdx` loader pipeline and the `@mdx-js/mdx` `evaluate()` runtime pipeline MUST produce the same heading IDs and anchor markup.

#### Scenario: Blog post headings
- **WHEN** a blog post at `/:year/:month/:day/:slug/` contains headings
- **THEN** all `h2`–`h6` headings have IDs and anchor links

#### Scenario: Static page headings
- **WHEN** a static page at `/page/:slug/` contains headings
- **THEN** all `h2`–`h6` headings have IDs and anchor links

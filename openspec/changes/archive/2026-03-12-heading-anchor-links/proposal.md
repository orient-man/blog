## Why

Headings in blog posts and static pages are plain text with no anchor IDs or link affordance.
Readers cannot share or bookmark a specific section of a long article.
This is a standard content-first feature (Constitution Principle II) that improves navigation and shareability with minimal added complexity (Principle I).

## What Changes

- All `h2`–`h6` headings in post and page content gain a deterministic `id` attribute derived from the heading text.
- Each heading becomes a clickable anchor link that navigates to its `#fragment` URL.
- A subtle link indicator appears on hover to signal that the heading is linkable.
- The page scrolls to the correct heading when a fragment URL is loaded, accounting for any fixed-header offset via `scroll-margin-top`.

## Capabilities

### New Capabilities

- `heading-anchor-links`: Automatic slug-based ID generation and anchor links for `h2`–`h6` headings in posts and pages.

### Modified Capabilities

(none)

## Impact

- **Rehype plugin chain**: New rehype plugins added to the three MDX compilation sites (`next.config.mjs`, post route, page route).
- **CSS**: New styles in `globals.css` for the anchor indicator, hover state, and scroll-margin offset.
- **Dependencies**: Up to two new npm packages (`rehype-slug`, `rehype-autolink-headings`).
- **Existing content**: No content file changes required; IDs are generated automatically at build time.

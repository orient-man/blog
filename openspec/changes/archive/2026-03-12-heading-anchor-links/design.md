## Context

Blog posts and static pages render Markdown headings as plain `<h2>`–`<h6>` elements with no `id` attributes and no anchor affordance.
There are three MDX compilation sites that all need the same plugin configuration:

1. `@next/mdx` loader in `next.config.mjs` (for `.mdx` files imported as pages).
2. `@mdx-js/mdx` `evaluate()` in `src/app/[year]/[month]/[day]/[slug]/page.tsx` (blog posts).
3. `@mdx-js/mdx` `evaluate()` in `src/app/page/[slug]/page.tsx` (static pages).

Existing rehype plugins: `rehype-pretty-code`, `rehype-copy-button` (custom).
Existing remark plugins: `remark-gfm`.

The site uses Tailwind CSS with `@tailwindcss/typography` (`prose` class) for content styling.
A fixed top bar exists, so scroll targets need vertical offset.

## Goals / Non-Goals

**Goals:**

- Every `h2`–`h6` heading in rendered content gets a deterministic slug-based `id`.
- Headings become clickable anchor links with a hover indicator.
- Fragment URLs work on initial page load and on click.
- All three MDX pipelines produce identical output.

**Non-Goals:**

- Table of contents generation (future feature, can build on this).
- Custom per-heading IDs via frontmatter or MDX syntax.
- Anchor links on heading elements outside post/page content (e.g., sidebar, homepage).

## Decisions

### D1: Use `rehype-slug` + `rehype-autolink-headings`

**Choice**: Add the well-established `rehype-slug` and `rehype-autolink-headings` packages.

**Alternatives considered**:
- *Custom rehype plugin*: Full control but duplicates solved problems. More code to maintain, violates Simplicity principle.
- *MDX component overrides for h2–h6*: Would require six component definitions in `mdx-components.tsx` plus manual slug generation at render time. More complex and error-prone.

**Rationale**: These two packages are the de-facto standard in the unified/rehype ecosystem, have zero runtime footprint (transform at build time), and compose cleanly with the existing plugin chain.
Combined download count exceeds 1M/week; maintenance risk is low.

### D2: Plugin ordering

`rehype-slug` MUST run before `rehype-autolink-headings` (autolink reads the `id` that slug generates).
Both MUST run before `rehype-pretty-code` to avoid interfering with code block processing.
Recommended order: `rehype-slug` → `rehype-autolink-headings` → `rehype-pretty-code` → `rehype-copy-button`.

### D3: Autolink heading behaviour — `wrap` mode

**Choice**: Use the `wrap` behaviour of `rehype-autolink-headings`, which wraps the entire heading content in an `<a>` element.

**Alternatives considered**:
- *`prepend`/`append`*: Inserts an `<a>` before/after heading text. Requires extra styling and can cause layout issues with inline elements.
- *`before`/`after`*: Places the link element outside the heading. Semantically unusual and harder to style.

**Rationale**: `wrap` keeps the heading text and anchor as a single clickable unit, which is the most intuitive UX.
The hover indicator (`#` symbol) is added via CSS `::after` pseudo-element on the anchor, avoiding extra DOM nodes.

### D4: CSS-only hover indicator

**Choice**: Use a CSS `::after` pseudo-element on the heading anchor to show a `#` symbol on hover.

**Rationale**: No JavaScript required, no extra DOM elements, minimal CSS additions.
Keeps the implementation aligned with Simplicity principle.

### D5: Scroll offset via `scroll-margin-top`

**Choice**: Apply `scroll-margin-top` to headings with `id` attributes to offset for the fixed header.

**Rationale**: Pure CSS solution, supported by all modern browsers.
The offset value matches the site header height.

## Risks / Trade-offs

- **Duplicate IDs across posts**: Not a risk — each post renders on its own page.
  `rehype-slug` handles duplicate headings within a single page by appending numeric suffixes.
- **Plugin ordering bugs**: If plugins are added in wrong order, code blocks or headings could render incorrectly.
  Mitigation: Document the exact order and use the same array reference for consistency.
- **Existing fragment links in content**: No existing content uses `#fragment` links, so no migration concern.
- **CSS specificity with prose**: The `@tailwindcss/typography` prose styles may override anchor colors.
  Mitigation: Use targeted selectors (`.prose :where(h2, h3, h4, h5, h6) a`) to style anchor links without fighting specificity.

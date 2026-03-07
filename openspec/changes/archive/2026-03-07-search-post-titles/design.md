## Context

The blog uses Pagefind (^1.3.0) for client-side search, invoked via `npx pagefind --site out` as a postbuild step.
Blog post pages are the only indexed pages (via `data-pagefind-body` on the `<article>` element in `src/app/[year]/[month]/[day]/[slug]/page.tsx`).

Currently, no Pagefind data attributes beyond `data-pagefind-body` are used.
Pagefind falls back to extracting the HTML `<title>` tag as the search result title.
The layout's metadata template (`"%s | Just A Programmer"`) causes every result title to include the site name suffix.

The entire `<article>` is indexed, including non-content sections: prev/next navigation, related posts, and comments.
These inflate the index and can produce misleading search excerpts.

## Goals / Non-Goals

**Goals:**

- Search results display clean post titles (no site name suffix).
- Non-content sections (navigation, related posts, comments) are excluded from the search index.
- Zero new dependencies; zero build configuration changes.

**Non-Goals:**

- Faceted search or filter attributes (e.g. by category or tag) — future enhancement.
- Custom result ranking or content weighting — out of scope.
- Changes to the Pagefind UI component or its configuration options.

## Decisions

### Decision 1: Use `data-pagefind-meta="title"` on the `<h1>` element

**Choice**: Add `data-pagefind-meta="title"` directly to the existing post `<h1>` tag.

**Alternatives considered**:
- _Pagefind config file with `default-meta`_: Would require creating a `pagefind.yml` and configuring a CSS selector.
  More indirection for a single attribute.
- _Remove the site name from the HTML `<title>` template_: Would fix search but degrade SEO and browser tab usability.
- _Post-process Pagefind's index_: Over-engineered for this use case.

**Rationale**: The inline attribute is the simplest, most explicit approach.
It co-locates the metadata with the content it describes and requires no configuration file.
Aligns with Constitution I (Simplicity).

### Decision 2: Use `data-pagefind-ignore` on wrapper elements for non-content sections

**Choice**: Add `data-pagefind-ignore` to the outermost wrapper `<div>` or `<nav>` of:
1. Prev/next post navigation block
2. Related posts section
3. Comments section

**Alternatives considered**:
- _Restructure the page to move non-content outside `data-pagefind-body`_: Would require significant JSX restructuring and could break the article semantic structure.
- _Use a Pagefind config exclude selector_: Requires a config file and is harder to maintain as the page evolves.

**Rationale**: Adding `data-pagefind-ignore` to existing wrapper elements is surgical — it targets exactly the noisy sections without changing page structure or requiring external config.

## Risks / Trade-offs

- **[Low] Attribute removed in future refactor** -> Mitigated by the spec requirement (FR-001, FR-003) which documents the expected behavior.
  A build-time search verification task (T003) ensures correctness.
- **[Low] Pagefind version incompatibility** -> `data-pagefind-meta` and `data-pagefind-ignore` are stable Pagefind features available since v1.0.
  No risk with the current ^1.3.0 dependency.

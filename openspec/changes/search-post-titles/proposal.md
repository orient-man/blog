## Why

Pagefind search results currently display the HTML `<title>` tag value as the result title.
Because the layout uses a template (`"%s | Just A Programmer"`), every result shows a title like "Post Title | Just A Programmer" — or in some cases just the site name — instead of the clean post title.
This makes search results harder to scan and less useful, undermining the Content-First principle (Constitution II).

## What Changes

- Add explicit Pagefind metadata attributes to blog post pages so search results display the post title cleanly.
- Add `data-pagefind-ignore` to non-content sections within the indexed `<article>` (navigation links, related posts, comments) to prevent noisy matches in search excerpts.

## Capabilities

### New Capabilities

- `search-result-metadata`: Configure Pagefind metadata and indexing attributes on blog post pages so search results display post titles, not the site-wide HTML title template.

### Modified Capabilities

_(none — no existing spec-level requirements are changing)_

## Impact

- **Code**: `src/app/[year]/[month]/[day]/[slug]/page.tsx` — add `data-pagefind-meta` and `data-pagefind-ignore` attributes to existing elements.
- **Dependencies**: None added or removed.
  Pagefind (^1.3.0) already supports these attributes; no version change needed.
- **Build**: No changes to the `postbuild` script or Pagefind invocation.
- **Risk**: Minimal.
  Attribute-only changes; no structural or behavioral changes to page rendering.

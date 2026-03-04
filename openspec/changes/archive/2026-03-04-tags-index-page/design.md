## Context

The blog currently has tag infrastructure in place:
- Tags stored as YAML arrays in post frontmatter, normalized to slugs at load time.
- `getAllTags()` returns all tags sorted by count descending with display names resolved.
- Individual tag pages at `/tag/:slug/` show posts for a single tag.
- `TagCloud` component in the sidebar renders the top 20 tags as weighted pills.

There is no way to see all tags at once.
The sidebar truncates to 20 and shows "Showing top N of M tags" but that text is not actionable.

## Goals / Non-Goals

**Goals:**
- Provide a `/tags/` page displaying every tag alphabetically with post counts.
- Link each tag to its existing `/tag/:slug/` page.
- Make the sidebar "Showing top N of M tags" text link to the new page.

**Non-Goals:**
- Tag grouping or filtering (alphabetical letter sections, search within tags).
- Tag management or editing.
- Changes to the tag data model or frontmatter format.
- Redesigning the existing tag cloud component.

## Decisions

### 1. Route location: `src/app/tags/page.tsx`

A new static page component at `src/app/tags/page.tsx`.
This is a simple server component with no dynamic params — Next.js will statically render it during build.
No `generateStaticParams` needed since the route has no dynamic segments.

**Alternative considered**: Adding a `/tags/` section to the existing home page or sidebar.
Rejected because it would clutter the home page and the sidebar is already space-constrained.

### 2. Data source: reuse `getAllTags()`

The existing `getAllTags()` function already aggregates all tags with counts and display names.
The page will call it directly and re-sort alphabetically by `tag.name` for display.
No new data layer code is needed.

**Alternative considered**: Creating a separate `getTagsAlphabetical()` function.
Rejected — sorting is trivial and can be done inline in the page component.

### 3. Layout: simple alphabetical list with pill styling

Tags rendered as a flat list of pill-styled links (similar to the tag cloud) sorted alphabetically.
Each pill shows the tag name and count.
Uses Tailwind CSS utilities — no new dependencies.

**Alternative considered**: Grouped by first letter with section headers (A, B, C…).
Rejected for now — with ~30-40 tags, grouping adds complexity without benefit.
Can be revisited if the tag count grows significantly.

### 4. Sidebar enhancement: link from "Showing top N" text

The `TagCloud` component's overflow message becomes a `<Link>` to `/tags/`.
This is a minimal, non-breaking change to the existing component.

## Risks / Trade-offs

- **[Low] Tag count growth**: The flat alphabetical list works well for the current ~40 tags.
  If tags grow to hundreds, a grouped/searchable view would be better.
  → Mitigation: Keep the design simple now; revisit if tag volume increases.
- **[Low] Display name gaps**: Some tags fall back to their slug as display name (no entry in `TAG_SLUG_MAP`).
  This is an existing data quality issue, not introduced by this change.
  → Mitigation: None needed — existing behavior preserved.

## Context

Book review posts (27 of 63 total) have cover images stored at `public/images/posts/<slug>/cover.jpg`.
Currently these are embedded as inline Markdown images (`![...]()`) at the top of the MDX body.
They are only visible when a reader opens the full post — listing pages show text-only cards.

The PostCard component renders: date block, title, excerpt, category badge, star rating, and tag pills.
The post detail page compiles MDX at build time via `@mdx-js/mdx` `evaluate()` and renders inside a Tailwind Typography `prose` wrapper.
The project uses plain `<img>` tags throughout (no `next/image`).

## Goals / Non-Goals

**Goals:**

- Surface existing book cover images in PostCard summaries (thumbnail on right).
- Display cover image on the post detail page from structured frontmatter rather than inline Markdown.
- Eliminate duplication of the cover image between frontmatter and MDX body.
- Maintain identical rendering for non-review posts (no placeholder, no layout shift).

**Non-Goals:**

- Cover images for non-review posts (tech posts, essays).
- Image optimization via `next/image` (requires custom loader for static export; can be done separately).
- Generating or sourcing covers for the 2 review posts that lack them (`kiczery-podroz-przez-bieszczady-review`, `zmierzch-husajna-burza-nad-irakiem-review`).

## Decisions

### D1: Explicit `coverImage` frontmatter field over convention-based lookup

**Decision**: Add `coverImage?: string` to Post frontmatter rather than inferring from filesystem path.

**Alternatives considered**:
- Convention-based: check if `/images/posts/<slug>/cover.jpg` exists at build time.
  Pros: zero frontmatter changes.
  Cons: requires filesystem checks during content loading, less flexible, implicit coupling between slug and image path.

**Rationale**: Explicit is better than implicit.
The field makes the cover image a first-class content attribute visible in the MDX file.
Frontmatter is already the single source of truth for post metadata.

### D2: Plain `<img>` tags over `next/image`

**Decision**: Use native `<img>` elements for both the PostCard thumbnail and the post detail cover.

**Rationale**: The project is a static export (`output: 'export'`).
`next/image` requires a custom image loader in static export mode and is not used anywhere in the codebase.
Introducing it for this feature would add configuration complexity for minimal benefit on a low-traffic blog.
Can be revisited as a separate optimization pass.

### D3: Layout D — thumbnail right of existing card content

**Decision**: Render the cover thumbnail as a flex item on the right side of PostCard's existing content area.

The card structure becomes a three-column flex layout:

```
[date block] [content area] [thumbnail]
```

The thumbnail is conditionally rendered — when absent, the content area takes the full remaining width.
The thumbnail is wrapped in a `<Link>` pointing to the post URL.

**Responsive behavior**: thumbnail shrinks on mobile (~48px) rather than hiding.
This preserves the visual association between cover and review at all viewport sizes.

### D4: Cover placement on detail page — between header and prose

**Decision**: Render the cover image in a `<figure>` between `</header>` and the prose `<div>`.

**Alternatives considered**:
- Inside the header, below the title: clutters the metadata area.
- Full-width hero above the title: too visually dominant for book covers (portrait aspect ratio).
- Inside the prose area (current inline approach): works but couples content structure to rendering.

**Rationale**: Placing the image between header and prose creates a clear visual hierarchy: metadata → cover → review text.
The image is centered and max-width constrained since book covers are portrait-oriented and should not fill the full prose column width.

### D5: Remove inline cover image from MDX body

**Decision**: Remove the `![...]()` line from the 25 review post MDX files when adding the `coverImage` frontmatter field.

**Rationale**: The inline image was the old convention from the `import-covers` migration script.
With `coverImage` in frontmatter, the image is rendered structurally by the page components.
Keeping both would show the cover twice on the detail page.

## Risks / Trade-offs

**[Mechanical content migration]** → 25 MDX files need the same edit pattern (add frontmatter field, remove inline image).
Mitigation: this is a repetitive, low-risk transformation.
Each file follows the identical pattern (`![...]()` as first line after frontmatter).

**[Two reviews without covers]** → `kiczery-podroz-przez-bieszczady-review` and `zmierzch-husajna-burza-nad-irakiem-review` have no cover files.
Mitigation: these posts simply get no `coverImage` field and render as today.
Finding covers for them is a separate task.

**[No image optimization]** → Plain `<img>` tags mean no lazy loading, no responsive srcset, no format conversion.
Mitigation: acceptable for a low-traffic static blog.
Can add `loading="lazy"` attribute for basic optimization.
`next/image` migration is a separate future concern.

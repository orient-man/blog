## Context

The blog has 27 book review posts (all `*-review.mdx` files) that store a numeric `rating` field in frontmatter (0.5–5.0 in half-star increments).
The field is loaded into the `Post` interface (`rating?: number`) but never rendered.
The LibraryThing migration design explicitly deferred rating display as a future enhancement.

Current rendering:
- Single post page (`[slug]/page.tsx`) shows post header with date, author, category, source links, and tags.
- `PostCard` component picks specific fields from `Post` but does not include `rating`.
- No star or rating component exists anywhere in the codebase.

## Goals / Non-Goals

**Goals:**

- Render a visual star rating (filled, half-filled, empty) for book reviews on both post pages and post cards.
- Keep the implementation zero-dependency (inline SVG, Tailwind classes only).
- Support dark mode with appropriate color contrast.
- Provide screen reader accessibility.

**Non-Goals:**

- Interactive rating input (users do not rate posts — this is display-only).
- Filtering or sorting posts by rating (possible future work, not in scope).
- Changing the rating data model or frontmatter schema.

## Decisions

### D1: Inline SVG stars over icon library or CSS-only shapes

**Choice**: Render each star as an inline `<svg>` element with three variants (filled, half, empty).

**Alternatives considered**:
- **Icon library** (e.g., Heroicons, Lucide): Adds a dependency, violates the Simplicity principle.
- **Unicode characters** (★☆): Inconsistent rendering across browsers and fonts, no half-star support.
- **CSS-only clip-path**: More complex, harder to maintain, and half-star rendering is fragile.

**Rationale**: Inline SVG gives pixel-perfect control over the three star states, works with Tailwind color classes, has zero runtime cost, and adds no dependencies.

### D2: Single `StarRating` component at `src/components/StarRating.tsx`

**Choice**: One self-contained React component that accepts `rating: number` and an optional `size` prop.

**Rationale**: Used in two places (post page header, PostCard), so a shared component avoids duplication.
The `size` prop allows the PostCard to use smaller stars than the post page.

### D3: Star color — amber/gold with Tailwind

**Choice**: Use `text-amber-400` for filled/half stars and `text-gray-300 dark:text-gray-600` for empty stars.

**Alternatives considered**:
- Brand color (`text-brand-500`): The brand blue doesn't read as a "rating" color.
- Custom CSS variables: Unnecessary complexity for a fixed palette.

**Rationale**: Amber/gold is the universal convention for star ratings.
Tailwind's `amber-400` is visible in both light and dark modes.
Gray tones for empty stars provide sufficient contrast in both modes.

### D4: Placement on post page — below source links, above tags

**Choice**: Render the star rating in the post header, between the source links row and the tags row.

**Rationale**: This groups it with metadata rather than content.
It sits naturally near the "Originally on LibraryThing" link, reinforcing the book review context.

### D5: Placement on PostCard — inline after the title

**Choice**: Render a small star rating on the same line after the category badge in the metadata footer of the card.

**Rationale**: Keeps the card layout compact.
The rating badge sits alongside other metadata (category, tags) without adding a new row.

### D6: Numeric label alongside stars

**Choice**: Show the numeric value as text next to the stars (e.g., "4.5" or "3").

**Rationale**: Stars alone can be ambiguous at a glance (is 3 out of 5 or out of 10?).
A short numeric label removes ambiguity with minimal space cost.

## Risks / Trade-offs

- **[Visual clutter on PostCard]** → Mitigation: Use small star size (`w-3.5 h-3.5`) and muted styling so it doesn't dominate the card.
- **[Half-star SVG rendering]** → Mitigation: Use a `linearGradient` or `clipPath` approach in SVG for the half-fill; test in major browsers.
- **[27 posts only]** → Acceptable: Even with few reviews, the rating adds value for readers scanning book content. The component has near-zero cost.

## Open Questions

_(none — scope is well-defined)_

## Context

The site header in `src/app/layout.tsx` (lines ~122-179) uses a single-row `flex items-center justify-between` layout at all viewport widths.
The site title block ("Just AI Programmer" + tagline) occupies ~260px and the four navigation items (Home, CV, Search, DarkModeToggle) occupy ~260px.
On phones in portrait mode (375-414px), these exceed the available width, causing buttons to collide with or overlap the title.

Additionally, the navigation markup is duplicated: a desktop `<nav>` (line ~136, `hidden sm:flex`) and an identical mobile `<div>` (line ~157, `sm:hidden flex`) render the same four items.
This duplication adds maintenance burden for no benefit.

## Goals / Non-Goals

**Goals:**

- Fix the navigation collision on mobile by stacking title and nav vertically.
- Right-align the nav row on mobile for visual consistency with the desktop right-aligned nav.
- Eliminate duplicated nav markup by using a single responsive `<nav>` element.
- Preserve the existing desktop layout exactly as-is.

**Non-Goals:**

- Hamburger menu or collapsible navigation — unnecessary for four items.
- Responsive font sizing for the site title — out of scope for this change.
- Hiding the tagline on mobile — explicitly excluded per user decision.
- Redesigning the nav items (styling, ordering, adding new links).

## Decisions

### D1: Flex direction switch over CSS Grid

**Decision**: Use `flex-col` on mobile and `flex-row` at `sm` breakpoint on the header container.

**Alternatives considered**:
- CSS Grid with `grid-template-areas` — more powerful but overkill for a two-section header.
  Adds complexity without benefit (Constitution Principle I: Simplicity).
- Media query in global CSS — breaks the Tailwind-first approach used throughout the codebase.

**Rationale**: `flex-col` / `sm:flex-row` is the idiomatic Tailwind pattern for stacking-to-row layouts.
It requires changing a single element's classes with zero new CSS.

### D2: Single `<nav>` with always-visible classes

**Decision**: Remove the duplicate mobile `<div>` and the `hidden sm:flex` toggle.
Keep one `<nav>` that is always visible (`flex` at all widths).

**Rationale**: The current two-element approach exists solely to swap visibility, but both contain identical content.
A single element with responsive flex-direction on the parent achieves the same result with less markup.

### D3: Right-alignment via `self-end` on mobile

**Decision**: Apply `self-end` to the `<nav>` so it right-aligns within the `flex-col` parent on mobile.
At `sm` and above, `justify-between` on the parent handles the left-right split.

**Alternatives considered**:
- `ml-auto` on the nav — works in row layout but has no effect in column layout.
- `items-end` on the parent — would also right-align the title, which should stay left-aligned.

## Risks / Trade-offs

- **[Minor visual shift on mobile]** Users who are accustomed to the current (broken) layout will see navigation move below the title.
  This is intentional and improves usability. No mitigation needed.
- **[Vertical space increase on mobile]** Stacking adds one row of height (~40px) to the header.
  Acceptable trade-off for readable, non-overlapping navigation.

## Open Questions

_None — all design decisions are resolved._

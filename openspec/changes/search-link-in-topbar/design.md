## Context

The site header (`src/app/layout.tsx`, lines 72–102) currently contains two navigation links — Home and CV — plus a `<DarkModeToggle />`.
Search is only reachable via the footer (line 136) and the sidebar (which is hidden on mobile).
On long posts or small screens, users have no quick way to access search.

The search page at `/search/` already exists and uses Pagefind.
No new pages, components, or dependencies are needed — only the existing layout needs a link addition.

## Goals / Non-Goals

**Goals:**
- Make search discoverable from the header on every page and viewport.
- Maintain visual consistency with existing header navigation links.
- Keep the change minimal — one file, no new dependencies.

**Non-Goals:**
- Inline search input in the header (out of scope; the link navigates to the dedicated search page).
- Mobile hamburger menu or responsive navigation overhaul.
- Changes to the search page itself or Pagefind configuration.

## Decisions

### D1: Add a plain `<Link>` rather than a search icon or input

**Choice**: A text "Search" link, identical in markup to the Home and CV links.

**Alternatives considered**:
- Search icon (magnifying glass SVG) — would require adding an icon, inconsistent with the text-only nav style.
- Inline search input in header — adds complexity and a new component; violates Constitution I (Simplicity).

**Rationale**: A text link matches the existing navigation pattern, requires zero new dependencies, and is the simplest option.

### D2: Place Search between CV and DarkModeToggle

**Rationale**: Home and CV are content-oriented navigation; Search and DarkModeToggle are utility actions.
Grouping utilities to the right keeps the navigation logically ordered.

### D3: Mobile — add Search link alongside DarkModeToggle in the `sm:hidden` block

**Choice**: Add a `<Link href="/search/">Search</Link>` inside the existing `sm:hidden` `<div>` that currently only shows `<DarkModeToggle />`.
Wrap both in a flex container with a small gap.

**Alternatives considered**:
- Hamburger menu — significant scope increase for a single extra link, violates Simplicity.
- Only footer link for mobile — status quo, poor discoverability.

**Rationale**: Minimal change to make search accessible on mobile.
If more nav links are added in the future, a hamburger menu should be reconsidered then.

## Risks / Trade-offs

- **[Visual crowding on small `sm` viewports]** → With 4 items (Home, CV, Search, toggle) the nav is still well within typical header width.
  The `gap-4` spacing keeps items readable.
- **[Mobile block grows slightly]** → Adding one link next to the toggle is a minor visual change.
  If more links accumulate later, this approach will not scale — but that is a future concern.

## Why

The Search link is only accessible in the footer and sidebar, making it hard to discover.
Readers must scroll past content or find the sidebar to reach search — a poor experience on long posts and on mobile viewports where the sidebar is hidden entirely.
Adding a Search link to the header navigation gives users immediate, persistent access from any page, aligned with the Content-First principle (Constitution II) that prioritizes reading experience.

## What Changes

- Add a "Search" link to the header `<nav>` in `src/app/layout.tsx`, placed between the existing "CV" link and the `<DarkModeToggle />`.
- Ensure the Search link is accessible on mobile viewports where the desktop nav is hidden.
- No new dependencies, no new components, no changes to the search page itself.

## Capabilities

### New Capabilities

- `topbar-search-link`: Add a Search navigation link to the site header for global discoverability.

### Modified Capabilities

_(none — no existing spec-level requirements are changing)_

## Impact

- **Code**: `src/app/layout.tsx` — header section (lines 72–102).
  The mobile breakpoint block (`sm:hidden`) may need a small addition.
- **APIs / Dependencies**: None. No new packages or components.
- **Systems**: Static export unaffected; no build or deployment changes.

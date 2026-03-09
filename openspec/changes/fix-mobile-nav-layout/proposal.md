## Why

On narrow screens (below ~550px), the header navigation buttons (Home, CV, Search, dark mode toggle) collide with the site title in a single horizontal row.
Most phones in portrait mode (375px-414px) cannot fit both the title (~260px) and four nav items (~260px), making navigation unusable.
This directly undermines Constitution Principle II (Content-First): navigation friction degrades the reading experience.

## What Changes

- Move navigation buttons below the site title on mobile (below `sm` / 640px breakpoint), right-aligned.
- Keep the existing side-by-side layout on desktop (640px+) unchanged.
- Remove the duplicated mobile nav `<div>` and unify into a single responsive `<nav>` element.
- Tagline remains visible at all viewport widths.

## Capabilities

### New Capabilities

- `responsive-header`: Responsive header layout that stacks title and navigation vertically on narrow screens (with right-aligned nav) and displays them side-by-side on wider screens.

### Modified Capabilities

_None — no existing spec-level requirements change._

## Impact

- **Code**: `src/app/layout.tsx` header section (lines ~122-179) — restructure flex layout and responsive classes.
- **Dependencies**: None added or removed (pure Tailwind CSS change).
- **APIs**: None affected.
- **Visual**: Mobile users will see navigation right-aligned below the title instead of beside it.
  Desktop layout is unchanged.

## Context

The site's retro/pixel-art identity is currently CSS-only: dithered gradient bar, bevel panels, CRT scanlines, pixel fonts.
The only actual pixel art imagery lives on the 404 page (4 sprites in `public/images/404/`).
This change adds real pixel art as ambient decoration across the site: a background texture, sidebar icons, and footer props.

Current layout facts relevant to implementation:
- `<body>` has `bg-[var(--bg)]`; the main content area and sidebar have no own opaque background, so a body background tile shows through naturally.
- Header and footer have `bg-white dark:bg-gray-950`, which occludes the tile.
- All 8 sidebar section headings share the identical class string: `font-pixel font-semibold text-gray-900 dark:text-gray-100 mb-3 uppercase tracking-wide text-xs border-b-2 border-current pb-1`.
- The footer terminal prompt is a `<span>` inside a flex-column `<div>` (`max-w-5xl mx-auto px-4 py-6`).
- The existing `.pixel-render` utility class already defines `image-rendering: pixelated`.

## Goals / Non-Goals

**Goals:**
- Add pixel art imagery to three locations: body background, sidebar headings, footer.
- Maintain visual consistency across all generated assets (same PixelLab parameters per group).
- Keep total asset weight under 50KB.
- Preserve full accessibility (all decorative, `aria-hidden`, empty `alt`).
- Zero new JS dependencies.

**Non-Goals:**
- Dark-mode-specific asset variants (single set of assets works in both modes due to low opacity / brand palette).
- Mascot or character presence anywhere on the site.
- Interactive or animated pixel art.
- Easter eggs or hidden interactions.
- Category-specific icons (only 2 categories, not worth it).

## Decisions

### D1: Background tile — CSS `background-image` on `<body>`

Add the tile as `background-image` on the `body` selector in `globals.css` with `background-repeat: repeat`, `image-rendering: pixelated`, and `opacity` controlled via a low-alpha overlay or direct opacity value.

**Why not a pseudo-element?** The body already has a background color via `bg-[var(--bg)]`.
A CSS background-image with a low-opacity tile on `<body>` is the simplest approach.
We will set the tile at very low opacity using a semi-transparent tile image (generating it with pale colors) rather than CSS opacity on the body itself (which would affect all children).

**Tile parameters:** 32x32 isometric tile, `high top-down` view, `lineless` outline, `basic shading`.
The tile content will be a simple cross-hatch or grid pattern in faded amber/teal.

**Alternatives considered:**
- CSS-only pattern (repeating-conic-gradient): Rejected — we want actual pixel art, not another CSS trick.
- `<div>` overlay with `pointer-events: none`: More complex, no benefit over `background-image`.

### D2: Sidebar icons — inline `<img>` elements before heading text

Each `<h2>` in `Sidebar.tsx` gets an `<img>` element prepended inside the heading, before the text node.
The heading `className` adds `flex items-center gap-1.5` to align icon and text.

**Icon parameters:** All 8 icons generated with identical PixelLab settings: `high top-down` view, 32x32 canvas (character will be ~19px), `single color outline`, `basic shading`, `medium detail`.
We will use the `pixellab_create_map_object` tool at 32x32 for each icon.

**Why inline `<img>` over CSS `background-image` on the heading?**
- Inline `<img>` allows `aria-hidden` and `alt=""` for proper accessibility semantics.
- Simpler to maintain — each heading's icon is explicit in the JSX.
- No need for 8 separate CSS classes.

**Alternatives considered:**
- CSS `::before` with `background-image`: Less accessible (no `aria-hidden`), requires 8 CSS rules.
- SVG sprites: More complex, and we want actual pixel art PNGs from PixelLab.
- A reusable `SidebarHeading` component: Possible future refactor, but for 8 headings the inline approach is simpler and avoids an abstraction that doesn't carry its weight.

### D3: Footer props — positioned `<img>` elements flanking the terminal prompt

Add 2 pixel art props (one left, one right) as `<img>` elements inside the footer's inner `<div>`.
Use `flex` layout with the props at the edges and the existing footer content in the center.
Props are 32-48px tall.

**Prop subjects:** A small lantern/torch (left) and a small potion bottle or scroll (right) — thematic with the retro adventure game aesthetic, matching the 404 page's sprite style.

**Prop parameters:** `pixellab_create_map_object`, 48x48 canvas, `high top-down` or `side` view, `single color outline`, `basic shading`, `medium detail`.

**Why not absolute positioning?** Flexbox is simpler, responsive, and doesn't require z-index management.

**Alternatives considered:**
- More than 2 props (3-4): Start with 2, can add more later if the look warrants it.
- Reusing 404 page sprites: Rejected — the 404 sprites have a different context (scene composition) and mixed styles.

### D4: Asset file organization

All new assets go in `public/images/decorations/` with kebab-case names:
- `bg-tile.png` — background texture tile
- `icon-about.png`, `icon-recent-posts.png`, `icon-categories.png`, `icon-tags.png`, `icon-reading.png`, `icon-archive.png`, `icon-blogroll.png`, `icon-search.png` — sidebar icons
- `footer-lantern.png`, `footer-potion.png` — footer props

### D5: Dark mode handling — no separate assets

The pixel art uses the brand palette (amber/teal) which works in both light and dark modes.
The background tile is at 3-5% opacity, so palette differences are imperceptible.
Sidebar icons and footer props are small accent pieces whose amber/teal colors read well on both light (`#ffffff`) and dark (`#1a1a2e`) backgrounds.
No dark-mode-specific asset variants are needed.

## Risks / Trade-offs

**[Risk] PixelLab generation produces inconsistent styles across batches**
Mitigation: Generate all icons in a single batch with identical parameters. Review output before integrating. Regenerate any outliers.

**[Risk] Background tile is too prominent or too subtle**
Mitigation: The opacity can be tuned in CSS after initial integration. Start at 3% and adjust.

**[Risk] Footer props look crowded on small screens**
Mitigation: Hide footer props below `sm:` breakpoint using `hidden sm:block`.

**[Risk] Sidebar headings become too busy with icons**
Mitigation: Icons are very small (16-24px rendered). The `gap-1.5` keeps them tight to the text. Can be toggled off easily.

**[Trade-off] Inline `<img>` per heading vs. component extraction**
We accept 8 similar `<img>` tags in `Sidebar.tsx` rather than extracting a `SidebarHeading` component. This is a deliberate simplicity choice — a component adds abstraction overhead for only 8 call sites with no complex logic.

## Open Questions

None — all design decisions are resolved based on exploration findings.

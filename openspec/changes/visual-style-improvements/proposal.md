## Why

The site's retro/pixel-art identity is carried entirely by fonts and CSS tricks (dithered gradient, bevel panels, CRT scanlines).
The only actual pixel art imagery lives on the 404 page.
This creates a gap between the UI chrome's retro character and the rest of the site, which feels visually plain outside the typography layer.
Adding delicate pixel art decorations — a subtle background texture, small sidebar section icons, and a footer scene — would deepen the site's atmosphere without competing with content.
This aligns with Constitution Principle II (Content-First): pixel art enhances the reading environment as ambient decoration, not as content-competing visuals.

## What Changes

- Add a subtle tiled background texture to the body, visible behind the main content area at very low opacity (~3-5%).
  The header and footer already have opaque backgrounds, so the tile only shows through in the content zone.
- Add small pixel art icons (~16-24px) inline with each sidebar section heading (About, Recent Posts, Categories, Tags, Currently Reading, Archive, Blogs I Follow, Search).
- Add 2-4 small pixel art props (32-48px) to the footer area, framing the existing terminal prompt.
- All pixel art assets generated via PixelLab MCP using the existing brand palette (amber/gold + teal).
- All pixel art images rendered with `image-rendering: pixelated` (CSS class already exists).
- No new JavaScript dependencies; no dynamic behavior; no dark-mode-specific asset variants.

## Capabilities

### New Capabilities
- `pixel-art-decorations`: Covers the generation, placement, and styling of pixel art image assets used as decorative elements — background texture tile, sidebar section icons, and footer scene props.

### Modified Capabilities
- `retro-components`: Sidebar section headings (FR-011) gain inline pixel art icons; footer terminal prompt (FR-014) gains flanking pixel art scene props.

## Impact

- **Files modified**: `src/styles/globals.css` (background tile styling), `src/components/Sidebar.tsx` (icon images in headings), `src/app/layout.tsx` (footer pixel art props).
- **New assets**: ~10-12 small PNG files in `public/images/decorations/` (1 background tile, ~8 sidebar icons, 2-4 footer props).
- **Dependencies**: None added. Assets are static PNGs served as-is.
- **Performance**: Minimal impact. All images are small (<5KB each). Background tile is a single tiny image repeated via CSS. Total new asset weight estimated at ~30-50KB.
- **Accessibility**: All decorative images use `aria-hidden="true"` and empty `alt=""`. Background tile is purely decorative CSS. No content or navigation depends on pixel art visibility.

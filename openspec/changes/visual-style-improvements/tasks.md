## 1. Asset Directory Setup

- [ ] 1.1 Create `public/images/decorations/` directory (FR-022)

## 2. Background Texture Tile (FR-019)

- [ ] 2.1 Generate background tile using PixelLab (`pixellab_create_isometric_tile` or `pixellab_create_tiles_pro`, 32x32, lineless, basic shading, faded amber/teal cross-hatch pattern) (FR-022)
- [ ] 2.2 Save tile as `public/images/decorations/bg-tile.png` (FR-022)
- [ ] 2.3 Add `background-image` rule to `body` in `src/styles/globals.css` with `background-repeat: repeat`, `image-rendering: pixelated`, and ~3-5% visible opacity (FR-019)

## 3. Sidebar Section Icons (FR-020)

- [ ] 3.1 Generate 8 sidebar icons using PixelLab (`pixellab_create_map_object`, 32x32, single color outline, basic shading, medium detail, high top-down view, brand palette) — About, Recent Posts, Categories, Tags, Currently Reading, Archive, Blogs I Follow, Search (FR-022)
- [ ] 3.2 Save icons as `public/images/decorations/icon-{name}.png` (FR-022)
- [ ] 3.3 Update each `<h2>` in `src/components/Sidebar.tsx` to add `flex items-center gap-1.5` class and prepend `<img src="/images/decorations/icon-{name}.png" alt="" aria-hidden="true" width={16} height={16} className="pixel-render" />` (FR-020, FR-011 modified)
- [ ] 3.4 Verify all 8 icons render correctly and are vertically aligned with heading text (FR-020)

## 4. Footer Scene Props (FR-021)

- [ ] 4.1 Generate 2 footer props using PixelLab (`pixellab_create_map_object`, 48x48, single color outline, basic shading, medium detail, side view, brand palette) — lantern (left) and potion/scroll (right) (FR-022)
- [ ] 4.2 Save props as `public/images/decorations/footer-lantern.png` and `public/images/decorations/footer-potion.png` (FR-022)
- [ ] 4.3 Add prop `<img>` elements to the footer in `src/app/layout.tsx`, flanking the terminal prompt with `aria-hidden="true"`, `alt=""`, `className="pixel-render hidden sm:block"` (FR-021, FR-014 modified)
- [ ] 4.4 Verify footer props do not obscure terminal prompt or footer links on desktop and mobile viewports (FR-021)

## 5. Validation

- [ ] 5.1 Run `npm run lint` and fix all warnings/errors (AGENTS.md requirement)
- [ ] 5.2 Run `npm run build` and verify static export succeeds
- [ ] 5.3 Bump version in `CHANGELOG.md` (minor version — new user-visible feature)

## 1. Foundation — Colors and Fonts

- [ ] 1.1 Update dark mode CSS custom properties in `globals.css` to warm indigo/amber/teal palette (FR-001)
- [ ] 1.2 Update light mode accent and link CSS custom properties in `globals.css` (FR-002)
- [ ] 1.3 Update Tailwind `brand` color scale in `tailwind.config.ts` from green/lime to amber/gold (FR-003)
- [ ] 1.4 Load Pixelify Sans (400-700) via `next/font/google` in `layout.tsx` and expose as `--font-pixel` CSS variable (FR-004)
- [ ] 1.5 Load VT323 via `next/font/google` in `layout.tsx` and expose as `--font-terminal` CSS variable (FR-005)

## 2. Global Visual Elements

- [ ] 2.1 Replace accent bar: change from 4px solid to 6px dithered amber→teal gradient using `repeating-conic-gradient` (FR-006)
- [ ] 2.2 Define reusable `.bevel-panel` CSS class in `globals.css` with inner highlight/shadow and outer drop shadow (D5)
- [ ] 2.3 Define `.bevel-panel-pressed` variant for hover states (D5)
- [ ] 2.4 Add pixel-style `<hr>` / section divider CSS using accent-colored diamond/cross pattern (FR-018)

## 3. Header and Navigation

- [ ] 3.1 Restyle site title in Pixelify Sans 700 in `layout.tsx` (FR-009)
- [ ] 3.2 Apply `.bevel-panel` styling and Pixelify Sans to nav buttons in `layout.tsx` (FR-010)
- [ ] 3.3 Add hover press effect (`.bevel-panel-pressed`) to nav buttons (FR-010)

## 4. Sidebar and Tags

- [ ] 4.1 Apply Pixelify Sans and beveled bottom border to sidebar section headings in `Sidebar.tsx` (FR-011)
- [ ] 4.2 Restyle tag pills as inventory items with Pixelify Sans and `.bevel-panel` in `TagCloud.tsx` (FR-012)
- [ ] 4.3 Add hover feedback to tag pills (FR-012)

## 5. Post Cards and Date Labels

- [ ] 5.1 Apply `.bevel-panel` styling to post cards in `PostCard.tsx` (FR-015)
- [ ] 5.2 Apply Pixelify Sans 400 to date labels in `PostCard.tsx` (FR-013)

## 6. Code Blocks

- [ ] 6.1 Restyle code block title bars with VT323 font and darker CRT-inspired background in `globals.css` (FR-016)
- [ ] 6.2 Add CRT scanline `::after` overlay to code blocks with `pointer-events: none` and ~0.03-0.05 opacity (FR-017)

## 7. Footer

- [ ] 7.1 Add terminal-style prompt line (`visitor@just-a-programmer.pl:~$`) in VT323 to footer in `layout.tsx` (FR-014)

## 8. Accessibility

- [ ] 8.1 Verify all text-background combinations meet WCAG 2.1 AA contrast ratios (FR-007)
- [ ] 8.2 Wrap all decorative animations and transitions in `@media (prefers-reduced-motion: no-preference)` (FR-008)

## 9. 404 Adventure Page

- [ ] 9.1 Generate pixel art assets (character, trees, moon, environment) using PixelLab AI MCP and save to `public/images/404/` (FR-020)
- [ ] 9.2 Create `src/app/not-found.tsx` with adventure-game scene layout, "not found" message, and homepage link (FR-019)
- [ ] 9.3 Add adventure-game flavor text in Pixelify Sans (FR-021)
- [ ] 9.4 Ensure 404 page is responsive across mobile, tablet, and desktop viewports (FR-022)

## 10. Validation

- [ ] 10.1 Run `npm run build` and verify static export succeeds with no errors
- [ ] 10.2 Run `npm run lint` and resolve all warnings and errors

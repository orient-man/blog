## Context

The blog (`blog.orientman.com`) is a statically exported Next.js site using Tailwind CSS for styling and CSS custom properties for theming.
The current visual identity is a generic developer template aesthetic: cool slate backgrounds, lime-green accents, and system-default styling on all components.

The goal is to layer personal cultural identity (pixel art, point-and-click adventure games, retro computing, cyberpunk) into the existing layout through CSS-only techniques and Google Fonts.
No structural layout changes are planned.
The approach ("Layered Subtlety") preserves the Content-First reading experience while making the blog recognizably personal.

Current theming architecture:
- CSS custom properties defined in `globals.css` under `[data-theme="dark"]` and `[data-theme="light"]` selectors.
- `DarkModeToggle.tsx` toggles the `data-theme` attribute on `<html>`.
- Tailwind `brand` color scale in `tailwind.config.ts` provides utility classes.
- Fonts loaded via `next/font/google` in `layout.tsx` and applied via CSS variables.

## Goals / Non-Goals

**Goals:**

- Replace color palettes (dark and light) with warm indigo/amber/teal scheme.
- Load two new Google Fonts (Pixelify Sans, VT323) without adding npm dependencies.
- Apply retro-game-inspired styling to nav, sidebar, tags, post cards, code blocks, and footer using CSS-only techniques.
- Create a dithered accent bar using CSS gradients.
- Build a standalone 404 page with AI-generated pixel art.
- Ensure WCAG 2.1 AA contrast compliance for all text.
- Add `prefers-reduced-motion` guards for all decorative animations.

**Non-Goals:**

- Body text font changes — Lora stays for prose, JetBrains Mono stays for code content.
- Layout/structure changes — no grid, flexbox, or component hierarchy modifications.
- Custom pixel art for avatar or favicon — Gravatar stays.
- Custom pixel cursor — deferred to a future change.
- JavaScript-based animations or effects.
- npm dependency additions.

## Decisions

### D1: Color system via CSS custom properties (not Tailwind theme)

**Decision**: Update CSS custom properties in `globals.css` as the primary color system; update Tailwind `brand` scale only for utility class parity.

**Rationale**: The existing architecture already uses CSS variables for theming with `data-theme` toggling.
Changing this to a Tailwind-first approach would require refactoring the `DarkModeToggle` and all components that reference `var(--*)`.
Keeping CSS variables as source of truth and syncing the Tailwind `brand` scale is the minimal-disruption path.

**Alternatives considered**: Full Tailwind `darkMode: 'class'` migration — rejected because it would touch every component and change the theming architecture.

### D2: Pixelify Sans as primary pixel font (not Silkscreen, not Press Start 2P)

**Decision**: Use Pixelify Sans (variable weight 400-700) for all pixel-font UI elements.

**Rationale**: Silkscreen lacks Polish diacritics (ą, ę, ś, ź, ż, ó, ł, ń, ć) — eliminated.
Press Start 2P supports Polish but only has one weight and is too thick for body-adjacent text.
Pixelify Sans has variable weights, supports Polish, and has the best readability among pixel fonts tested.

**Alternatives considered**: Silkscreen (no Polish), Press Start 2P (single heavy weight, poor readability at small sizes).

### D3: VT323 scoped to code title bars and terminal decoration only

**Decision**: VT323 is used exclusively for code block title bars, copy button labels, and the footer terminal prompt.
It is NOT used for code content (JetBrains Mono stays).

**Rationale**: VT323's monospace terminal feel suits UI chrome around code blocks but lacks the ligatures and rendering quality of JetBrains Mono for actual code reading.
Mixing fonts within code blocks (title vs. content) creates a clear visual hierarchy.

### D4: Dithered accent bar via CSS repeating-conic-gradient

**Decision**: The accent bar uses a two-layer CSS approach: a linear-gradient (amber → teal) underneath, with a `repeating-conic-gradient` checkerboard overlay creating the dither pattern.
Bar height increases from 4px to 6px.

**Rationale**: At 4px only 2 rows of pixels exist, making dithering invisible.
At 6px the checkerboard pattern is perceptible.
`repeating-conic-gradient` has excellent browser support (Chrome 69+, Firefox 83+, Safari 12.1+).
No JavaScript or image assets needed.

**Alternatives considered**: SVG data URI pattern (more markup), `background-image` with PNG tile (adds an asset), JavaScript canvas (violates Simplicity principle).

### D5: Beveled panel as reusable CSS pattern

**Decision**: Define a single `.bevel-panel` CSS class (and/or Tailwind `@apply` mixin) for the retro panel effect.
Applied to: nav buttons, post cards, sidebar headings, tag pills.

**Pattern**:
```css
border: 2px solid #3a3a5c;
box-shadow:
  inset 1px 1px 0 #4a4a7a,
  inset -1px -1px 0 #1a1a3a,
  2px 2px 0 #0a0a1e;
```

**Rationale**: A single reusable class ensures visual consistency across all beveled elements and reduces CSS duplication.
The shadow values reference the color palette variables for theme adaptability.

### D6: CRT scanlines as ::after pseudo-element

**Decision**: Scanlines are applied via `::after` on code blocks with `pointer-events: none` and very low opacity (0.03-0.05).

**Rationale**: Using a pseudo-element with `pointer-events: none` ensures text selection, copying, and clicking within code blocks is unaffected.
The extremely low opacity makes scanlines a subtle texture, not a readability barrier.

### D7: 404 page as standalone Next.js route with static assets

**Decision**: The 404 page is `src/app/not-found.tsx`.
Pixel art assets are generated via PixelLab AI MCP during development and committed as static PNGs in `public/images/404/`.
No runtime API calls to PixelLab.

**Rationale**: Static assets align with Constitution Principle I (Simplicity — no runtime dependencies).
PixelLab AI is a development-time tool only; the deployed site serves pre-generated images.

### D8: Font loading via next/font/google

**Decision**: Both Pixelify Sans and VT323 are loaded via `next/font/google` in `layout.tsx`, following the existing pattern used for Lora and JetBrains Mono.

**Rationale**: `next/font/google` handles subsetting, self-hosting, and `font-display: swap` automatically.
This is the established pattern in the codebase and adds zero new dependencies.

## Risks / Trade-offs

| Risk | Impact | Mitigation |
|------|--------|------------|
| Pixel fonts may feel jarring next to serif body text | Medium — could undermine Content-First principle | Limited to UI chrome (nav, headings, tags, dates, footer); body prose untouched. Review after implementation. |
| Dithered accent bar may be imperceptible on some displays | Low — purely decorative | Fallback: solid amber bar still looks good if dithering doesn't render. |
| Warm parchment text color may fatigue on long reads | Medium — readability concern | Contrast ratio verified > 4.5:1. If user feedback indicates fatigue, can lighten toward `#f0e0c8`. |
| PixelLab AI asset quality unknown until generation | Low — isolated to 404 page | 404 page is last in implementation order. Can fall back to CSS-only scene if assets don't meet quality bar. |
| `repeating-conic-gradient` not supported in very old browsers | Very Low — decorative only | Accent bar degrades gracefully to the underlying linear gradient. |
| Beveled shadows may look heavy if accumulated on many elements | Medium — visual clutter | Defined as a single reusable class; can globally tune shadow intensity. On dense pages (tag listing), may reduce to 1px shadows. |

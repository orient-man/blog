## Context

The blog currently uses a blue accent color system defined through CSS custom properties (`--link`, `--link-hover`, `--accent`) and Tailwind utility classes (`blue-*`).
Dark mode uses the `class` strategy with localStorage persistence.
Styling is entirely Tailwind utility classes — no CSS Modules or styled-components.
Layout is a header → main+sidebar (flex) → footer structure, max-w-5xl, with sidebar at lg:w-64/xl:w-72.
Fonts load locally: Inter (sans), JetBrains Mono (mono).
There are ~33 lines of blue Tailwind utility classes across 11 files plus 3 CSS variables (`--link`, `--link-hover`, `--accent`) using blue hex values.

## Goals / Non-Goals

**Goals:**
- Restore the Chateau theme's visual identity (green accent, serif headings, top border, date blocks) as a spiritual successor.
- Maintain full dark mode support with accessible contrast ratios.
- Keep the change purely CSS/config — no new runtime dependencies or build changes.

**Non-Goals:**
- Pixel-perfect reproduction of the WordPress Chateau theme.
- Changing the site layout structure (header/sidebar/footer arrangement stays).
- Modifying content, URLs, build pipeline, or functional behavior.
- Adding the old Don Quixote mascot image (keeping current Gravatar).

## Decisions

### D1: Color system approach — Tailwind custom color scale

**Decision:** Define a custom `brand` color scale in `tailwind.config.ts` (shades 50-950) based on `#88c34b`, and update CSS custom properties in `globals.css`.

**Alternatives considered:**
- *Use Tailwind's built-in `lime` palette:* `#88c34b` is close to `lime-500` (`#84cc16`) but not exact. Using a custom scale preserves the precise original color.
- *CSS-only approach (no Tailwind config):* Would require manual hex values everywhere instead of semantic class names. Less maintainable.

**Rationale:** A custom scale gives semantic names (`brand-500`, `brand-600`) while keeping the exact Chateau green. Components use Tailwind classes, so this fits the existing pattern.

**Color mapping:**

| Usage | Light mode | Dark mode |
|-------|-----------|-----------|
| Links (`--link`) | `#4d7c0f` (lime-700, darker for AA contrast) | `#a3e635` (lime-400) |
| Link hover (`--link-hover`) | `#88c34b` (brand-500) | `#bef264` (lime-300) |
| Accent (`--accent`) | `#88c34b` (brand-500) | `#a3e635` (lime-400) |
| UI elements | `brand-*` scale shades | Lighter `brand-*` shades |

### D2: Font loading — System Georgia with optional Lora

**Decision:** Add `serif: ["Lora", "Georgia", "serif"]` to Tailwind's font families. Import Lora from Google Fonts via `next/font/google` for consistent cross-platform rendering.

**Alternatives considered:**
- *Georgia-only (system font):* Zero added weight, but Georgia renders differently across OS/browsers. Some Linux systems lack Georgia entirely.
- *Self-host Lora woff2:* Full control but adds a build step and files to manage.
- *`next/font/google` for Lora:* Next.js auto-optimizes, self-hosts at build time, adds `font-display: swap`. Minimal config, zero layout shift.

**Rationale:** `next/font/google` gives optimized loading with no manual font file management, consistent with the Simplicity principle. Georgia remains the fallback.

### D3: Top border — CSS pseudo-element on body

**Decision:** Add a `::before` pseudo-element on `body` (or a dedicated `<div>`) with `height: 4px; background: #88c34b; position: fixed; top: 0; width: 100%; z-index: 50`.

**Alternatives considered:**
- *`border-top` on body:* Shifts layout by 4px, affects scroll calculations.
- *Fixed `<div>` in layout:* Simple, semantic, no layout shift. Slightly preferred for clarity.

**Rationale:** A fixed-position div at the top of `layout.tsx` is the simplest, most predictable approach. It stays visible on scroll and doesn't affect document flow.

### D4: Date block — Restructured PostCard component

**Decision:** Restructure `PostCard.tsx` to render the date as a left-floated block (flex layout: date column + content column). The date column shows a large day number with weekday and month/year below.

**Alternatives considered:**
- *CSS Grid overlay:* More complex for a simple two-column card layout.
- *Absolute positioning:* Fragile across breakpoints.

**Rationale:** Flexbox with a fixed-width date column is the most maintainable approach and works naturally with the existing card structure.

### D5: Excerpt length — `line-clamp-6`

**Decision:** Change from `line-clamp-3` to `line-clamp-6` in PostCard excerpt.

**Rationale:** Direct, single-line change. The value 6 provides a good editorial feel without making cards excessively tall on mobile.

### D6: Component migration order — CSS variables first, then utilities

**Decision:** Migrate in this order:
1. `tailwind.config.ts` (add brand colors + serif font)
2. `globals.css` (update CSS custom properties)
3. `layout.tsx` (top border, subtitle, nav link, font classes)
4. `PostCard.tsx` (date block, excerpt, colors)
5. All remaining components (mechanical blue→brand replacement)

**Rationale:** Config and CSS variables affect all components, so changing them first means some blue→green happens automatically (via `--link` etc.). The remaining per-component changes are then purely utility class replacements.

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Green-on-white contrast may be insufficient for small text | Use darker green variants (`lime-700`/`#4d7c0f`) for body links in light mode. Reserve `#88c34b` for decorative elements and hover states. |
| Lora font adds ~20KB network weight | `next/font/google` self-hosts and subsets automatically. Only load Regular and Italic weights. Fallback to Georgia is graceful. |
| Date block layout may break on narrow mobile screens | Use responsive design: date block floats left on `sm:` and above, stacks vertically on mobile. |
| Visual regression across 11 files | Migrate systematically (D6 order). Verify each component visually before proceeding. |
| CV link destination unknown | The CV page URL needs to be confirmed. Use `/cv` as default, or an external URL if one exists. |

## Open Questions

1. **CV page URL**: Is there an existing CV page at `/cv`, or should the nav link point to an external URL (e.g., LinkedIn)?
2. **Lora font weights**: Should we load Regular (400) + Italic (400i) only, or also Bold (700) for emphasized headings?

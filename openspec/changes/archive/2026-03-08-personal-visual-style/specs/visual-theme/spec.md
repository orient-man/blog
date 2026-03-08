## ADDED Requirements

### Requirement: FR-001 Dark mode color palette

The blog's dark mode SHALL use a warm indigo/amber/teal palette instead of the current cool slate/lime scheme.
The CSS custom properties in the `[data-theme="dark"]` selector SHALL define:

| Variable | Value | Purpose |
|----------|-------|---------|
| `--bg` | `#1a1a2e` | Deep indigo background |
| `--fg` | `#e8d5b7` | Warm parchment foreground |
| `--muted` | `#8b7e6a` | Warm gray for secondary text |
| `--border` | `#2a2a4a` | Warm dark border |
| `--card-bg` | `#1e1e38` | Dark indigo card surface |
| `--code-bg` | `#16213e` | Deep blue code background |
| `--link` | `#5bc0be` | Muted teal for links |
| `--link-hover` | `#7ee8e5` | Bright teal for link hover |
| `--accent` | `#e8a849` | Amber/gold accent |

#### Scenario: Dark mode renders warm palette
- **WHEN** the user views the blog with dark mode active
- **THEN** the page background SHALL be deep indigo (`#1a1a2e`), body text SHALL be warm parchment (`#e8d5b7`), and links SHALL be muted teal (`#5bc0be`)

#### Scenario: Dark mode accent color
- **WHEN** the user views any accent-colored element (accent bar, highlighted text, active states) in dark mode
- **THEN** the accent color SHALL be amber/gold (`#e8a849`)

### Requirement: FR-002 Light mode accent and link colors

The blog's light mode SHALL update accent and link colors from green to amber/teal for consistency with the overall theme.
Only the following properties change; all other light-mode variables remain unchanged:

| Variable | Value |
|----------|-------|
| `--accent` | `#d4940a` |
| `--link` | `#0a7e7a` |
| `--link-hover` | `#d4940a` |

#### Scenario: Light mode accent consistency
- **WHEN** the user views the blog in light mode
- **THEN** accent-colored elements SHALL use warm amber (`#d4940a`) and links SHALL use dark teal (`#0a7e7a`)

### Requirement: FR-003 Tailwind brand color scale

The `brand` color scale in `tailwind.config.ts` SHALL be updated from the current green/lime family to an amber/gold family.
All existing Tailwind utility classes referencing `brand-*` SHALL resolve to the new amber values.

#### Scenario: Brand utilities render amber
- **WHEN** a component uses `text-brand-500` or `bg-brand-500`
- **THEN** the rendered color SHALL be in the amber/gold family, not green/lime

### Requirement: FR-004 Pixelify Sans font loading

The site SHALL load Pixelify Sans from Google Fonts via `next/font/google` with variable weights 400-700.
The font SHALL be available as a CSS variable (e.g., `--font-pixel`) for use in components.
The font MUST support Polish diacritics (ą, ę, ś, ź, ż, ó, ł, ń, ć).
The font MUST NOT be applied to body prose or code content.

#### Scenario: Pixelify Sans available
- **WHEN** the page loads
- **THEN** Pixelify Sans SHALL be loaded and available via the `--font-pixel` CSS variable

#### Scenario: Polish diacritics render correctly
- **WHEN** text using Pixelify Sans contains Polish characters (ą, ę, ś, ź, ż, ó, ł, ń, ć)
- **THEN** all characters SHALL render in Pixelify Sans without fallback substitution

### Requirement: FR-005 VT323 font loading

The site SHALL load VT323 from Google Fonts via `next/font/google`.
The font SHALL be available as a CSS variable (e.g., `--font-terminal`) for use in code block title bars and decorative terminal elements.
VT323 MUST NOT be applied to code block content (JetBrains Mono stays).

#### Scenario: VT323 available for terminal UI
- **WHEN** a code block title bar or terminal-style element renders
- **THEN** the text SHALL use VT323 via the `--font-terminal` CSS variable

### Requirement: FR-006 Dithered accent bar

The top accent bar SHALL be 6px tall (increased from 4px) and display a dithered amber-to-teal gradient.
The dithering effect SHALL be achieved using a CSS `repeating-conic-gradient` checkerboard overlay on a linear gradient.
The bar MUST NOT use JavaScript or image assets.

#### Scenario: Accent bar renders with dithering
- **WHEN** the user views any page
- **THEN** the top accent bar SHALL be 6px tall and display a visible checkerboard dithering pattern transitioning from amber to teal

#### Scenario: CSS-only implementation
- **WHEN** the accent bar markup is inspected
- **THEN** the dithering effect SHALL be implemented entirely with CSS gradients (no `<img>`, `<canvas>`, or JavaScript)

### Requirement: FR-007 WCAG contrast compliance

All text-background color combinations in both dark and light modes SHALL meet WCAG 2.1 AA contrast requirements.
Body text (`--fg` on `--bg`) SHALL have a contrast ratio of at least 4.5:1.
Large text (headings, nav labels in pixel font) SHALL have a contrast ratio of at least 3:1.

#### Scenario: Body text contrast in dark mode
- **WHEN** body text (`#e8d5b7`) renders on the dark background (`#1a1a2e`)
- **THEN** the contrast ratio SHALL be at least 4.5:1

#### Scenario: Link contrast in dark mode
- **WHEN** link text (`#5bc0be`) renders on the dark background (`#1a1a2e`)
- **THEN** the contrast ratio SHALL be at least 4.5:1

### Requirement: FR-008 Reduced motion support

All CSS animations and transitions introduced by this change SHALL be wrapped in `@media (prefers-reduced-motion: no-preference)`.
When the user has `prefers-reduced-motion: reduce` active, all decorative animations (glow pulses, hover transitions) SHALL be disabled.

#### Scenario: Animations disabled for reduce preference
- **WHEN** the user has `prefers-reduced-motion: reduce` set in their OS/browser
- **THEN** no decorative CSS animations or transitions SHALL play

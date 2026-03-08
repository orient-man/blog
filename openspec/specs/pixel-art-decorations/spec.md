## ADDED Requirements

### Requirement: FR-019 Body background texture tile

The site SHALL display a subtle tiled pixel art texture on the `<body>` background.
The tile SHALL be a small PNG image (16x16 or 32x32 pixels) repeated via `background-repeat: repeat`.
The texture opacity MUST be between 3% and 5% so it is barely perceptible and MUST NOT compete with content readability.
The tile image MUST use colors from the existing brand palette (amber `#d4940a` / teal `#0a7e7a`).
The tile MUST be rendered with `image-rendering: pixelated` to preserve crisp pixel edges.
The background tile SHALL be visible only in the content zone where the `<main>` and sidebar have no opaque background; the header and footer already have opaque backgrounds that naturally occlude the tile.
The tile MUST be a static PNG asset served from `public/images/decorations/`.
No JavaScript or dynamic behavior SHALL be used to render the background.

#### Scenario: Background tile is visible in content zone
- **WHEN** the user views any page
- **THEN** a faint repeating pixel art texture SHALL be visible behind the main content and sidebar areas

#### Scenario: Background tile does not affect readability
- **WHEN** the user reads body text or post content
- **THEN** the background texture opacity SHALL be at most 5% and SHALL NOT reduce text-to-background contrast below WCAG AA thresholds

#### Scenario: Background tile preserves pixel crispness
- **WHEN** the background tile renders on any screen density
- **THEN** the tile SHALL render with `image-rendering: pixelated` so individual pixels remain sharp

### Requirement: FR-020 Sidebar section heading icons

Each sidebar section heading SHALL display an inline pixel art icon to the left of the heading text.
The icons SHALL be static PNG images sized at 16x16 or 24x24 pixels, rendered with `image-rendering: pixelated`.
Each of the 8 sidebar sections SHALL have a unique icon: About, Recent Posts, Categories, Tags, Currently Reading, Archive, Blogs I Follow, Search.
Icons MUST use the brand palette (amber/teal) and a consistent visual style (same outline, shading, and detail level).
Icons MUST be purely decorative: they SHALL have `aria-hidden="true"` and an empty `alt=""` attribute.
Icons MUST NOT replace the heading text or serve as the sole indicator of the section's purpose.
Icon images SHALL be served from `public/images/decorations/`.

#### Scenario: Each sidebar heading has a unique icon
- **WHEN** the user views the sidebar
- **THEN** each of the 8 section headings SHALL display a distinct pixel art icon to the left of the heading text

#### Scenario: Icons are decorative only
- **WHEN** a screen reader encounters a sidebar heading icon
- **THEN** the icon image SHALL be skipped (`aria-hidden="true"`, `alt=""`) and the heading text alone SHALL convey the section's purpose

#### Scenario: Icons render at pixel-crisp quality
- **WHEN** sidebar icons render on any screen density
- **THEN** each icon SHALL render with `image-rendering: pixelated` and display at its native pixel dimensions (no blurring or anti-aliasing)

#### Scenario: Icons use consistent style
- **WHEN** the user views all 8 sidebar section icons together
- **THEN** all icons SHALL share the same outline style, shading level, and color palette

### Requirement: FR-021 Footer decorative scene props

The footer area SHALL include 2 to 4 small pixel art props flanking the existing terminal prompt.
Each prop SHALL be a static PNG image sized at 32x48 pixels or smaller.
Props MUST be purely decorative: `aria-hidden="true"`, empty `alt=""`, and no interactive behavior.
Props SHALL use the brand palette and a style consistent with the existing 404 page sprites (outlined, low-to-medium detail, amber/teal palette).
Props MUST be positioned so they do not overlap or obscure the terminal prompt text or footer links.
Props SHALL be rendered with `image-rendering: pixelated`.
Prop images SHALL be served from `public/images/decorations/`.

#### Scenario: Footer props are visible
- **WHEN** the user scrolls to the footer
- **THEN** 2 to 4 small pixel art props SHALL be visible flanking the terminal prompt

#### Scenario: Footer props do not obscure content
- **WHEN** the user views or interacts with the footer
- **THEN** all footer links and the terminal prompt text SHALL remain fully visible, focusable, and clickable

#### Scenario: Footer props are decorative only
- **WHEN** a screen reader encounters footer pixel art props
- **THEN** the props SHALL be skipped (`aria-hidden="true"`, `alt=""`) and no content or navigation SHALL depend on their visibility

### Requirement: FR-022 Pixel art asset generation standards

All pixel art assets generated for this change SHALL be created using the PixelLab MCP tools.
All assets MUST use the brand palette: amber/gold (`#d4940a`) and teal (`#0a7e7a`) as primary colors.
All assets intended for the same visual context (e.g., all 8 sidebar icons) MUST use identical PixelLab generation parameters (outline style, shading level, detail level, view angle) to ensure visual consistency.
All assets SHALL be saved as PNG files in `public/images/decorations/`.
File naming SHALL follow kebab-case: e.g., `bg-tile.png`, `icon-about.png`, `footer-lantern.png`.

#### Scenario: Assets use brand palette
- **WHEN** any generated pixel art asset is examined
- **THEN** its dominant colors SHALL be amber/gold and teal from the brand palette

#### Scenario: Assets within a group are visually consistent
- **WHEN** all 8 sidebar icons are viewed together
- **THEN** they SHALL share identical outline style, shading level, and detail level

#### Scenario: Assets follow naming convention
- **WHEN** the `public/images/decorations/` directory is listed
- **THEN** all file names SHALL be kebab-case with descriptive prefixes (`bg-`, `icon-`, `footer-`)

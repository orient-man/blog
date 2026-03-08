## ADDED Requirements

### Requirement: FR-009 Site title pixel font styling

The site title in the header SHALL render in Pixelify Sans at weight 700.
The title MUST remain a clickable link to the homepage.

#### Scenario: Title renders in pixel font
- **WHEN** the user views any page
- **THEN** the site title in the header SHALL render in Pixelify Sans 700

### Requirement: FR-010 Beveled nav buttons

The navigation links in the header SHALL be styled as beveled retro panel buttons, evoking the verb bar from point-and-click adventure games.
Each nav button SHALL have:
- A 2px solid border with an inner highlight/shadow and outer drop shadow.
- Text in Pixelify Sans.
- A hover state that reverses or adjusts the bevel to simulate a button press.

#### Scenario: Nav buttons display bevel effect
- **WHEN** the user views the header navigation
- **THEN** each nav link SHALL appear as a beveled button with visible inner highlight, inner shadow, and outer drop shadow

#### Scenario: Nav button hover press effect
- **WHEN** the user hovers over a nav button
- **THEN** the button SHALL visually indicate a pressed state (bevel direction reversal or shadow adjustment)

### Requirement: FR-011 Beveled sidebar headings

Sidebar section headings (e.g., "Tags", "About", "Currently Reading") SHALL render in Pixelify Sans with a beveled bottom border.
The bevel style SHALL be consistent with the nav button bevel pattern.

#### Scenario: Sidebar headings use pixel font and bevel
- **WHEN** the user views the sidebar
- **THEN** section headings SHALL render in Pixelify Sans with a visible beveled border accent

### Requirement: FR-012 Inventory-style tag pills

Tag pills in the tag cloud and on post pages SHALL be styled as inventory items with:
- Pixelify Sans font.
- Beveled border (consistent with the global bevel pattern).
- Compact sizing appropriate for inline display.

#### Scenario: Tag pills render as inventory items
- **WHEN** the user views the tag cloud or tags on a post
- **THEN** each tag SHALL display in Pixelify Sans with a beveled border

#### Scenario: Tag pill hover feedback
- **WHEN** the user hovers over a tag pill
- **THEN** the tag SHALL provide visual feedback (e.g., highlight, bevel press, or accent color shift)

### Requirement: FR-013 Pixel font date labels

Date labels on post cards and post pages SHALL render in Pixelify Sans at weight 400.
The date font size SHALL remain proportional to the surrounding content to avoid readability issues.

#### Scenario: Date labels use pixel font
- **WHEN** the user views a post card or post header
- **THEN** the date SHALL render in Pixelify Sans 400

### Requirement: FR-014 Terminal-style footer

The site footer SHALL include a decorative terminal prompt line rendered in VT323.
The prompt SHALL follow the pattern `visitor@just-a-programmer.pl:~$` or similar.
The footer MUST remain accessible (the terminal prompt is decorative; core footer links MUST NOT be hidden or obscured).

#### Scenario: Footer shows terminal prompt
- **WHEN** the user views the footer
- **THEN** a terminal-style prompt line SHALL be visible, rendered in VT323

#### Scenario: Footer links remain accessible
- **WHEN** the user navigates the footer
- **THEN** all existing footer links SHALL remain visible, focusable, and clickable

### Requirement: FR-015 Beveled post cards

Post cards on the homepage and listing pages SHALL have a beveled panel border.
The bevel pattern SHALL match the global bevel style (2px border, inner highlight/shadow, outer drop shadow).

#### Scenario: Post cards display bevel
- **WHEN** the user views the post listing
- **THEN** each post card SHALL have a visible beveled panel border with highlight and shadow

### Requirement: FR-016 CRT-style code block title bars

Code block title bars (filename/language indicators) SHALL be styled with:
- VT323 font for the title text and copy button label.
- A subtle CRT-inspired background (darker shade of `--code-bg`).
- JetBrains Mono MUST remain the font for code content inside the block.

#### Scenario: Code title bar uses terminal font
- **WHEN** the user views a code block that has a title/filename bar
- **THEN** the title text SHALL render in VT323 and the code content below SHALL render in JetBrains Mono

### Requirement: FR-017 CRT scanline overlay on code blocks

Code blocks SHALL have a very subtle CRT scanline overlay using CSS `repeating-linear-gradient`.
The overlay MUST be applied via a `::after` pseudo-element with `pointer-events: none` so it does not interfere with text selection or copying.
The opacity MUST be low enough (approximately 0.03-0.05) that code readability is not impacted.

#### Scenario: Scanlines visible but non-intrusive
- **WHEN** the user views a code block
- **THEN** a faint horizontal scanline pattern SHALL be visible, and the code text SHALL remain fully readable

#### Scenario: Scanlines do not block interaction
- **WHEN** the user selects, copies, or clicks within a code block
- **THEN** the scanline overlay SHALL not interfere with any interaction

### Requirement: FR-018 Pixel-style section dividers

Horizontal rules (`<hr>`) and section dividers SHALL be replaced with a CSS-only pixel pattern (e.g., diamond or cross repeating pattern).
The divider SHALL use the accent color and be centered.

#### Scenario: Section dividers render pixel pattern
- **WHEN** an `<hr>` element renders in post content or between sections
- **THEN** it SHALL display a pixel-art-style repeating pattern instead of a plain line

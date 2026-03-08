## MODIFIED Requirements

### Requirement: FR-011 Beveled sidebar headings

Sidebar section headings (e.g., "Tags", "About", "Currently Reading") SHALL render in Pixelify Sans with a beveled bottom border.
The bevel style SHALL be consistent with the nav button bevel pattern.
Each sidebar section heading SHALL display a pixel art icon (16-24px) inline to the left of the heading text.
The icon SHALL be rendered with `image-rendering: pixelated` and MUST be purely decorative (`aria-hidden="true"`, `alt=""`).
The icon and heading text SHALL be vertically center-aligned.
Icon specifications are defined in FR-020 (`pixel-art-decorations` capability).

#### Scenario: Sidebar headings use pixel font and bevel
- **WHEN** the user views the sidebar
- **THEN** section headings SHALL render in Pixelify Sans with a visible beveled border accent

#### Scenario: Sidebar headings display pixel art icons
- **WHEN** the user views the sidebar
- **THEN** each section heading SHALL display a pixel art icon to the left of the heading text, vertically center-aligned

### Requirement: FR-014 Terminal-style footer

The site footer SHALL include a decorative terminal prompt line rendered in VT323.
The prompt SHALL follow the pattern `visitor@blog.orientman.com:~$` or similar.
The footer MUST remain accessible (the terminal prompt is decorative; core footer links MUST NOT be hidden or obscured).
The footer area SHALL include 2 to 4 small pixel art props flanking the terminal prompt to create a decorative scene.
Props MUST be positioned so they do not overlap or obscure the terminal prompt text or footer links.
Prop specifications are defined in FR-021 (`pixel-art-decorations` capability).

#### Scenario: Footer shows terminal prompt
- **WHEN** the user views the footer
- **THEN** a terminal-style prompt line SHALL be visible, rendered in VT323

#### Scenario: Footer links remain accessible
- **WHEN** the user navigates the footer
- **THEN** all existing footer links SHALL remain visible, focusable, and clickable

#### Scenario: Footer displays pixel art scene props
- **WHEN** the user views the footer
- **THEN** 2 to 4 pixel art props SHALL be visible flanking the terminal prompt, without obscuring any text or links

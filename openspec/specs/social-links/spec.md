## ADDED Requirements

### Requirement: FR-001 Social icon row in sidebar
The sidebar About section SHALL display a horizontal row of social media icon links below the bio text and above the "Recent Posts" section.

#### Scenario: Icons visible on desktop
- **WHEN** a visitor views any page on a viewport wide enough to show the sidebar (lg+)
- **THEN** the social icon row is visible below the author bio
- **AND** it contains exactly 5 icons in order: X, Facebook, LinkedIn, GitHub, RSS

#### Scenario: Icons visible on mobile
- **WHEN** a visitor views any page on a mobile viewport
- **THEN** the social icon row is visible within the sidebar section (which appears below main content)

### Requirement: FR-002 Icons rendered as inline SVGs
Each social link MUST be rendered as an inline SVG element, consistent with the existing icon pattern used by `DarkModeToggle` and `StarRating`.
No external icon library MUST be added as a dependency.

#### Scenario: No new dependencies
- **WHEN** the change is complete
- **THEN** `package.json` contains no new icon library dependencies (e.g., no `lucide-react`, `react-icons`, `@heroicons/*`)

### Requirement: FR-003 Accessible social links
Each social link MUST have an accessible label.
The SVG icons MUST have `aria-hidden="true"` and the anchor element MUST contain a visually hidden text label or `aria-label` attribute.

#### Scenario: Screen reader announces link purpose
- **WHEN** a screen reader encounters a social link icon
- **THEN** it announces the platform name (e.g., "GitHub", "LinkedIn", "RSS Feed")

### Requirement: FR-004 External links open in new tab
All social links pointing to external URLs MUST open in a new browser tab with `target="_blank"` and `rel="noopener noreferrer"`.
The RSS link (`/feed.xml`) is site-relative and MAY open in the same tab.

#### Scenario: GitHub link opens in new tab
- **WHEN** a visitor clicks the GitHub icon
- **THEN** the browser opens `https://github.com/orient-man` in a new tab

#### Scenario: RSS link behavior
- **WHEN** a visitor clicks the RSS icon
- **THEN** the browser navigates to `/feed.xml`

### Requirement: FR-005 Hover interaction
Social icons MUST use the existing color scheme: gray by default (`text-gray-500`), brand color on hover (`hover:text-brand-600`, `dark:hover:text-brand-400`), with a CSS transition.

#### Scenario: Hover state on light mode
- **WHEN** a visitor hovers over a social icon in light mode
- **THEN** the icon color transitions from gray to brand green

#### Scenario: Hover state on dark mode
- **WHEN** a visitor hovers over a social icon in dark mode
- **THEN** the icon color transitions from gray to brand green (light variant)

### Requirement: FR-006 Social links sourced from config
The sidebar component MUST NOT hardcode social link URLs.
It MUST read them from the centralized site config module (`siteConfig.socialLinks`).

#### Scenario: Adding a new social link
- **WHEN** a developer adds a new entry to `siteConfig.socialLinks`
- **THEN** the sidebar renders the new icon without modifying `Sidebar.tsx` (assuming the SVG icon for that platform already exists)

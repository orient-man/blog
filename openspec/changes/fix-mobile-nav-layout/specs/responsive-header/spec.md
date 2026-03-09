## ADDED Requirements

### Requirement: FR-001 Mobile vertical stacking
On viewports below the `sm` breakpoint (640px), the header MUST render the site title block and navigation as stacked vertical sections — title on top, navigation below.

#### Scenario: Phone in portrait mode
- **WHEN** the viewport width is less than 640px
- **THEN** the navigation links and dark mode toggle MUST appear below the site title and tagline, not beside them

#### Scenario: Viewport resized from wide to narrow
- **WHEN** the user resizes the browser window from above 640px to below 640px
- **THEN** the navigation MUST reflow from side-by-side to below the title without a page reload

### Requirement: FR-002 Desktop side-by-side layout
On viewports at or above the `sm` breakpoint (640px), the header MUST render the site title and navigation side-by-side — title on the left, navigation on the right.

#### Scenario: Tablet or desktop viewport
- **WHEN** the viewport width is 640px or greater
- **THEN** the site title MUST appear on the left and navigation links MUST appear on the right in a single horizontal row

### Requirement: FR-003 Single nav element
The header MUST contain exactly one `<nav>` element for site navigation.
Duplicated navigation markup MUST NOT exist.

#### Scenario: DOM inspection
- **WHEN** the page is rendered at any viewport width
- **THEN** the header MUST contain exactly one `<nav>` element with all navigation links (Home, CV, Search) and the dark mode toggle

### Requirement: FR-004 Navigation item completeness
All existing navigation items (Home, CV, Search, DarkModeToggle) MUST remain accessible at every viewport width.
No navigation item SHALL be hidden or removed on any breakpoint.

#### Scenario: Mobile navigation completeness
- **WHEN** the viewport width is less than 640px
- **THEN** Home, CV, Search links and the dark mode toggle MUST all be visible and interactive

#### Scenario: Desktop navigation completeness
- **WHEN** the viewport width is 640px or greater
- **THEN** Home, CV, Search links and the dark mode toggle MUST all be visible and interactive

### Requirement: FR-005 Mobile nav right-alignment
On viewports below the `sm` breakpoint (640px), the navigation row MUST be right-aligned within the header container.

#### Scenario: Nav alignment on narrow screen
- **WHEN** the viewport width is less than 640px
- **THEN** the navigation links MUST be aligned to the right edge of the header container

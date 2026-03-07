## ADDED Requirements

### Requirement: FR-001 Search link in desktop header navigation
The site header navigation MUST include a "Search" link that navigates to the `/search/` page.
The link MUST appear in the desktop navigation bar (visible at `sm` breakpoint and above).
The link MUST use the same visual styling (text color, hover state, transition) as existing header nav links (Home, CV).

#### Scenario: SC-001 User clicks Search in desktop header
- **WHEN** a user views any page on a viewport at or above the `sm` breakpoint
- **THEN** a "Search" link is visible in the header navigation bar

#### Scenario: SC-002 Search link navigates to search page
- **WHEN** a user clicks the "Search" link in the header navigation
- **THEN** the browser navigates to `/search/`

### Requirement: FR-002 Search link accessible on mobile viewports
The site header MUST provide access to the Search link on viewports below the `sm` breakpoint.
The link MUST be visible without requiring the user to scroll to the footer or find the sidebar.

#### Scenario: SC-003 Mobile user can reach Search from header
- **WHEN** a user views any page on a viewport below the `sm` breakpoint
- **THEN** a "Search" link or icon is visible in the header area

### Requirement: FR-003 Search link placement
The Search link MUST be placed between the "CV" link and the `<DarkModeToggle />` component in the desktop navigation.
This placement keeps utility actions (search, theme toggle) grouped to the right of content links (Home, CV).

#### Scenario: SC-004 Correct ordering in desktop nav
- **WHEN** a user views the desktop header navigation
- **THEN** the links appear in this order: Home, CV, Search, DarkModeToggle

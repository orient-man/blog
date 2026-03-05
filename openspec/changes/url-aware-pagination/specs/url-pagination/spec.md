## ADDED Requirements

### Requirement: FR-001 Read page from URL

The system SHALL read the current page number from the `?page=N` URL search parameter on initial render.
The page number in the URL MUST be 1-based (i.e., `?page=1` is the first page).

#### Scenario: Page loads with valid page parameter
- **WHEN** user navigates to a listing page with `?page=2` in the URL
- **THEN** the system displays the second page of results

#### Scenario: Page loads without page parameter
- **WHEN** user navigates to a listing page with no `?page` parameter
- **THEN** the system displays the first page of results

### Requirement: FR-002 Update URL on page change

The system SHALL update the URL search parameter when the user navigates between pages.
The URL update MUST use `history.replaceState` so that each page change does not create a new browser history entry.
The system MUST NOT trigger a full page navigation when updating the URL.

#### Scenario: User clicks pagination button
- **WHEN** user clicks the "Older" or "Newer" pagination button
- **THEN** the URL updates to reflect the new page number without a full page reload

#### Scenario: First page omits parameter
- **WHEN** user navigates to page 1
- **THEN** the `?page` parameter is removed from the URL (clean URL for the default state)

### Requirement: FR-003 Graceful handling of invalid page values

The system SHALL treat absent, non-numeric, zero, negative, or out-of-range `?page` values as page 1.
The system MUST NOT display an error state for invalid page parameters.

#### Scenario: Non-numeric page value
- **WHEN** user navigates to a listing page with `?page=abc`
- **THEN** the system displays the first page of results

#### Scenario: Page number exceeds total pages
- **WHEN** user navigates with `?page=999` and only 4 pages exist
- **THEN** the system clamps to the last available page

#### Scenario: Zero or negative page value
- **WHEN** user navigates with `?page=0` or `?page=-1`
- **THEN** the system displays the first page of results

### Requirement: FR-004 Consistent behavior across all listing surfaces

The `?page` parameter MUST function identically on all pages that display paginated post lists:
homepage (`/`), category pages (`/category/[slug]/`), tag pages (`/tag/[slug]/`), and archive pages (`/archive/[year]/[month]/`).

#### Scenario: Category page with page parameter
- **WHEN** user navigates to `/category/programming/?page=2`
- **THEN** the system displays the second page of posts in that category

#### Scenario: Archive page with page parameter
- **WHEN** user navigates to `/archive/2024/01/?page=2`
- **THEN** the system displays the second page of posts for January 2024

### Requirement: FR-005 Preserve existing pagination UI

The system MUST retain the existing pagination controls: "Newer" button, "Older" button, page counter ("Page X of Y"), and post range indicator ("Showing N-M of Total posts").
Scroll-to-top behavior on page change MUST be preserved.

#### Scenario: Pagination UI renders correctly
- **WHEN** a listing page has more than one page of results
- **THEN** the Newer/Older buttons, page counter, and range indicator are displayed

#### Scenario: Scroll resets on page change
- **WHEN** user clicks a pagination button
- **THEN** the page scrolls to the top of the viewport

### Requirement: FR-006 Page state survives refresh and back-navigation

The page parameter in the URL MUST persist across browser refresh.
When the user navigates to a post and returns via browser back button, the listing page MUST restore the previously viewed page.

#### Scenario: Browser refresh preserves page
- **WHEN** user is viewing `?page=3` and refreshes the browser
- **THEN** the system displays page 3 of results

#### Scenario: Back navigation restores page
- **WHEN** user views page 3, clicks a post link, then presses the browser back button
- **THEN** the listing page displays page 3 of results

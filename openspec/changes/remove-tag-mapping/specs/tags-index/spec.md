## MODIFIED Requirements

### Requirement: Display all tags with counts

The page SHALL display every tag that has at least one associated post.
Each tag SHALL show its slug as its display name and its post count.
Tags SHALL be sorted alphabetically by display name (which is now the slug).
Each tag SHALL be rendered at a font size proportional to its post count, using the same logarithmic sizing algorithm as the sidebar tag cloud.

#### Scenario: All tags are visible with weighted sizing

- **WHEN** the tags index page is loaded
- **THEN** every tag from `getAllTags()` is displayed on the page
- **THEN** each tag shows its slug as the display name (e.g., `fsharp`, `csharp`, `dotnet`)
- **THEN** each tag shows its post count (e.g., "(3)")
- **THEN** each tag's font size varies proportionally to its post count

#### Scenario: Alphabetical ordering

- **WHEN** the tags index page is loaded
- **THEN** tags are ordered alphabetically by slug (case-insensitive)

### Requirement: Tags link to individual tag pages

Each tag on the index page SHALL link to its corresponding `/tag/:slug/` page.

#### Scenario: Clicking a tag navigates to tag page

- **WHEN** a visitor clicks on the tag displayed as `fsharp`
- **THEN** the browser navigates to `/tag/fsharp/`

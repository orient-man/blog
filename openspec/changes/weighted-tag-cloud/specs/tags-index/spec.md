## MODIFIED Requirements

### Requirement: Display all tags with counts

The page SHALL display every tag that has at least one associated post.
Each tag SHALL show its display name and post count.
Tags SHALL be sorted alphabetically by display name.
Each tag SHALL be rendered at a font size proportional to its post count, using the same logarithmic sizing algorithm as the sidebar tag cloud.

#### Scenario: All tags are visible with weighted sizing

- **WHEN** the tags index page is loaded
- **THEN** every tag from `getAllTags()` is displayed on the page
- **THEN** each tag shows its display name (not raw slug)
- **THEN** each tag shows its post count (e.g., "(3)")
- **THEN** each tag's font size varies proportionally to its post count

#### Scenario: Alphabetical ordering

- **WHEN** the tags index page is loaded
- **THEN** tags are ordered alphabetically by display name (case-insensitive)

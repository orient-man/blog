## ADDED Requirements

### Requirement: FR-001 Proportional tag font sizing

The tag cloud SHALL render each tag at a font size proportional to its usage count.
The sizing function SHALL use a logarithmic scale to map post counts to font sizes within a configured min–max range.
Tags with the lowest count SHALL render at the minimum font size.
The tag with the highest count SHALL render at the maximum font size.
When all tags have the same count, they SHALL all render at the midpoint size.

#### Scenario: High-frequency tag is visibly larger than low-frequency tag

- **WHEN** the tag cloud renders a tag with 10 posts and a tag with 1 post
- **THEN** the 10-post tag has a visibly larger font size than the 1-post tag

#### Scenario: Single-count tags render at minimum size

- **WHEN** a tag has exactly 1 post
- **THEN** it renders at the minimum configured font size (0.75rem)

#### Scenario: Maximum-count tag renders at maximum size

- **WHEN** a tag has the highest post count among all displayed tags
- **THEN** it renders at the maximum configured font size (1.5rem)

#### Scenario: Equal counts produce uniform sizing

- **WHEN** all displayed tags have the same post count
- **THEN** all tags render at the same midpoint font size

### Requirement: FR-002 Logarithmic scale distribution

The sizing algorithm SHALL use a logarithmic function (not linear) to distribute font sizes.
This prevents a single high-count tag from compressing all other tags to minimum size.

#### Scenario: Mid-range tags are distinguishable

- **WHEN** tags have counts of 1, 3, 5, and 20
- **THEN** the tags with counts 3 and 5 are noticeably larger than count-1 tags, not compressed to near-minimum

### Requirement: FR-003 Hyphenated tag display names

Tags whose slug contains hyphens SHALL display with hyphens preserved in their display name.
The display name for a tag like `dependency-injection` SHALL be `dependency-injection`, not `dependencyinjection` or `dependency injection`.
Tags with explicit entries in `TAG_SLUG_MAP` SHALL continue to use their mapped display name (e.g., slug `fsharp` displays as `F#`).

#### Scenario: Hyphenated slug displays with hyphen

- **WHEN** a tag has the slug `dependency-injection`
- **THEN** its display name is `dependency-injection` across all rendering surfaces (tag cloud, tags index, post cards, post headers)

#### Scenario: TAG_SLUG_MAP entries are unaffected

- **WHEN** a tag has the slug `fsharp` with a `TAG_SLUG_MAP` entry mapping to display name `F#`
- **THEN** the display name remains `F#`

#### Scenario: Simple single-word slugs are unaffected

- **WHEN** a tag has the slug `refactoring`
- **THEN** its display name is `refactoring`

### Requirement: FR-004 Sidebar tag cloud weighted sizing

The sidebar `TagCloud` component SHALL use the proportional sizing algorithm for all displayed tags.
Existing pill styling (colors, rounded shape, hover states) SHALL be preserved.
The tag count title attribute SHALL remain functional.

#### Scenario: Sidebar tag cloud renders with variable sizes

- **WHEN** the sidebar tag cloud is visible
- **THEN** tags appear at varying font sizes corresponding to their post counts
- **THEN** pill shape, colors, and hover effects are unchanged

### Requirement: FR-005 Tags index page weighted sizing

The `/tags/` index page SHALL render all tags using the same proportional sizing algorithm as the sidebar tag cloud.
Each tag SHALL still display its post count in parentheses.
Tags SHALL remain sorted alphabetically by display name.

#### Scenario: Tags index page shows weighted tags

- **WHEN** a visitor loads `/tags/`
- **THEN** tags appear at varying font sizes based on post count
- **THEN** each tag shows its count (e.g., "(5)")
- **THEN** tags are ordered alphabetically by display name

### Requirement: FR-006 No URL or routing changes

Tag slugs, URL paths (`/tag/{slug}/`), and routing logic SHALL NOT change.
The sizing and display-name changes are purely visual.

#### Scenario: Tag links remain functional

- **WHEN** a visitor clicks a tag in the weighted tag cloud
- **THEN** navigation goes to `/tag/{slug}/` using the same slug as before

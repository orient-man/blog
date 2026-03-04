## Requirements

### Requirement: Tags index page route

The system SHALL serve a page at the `/tags/` URL path.
The page SHALL be statically generated at build time using `generateStaticParams` / static export.
The page SHALL have a `<title>` containing "Tags".

#### Scenario: Visitor navigates to /tags/

- **WHEN** a visitor requests `/tags/`
- **THEN** the system returns a 200 response with an HTML page listing all tags

#### Scenario: Page is included in static build

- **WHEN** the site is built with `next build` (static export)
- **THEN** an `out/tags/index.html` file is generated

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

### Requirement: Tags link to individual tag pages

Each tag on the index page SHALL link to its corresponding `/tag/:slug/` page.

#### Scenario: Clicking a tag navigates to tag page

- **WHEN** a visitor clicks on a tag named "F#"
- **THEN** the browser navigates to `/tag/fsharp/`

### Requirement: Sidebar tag cloud links to tags index

The existing sidebar tag cloud "Showing top N of M tags" text SHALL link to the `/tags/` page, allowing readers to discover the full list.

#### Scenario: Sidebar links to tags index

- **WHEN** the sidebar tag cloud displays the "Showing top N of M tags" message
- **THEN** that message is a hyperlink to `/tags/`

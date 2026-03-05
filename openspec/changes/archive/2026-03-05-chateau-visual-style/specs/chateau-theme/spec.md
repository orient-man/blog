## ADDED Requirements

### Requirement: FR-001 Brand accent color system
The site MUST use Chateau green (`#88c34b`) as the primary accent color in place of blue.
A custom `brand` color scale MUST be defined in the Tailwind configuration with shades from 50 through 950.
All existing blue accent color references (`blue-50` through `blue-950`) across components and CSS variables MUST be replaced with the corresponding brand green equivalents.

#### Scenario: Light mode accent color
- **WHEN** a user views the site in light mode
- **THEN** all accent-colored elements (links, tags, borders, highlights) MUST render in shades of the brand green color scale

#### Scenario: Dark mode accent color adaptation
- **WHEN** a user views the site in dark mode
- **THEN** accent-colored elements MUST use lighter green variants (e.g., lime-400/lime-300 equivalents) that meet WCAG AA contrast ratio against dark backgrounds

#### Scenario: CSS variable consistency
- **WHEN** the site stylesheet loads
- **THEN** all CSS custom properties previously defined with blue hex values in `globals.css` MUST resolve to brand green equivalents

### Requirement: FR-002 Top page border
The site MUST display a solid green horizontal border at the very top of every page.
The border MUST be 3-4px in height and span the full viewport width.
The border color MUST use the primary brand green (`#88c34b`).

#### Scenario: Top border visibility
- **WHEN** a user loads any page on the site
- **THEN** a 3-4px solid green border MUST appear at the top edge of the viewport, spanning the full width

### Requirement: FR-003 Serif typography for headings
The site title MUST render in an italic serif font (Georgia or Lora).
Post titles (h2 in cards, h1 on post pages) MUST render in a non-italic serif font.
Body text MUST remain in the existing sans-serif font (Inter/system sans-serif).

#### Scenario: Site title typography
- **WHEN** a user views any page
- **THEN** the site title "Just A Programmer" MUST render in an italic serif typeface

#### Scenario: Post title typography
- **WHEN** a user views a post card on the homepage or a post detail page
- **THEN** the post title MUST render in a non-italic serif typeface

#### Scenario: Body text unchanged
- **WHEN** a user reads post content or any body text
- **THEN** the text MUST render in the existing sans-serif font stack

### Requirement: FR-004 Subtitle tilde prefix
The site subtitle MUST be displayed as "~ Don Quixote fighting entropy" with a tilde-space prefix.

#### Scenario: Subtitle rendering
- **WHEN** a user views the site header or sidebar subtitle
- **THEN** the subtitle text MUST begin with "~ " followed by "Don Quixote fighting entropy"

### Requirement: FR-005 Editorial date block on post cards
Each post card MUST display the publication date as a styled block element positioned to the left of the card content.
The date block MUST show the day number in a large font, with the abbreviated weekday and month/year in smaller text below or beside it.

#### Scenario: Date block layout
- **WHEN** a user views a post card on the homepage
- **THEN** the date MUST appear as a visually distinct block floated or positioned to the left of the card title and excerpt

#### Scenario: Date block content
- **WHEN** a post was published on a given date
- **THEN** the date block MUST display the numeric day (e.g., "15"), the abbreviated weekday (e.g., "Mon"), and the month/year (e.g., "Jan 2024")

### Requirement: FR-006 Extended post card excerpts
Post card excerpts on the homepage MUST display 6-8 lines of text instead of the current 3-line limit.
This provides a more editorial reading experience consistent with the original Chateau theme's longer previews.

#### Scenario: Excerpt length
- **WHEN** a user views the homepage post listing
- **THEN** each post card excerpt MUST show approximately 6-8 lines of text (replacing the current `line-clamp-3` with `line-clamp-6` or equivalent)

### Requirement: FR-007 Header navigation CV link
The top header navigation MUST include a link to the CV page.
The link MUST be styled consistently with other navigation elements.

#### Scenario: CV link presence
- **WHEN** a user views any page on the site
- **THEN** the top header navigation MUST contain a visible "CV" link

#### Scenario: CV link destination
- **WHEN** a user clicks the CV navigation link
- **THEN** they MUST be navigated to the CV page URL

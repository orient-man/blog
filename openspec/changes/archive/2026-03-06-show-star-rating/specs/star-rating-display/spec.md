## ADDED Requirements

### Requirement: FR-001 Star rating component renders correct star states

The system SHALL provide a `StarRating` component that accepts a numeric rating value and renders a row of five star icons.
Each star MUST be one of three states: filled (value covered), half-filled (value partially covered), or empty (value not covered).
The component MUST support ratings from 0.5 to 5.0 in 0.5 increments.

#### Scenario: Full integer rating

- **WHEN** the component receives `rating={4}`
- **THEN** it renders 4 filled stars and 1 empty star

#### Scenario: Half-star rating

- **WHEN** the component receives `rating={3.5}`
- **THEN** it renders 3 filled stars, 1 half-filled star, and 1 empty star

#### Scenario: Maximum rating

- **WHEN** the component receives `rating={5}`
- **THEN** it renders 5 filled stars and 0 empty stars

#### Scenario: Minimum rating

- **WHEN** the component receives `rating={0.5}`
- **THEN** it renders 0 filled stars, 1 half-filled star, and 4 empty stars

### Requirement: FR-002 Star rating is accessible

The component MUST include an accessible label conveying the numeric rating value (e.g., "Rating: 3.5 out of 5").
Star icons MUST be hidden from assistive technology via `aria-hidden="true"`.
The accessible label MUST be visually hidden but readable by screen readers.

#### Scenario: Screen reader announces rating

- **WHEN** a screen reader encounters the star rating component with `rating={4}`
- **THEN** it announces "Rating: 4 out of 5"

### Requirement: FR-003 Star rating displayed on book review post page

The single post page SHALL display the star rating in the post header area for posts that have a `rating` value.
The rating MUST appear near the source links section (below the metadata line).
Posts without a `rating` value MUST NOT render any rating element.

#### Scenario: Book review post shows stars

- **WHEN** a user visits a post page for a book review with `rating: 4`
- **THEN** the post header displays a visual star rating showing 4 out of 5 stars

#### Scenario: Non-review post has no rating

- **WHEN** a user visits a regular post without a `rating` field
- **THEN** no star rating element is rendered

### Requirement: FR-004 Star rating displayed on PostCard for book reviews

The `PostCard` component SHALL display a compact star rating for posts that have a `rating` value.
The rating MUST appear in the metadata area of the card.
Posts without a `rating` value MUST NOT render any rating element on the card.

#### Scenario: PostCard shows stars for book review

- **WHEN** a post list renders a PostCard for a book review with `rating: 3.5`
- **THEN** the card displays a star rating showing 3.5 out of 5 stars

#### Scenario: PostCard hides rating for regular post

- **WHEN** a post list renders a PostCard for a post without a `rating` field
- **THEN** no star rating element appears on the card

### Requirement: FR-005 No external dependencies for star rendering

The star rating MUST be rendered using inline SVG or CSS only.
The implementation MUST NOT introduce any new npm dependencies.

#### Scenario: Build with no new packages

- **WHEN** the star rating feature is implemented
- **THEN** `package.json` contains no new dependencies compared to before the change

### Requirement: FR-006 Star rating supports dark mode

The star rating MUST be visually correct in both light and dark color schemes.
Star fill color MUST use the brand color palette or an amber/gold tone appropriate for ratings.
Empty stars MUST use a muted color that is visible in both modes.

#### Scenario: Stars visible in dark mode

- **WHEN** a user views a book review in dark mode
- **THEN** filled stars use a warm/gold color and empty stars use a visible muted color against the dark background

#### Scenario: Stars visible in light mode

- **WHEN** a user views a book review in light mode
- **THEN** filled stars use a warm/gold color and empty stars use a visible muted color against the light background

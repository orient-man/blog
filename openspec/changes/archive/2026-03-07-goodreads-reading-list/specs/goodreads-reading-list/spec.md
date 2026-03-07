## ADDED Requirements

### Requirement: FR-001 Build-time data fetch

The system SHALL fetch the Goodreads "currently-reading" shelf via the public RSS feed (`https://www.goodreads.com/review/list_rss/13930842?shelf=currently-reading`) during the prebuild step.
The fetch script SHALL write a JSON file to `content/data/currently-reading.json` containing book data.

#### Scenario: Successful RSS fetch

- **WHEN** the prebuild script runs and the Goodreads RSS feed is reachable
- **THEN** the script SHALL parse the RSS XML and write `content/data/currently-reading.json` with an array of books, a shelf URL, and a fetch timestamp

#### Scenario: RSS fetch failure with existing cache

- **WHEN** the prebuild script runs and the Goodreads RSS feed is unreachable or returns an error
- **AND** a `content/data/currently-reading.json` file already exists
- **THEN** the script SHALL log a warning, leave the existing JSON file untouched, and exit with code 0 (non-failing)

#### Scenario: RSS fetch failure with no cache

- **WHEN** the prebuild script runs and the Goodreads RSS feed is unreachable
- **AND** no `content/data/currently-reading.json` file exists
- **THEN** the script SHALL write an empty books array to `content/data/currently-reading.json` and exit with code 0

### Requirement: FR-002 Book data structure

Each book entry in the JSON file SHALL contain the following fields:
- `title` (string): the book title from the RSS `<title>` element
- `author` (string): the author name from `<author_name>`
- `coverUrl` (string | null): the medium cover image URL from `<book_medium_image_url>`, or null if the image is a Goodreads placeholder
- `url` (string): the Goodreads review/book URL from `<link>`, with UTM parameters stripped

The JSON root SHALL also contain:
- `shelfUrl` (string): link to the full currently-reading shelf page
- `fetchedAt` (string): ISO 8601 timestamp of when the data was fetched

#### Scenario: Book with real cover image

- **WHEN** the RSS item has a `<book_medium_image_url>` that does not contain `nophoto`
- **THEN** `coverUrl` SHALL be set to that URL

#### Scenario: Book with placeholder cover image

- **WHEN** the RSS item has a `<book_medium_image_url>` that contains `nophoto`
- **THEN** `coverUrl` SHALL be set to `null`

### Requirement: FR-003 Sidebar widget display

The sidebar SHALL display a "Currently Reading" section after the Tags section and before the Archive section.
The section SHALL show up to a configurable maximum number of books (default: 5).

#### Scenario: Books available

- **WHEN** the `currently-reading.json` contains one or more books
- **THEN** the sidebar SHALL render a "Currently Reading" section with each book showing its cover image (or styled placeholder), title (linked to Goodreads), and author name

#### Scenario: No books available

- **WHEN** the `currently-reading.json` contains an empty books array
- **THEN** the sidebar SHALL NOT render the "Currently Reading" section

#### Scenario: More books than display limit

- **WHEN** the `currently-reading.json` contains more books than the configured maximum
- **THEN** the sidebar SHALL display only the first N books (most recently added first)

### Requirement: FR-004 Book cover display

Each book entry SHALL display a cover image when available.
When no cover image is available, the component SHALL render a styled placeholder.

#### Scenario: Book has a cover image

- **WHEN** the book's `coverUrl` is not null
- **THEN** the component SHALL render an `<img>` element with the cover URL, the book title as alt text, and consistent dimensions

#### Scenario: Book has no cover image

- **WHEN** the book's `coverUrl` is null
- **THEN** the component SHALL render a styled placeholder displaying the first letter of the author's first name and the first letter of the author's last name, using the blog's brand colour scheme

### Requirement: FR-005 Shelf link

The "Currently Reading" section SHALL include a footer link to the full Goodreads shelf.

#### Scenario: Footer link rendered

- **WHEN** the "Currently Reading" section is visible
- **THEN** a "View on Goodreads" link SHALL appear below the book list, linking to the `shelfUrl` and opening in a new tab

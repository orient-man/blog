# Feature Specification: Fix Comments Showing "undefined NaN"

**Feature Branch**: `006-fix-comments-undefined-nan`
**Created**: 2026-03-01
**Status**: Draft
**Input**: User description: "bug - comments shows undefined NaN"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Comment Dates Display Correctly (Priority: P1)

A reader visits a blog post that has historical WordPress comments.
Each comment displays the author name, a human-readable date (e.g., "September 25, 2013"), and the comment text.
Currently, the date field shows "undefined NaN, NaN" instead of the actual date.
After this fix, the reader sees the correctly formatted date for every comment on every post.

**Why this priority**: This is the core bug. Comment dates are completely unreadable, making the comment section appear broken and unprofessional. Every post with comments is affected.

**Independent Test**: Can be fully tested by visiting any post that has comments (9 posts have comments) and verifying that each comment shows a properly formatted date like "September 25, 2013" rather than "undefined NaN, NaN".

**Acceptance Scenarios**:

1. **Given** a post with comments where comment dates are stored as bare date values (e.g., `2013-09-25`) in frontmatter, **When** a reader views the post, **Then** each comment displays the date in "Month Day, Year" format (e.g., "September 25, 2013").
2. **Given** all 9 posts with historical comments, **When** the site is built and each post is visited, **Then** zero comments display "undefined", "NaN", or any other malformed date text.
3. **Given** a comment with a valid date, **When** the comment is rendered, **Then** the `<time>` element's `datetime` attribute contains a valid ISO 8601 date string (e.g., "2013-09-25").

---

### User Story 2 - Graceful Handling of Malformed Comment Dates (Priority: P2)

A blog maintainer adds or edits a comment in frontmatter and accidentally provides a malformed or missing date value.
Rather than crashing or showing "undefined NaN", the system gracefully handles the error by displaying a reasonable fallback.

**Why this priority**: Prevents regressions and ensures robustness. While existing data is well-formed, defensive handling avoids future breakage if content is edited manually or new comments are added.

**Independent Test**: Can be tested by intentionally introducing a comment with a missing or malformed date field in a test post's frontmatter and verifying the site builds successfully and shows a fallback rather than broken text.

**Acceptance Scenarios**:

1. **Given** a comment with a missing date field, **When** the comment is rendered, **Then** the system displays a fallback text (e.g., "Unknown date") rather than "undefined NaN, NaN".
2. **Given** a comment with a non-parseable date string (e.g., "not-a-date"), **When** the comment is rendered, **Then** the system displays a fallback text rather than "undefined NaN, NaN".
3. **Given** a comment with a malformed date, **When** the site is built, **Then** the build completes successfully without errors.

---

### Edge Cases

- What happens when a comment date is an empty string?
- What happens when a comment date is stored as a full ISO 8601 timestamp with time (e.g., "2013-09-25T14:30:00Z")?
- What happens when the YAML parser returns a comment date as a Date object rather than a string (the root cause of this bug)?
- What happens when a comment has no date field at all?
- What happens when a comment author field is empty? (Currently handled — shows "?" as avatar initials.)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST display comment dates in human-readable "Month Day, Year" format (e.g., "September 25, 2013") for all valid dates.
- **FR-002**: The system MUST correctly handle comment date values regardless of whether the data loading layer returns them as strings or Date objects.
- **FR-003**: The system MUST normalize comment dates during data loading so that downstream rendering receives a consistent string format.
- **FR-004**: The system MUST display a fallback label when a comment date is missing, empty, or unparseable, rather than showing "undefined NaN" or crashing.
- **FR-005**: The system MUST produce a valid ISO 8601 date string in the `<time>` element's `datetime` attribute for all comments with valid dates.
- **FR-006**: The fix MUST NOT alter the display or behavior of post-level dates, which are already handled correctly.
- **FR-007**: The fix MUST NOT change the structure or content of the MDX source files; the correction is in the data loading or rendering layer only.

### Key Entities

- **Comment**: A historical WordPress comment with attributes: author (string), date (string in "YYYY-MM-DD" format after normalization), content (string, may contain HTML). Associated with a Post via frontmatter metadata.
- **Post**: A blog post that MAY contain zero or more Comments. Post-level dates are already normalized correctly and are unaffected by this fix.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of comments across all 9 posts with comments display a correctly formatted date — zero instances of "undefined", "NaN", or blank date text visible to readers.
- **SC-002**: The site builds successfully with no errors or warnings related to comment date parsing.
- **SC-003**: A comment with a deliberately malformed or missing date in frontmatter renders a graceful fallback label rather than broken text, and the build still succeeds.
- **SC-004**: The `<time>` element's `datetime` attribute contains a valid ISO 8601 date string for every comment with a valid date.

## Assumptions

- The root cause is that the YAML parser converts bare date values (e.g., `2013-09-25`) in comment objects to Date objects, but the data loading layer only normalizes the post-level date and passes comment dates through without coercion.
- The existing Date-to-string normalization pattern already applied to post-level dates can be reused for comment dates.
- All 9 existing posts with comments have well-formed date values; the malformed-date scenario (US2) is a defensive measure against future editing errors.
- The fix should be applied at the data loading layer rather than the rendering layer, to maintain a consistent data contract.
- HTML entity rendering in comment content (e.g., `&#8230;` showing literally as encoded text) is a separate issue and is out of scope for this bug fix.

## Scope Boundaries

**In scope**:
- Fixing the "undefined NaN" display in comment dates
- Normalizing comment date values during data loading
- Adding defensive handling for missing or malformed comment dates

**Out of scope**:
- HTML entity decoding in comment content
- Adding new commenting functionality
- Changing the comment data storage format in MDX files
- Modifying the migration script

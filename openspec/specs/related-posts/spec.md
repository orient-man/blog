## ADDED Requirements

### Requirement: FR-001 Display related posts section

The system SHALL display a "Related Posts" section on each individual post page showing 2–3 posts that are topically related to the current post.
The section SHALL appear between the comments block and the chronological Older/Newer navigation.

#### Scenario: Post with multiple related posts

- **WHEN** a post has 3 or more posts sharing at least one tag
- **THEN** the section displays exactly 3 related posts

#### Scenario: Post with exactly 2 related posts

- **WHEN** a post has exactly 2 posts sharing at least one tag
- **THEN** the section displays exactly 2 related posts

### Requirement: FR-002 Score relatedness by shared tags

The system SHALL compute relatedness between two posts as the count of tags they share.
A higher shared-tag count SHALL rank a candidate post higher in the related list.

#### Scenario: Scoring with different overlap counts

- **WHEN** post A shares 3 tags with post B and 1 tag with post C
- **THEN** post B ranks higher than post C in post A's related list

### Requirement: FR-003 Tiebreak by recency

When two candidate posts have the same relatedness score, the system SHALL rank the more recently published post higher.

#### Scenario: Equal tag overlap with different dates

- **WHEN** post B and post C each share 2 tags with post A
- **AND** post B was published on 2024-06-01 and post C on 2024-03-15
- **THEN** post B appears before post C in post A's related list

### Requirement: FR-004 Prefer same-category posts

The system SHALL apply a secondary scoring bonus to candidate posts that share the same category as the current post.
This bonus MUST NOT override a higher shared-tag count.

#### Scenario: Category bonus as tiebreaker

- **WHEN** post B shares 2 tags and the same category as post A
- **AND** post C shares 2 tags but a different category from post A
- **THEN** post B ranks higher than post C

#### Scenario: Tag count overrides category

- **WHEN** post B shares 1 tag and the same category as post A
- **AND** post C shares 3 tags but a different category from post A
- **THEN** post C ranks higher than post B

### Requirement: FR-005 Exclude current post

The system SHALL NOT include the current post in its own related posts list.

#### Scenario: Self-exclusion

- **WHEN** computing related posts for post A
- **THEN** post A does not appear in the results

### Requirement: FR-006 Omit section when insufficient results

The system SHALL NOT render the "Related Posts" section if fewer than 2 related posts are found.

#### Scenario: Post with no tags

- **WHEN** a post has an empty tags array
- **THEN** the "Related Posts" section is not rendered

#### Scenario: Post with only 1 related match

- **WHEN** only 1 other post shares any tag with the current post
- **THEN** the "Related Posts" section is not rendered

### Requirement: FR-007 Related post display format

Each related post entry SHALL display the post title as a link to the post page, the publication date, and tag pills.
The display MUST NOT include the post excerpt.

#### Scenario: Related post card content

- **WHEN** the "Related Posts" section is rendered
- **THEN** each entry shows a linked title, formatted date, and tag pills
- **AND** no excerpt text is shown

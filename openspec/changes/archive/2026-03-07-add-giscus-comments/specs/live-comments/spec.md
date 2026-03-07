## ADDED Requirements

### Requirement: FR-001 Giscus comment widget on posts without legacy comments

The system SHALL display a Giscus comment widget on blog post pages that have
no legacy WordPress comments.
Posts that have one or more legacy WordPress comments SHALL continue to display
the existing `CommentList` component and SHALL NOT show the Giscus widget.

#### Scenario: Post without legacy comments shows Giscus

- **WHEN** a reader visits a blog post that has no `comments` in its frontmatter
- **THEN** a Giscus comment widget is rendered below the post content,
  allowing the reader to view and post comments via GitHub Discussions

#### Scenario: Post with legacy comments shows only WordPress comments

- **WHEN** a reader visits a blog post that has `comments` with at least one entry
  in its frontmatter
- **THEN** the existing `CommentList` component is rendered
- **AND** no Giscus widget is displayed

### Requirement: FR-002 Lazy loading of comment widget

The Giscus widget SHALL be lazy-loaded so that it does not fetch external
resources until the user scrolls near the comment section.

#### Scenario: Widget loads on scroll

- **WHEN** the comment section is not yet visible in the viewport
- **THEN** no Giscus iframe or external script is loaded

#### Scenario: Widget triggers when approaching viewport

- **WHEN** the comment section enters or is within 200px of the viewport
- **THEN** the Giscus widget initialises and loads the Discussion thread

### Requirement: FR-003 Dark mode synchronisation

The Giscus widget theme SHALL stay in sync with the site's dark mode setting.

#### Scenario: Initial theme matches site theme

- **WHEN** the Giscus widget initialises
- **THEN** the widget uses the dark theme if the `<html>` element has the
  `dark` class, and the light theme otherwise

#### Scenario: Theme toggles after widget is loaded

- **WHEN** the user toggles dark mode via the `DarkModeToggle` component
  while the Giscus widget is already loaded
- **THEN** the widget switches to the corresponding theme without a full
  page reload

### Requirement: FR-004 Discussion mapping by pathname

Each blog post SHALL map to a GitHub Discussion thread based on the post's
URL pathname.

#### Scenario: New discussion created for first comment

- **WHEN** a reader posts the first comment on a blog post
- **THEN** Giscus creates a new Discussion in the configured category with
  the post's pathname as the mapping key

#### Scenario: Existing discussion loaded for return visits

- **WHEN** a reader visits a post that already has a Discussion thread
- **THEN** the existing comments are displayed in the Giscus widget

### Requirement: FR-005 Graceful degradation without JavaScript

The Giscus widget SHALL degrade gracefully when JavaScript is disabled.

#### Scenario: JavaScript disabled

- **WHEN** a reader visits a blog post with JavaScript disabled
- **THEN** the comment section is simply absent — no error is shown,
  and the rest of the post content renders normally

### Requirement: FR-006 Reactions enabled

The Giscus widget SHALL display reactions on comments and on the main
Discussion post.

#### Scenario: Reader reacts to a comment

- **WHEN** a reader clicks a reaction emoji on a comment in the Giscus widget
- **THEN** the reaction is recorded in the corresponding GitHub Discussion

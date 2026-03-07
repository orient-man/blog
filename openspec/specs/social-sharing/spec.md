## ADDED Requirements

### Requirement: Share buttons rendered on every post page
The system SHALL display a row of social sharing buttons on every blog post page.
The buttons SHALL appear between the post content and the comments section.
The row SHALL be wrapped in a `data-pagefind-ignore` container so it is excluded from search indexing.

#### Scenario: Share buttons visible after reading a post
- **WHEN** a reader views any blog post page
- **THEN** a share button row is displayed below the post content and above the comments section

#### Scenario: Share buttons excluded from search
- **WHEN** Pagefind indexes a blog post page
- **THEN** the share button markup is NOT included in the search index

### Requirement: X/Twitter share button
The system SHALL render an icon-only button that opens the X/Twitter share intent in a new tab.
The share URL SHALL be `https://twitter.com/intent/tweet?text={title}&url={canonicalUrl}&via=orientman`.
The `{title}` and `{canonicalUrl}` values SHALL be URL-encoded.

#### Scenario: Reader shares a post on X/Twitter
- **WHEN** a reader clicks the X/Twitter share icon
- **THEN** a new browser tab opens with the X/Twitter compose dialog pre-filled with the post title, canonical URL, and `via=orientman` attribution

### Requirement: Facebook share button
The system SHALL render an icon-only button that opens the Facebook share dialog in a new tab.
The share URL SHALL be `https://www.facebook.com/sharer/sharer.php?u={canonicalUrl}`.

#### Scenario: Reader shares a post on Facebook
- **WHEN** a reader clicks the Facebook share icon
- **THEN** a new browser tab opens with the Facebook share dialog pre-filled with the post URL

### Requirement: LinkedIn share button
The system SHALL render an icon-only button that opens the LinkedIn share dialog in a new tab.
The share URL SHALL be `https://www.linkedin.com/sharing/share-offsite/?url={canonicalUrl}`.

#### Scenario: Reader shares a post on LinkedIn
- **WHEN** a reader clicks the LinkedIn share icon
- **THEN** a new browser tab opens with the LinkedIn share dialog pre-filled with the post URL

### Requirement: Copy link button
The system SHALL render an icon-only button that copies the post's canonical URL to the clipboard.
The button SHALL display a brief visual confirmation (icon change) for approximately 2 seconds after a successful copy.

#### Scenario: Reader copies the post link
- **WHEN** a reader clicks the copy-link icon
- **THEN** the post's canonical URL is copied to the system clipboard
- **AND** the icon changes to a checkmark for approximately 2 seconds before reverting

#### Scenario: Clipboard API unavailable
- **WHEN** the Clipboard API is not available (e.g., insecure context)
- **THEN** the copy-link button SHALL still be rendered but MAY fail silently

### Requirement: Canonical URL construction
Each share button SHALL use the fully-qualified canonical URL constructed from `siteConfig.siteUrl` and the post's date-based path (`/{year}/{month}/{day}/{slug}/`).

#### Scenario: URL is correctly formed
- **WHEN** a post with date `2022-08-27` and slug `anomalia-review` is rendered
- **THEN** the canonical URL used in share links is `https://blog.orientman.com/2022/08/27/anomalia-review/`

### Requirement: Accessibility
Each share button SHALL have an `aria-label` describing its action (e.g., "Share on Twitter", "Share on Facebook", "Share on LinkedIn", "Copy link to clipboard").
External share links SHALL open in a new tab with `rel="noopener noreferrer"`.

#### Scenario: Screen reader announces button purpose
- **WHEN** a screen reader user navigates to a share button
- **THEN** the screen reader announces the button's purpose via its `aria-label`

### Requirement: Icon consistency
The share button icons SHALL use the same SVG assets as the sidebar social links for X/Twitter, Facebook, and LinkedIn to maintain visual consistency across the site.

#### Scenario: Icons match sidebar
- **WHEN** share buttons are displayed on a post page
- **THEN** the X, Facebook, and LinkedIn icons are identical to those used in the sidebar social links section

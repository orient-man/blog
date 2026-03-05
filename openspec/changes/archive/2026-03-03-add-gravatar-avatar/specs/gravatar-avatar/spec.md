## ADDED Requirements

### Requirement: FR-001 Sidebar avatar display

The sidebar About section MUST display the blog author's Gravatar image above the bio text.
The avatar MUST be visible on every page where the sidebar is rendered.

#### Scenario: Avatar visible on page load

- **WHEN** a visitor loads any page that includes the sidebar
- **THEN** the author's Gravatar image is displayed in the About section above the bio text

### Requirement: FR-002 Gravatar URL construction

The avatar image MUST be sourced from Gravatar using a URL derived from the author's email address MD5 hash.
The hash MUST be pre-computed and hardcoded as a string literal — no hashing library SHALL be added as a dependency.

#### Scenario: Correct Gravatar URL

- **WHEN** the sidebar renders the avatar image
- **THEN** the `src` attribute points to `https://gravatar.com/avatar/<md5-hash>` with `s=128` size parameter

### Requirement: FR-003 Avatar dimensions and shape

The avatar MUST display as a circular image, approximately 128 pixels in diameter, matching the original WordPress blog presentation.

#### Scenario: Avatar styling

- **WHEN** the avatar image is rendered
- **THEN** it appears as a circle with approximately 128px diameter

### Requirement: FR-004 Gravatar fallback

The Gravatar URL MUST include a fallback parameter (`d=mp`) so that a generic silhouette is shown if the Gravatar service is unreachable or the email hash has no associated image.

#### Scenario: No Gravatar image available

- **WHEN** the Gravatar service returns no image for the given hash
- **THEN** a generic silhouette placeholder is displayed instead

### Requirement: FR-005 Dark mode compatibility

The avatar MUST render correctly in both light and dark color modes without visual artifacts.

#### Scenario: Avatar in dark mode

- **WHEN** the site is viewed in dark mode
- **THEN** the avatar image is displayed without jarring contrast or missing borders

#### Scenario: Avatar in light mode

- **WHEN** the site is viewed in light mode
- **THEN** the avatar image is displayed cleanly against the light background

### Requirement: FR-006 No new dependencies

No new runtime or build-time dependencies SHALL be introduced for this feature.
This aligns with the constitution's Simplicity principle.

#### Scenario: Dependency check

- **WHEN** the change is implemented
- **THEN** `package.json` has no new entries in `dependencies` or `devDependencies`

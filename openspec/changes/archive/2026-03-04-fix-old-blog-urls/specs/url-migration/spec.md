## ADDED Requirements

### Requirement: FR-001 Feed URLs use canonical domain

The feed generator (`scripts/generate-feeds.ts`) MUST use `https://blog.orientman.com` as the site URL.
All URLs emitted in `sitemap.xml` and `feed.xml` MUST use the canonical domain.

#### Scenario: Sitemap contains canonical URLs

- **WHEN** the prebuild script generates `public/sitemap.xml`
- **THEN** every `<loc>` element MUST start with `https://blog.orientman.com/`
- **AND** no `<loc>` element SHALL contain `orientman.wordpress.com`

#### Scenario: RSS feed contains canonical URLs

- **WHEN** the prebuild script generates `public/feed.xml`
- **THEN** every `<link>` and `<guid>` element MUST start with `https://blog.orientman.com/`
- **AND** the channel `<link>` MUST be `https://blog.orientman.com/`

### Requirement: FR-002 Internal content links use relative paths

Cross-post links within MDX content files MUST use relative paths instead of absolute WordPress URLs.
A relative path follows the pattern `/YYYY/MM/DD/slug/` matching the blog's existing URL structure.

#### Scenario: Cross-post link in post body

- **WHEN** a post body contains a Markdown link targeting another post on this blog
- **THEN** the link href MUST be a relative path (e.g., `/2013/01/15/blanket-js-qunit-and-ie8-please-die-now/`)
- **AND** the link href MUST NOT contain `orientman.wordpress.com`

#### Scenario: Cross-post link in static page

- **WHEN** a static page contains a Markdown link targeting a post on this blog
- **THEN** the link href MUST be a relative path (e.g., `/2014/02/22/git-jest-git/`)
- **AND** the link href MUST NOT contain `orientman.wordpress.com`

#### Scenario: Comment content is preserved

- **WHEN** a migrated comment's `content` field contains a WordPress URL
- **THEN** the URL MUST be left unchanged to preserve historical accuracy

#### Scenario: Frontmatter wordpressUrl is preserved

- **WHEN** a post's frontmatter contains a `wordpressUrl` field
- **THEN** the value MUST be left unchanged as historical metadata

### Requirement: FR-003 Content images hosted locally

Images referenced in user-facing content files MUST be served from local paths under `public/images/` rather than from external WordPress hosting.

#### Scenario: CV page images served locally

- **WHEN** `content/pages/curriculum-vitae-pl.mdx` references an image
- **THEN** the image `src` MUST point to a local path under `/images/pages/`
- **AND** the corresponding image file MUST exist in `public/images/pages/`

#### Scenario: Image download preserves originals

- **WHEN** images are downloaded from WordPress uploads
- **THEN** the downloaded files MUST be identical to the originals (no re-encoding)
- **AND** filenames MUST be the original WordPress filename (e.g., `image_22831397.png`)

## ADDED Requirements

### Requirement: FR-001 Centralized site metadata module
The project SHALL provide a single TypeScript module (`src/lib/siteConfig.ts`) that exports all site-level metadata constants.
The module MUST export at minimum: site title, title template, author name, tagline, site URL, gravatar hash, GoatCounter ID, and social links array.

#### Scenario: Importing site title
- **WHEN** a component or script needs the site title
- **THEN** it imports `siteConfig` from `@/lib/siteConfig` and reads `siteConfig.title`
- **AND** the value equals `"Just A Programmer"`

#### Scenario: Importing author name
- **WHEN** a component or script needs the author name
- **THEN** it imports `siteConfig` from `@/lib/siteConfig` and reads `siteConfig.author`
- **AND** the value equals `"Marcin Malinowski"`

### Requirement: FR-002 No duplicate hardcoded values in source files
All source files under `src/` and `scripts/generate-feeds.ts` MUST reference site metadata from the centralized config module instead of inline string literals.
One-off import scripts (`scripts/migrate.ts`, `scripts/import-*.ts`, `scripts/fetch-*.ts`) are exempt.

#### Scenario: layout.tsx uses config for site title
- **WHEN** `src/app/layout.tsx` renders the site title in the header or metadata
- **THEN** it reads the value from the centralized config, not a hardcoded string

#### Scenario: generate-feeds.ts uses config for site URL
- **WHEN** `scripts/generate-feeds.ts` builds RSS/Atom feed XML
- **THEN** it reads the site URL and title from the centralized config

#### Scenario: Page title templates use config
- **WHEN** route pages (`tag/`, `category/`, `archive/`) construct page titles
- **THEN** they read the site title suffix from the centralized config

### Requirement: FR-003 Social links defined in config
The config module MUST export an ordered array of social link objects.
Each object MUST have `platform` (string identifier), `url` (full URL or site-relative path), and `label` (accessible display name).
The default order SHALL be: X, Facebook, LinkedIn, GitHub, RSS.

#### Scenario: Social links array structure
- **WHEN** a consumer reads `siteConfig.socialLinks`
- **THEN** it receives an array of 5 objects with `platform`, `url`, and `label` fields
- **AND** the first entry has `platform: "x"` and the last has `platform: "rss"`

### Requirement: FR-004 Config module is statically importable
The config module MUST use only static values (no async, no runtime fetching, no environment variables).
This ensures compatibility with Next.js static export and build-time metadata generation.

#### Scenario: Static export compatibility
- **WHEN** the project builds with `next build` and static export
- **THEN** all config values resolve at build time without errors

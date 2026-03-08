## ADDED Requirements

### Requirement: Changelog file exists

FR-001: The repository MUST contain a `CHANGELOG.md` file in the root directory.
The file MUST follow the [Keep a Changelog](https://keepachangelog.com/) format.

#### Scenario: Changelog is present at repo root

- **WHEN** a developer opens the repository
- **THEN** a `CHANGELOG.md` file exists in the root directory

### Requirement: Semver versioning scheme

FR-002: Each changelog entry MUST use a semantic version number (`MAJOR.MINOR.PATCH`).
Versions MUST follow these rules:
- **MAJOR**: Platform-level overhauls (e.g., complete visual redesign, architecture change).
- **MINOR**: New user-visible features, content migrations.
- **PATCH**: Bug fixes, content corrections, developer tooling changes.

#### Scenario: Feature addition gets MINOR bump

- **WHEN** a change adds a new user-visible feature (e.g., search, comments widget)
- **THEN** the changelog entry uses a MINOR version bump (e.g., 1.15.0 → 1.16.0)

#### Scenario: Bug fix gets PATCH bump

- **WHEN** a change fixes a bug or adds developer tooling
- **THEN** the changelog entry uses a PATCH version bump (e.g., 1.16.0 → 1.16.1)

#### Scenario: Platform overhaul gets MAJOR bump

- **WHEN** a change fundamentally alters the blog platform (e.g., complete visual redesign)
- **THEN** the changelog entry uses a MAJOR version bump (e.g., 1.x.x → 2.0.0)

### Requirement: Retroactive version history

FR-003: The initial `CHANGELOG.md` MUST include retroactive entries for all significant platform changes from project inception (v1.0.0) through the current state.
Each merged PR MUST map to exactly one version entry.

#### Scenario: All historical PRs are covered

- **WHEN** the changelog is first created
- **THEN** every merged PR from #1 through #35 has a corresponding version entry

### Requirement: Entry format

FR-004: Each version entry MUST include:
- Version number in brackets and date in ISO format as heading (e.g., `## [1.5.0] - 2026-03-05`)
- One or more sections from: `Added`, `Changed`, `Fixed`, `Removed`
- Concise bullet points describing what changed

#### Scenario: Entry follows Keep a Changelog structure

- **WHEN** a new version entry is added
- **THEN** it uses `## [x.y.z] - YYYY-MM-DD` heading format with categorized bullet points

### Requirement: Mandatory version bump on changes

FR-005: The `AGENTS.md` file MUST include a requirement that every change modifying site behavior, adding a feature, or fixing a bug MUST bump the version in `CHANGELOG.md`.
The changelog update MUST happen as part of the same change, not as a follow-up.

#### Scenario: Agent implements a new feature

- **WHEN** an AI agent completes a code change
- **THEN** the agent has also added a new version entry to `CHANGELOG.md` before considering the change complete

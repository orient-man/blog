## Why

The project has no record of significant platform changes.
Git history contains 171 commits across 35 PRs but the narrative is buried in commit messages and OpenSpec archives.
A `CHANGELOG.md` gives the maintainer a quick, scannable reference of what changed and when, with retroactive semver versioning projected onto the existing history.

## What Changes

- Add `CHANGELOG.md` in repository root with retroactive version history (v1.0.0 through v1.20.1) covering all 35 merged PRs.
- Use [Keep a Changelog](https://keepachangelog.com/) format with semver versioning: MAJOR for platform-level overhauls, MINOR for new features and content migrations, PATCH for fixes and developer tooling.
- Add a requirement to `AGENTS.md` that every change MUST bump the version in `CHANGELOG.md`.

## Capabilities

### New Capabilities

- `changelog`: Defines the changelog format, versioning scheme, and maintenance rules.

### Modified Capabilities

_(none — no existing spec-level requirements change)_

## Impact

- New file: `CHANGELOG.md` (repo root)
- Modified file: `AGENTS.md` (new section on version bumping)
- No code changes, no dependency changes, no build impact.

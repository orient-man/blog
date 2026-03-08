## Context

The project has 171 commits, 35 merged PRs, and 25 archived OpenSpec changes, all created within a 10-day sprint (Feb 26 – Mar 7, 2026).
There is no version tracking or changelog.
The git history is the only record, and it mixes feature commits, docs commits, and OpenSpec workflow artifacts.

This change adds a purely documentation artifact — no code, no dependencies, no build changes.

## Goals / Non-Goals

**Goals:**

- Provide a scannable record of every significant platform change.
- Establish a semver scheme that can be maintained going forward.
- Ensure future changes always include a changelog entry via AGENTS.md rules.

**Non-Goals:**

- Automated changelog generation from git history.
- Exposing the changelog as a site page (this is developer-facing only).
- Git tags for versions (may be added later, not in scope).

## Decisions

### D1: Keep a Changelog format

Use [Keep a Changelog](https://keepachangelog.com/) conventions (`Added`, `Changed`, `Fixed`, `Removed` sections under version headings).

**Why**: De facto standard for open-source changelogs.
Well-understood, parseable, and concise.

**Alternatives considered**: Free-form narrative grouped by theme — rejected because it loses scanability and makes future entries inconsistent.

### D2: One version per PR

Each merged PR maps to exactly one version entry.
No bundling multiple PRs into a single version.

**Why**: The project has a clean 1:1 mapping between PRs and logical changes.
This preserves maximum traceability.

### D3: Semver without tags

Use semver numbers in the changelog but do not create git tags.
Tags can be added later if needed.

**Why**: Tags add ceremony without immediate benefit for a single-maintainer project.
The changelog itself is the source of truth.

### D4: Single MAJOR era

v1.0.0 is the WordPress → Next.js migration.
Everything since stays in `v1.x.x`.
The Next.js 14 → 16 upgrade is a MINOR bump (v1.8.0) because it changed internals without altering blog functionality.

**Why**: MAJOR should reflect a fundamental shift in what the blog *is*, not framework version bumps.

### D5: AGENTS.md enforcement

Add a rule to `AGENTS.md` requiring agents to bump the changelog version as part of every change.
This is a process rule, not a technical enforcement (no CI check).

**Why**: The project uses AI agents extensively.
A documented rule in AGENTS.md is the standard mechanism for agent behavior constraints in this project.

## Risks / Trade-offs

- **[Retroactive inaccuracy]** → Mitigated by deriving versions directly from git merge history and OpenSpec archives. Each version maps to a specific PR.
- **[Maintenance burden]** → Minimal: one entry per change, enforced by AGENTS.md rule. Agents handle the bookkeeping.
- **[Version number inflation]** → Acceptable. 31 versions in 10 days looks unusual but accurately reflects the development pace. Numbers will grow slower going forward.

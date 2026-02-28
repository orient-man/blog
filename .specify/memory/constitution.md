<!-- Sync Impact Report
  Version change: 1.0.0 → 1.0.1
  Modified principles:
    - I. Simplicity — removed Astro framework reference, now framework-agnostic
  Added sections: None
  Removed sections: None
  Templates requiring updates:
    - .specify/templates/plan-template.md — ✅ no update needed
    - .specify/templates/spec-template.md — ✅ no update needed
    - .specify/templates/tasks-template.md — ✅ no update needed
    - .specify/templates/commands/*.md — ✅ no files exist
  Follow-up TODOs: None
-->

# OrientMan Blog Constitution

## Core Principles

### I. Simplicity

The blog MUST remain a static site. No server-side runtime, no
databases, no dynamic backends. Dependencies MUST be kept to a
minimum. If a feature can be achieved with plain HTML, CSS, or
Markdown, that approach MUST be preferred over adding a library or
framework dependency.

**Rationale**: A static blog has near-zero operational cost and
attack surface. Complexity is the primary risk for a personal blog.

### II. Content-First

Markdown is the canonical content format. All blog posts MUST be
authored in Markdown. Site structure, styling, and tooling MUST
serve content readability and authoring ease. Design decisions MUST
prioritize the reading experience over visual complexity.

**Rationale**: The blog exists to publish written content. Every
technical choice should reduce friction between writing and
publishing.

## Governance

This constitution is the authoritative reference for project
decisions. It supersedes ad-hoc preferences when conflicts arise.

- **Amendments**: Update this file, increment the version, and
  record the date. MAJOR version for principle removal/redefinition,
  MINOR for new principles or sections, PATCH for wording fixes.
- **Compliance**: Any new feature or dependency addition MUST be
  checked against the Simplicity and Content-First principles before
  adoption.

**Version**: 1.0.1 | **Ratified**: 2026-02-26 | **Last Amended**: 2026-02-26

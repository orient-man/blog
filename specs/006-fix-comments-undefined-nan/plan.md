# Implementation Plan: Fix Comments Showing "undefined NaN, NaN"

**Branch**: `006-fix-comments-undefined-nan` | **Date**: 2026-03-01 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/006-fix-comments-undefined-nan/spec.md`

## Summary

Fix a bug where all historical WordPress comment dates display as "undefined NaN, NaN"
instead of a human-readable date like "September 25, 2013".

The root cause: `gray-matter` (YAML parser) converts bare date values
(e.g., `date: 2013-09-25`) inside nested comment objects into JavaScript `Date` objects.
The post-level date is already normalized at load time using an `instanceof Date` check,
but comment dates pass through `content.ts` without normalization.
`Comment.tsx` then calls `String(dateObj)` on the raw Date object, which produces
a locale string like "Wed Sep 25 2013 02:00:00 GMT+0200...".
`formatDate()` appends `T00:00:00Z` to that garbage string, `new Date()` returns
Invalid Date, and `MONTH_NAMES[NaN]` is `undefined` — hence "undefined NaN, NaN".

The fix requires changes to exactly 2 files and introduces zero new dependencies:

1. **`src/lib/content.ts`** — normalize comment dates at load time using the same
   `instanceof Date` → ISO string pattern already applied to post-level dates.
2. **`src/components/Comment.tsx`** — remove the now-redundant `typeof` guards
   and add a graceful "Unknown date" fallback for invalid dates.

## Technical Context

**Language/Version**: TypeScript 5.x, Node.js 20 LTS
**Primary Dependencies**: Next.js 14.2.35 (`output: 'export'`), `@mdx-js/mdx` 3.x, `gray-matter` 4.x
**Storage**: Filesystem — MDX files in `content/posts/`
**Testing**: Manual build + browser verification (no test framework yet)
**Target Platform**: Static site (GitHub Pages)
**Project Type**: Static blog (Next.js static export)
**Performance Goals**: No new overhead; fix is pure data normalization
**Constraints**: Zero new npm dependencies; must not alter post-level date handling (FR-006); must not modify MDX source files (FR-007)
**Scale/Scope**: 9 posts with comments, 16 total comments affected

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

### Pre-Design Evaluation

| Principle         | Gate                                 | Evaluation                                                                               | Status |
| ----------------- | ------------------------------------ | ---------------------------------------------------------------------------------------- | ------ |
| I. Simplicity     | Static site — no server-side runtime | Fix is purely in data loading and rendering layers. No new runtime.                      | PASS   |
| I. Simplicity     | No databases, no dynamic backends    | Zero runtime state introduced.                                                           | PASS   |
| I. Simplicity     | Dependencies kept to minimum         | Zero new npm dependencies.                                                               | PASS   |
| I. Simplicity     | Prefer plain HTML/CSS over libraries | Fix reuses the existing `instanceof Date` normalization pattern already in the codebase. | PASS   |
| II. Content-First | Markdown is canonical content format | MDX source files are untouched. Dates remain `YYYY-MM-DD` in frontmatter.                | PASS   |
| II. Content-First | Serve content readability            | Fixing unreadable comment dates directly improves content readability.                   | PASS   |

### Post-Design Re-Evaluation

All gates remain PASS after Phase 1 design.
No new violations introduced.
The fix is a minimal 2-file change that extends an already-established pattern.

**Gate verdict**: PASS — no violations, no complexity justification needed.

## Project Structure

### Documentation (this feature)

```text
specs/006-fix-comments-undefined-nan/
├── plan.md              # This file
├── research.md          # Phase 0 output — root cause analysis, fix approach, risk register
├── data-model.md        # Phase 1 output — data flow, normalization contract
├── quickstart.md        # Phase 1 output — 3-step implementation guide
├── checklists/
│   └── requirements.md  # Specification quality checklist (all items pass)
└── tasks.md             # Phase 2 output (/speckit.tasks command — NOT created by /speckit.plan)
```

Note: No `contracts/` directory — this feature has no external interfaces or
script output schemas. The fix is internal to the data loading and rendering pipeline.

### Source Code (files changed by this feature)

```text
src/
├── lib/
│   └── content.ts       # Modified: normalize comment dates during data loading (line 66)
└── components/
    └── Comment.tsx      # Modified: remove typeof guards, add "Unknown date" fallback
```

**Structure Decision**: No new files, no new directories.
Two targeted changes to existing files. This is the minimum possible footprint
consistent with the spec's requirement to fix at the data loading layer (FR-003)
and add graceful fallback in the rendering layer (FR-004).

## Complexity Tracking

No violations — table intentionally left empty.

| Violation | Why Needed | Simpler Alternative Rejected Because |
| --------- | ---------- | ------------------------------------ |
| _(none)_  |            |                                      |

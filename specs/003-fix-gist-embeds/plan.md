# Implementation Plan: Fix Gist Embeds Not Rendering

**Branch**: `003-fix-gist-embeds` | **Date**: 2026-02-28 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-fix-gist-embeds/spec.md`

## Summary

Replace 8 bare GitHub Gist URLs across 5 MDX post files with static fenced code blocks
containing the gist content pasted directly.
Each code block carries the correct language tag for syntax highlighting and is followed by
a `[View on GitHub](url)` attribution link.
No changes to the rendering pipeline; `format: 'md'` mode is preserved.

## Technical Context

**Language/Version**: TypeScript 5.x / Node.js 20 LTS (build runtime); Markdown (content)
**Primary Dependencies**: Next.js 14 (`output: 'export'`), `@mdx-js/mdx`, `rehype-pretty-code` (Shiki)
**Storage**: Filesystem only — MDX files in `content/posts/`, images in `public/images/`
**Testing**: Manual visual inspection in the local dev server (`npm run dev`) and static build (`npm run build`)
**Target Platform**: GitHub Pages (static HTML)
**Project Type**: Static blog site
**Performance Goals**: N/A (content-only change, no compute)
**Constraints**: All embedded content MUST be static Markdown; no external fetch at build or runtime
**Scale/Scope**: 5 post files, 8 gist references

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| Principle                                                                                                             | Status  | Notes                                                                                                              |
| --------------------------------------------------------------------------------------------------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------ |
| **I. Simplicity** — no server-side runtime, no databases, no dynamic backends; prefer plain HTML/CSS/Markdown         | ✅ PASS | Content is pasted as static Markdown fenced code blocks. Zero new dependencies. No build-time or runtime fetching. |
| **II. Content-First** — Markdown is the canonical content format; design decisions must prioritize reading experience | ✅ PASS | Bare URLs (unreadable) replaced with syntax-highlighted code blocks (readable). Strictly content improvement.      |

**Gate verdict: PASS — proceed to Phase 0.**

Post-Phase-1 re-check: No new dependencies introduced; no rendering pipeline changes. Both principles remain satisfied.

## Project Structure

### Documentation (this feature)

```text
specs/003-fix-gist-embeds/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
content/posts/
├── blanket-js-qunit-and-ie8-please-die-now.mdx          # 3 gist refs to replace
├── fun-with-castle-dynamicproxy.mdx                     # 2 gist refs to replace
├── fun-with-castle-dynamicproxy-part-ii.mdx             # 1 gist ref to replace
├── explaining-sqlite-foreign-keys-support-with-unit-tests.mdx  # 1 gist ref to replace
└── how-to-put-your-toe-into-asp-net-mvc-integration-testing.mdx # 1 gist ref to replace
```

**Structure Decision**: Content-only change. All edits are confined to `content/posts/`.
No source code files are added or modified.

## Complexity Tracking

No constitution violations. Table not required.

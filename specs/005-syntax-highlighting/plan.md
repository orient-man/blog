# Implementation Plan: Syntax Highlighting for Code Blocks

**Branch**: `005-syntax-highlighting` | **Date**: 2026-03-01 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/005-syntax-highlighting/spec.md`

## Summary

Activate and extend the existing `rehype-pretty-code` + Shiki syntax highlighting
pipeline to deliver build-time highlighting for all fenced code blocks across 33
blog posts.
The feature adds three capabilities on top of the already-installed infrastructure:
(1) dual-theme token CSS wiring so highlighted tokens switch colours with the
light/dark toggle, (2) CSS-counter-based line numbers, and (3) a build-time
copy-to-clipboard button with a minimal inline runtime script.
A content audit script plus manual conversion of ~5-8 posts ensures every post
with code content displays highlighted blocks.

**Zero new npm dependencies.**
All work builds on packages already in `package.json`
(`rehype-pretty-code` ^0.14, `shiki` ^1.29, `remark-gfm` ^4.0).

## Technical Context

**Language/Version**: TypeScript 5.x, Node.js 20 LTS  
**Primary Dependencies**: Next.js 14.2.35 (`output: 'export'`), `@mdx-js/mdx` 3.x, `rehype-pretty-code` 0.14, `shiki` 1.29, `remark-gfm` 4.x  
**Storage**: Filesystem — MDX files in `content/posts/`, static output in `out/`  
**Testing**: Manual build + browser verification (no test framework yet)  
**Target Platform**: Static site (GitHub Pages)  
**Project Type**: Static blog (Next.js static export)  
**Performance Goals**: Zero client-side highlighting overhead (SC-005); build-time only  
**Constraints**: No new npm dependencies; inline clipboard script must be <10 lines; WCAG AA contrast (4.5:1) for code tokens  
**Scale/Scope**: 33 posts, ~11 with existing fenced blocks, ~5-8 needing manual conversion

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

### Pre-Design Evaluation

| Principle         | Gate                                 | Evaluation                                                                           | Status |
| ----------------- | ------------------------------------ | ------------------------------------------------------------------------------------ | ------ |
| I. Simplicity     | Static site — no server-side runtime | All highlighting is build-time via `rehype-pretty-code`. Output is static HTML.      | PASS   |
| I. Simplicity     | No databases, no dynamic backends    | Zero runtime state. Copy-to-clipboard is a minimal inline script.                    | PASS   |
| I. Simplicity     | Dependencies kept to minimum         | Zero new npm dependencies. All packages already installed.                           | PASS   |
| I. Simplicity     | Prefer plain HTML/CSS over libraries | Line numbers: pure CSS counters. Copy button: build-time HTML + 6-line vanilla JS.   | PASS   |
| II. Content-First | Markdown is canonical content format | Posts remain MDX/Markdown. Audit adds standard fenced code blocks.                   | PASS   |
| II. Content-First | Serve content readability            | Syntax highlighting directly improves code readability. Dual-theme ensures contrast. | PASS   |

### Post-Design Re-Evaluation

All gates remain PASS after Phase 1 design.
No new violations introduced.
The custom rehype plugin (`rehypeCopyButton`) uses `unist-util-visit` which is
already a transitive dependency — no new packages added to `package.json`.

**Gate verdict**: PASS — no violations, no complexity justification needed.

## Project Structure

### Documentation (this feature)

```text
specs/005-syntax-highlighting/
├── plan.md              # This file
├── research.md          # Phase 0 output — infrastructure, themes, line numbers, copy, audit, languages, risks
├── data-model.md        # Phase 1 output — entities, pipeline diagram, runtime model
├── quickstart.md        # Phase 1 output — 9-step implementation guide
├── contracts/
│   └── audit-script-output.md   # Audit script CLI interface and JSON schema
├── checklists/
│   └── requirements.md          # Specification quality checklist (all items pass)
└── tasks.md             # Phase 2 output (/speckit.tasks command — NOT created by /speckit.plan)
```

### Source Code (files changed by this feature)

```text
src/
├── styles/
│   └── globals.css              # Modified: dual-theme token CSS, line number CSS, copy button styles
├── lib/
│   └── rehype-copy-button.ts    # New: custom rehype plugin (build-time button injection)
└── app/
    ├── layout.tsx               # Modified: inline clipboard <script> added
    ├── [year]/[month]/[day]/[slug]/
    │   └── page.tsx             # Modified: rehypeCopyButton added to rehypePlugins
    └── page/[slug]/
        └── page.tsx             # Modified: rehypeCopyButton added to rehypePlugins

next.config.mjs                  # Modified: rehypeCopyButton added to withMDX rehypePlugins

scripts/
└── audit-code-blocks.ts         # New: content audit script (read-only diagnostic)

content/posts/
└── *.mdx                        # Modified: ~5-8 posts get fenced code blocks added manually
```

**Structure Decision**: No new directories created.
One new file in `src/lib/` (rehype plugin), one new file in `scripts/` (audit tool).
All other changes are modifications to existing files.
This follows the existing project layout exactly.

## Complexity Tracking

No violations — table intentionally left empty.

| Violation | Why Needed | Simpler Alternative Rejected Because |
| --------- | ---------- | ------------------------------------ |
| _(none)_  |            |                                      |

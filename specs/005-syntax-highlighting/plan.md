# Implementation Plan: Syntax Highlighting for Code Blocks

**Branch**: `005-syntax-highlighting` | **Date**: 2026-03-01 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/005-syntax-highlighting/spec.md`

## Summary

All fenced code blocks on the blog MUST render with build-time syntax highlighting
(language-aware, dual light/dark theme), display line numbers, and include a
copy-to-clipboard button.
The existing `rehype-pretty-code` + Shiki pipeline is already installed and
partially configured; this feature completes the CSS for line numbers, adds a minimal
inline clipboard script, and audits/converts ~5-8 legacy posts whose code content is
not yet wrapped in fenced code blocks.

## Technical Context

**Language/Version**: TypeScript 5.x, Node.js 20 LTS, React 18  
**Primary Dependencies**: Next.js 14.2.35 (`output: 'export'`), `@mdx-js/mdx` 3.x,
`rehype-pretty-code` 0.14.x, `shiki` 1.29.x, `remark-gfm` 4.x,
Tailwind CSS 3.4 + `@tailwindcss/typography`  
**Storage**: Filesystem — MDX files in `content/posts/`, static output in `out/`  
**Testing**: No test framework installed (no jest/vitest/playwright); verification is
manual browser spot-check + `next build` success  
**Target Platform**: Static site, GitHub Pages (no server runtime)  
**Project Type**: Static blog (Next.js App Router + MDX, `output: 'export'`)  
**Performance Goals**: Zero client-side highlighting overhead — all tokenisation at
build time; copy-to-clipboard is the only permitted runtime interaction  
**Constraints**: No new npm dependencies; minimal inline JS only (SC-005); WCAG AA
contrast (4.5:1) in both light and dark themes (SC-002)  
**Scale/Scope**: 33 MDX posts; ~11 already have fenced code blocks; ~5-8 need
manual conversion during content audit

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Pre-Phase-0 Check

#### Principle I — Simplicity

| Check | Result |
|-------|--------|
| Does this feature require a server-side runtime? | **PASS** — static build only |
| Does this feature add new npm dependencies? | **PASS** — all required packages (`rehype-pretty-code`, `shiki`) are already installed |
| Can highlighting be achieved without an additional library? | N/A — the library is already present; this feature only activates and configures it |
| Does copy-to-clipboard require a new library? | **CONDITIONAL PASS** — `navigator.clipboard.writeText()` is a browser native API; no library needed. A minimal inline `<script>` tag (< 10 lines) is sufficient. This is the sole client-side addition permitted by SC-005. Tracked in Complexity Tracking below. |

#### Principle II — Content-First

| Check | Result |
|-------|--------|
| Does this feature improve the reading experience? | **PASS** — syntax highlighting is the primary reading-experience improvement for code-heavy technical posts |
| Does this affect Markdown as the canonical content format? | **PASS** — content remains in MDX/Markdown; only the rendering pipeline changes |
| Does this add friction to authoring? | **PASS** — no authoring changes required for new posts; existing Markdown fenced-block syntax is unchanged |

**Pre-Phase-0 Gate result: PASS**

---

### Post-Phase-1 Re-check

Design is now fully specified in `research.md`, `data-model.md`, `contracts/`, and `quickstart.md`.

#### Principle I — Simplicity (post-design)

| Check | Result |
|-------|--------|
| New npm packages introduced by design? | **PASS** — zero. `unist-util-visit` and `hast` types are already transitive dependencies of `rehype-pretty-code`. |
| New files introduced? | `src/lib/rehype-copy-button.ts` (new build plugin, ~20 lines) and `scripts/audit-code-blocks.ts` (one-off script). Both are minimal. |
| Is the inline `<script>` truly minimal? | **PASS** — 7 lines, event delegation, no globals, no framework code. |
| Does the design require any new infrastructure (CI, server, DB)? | **PASS** — no. |
| Does the copy button need a React component? | **PASS** — rejected in favour of CSS + inline script per research.md Section 4.1. |

#### Principle II — Content-First (post-design)

| Check | Result |
|-------|--------|
| Content remains in Markdown? | **PASS** — MDX source files unchanged in format; only rendering pipeline extended. |
| Does the design affect authoring workflow? | **PASS** — authors continue writing standard fenced code blocks. No new syntax or tooling required. |
| Does the line-number CSS affect readability negatively? | **PASS** — `user-select: none` keeps line numbers out of copy; gutter colour is neutral. |
| Does the copy button affect reading experience? | **PASS** — opacity 0 by default, visible only on hover; non-intrusive. |

**Post-Phase-1 Gate result: PASS** — proceed to `/speckit.tasks`.

## Project Structure

### Documentation (this feature)

```text
specs/005-syntax-highlighting/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
│   └── audit-script-output.md
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── styles/
│   └── globals.css          # Add line-number CSS counters; copy-button styles
├── app/
│   ├── layout.tsx            # Add inline clipboard script (dangerouslySetInnerHTML)
│   └── [year]/[month]/[day]/[slug]/
│       └── page.tsx          # MDX evaluate() — rehype-pretty-code options already here
├── components/
│   └── (no new components — copy button added via CSS + inline script, not React)
└── lib/
    └── content.ts            # Read-only during this feature

content/
└── posts/
    └── *.mdx                 # ~5-8 posts to be manually edited (fenced code block audit)

scripts/
└── audit-code-blocks.ts      # New: identifies posts with likely un-fenced code

next.config.mjs               # rehype-pretty-code options (already configured; verify only)
```

**Structure Decision**: Single Next.js project (no backend/frontend split). All
changes are either CSS, a minimal inline script in the root layout, a one-off audit
script, and manual MDX edits. No new components or services required.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Inline `<script>` for clipboard | FR-013 requires copy-to-clipboard; SC-005 allows minimal JS for this interaction only | A CSS-only clipboard solution does not exist; `rehype-pretty-copy` is experimental and would still emit a script; a React client component adds a full component boundary for a 5-line behaviour |

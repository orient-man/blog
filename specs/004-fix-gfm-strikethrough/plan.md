# Implementation Plan: Fix GFM Strikethrough Rendering

**Branch**: `004-fix-gfm-strikethrough` | **Date**: 2026-03-01 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/004-fix-gfm-strikethrough/spec.md`

## Summary

Blog posts using `~~text~~` GFM strikethrough syntax render as literal tildes instead of
struck-through text. The root cause is that the Markdown processing pipeline has no remark
plugins configured -- specifically `remark-gfm` is missing. The fix adds `remark-gfm` v4 as a
remark plugin to all three content compilation paths (the `@next/mdx` config and both runtime
`evaluate()` call sites).

## Technical Context

**Language/Version**: TypeScript 5.x / Node.js 20 LTS  
**Primary Dependencies**: Next.js 14.2.35 (`output: 'export'`), `@mdx-js/mdx` 3.x, `rehype-pretty-code` 0.14, `shiki` 1.29  
**New Dependency**: `remark-gfm` 4.0.1 (~20 incremental packages / ~1-2 MB over existing `@mdx-js/mdx` tree)  
**Storage**: Filesystem -- MDX files in `content/posts/`, images in `public/images/`  
**Testing**: Manual: `npm run build` + visual verification (no test framework configured)  
**Target Platform**: Static site deployed to GitHub Pages  
**Project Type**: Static blog (Next.js static export)  
**Performance Goals**: N/A -- build-time only change, no runtime impact  
**Constraints**: Minimal dependencies per constitution; static export only  
**Scale/Scope**: 33 posts, 2 rendering paths (`evaluate()` call sites) + 1 config path (`next.config.mjs`)

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

### Pre-Research Check

| Gate | Principle                                  | Status           | Notes                                                                      |
| ---- | ------------------------------------------ | ---------------- | -------------------------------------------------------------------------- |
| G1   | I. Simplicity -- Static site, no runtime   | PASS             | `remark-gfm` runs at build time only; zero runtime impact on deployed site |
| G2   | I. Simplicity -- Minimize dependencies     | PASS (justified) | New dependency justified; see Complexity Tracking                          |
| G3   | II. Content-First -- Markdown is canonical | PASS             | Enables standard GFM Markdown to render as authors expect                  |
| G4   | II. Content-First -- Reading experience    | PASS             | Fixes broken formatting that degrades reader comprehension                 |

### Post-Design Re-Check

| Gate | Principle                                  | Status           | Notes                                                                                                                                        |
| ---- | ------------------------------------------ | ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| G1   | I. Simplicity -- Static site, no runtime   | PASS             | No change from pre-research assessment                                                                                                       |
| G2   | I. Simplicity -- Minimize dependencies     | PASS (justified) | Research confirmed `remark-gfm` is the canonical solution recommended by both MDX and Next.js docs; alternatives are worse (see research.md) |
| G3   | II. Content-First -- Markdown is canonical | PASS             | No change from pre-research assessment                                                                                                       |
| G4   | II. Content-First -- Reading experience    | PASS             | No change from pre-research assessment                                                                                                       |

## Project Structure

### Documentation (this feature)

```text
specs/004-fix-gfm-strikethrough/
├── spec.md              # Feature specification
├── plan.md              # This file
├── research.md          # Phase 0: remark-gfm research findings
├── quickstart.md        # Phase 1: verification steps
├── checklists/
│   └── requirements.md  # Spec quality checklist
└── tasks.md             # Phase 2 output (/speckit.tasks -- NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
# Existing files modified (no new source files created)
package.json                                    # +1 dependency line
next.config.mjs                                 # +1 import, +1 remarkPlugins config line
src/app/[year]/[month]/[day]/[slug]/page.tsx    # +1 import, +1 remarkPlugins config line
src/app/page/[slug]/page.tsx                    # +1 import, +1 remarkPlugins config line
```

**Structure Decision**: No new directories or files needed in `src/`. The change is a
configuration-only addition to 4 existing files. The `src/` structure remains identical:
`app/`, `components/`, `lib/`, `styles/`.

## Change Details

### 1. `package.json` -- Add dependency

Add `"remark-gfm": "^4.0.0"` to the `dependencies` section, then run `npm install`.

### 2. `next.config.mjs` -- Add remark plugin to `@next/mdx` pipeline

Import `remarkGfm` and add it to the `remarkPlugins` array:

```js
import remarkGfm from "remark-gfm";

const withMDX = createMDX({
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [[rehypePrettyCode, prettyCodeOptions]],
  },
});
```

### 3. `src/app/[year]/[month]/[day]/[slug]/page.tsx` -- Add to post `evaluate()`

Import `remarkGfm` and add `remarkPlugins` to the `evaluate()` options:

```ts
import remarkGfm from "remark-gfm";

const { default: Content } = await evaluate(post.content, {
  ...(runtime as any),
  format: "md",
  remarkPlugins: [remarkGfm],
  rehypePlugins: [[rehypePrettyCode as any, prettyCodeOptions]],
  development: false,
});
```

### 4. `src/app/page/[slug]/page.tsx` -- Add to static page `evaluate()`

Identical pattern to change #3:

```ts
import remarkGfm from "remark-gfm";

const { default: Content } = await evaluate(page.content, {
  ...(runtime as any),
  format: "md",
  remarkPlugins: [remarkGfm],
  rehypePlugins: [[rehypePrettyCode as any, prettyCodeOptions]],
  development: false,
});
```

## Complexity Tracking

| Violation                                                            | Why Needed                                                                                                                  | Simpler Alternative Rejected Because                                                                                                                                                                                                                                                                                                                                                                        |
| -------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Adding `remark-gfm` dependency (+1 package, ~20 transitive, ~1-2 MB) | Enables `~~strikethrough~~`, GFM tables, task lists, and autolinks -- all standard Markdown conventions expected by authors | **`<del>` HTML tags**: forces non-standard authoring syntax, requires editing all existing posts, violates the Content-First principle that Markdown should "just work". **Strikethrough-only custom plugin**: no off-the-shelf package exists; requires hand-wiring `micromark-extension-gfm-strikethrough` + `mdast-util-gfm-strikethrough` manually, saves only ~1.6 MB, adds ongoing maintenance burden |

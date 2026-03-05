# Research: Fix GFM Strikethrough Rendering

**Feature**: 004-fix-gfm-strikethrough  
**Date**: 2026-03-01  
**Status**: Complete -- all unknowns resolved

## Research Questions

1. Can `remark-gfm` be added without violating the constitution's simplicity principle?
2. Is `remark-gfm` compatible with `@mdx-js/mdx` `evaluate()` in `format: 'md'` mode?
3. Is `remark-gfm` compatible with `rehype-pretty-code`?
4. What is the true dependency cost of adding `remark-gfm`?
5. Does a strikethrough-only alternative exist that would be lighter?

---

## Decision 1: Use `remark-gfm` (not a custom plugin or HTML workaround)

**Decision**: Add `remark-gfm` v4.0.1 as the single solution.

**Rationale**:
- Officially recommended by both the MDX docs (`mdxjs.com/guides/gfm/`) and the Next.js docs for enabling GFM in Markdown pipelines.
- Enables strikethrough, tables, task lists, and autolinks in one well-maintained package -- preventing the same class of bug from recurring for other GFM features.
- The incremental dependency cost over the existing `@mdx-js/mdx` tree is modest (~20 packages, ~1-2 MB) because both share the same `unified@^11` ecosystem.

**Alternatives considered**:

| Alternative | Verdict | Reason Rejected |
|-------------|---------|-----------------|
| `<del>text</del>` HTML tags | Rejected | Forces non-standard authoring, requires editing existing posts, violates Content-First principle |
| Custom strikethrough plugin (wrapping `micromark-extension-gfm-strikethrough`) | Rejected | No off-the-shelf package; requires hand-wiring two packages manually, saves only ~1.6 MB, adds maintenance burden with no benefit |
| Do nothing / document limitation | Rejected | At least one published post is already broken (`~~framework~~` in "There Is No Such Thing as a Free (Free Monad)") |

---

## Decision 2: Apply `remark-gfm` to all three compilation paths

**Decision**: Add `remarkPlugins: [remarkGfm]` to:
1. `createMDX()` in `next.config.mjs`
2. `evaluate()` in `src/app/[year]/[month]/[day]/[slug]/page.tsx`
3. `evaluate()` in `src/app/page/[slug]/page.tsx`

**Rationale**: The blog has two independent rendering pipelines. Post and static page content is compiled via `@mdx-js/mdx` `evaluate()` at build time, which does **not** inherit configuration from `next.config.mjs`. Applying the plugin to only one path would leave the other broken. Consistency across all three ensures future content works uniformly regardless of which path serves it.

**Alternatives considered**:

| Alternative | Verdict | Reason Rejected |
|-------------|---------|-----------------|
| Apply only to `evaluate()` call sites (skip `next.config.mjs`) | Acceptable but incomplete | `@next/mdx` is still configured for potential `.mdx` file routes; leaving it inconsistent would be confusing |
| Extract shared `evaluate()` options to a shared constant | Preferred refactor | Out of scope for this fix; would be a good follow-up to eliminate duplication of `prettyCodeOptions` as well |

---

## Compatibility Findings

### `remark-gfm` + `@mdx-js/mdx` `evaluate()` with `format: 'md'`

**Result**: Fully compatible. Confirmed.

- `evaluate()` accepts `EvaluateOptions` which inherits `ProcessorOptions`, including `remarkPlugins`.
- `format: 'md'` controls the parser mode (no JSX/ESM), not the remark plugin stage. `remark-gfm` runs in the transform stage, which is unaffected by format.
- MDX docs explicitly demonstrate this pattern with `compile()` and the same options apply to `evaluate()`.

### `remark-gfm` + `rehype-pretty-code`

**Result**: No conflicts. Confirmed.

- The two plugins operate at different pipeline stages:
  - `remark-gfm` runs at the **remark (mdast) phase** -- extends parsing for GFM syntax.
  - `rehype-pretty-code` runs at the **rehype (hast) phase** -- transforms `<pre><code>` for syntax highlighting.
- Pipeline order: `parse → remark-gfm → mdast-to-hast → rehype-pretty-code → output`
- GFM table pipe syntax (`| cell |`) only applies in block-level contexts. Content inside fenced code blocks is parsed as code **before** `remark-gfm` runs, so pipes inside code blocks are never misinterpreted as table delimiters.
- Both plugins are widely used together in the Next.js ecosystem with no known conflicts.

### `remark-gfm` + `@next/mdx` `createMDX()`

**Result**: Fully compatible. Confirmed.

- The Next.js MDX documentation uses `remark-gfm` with `createMDX()` as the canonical example.
- Usage: `remarkPlugins: [remarkGfm]` in the `options` object passed to `createMDX()`.

---

## Dependency Cost Analysis

| Metric | Value |
|--------|-------|
| Package version | `4.0.1` (released 2025-02-10) |
| Direct new dependencies | `mdast-util-gfm`, `micromark-extension-gfm` (and their sub-packages) |
| Total new `node_modules` additions | ~20 packages (rest already present via `@mdx-js/mdx`) |
| Incremental disk size | ~1-2 MB |
| Node.js compatibility | 16+ |
| Maintenance status | Active; part of the `remarkjs` monorepo maintained by the unified collective |

---

## Edge Case Verification

| Scenario | GFM Spec Behavior | Risk |
|----------|-------------------|------|
| Single tildes in prose (`~> 1`, `~EWD/`) | Not strikethrough (requires `~~`) | None -- 15 posts with single `~` are unaffected |
| Tildes in fenced code blocks | Parsed as code before remark runs | None |
| Tildes in inline code (`` `~~` ``) | Parsed as code before remark runs | None |
| Unmatched `~~orphaned` | Rendered as literal `~~` per GFM spec | None |
| Multi-line `~~span~~` across blocks | GFM spec: does not span block boundaries | None |

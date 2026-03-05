# Data Model: Syntax Highlighting for Code Blocks

**Feature**: 005-syntax-highlighting  
**Phase**: 1 — Design  
**Date**: 2026-03-01

## Overview

This feature operates entirely on build-time data (MDX source files → HTML output)
and a single runtime interaction (copy-to-clipboard).
There is no database, no server, and no persistent state beyond the filesystem.
The "data model" describes the content structures, configuration shapes, and
build-time transformations involved.

---

## Entities

### 1. `MdxPost`

Represents a single blog post file on disk.

| Field | Type | Source | Notes |
|-------|------|--------|-------|
| `filePath` | `string` | Filesystem | Absolute path to `.mdx` file under `content/posts/` |
| `slug` | `string` | Derived from filename | Used in URL routing (`[year]/[month]/[day]/[slug]`) |
| `frontmatter` | `Record<string, unknown>` | YAML front matter (via `gray-matter`) | Contains `title`, `date`, `tags`, etc. |
| `body` | `string` | File content after front matter | Raw Markdown/MDX source |
| `codeBlocks` | `CodeBlock[]` | Derived (audit script) | Zero or more fenced code blocks found in `body` |

---

### 2. `CodeBlock`

Represents a single fenced code block within a post body.

| Field | Type | Notes |
|-------|------|-------|
| `language` | `string \| null` | Language identifier from the opening fence (e.g., `csharp`, `bash`). `null` when no tag is present. |
| `rawContent` | `string` | Literal text between the opening and closing fences, before any highlighting |
| `lineCount` | `number` | Number of lines in `rawContent` |
| `hasCopyButton` | `boolean` | Always `true` post-implementation (injected at build time by `rehypeCopyButton`) |
| `hasLineNumbers` | `boolean` | Always `true` post-implementation (CSS counters, no per-block config) |

**Invariants**:
- `language` MUST be a valid Shiki language ID, an alias thereof, or `null`
- If `language` is unrecognised by Shiki, output falls back to plain monospaced text (FR-006)
- `rawContent` is never HTML-escaped at this layer; escaping occurs inside the rehype pipeline

---

### 3. `HighlightedCodeBlock`

The build-time output produced by `rehype-pretty-code` for a single `CodeBlock`.
This is the HTML structure written into the static `out/` directory.

| Field | HTML attribute / element | Notes |
|-------|--------------------------|-------|
| `figure` | `<figure data-rehype-pretty-code-figure="">` | Wrapper element |
| `pre` | `<pre data-language="{lang}" data-theme="github-dark github-light" tabindex="0">` | Scrollable container |
| `code` | `<code data-language="{lang}" data-theme="github-dark github-light" style="display:grid">` | Token grid |
| `lines` | `<span data-line="">…</span>` (one per line) | CSS counter increments on these |
| `tokens` | `<span style="--shiki-dark:…;--shiki-light:…">…</span>` | Per-token colour via CSS custom props |
| `copyButton` | `<button data-copy-btn="">Copy</button>` | Appended to `figure` by `rehypeCopyButton`; styled and activated by inline script |

**CSS custom property resolution**:

```
Light theme:  color: var(--shiki-light)    (default)
Dark theme:   color: var(--shiki-dark)     (.dark class on <html>)
```

---

### 4. `ThemeConfig`

The dual-theme configuration passed to `rehype-pretty-code`.

| Field | Value | Notes |
|-------|-------|-------|
| `theme.dark` | `'github-dark'` | Shiki built-in theme |
| `theme.light` | `'github-light'` | Shiki built-in theme |
| `keepBackground` | `false` | Prevents Shiki from emitting `--shiki-dark-bg` / `--shiki-light-bg`; background is controlled by `--code-bg` CSS variable instead |

---

### 5. `AuditResult`

The output produced by `scripts/audit-code-blocks.ts` for a single post.
Used to guide the manual content-conversion phase.

| Field | Type | Notes |
|-------|------|-------|
| `filePath` | `string` | Path to the MDX file |
| `slug` | `string` | Post slug |
| `flagged` | `boolean` | `true` if any heuristic fired |
| `heuristics` | `AuditHeuristic[]` | Which patterns were detected and where |
| `existingFencedBlocks` | `number` | Count of already-fenced blocks (for context) |

#### `AuditHeuristic`

| Field | Type | Notes |
|-------|------|-------|
| `type` | `'shell-command' \| 'indented-block' \| 'long-inline-code' \| 'raw-xml-html'` | Which rule triggered |
| `lineNumber` | `number` | 1-based line in the MDX file |
| `excerpt` | `string` | Short excerpt of the flagged content (max 80 chars) |

---

## Build-Time Transformation Pipeline

```
content/posts/*.mdx
        │
        ▼ gray-matter (frontmatter extraction)
        │
        ▼ @mdx-js/mdx evaluate()
            ├── remarkPlugins: [remarkGfm]
            └── rehypePlugins:
                  ├── rehype-pretty-code  ← tokenises code blocks → HighlightedCodeBlock HTML
                  └── rehypeCopyButton    ← appends <button data-copy-btn> to each figure
        │
        ▼ React Server Component render
        │
        ▼ next build → out/**/*.html  (static)
```

---

## Runtime Interaction Model

```
User click on [data-copy-btn]
        │
        ▼ document click event (delegated, inline <script> in layout.tsx)
        │
        ▼ btn.closest('[data-rehype-pretty-code-figure]').querySelector('pre').innerText
        │
        ▼ navigator.clipboard.writeText(text)
        │
        ├── success → btn[data-copied] set; cleared after 2 000 ms
        └── failure → silently ignored (clipboard API unavailable e.g. HTTP)
```

No state is stored. No server round-trip. No dependencies.

---

## CSS Counter Model for Line Numbers

```
<code>                          ← counter-reset: line   (already in globals.css)
  <span data-line="">…</span>  ← counter-increment: line
  <span data-line="">…</span>      ::before { content: counter(line) }
  …
</code>
```

Line numbers are excluded from clipboard copy because:
- The `::before` pseudo-element is not part of `innerText`
- `user-select: none` prevents manual text selection from including them

---

## File Relationships

```
content/posts/*.mdx
    └── read by → src/lib/content.ts (getPostBySlug, getAllPosts)
    └── compiled by → src/app/[year]/[month]/[day]/[slug]/page.tsx (evaluate())
    └── audited by → scripts/audit-code-blocks.ts (read-only)

src/styles/globals.css
    └── line-number CSS added here

src/app/layout.tsx
    └── inline clipboard <script> added here

next.config.mjs
    └── rehypeCopyButton added to withMDX() rehypePlugins here

src/app/[year]/[month]/[day]/[slug]/page.tsx
    └── rehypeCopyButton added to evaluate() rehypePlugins here
```

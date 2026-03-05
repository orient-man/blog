# Research: Syntax Highlighting for Code Blocks

**Feature**: 005-syntax-highlighting  
**Phase**: 0 — Discovery  
**Date**: 2026-03-01

## 1. Existing Highlighting Infrastructure

### 1.1 Packages Already Installed

| Package | Version | Role |
|---------|---------|------|
| `rehype-pretty-code` | ^0.14.0 | Build-time syntax highlighting via Shiki |
| `shiki` | ^1.29.2 | Tokeniser; ships VS Code TextMate grammars for 200+ languages |
| `@mdx-js/mdx` | ^3.1.0 | MDX compilation with `evaluate()` |
| `@next/mdx` | ^14.2.35 | Next.js MDX integration (secondary path) |
| `remark-gfm` | ^4.0.1 | GitHub Flavored Markdown (tables, strikethrough, etc.) |

**Key finding**: All highlighting infrastructure is already present.
This feature activates and extends the existing pipeline — no new npm dependencies needed.

### 1.2 MDX Rendering Pipeline

Posts are rendered via `@mdx-js/mdx`'s `evaluate()` in
`src/app/[year]/[month]/[day]/[slug]/page.tsx`:

```typescript
// Primary rendering path (app router dynamic route)
const { default: Content } = await evaluate(source, {
  format: 'md',
  remarkPlugins: [remarkGfm],
  rehypePlugins: [[rehypePrettyCode, prettyCodeOptions]],
  ...runtime,
})
```

The same options are duplicated in `next.config.mjs` for `@next/mdx` page routes
(secondary/fallback path).

**Current `prettyCodeOptions`** (in `page.tsx`):

```typescript
const prettyCodeOptions = {
  theme: { dark: 'github-dark', light: 'github-light' },
  keepBackground: false,
}
```

### 1.3 Generated HTML Structure

`rehype-pretty-code` 0.14 wraps each code block as follows:

```html
<figure data-rehype-pretty-code-figure="">
  <pre tabindex="0" data-language="csharp" data-theme="github-dark github-light">
    <code data-language="csharp" data-theme="github-dark github-light" style="display:grid">
      <span data-line="">
        <span style="--shiki-dark:#79C0FF;--shiki-light:#0550AE">using</span>
        <span style="--shiki-dark:#C9D1D9;--shiki-light:#24292F"> System;</span>
      </span>
    </code>
  </pre>
</figure>
```

Dual-theme tokens are expressed as CSS custom properties (`--shiki-dark`,
`--shiki-light`) on each inline `<span>`.
Theme switching requires CSS rules that read these properties based on the
current color-scheme context (see Section 3).

## 2. Theme Mechanism

### 2.1 Dark Mode Toggle

- `darkMode: 'class'` in `tailwind.config.ts`
- The `.dark` class is toggled on `<html>` via a `localStorage`-persisted script
  in `src/app/layout.tsx`
- No `prefers-color-scheme` media query is used at runtime — the class-based toggle
  is the single source of truth

### 2.2 Shiki Dual-Theme CSS Wiring

For Shiki's `--shiki-dark` / `--shiki-light` custom properties to switch with the
`.dark` class, the following CSS is needed:

```css
/* Light theme (default) */
code[data-theme*=" "],
code[data-theme*=" "] span {
  color: var(--shiki-light);
  background-color: var(--shiki-light-bg);
}

/* Dark theme */
.dark code[data-theme*=" "],
.dark code[data-theme*=" "] span {
  color: var(--shiki-dark);
  background-color: var(--shiki-dark-bg);
}
```

**Note**: `keepBackground: false` is already set, so `--shiki-light-bg` /
`--shiki-dark-bg` are not emitted by Shiki.
Only token colour variables need to be wired up.
The existing `globals.css` already has `[data-rehype-pretty-code-figure] pre`
background rules that use `--code-bg` custom property — these continue to apply.

### 2.3 Existing Code Block CSS (globals.css lines 56–78)

The project already has:

- `--code-bg: #f1f5f9` (light) and `--code-bg: #1e293b` (dark)
- `[data-rehype-pretty-code-figure] pre` — sets background, border-radius, padding,
  overflow-x scroll
- `[data-rehype-pretty-code-figure] code` — font size, `counter-reset: line`
- `[data-line]` — padding, display block
- Title bar styles for `[data-rehype-pretty-code-title]`

**Key finding**: `counter-reset: line` is ALREADY present on the `code` selector.
Only the `::before` pseudo-element CSS for `[data-line]` is missing to activate
line numbers.

## 3. Line Numbers — Implementation Approach

Line numbers in `rehype-pretty-code` 0.14 are NOT a plugin config option.
The recommended approach is pure CSS counters:

```css
/* Already present in globals.css: counter-reset: line on code */

/* To add — increment and display on each line */
[data-rehype-pretty-code-figure] [data-line]::before {
  counter-increment: line;
  content: counter(line);

  /* Styling */
  display: inline-block;
  width: 1rem;
  margin-right: 1.5rem;
  text-align: right;
  color: hsl(0 0% 60%);          /* neutral gutter colour */
  user-select: none;              /* exclude from text selection / copy */
  font-variant-numeric: tabular-nums;
}
```

**Pros**: Zero JS, zero build-time config, no new dependencies.  
**Cons**: None for this use case.

## 4. Copy-to-Clipboard — Implementation Approach

### 4.1 Options Evaluated

| Option | Pros | Cons | Decision |
|--------|------|------|----------|
| `rehype-pretty-copy` (experimental plugin) | Zero runtime JS; button HTML injected at build time | Experimental status; still needs client JS to wire up `navigator.clipboard`; adds a dependency | **Rejected** |
| React client component (`'use client'`) | Clean React pattern | Adds component hydration boundary; more complex than needed | **Rejected** |
| Minimal inline `<script>` in layout | 5–8 lines; no dependencies; works on all static pages; idiomatic for progressive enhancement | `dangerouslySetInnerHTML` needed in layout component | **Selected** |

### 4.2 Selected Approach — Inline Script in Layout

A `<script>` tag added to `src/app/layout.tsx` via `dangerouslySetInnerHTML`
handles all copy buttons across every page with a single event delegation pattern:

```javascript
// Event delegation — one listener for all copy buttons on the page
document.addEventListener('click', function(e) {
  var btn = e.target.closest('[data-copy-btn]');
  if (!btn) return;
  var pre = btn.closest('[data-rehype-pretty-code-figure]').querySelector('pre');
  navigator.clipboard.writeText(pre.innerText).then(function() {
    btn.setAttribute('data-copied', '');
    setTimeout(function() { btn.removeAttribute('data-copied'); }, 2000);
  });
});
```

The button HTML is injected by a custom `rehype` plugin or `rehypePrettyCode`'s
`onVisitCodeBlock` callback at build time — no runtime DOM manipulation needed for
the button itself.

### 4.3 Button Injection at Build Time

`rehype-pretty-code` 0.14 exposes `onVisitHighlightedLine` and related callbacks
but does NOT have a built-in `onVisitCodeBlock` callback for post-processing the
`<pre>` element.
The correct approach is to add a small custom rehype plugin that runs AFTER
`rehype-pretty-code` and appends `<button data-copy-btn>` to each
`<figure data-rehype-pretty-code-figure>`:

```typescript
// scripts/rehype-copy-button.ts (or inline in next.config.mjs / page.tsx)
import { visit } from 'unist-util-visit'
import type { Root, Element } from 'hast'

export function rehypeCopyButton() {
  return (tree: Root) => {
    visit(tree, 'element', (node: Element) => {
      if (
        node.tagName === 'figure' &&
        Object.prototype.hasOwnProperty.call(node.properties, 'dataRehypePrettyCodeFigure')
      ) {
        node.children.push({
          type: 'element',
          tagName: 'button',
          properties: { 'data-copy-btn': '' },
          children: [{ type: 'text', value: 'Copy' }],
        })
      }
    })
  }
}
```

This runs at build time.
The inline script in layout handles the runtime click → clipboard flow.

## 5. Content Audit Findings

### 5.1 Summary

| Category | Count |
|----------|-------|
| Total MDX posts | 33 |
| Already have fenced code blocks | 11 |
| No fenced blocks, prose-only | ~14 |
| No fenced blocks, likely contain code | ~8 |

### 5.2 Posts Confirmed to Need Conversion

The following posts were identified during exploration as containing code content
not wrapped in fenced code blocks:

| Post (slug) | Code Content | Likely Language |
|-------------|-------------|-----------------|
| `checking-for-outdated-package-references-during-build-with-fake-paket` | Paket/MSBuild scripts, command output | `bash`, `xml` |
| `how--not--to-upgrade-to-asp-net-core-2-0-just-yet-with-paket` | Paket dependency files, commands | `bash`, `text` |
| `chutzpah-to-run-javascript-tests` | Config JSON, command output | `json`, `bash` |
| `tips-for-running-visualstudio-2010-resharper-7-on-32-bit-windows` | Registry keys, config snippets | `text`, `xml` |
| `for-the-record-how-to-run-nuget-exe-on-os-x-mountain-lion` | Shell commands, mono invocation | `bash` |

### 5.3 Languages in Existing Fenced Blocks

Languages already tagged in the 11 posts with fenced blocks:
`fsharp`, `bash`, `javascript`, `csharp`, `xml`, `html`, `diff`

All are supported by Shiki's bundled grammars.

### 5.4 Audit Script Strategy

A TypeScript script (`scripts/audit-code-blocks.ts`) will:

1. Read all MDX files in `content/posts/`
2. For each post, detect heuristics for un-fenced code:
   - Lines that look like shell commands (start with `$`, `>`, or known CLI names)
   - Lines indented 4+ spaces (legacy Markdown code indent)
   - Inline backtick spans longer than 30 characters (likely should be a block)
   - Presence of XML/HTML tags outside of fenced blocks
3. Output a report (JSON + human-readable) listing posts flagged for manual review
4. NOT modify files — author reviews and edits manually (FR-014)

## 6. Supported Languages Confirmation

Shiki 1.29 ships grammars for all required languages from FR-001:

| Language | Shiki ID | Notes |
|----------|----------|-------|
| C# | `csharp` or `cs` | ✅ Built-in |
| F# | `fsharp` or `fs` | ✅ Built-in |
| C++ | `cpp` | ✅ Built-in |
| JavaScript | `javascript` or `js` | ✅ Built-in |
| TypeScript | `typescript` or `ts` | ✅ Built-in |
| HTML | `html` | ✅ Built-in |
| CSS | `css` | ✅ Built-in |
| XML | `xml` | ✅ Built-in |
| Bash | `bash` or `sh` | ✅ Built-in |
| Diff | `diff` | ✅ Built-in |
| JSON | `json` | ✅ Built-in (useful for audit findings) |

## 7. Risk Register

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Inline script conflicts with Next.js hydration | Low | Medium | Use `defer` attribute; event delegation fires after DOM ready |
| `counter-reset` already present causes double-counting | Low | Low | Inspect generated CSS; `counter-reset` on `code` + `counter-increment` on `[data-line]::before` is the correct pairing |
| Un-fenced code in posts not caught by audit script | Medium | Low | Script is a hint tool only; author does final manual review (FR-014) |
| `rehype-copy-button` plugin incompatible with `@next/mdx` path | Low | Low | Plugin must be added to both `next.config.mjs` and `page.tsx` evaluate() options |
| Dark/light Shiki token CSS conflicts with existing prose styles | Low | Medium | Test both themes in browser after CSS change; existing `--code-bg` rules are scoped to `[data-rehype-pretty-code-figure]` |

## 8. Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Line number implementation | CSS counters | Already 50% done (`counter-reset` present); zero JS; no config |
| Copy button injection | Custom rehype plugin at build time | Button HTML is static; only click handler needs runtime |
| Copy button runtime | Inline `<script>` with event delegation | Minimal; no dependencies; SC-005 compliant |
| Content audit | Script + manual review | FR-014 explicitly requires hybrid approach |
| New npm dependencies | None | All required packages already installed |

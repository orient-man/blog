# Quickstart: Syntax Highlighting for Code Blocks

**Feature**: 005-syntax-highlighting  
**Phase**: 1 — Design  
**Date**: 2026-03-01  
**Audience**: Implementing agent / developer

This guide provides a step-by-step implementation sequence.
Each step is self-contained and references the exact files to change.

---

## Prerequisites

```bash
# Verify the feature branch
git branch --show-current
# Expected: 005-syntax-highlighting

# Verify required packages are already installed (no npm install needed)
grep '"rehype-pretty-code"' package.json
grep '"shiki"' package.json
```

---

## Step 1 — Activate Dual-Theme Token CSS

**File**: `src/styles/globals.css`

Add the following CSS rules to wire Shiki's `--shiki-light` / `--shiki-dark`
custom properties to the existing class-based dark mode toggle:

```css
/* Shiki dual-theme token colours */
code[data-theme*=" "],
code[data-theme*=" "] span {
  color: var(--shiki-light);
}

.dark code[data-theme*=" "],
.dark code[data-theme*=" "] span {
  color: var(--shiki-dark);
}
```

**Where to insert**: After the existing `[data-rehype-pretty-code-figure] pre`
block (around line 60 in the current file).

**Verification**: Build the site and open a post with a code block.
Tokens should have colours. Switch to dark mode — colours should change.

---

## Step 2 — Add Line Numbers via CSS Counters

**File**: `src/styles/globals.css`

The `counter-reset: line` is already present on
`[data-rehype-pretty-code-figure] code`.
Add the `::before` pseudo-element to display the counter on each line:

```css
[data-rehype-pretty-code-figure] [data-line]::before {
  counter-increment: line;
  content: counter(line);
  display: inline-block;
  width: 1rem;
  margin-right: 1.5rem;
  text-align: right;
  color: hsl(0 0% 55%);
  user-select: none;
  font-variant-numeric: tabular-nums;
}
```

**Verification**: Line numbers appear to the left of each code line.
Selecting and copying code text does NOT include the line numbers.

---

## Step 3 — Create the `rehypeCopyButton` Build Plugin

**File**: `src/lib/rehype-copy-button.ts` (new file)

```typescript
import { visit } from 'unist-util-visit'
import type { Root, Element } from 'hast'

/**
 * Rehype plugin that appends a <button data-copy-btn> to every
 * <figure data-rehype-pretty-code-figure> element.
 * Must run AFTER rehype-pretty-code in the plugin chain.
 */
export function rehypeCopyButton() {
  return (tree: Root) => {
    visit(tree, 'element', (node: Element) => {
      if (
        node.tagName === 'figure' &&
        'dataRehypePrettyCodeFigure' in (node.properties ?? {})
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

**Dependencies**: `unist-util-visit` and `hast` are already transitive
dependencies of `rehype-pretty-code` — no new packages needed.

---

## Step 4 — Register the Plugin in Both Pipeline Locations

### 4a. `src/app/[year]/[month]/[day]/[slug]/page.tsx`

Find the `evaluate()` call and add `rehypeCopyButton` to `rehypePlugins`:

```typescript
import { rehypeCopyButton } from '@/lib/rehype-copy-button'

// ...

const { default: Content } = await evaluate(source, {
  format: 'md',
  remarkPlugins: [remarkGfm],
  rehypePlugins: [
    [rehypePrettyCode, prettyCodeOptions],
    rehypeCopyButton,           // ← add after rehype-pretty-code
  ],
  ...runtime,
})
```

### 4b. `next.config.mjs`

Find the `withMDX({ ... })` options block and add the plugin:

```javascript
import { rehypeCopyButton } from './src/lib/rehype-copy-button.js'

// ...

const withMDX = createMDX({
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      [rehypePrettyCode, prettyCodeOptions],
      rehypeCopyButton,         // ← add after rehype-pretty-code
    ],
  },
})
```

---

## Step 5 — Add Copy Button Styles

**File**: `src/styles/globals.css`

Style the copy button so it appears in the top-right corner of the code figure:

```css
/* Copy button */
[data-rehype-pretty-code-figure] {
  position: relative;
}

[data-copy-btn] {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  padding: 0.25rem 0.5rem;
  font-size: 0.7rem;
  line-height: 1;
  border-radius: 0.25rem;
  border: 1px solid hsl(0 0% 70%);
  background: transparent;
  color: hsl(0 0% 60%);
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.15s;
}

[data-rehype-pretty-code-figure]:hover [data-copy-btn] {
  opacity: 1;
}

[data-copy-btn][data-copied]::after {
  content: 'Copied!';
  position: absolute;
  right: calc(100% + 0.4rem);
  top: 50%;
  transform: translateY(-50%);
  white-space: nowrap;
  font-size: 0.7rem;
  color: hsl(142 70% 45%);
}
```

---

## Step 6 — Add Inline Clipboard Script to Layout

**File**: `src/app/layout.tsx`

Add a `<script>` tag inside the `<body>` that handles clipboard writes via event
delegation:

```tsx
<body>
  {/* existing dark mode script */}
  <script
    dangerouslySetInnerHTML={{
      __html: `
document.addEventListener('click',function(e){
  var btn=e.target.closest('[data-copy-btn]');
  if(!btn)return;
  var pre=btn.closest('[data-rehype-pretty-code-figure]').querySelector('pre');
  navigator.clipboard&&navigator.clipboard.writeText(pre.innerText).then(function(){
    btn.setAttribute('data-copied','');
    setTimeout(function(){btn.removeAttribute('data-copied');},2000);
  });
});
      `.trim(),
    }}
  />
  {/* rest of layout */}
</body>
```

**Note**: The script is minified inline to minimise page weight.
`navigator.clipboard` is guarded for HTTP contexts where the API is unavailable.

---

## Step 7 — Create the Content Audit Script

**File**: `scripts/audit-code-blocks.ts`

See `contracts/audit-script-output.md` for the full output schema.
The script MUST:

1. Read all `.mdx` files from `content/posts/` using `fs` + `path`
2. Strip frontmatter before analysis (use `gray-matter` — already installed)
3. Apply the four heuristics defined in the contract
4. Skip lines that are inside an already-fenced block
5. Output results per the `--json` / `--paths-only` / default modes
6. Exit 0 on success, exit 1 on script errors

**Run the audit**:

```bash
npx tsx scripts/audit-code-blocks.ts
```

---

## Step 8 — Manual Content Conversion

After running the audit script, review each flagged post and manually:

1. Open the MDX file in an editor
2. Identify the un-fenced code content
3. Wrap it in a fenced block with the correct language tag:

   ````markdown
   ```bash
   $ paket outdated --strict
   ```
   ````

4. Verify the post builds without errors
5. Check the rendered output in a browser

**Target posts** (from research.md Section 5.2):
- `checking-for-outdated-package-references-during-build-with-fake-paket.mdx`
- `how--not--to-upgrade-to-asp-net-core-2-0-just-yet-with-paket.mdx`
- `chutzpah-to-run-javascript-tests.mdx`
- `tips-for-running-visualstudio-2010-resharper-7-on-32-bit-windows.mdx`
- `for-the-record-how-to-run-nuget-exe-on-os-x-mountain-lion.mdx`

---

## Step 9 — Build and Verify

```bash
# Full static build
npm run build

# Spot-check (open in browser)
# Verify at least 5 code-heavy posts:
#   - Tokens are coloured (highlighting active)
#   - Line numbers appear in the gutter
#   - Copy button appears on hover
#   - Clicking copy places the code on clipboard (not the line numbers)
#   - Dark mode toggle changes token colours
#   - Build log shows zero errors
```

**Success criteria checklist** (from spec.md):

- [ ] SC-001: All code-heavy posts display highlighted blocks
- [ ] SC-002: WCAG AA contrast in light and dark themes
- [ ] SC-003: At least 10 distinct languages highlighted correctly
- [ ] SC-004: Zero build failures or rendering errors
- [ ] SC-005: No new client-side libraries; inline script only
- [ ] SC-006: Full build succeeds; 5+ posts spot-checked

---

## Implementation Order Summary

| Step | File(s) Changed | What |
|------|-----------------|------|
| 1 | `globals.css` | Dual-theme token CSS |
| 2 | `globals.css` | Line number counter CSS |
| 3 | `src/lib/rehype-copy-button.ts` | Build plugin (new file) |
| 4 | `page.tsx`, `next.config.mjs` | Register plugin in both pipeline paths |
| 5 | `globals.css` | Copy button styles |
| 6 | `src/app/layout.tsx` | Inline clipboard script |
| 7 | `scripts/audit-code-blocks.ts` | Audit script (new file) |
| 8 | `content/posts/*.mdx` | Manual content conversions (~5-8 posts) |
| 9 | — | Build and verify |

# Research: Fix Gist Embeds Not Rendering

**Date**: 2026-02-28  
**Feature**: [spec.md](./spec.md)  
**Phase**: 0 — Outline & Research

## Summary

All 8 gist URLs are public and were successfully retrieved via the GitHub Gist API.
No clarifications remain unresolved.
No new dependencies are required.
The fix is a purely manual content edit to 5 post files.

---

## Gist Inventory

All gist content is recorded here as the single source of truth for Phase 1 implementation.
Language tags for fenced code blocks are derived from the `language` field returned by the API.

### Gist 1 — `4538958`

- **Post**: `blanket-js-qunit-and-ie8-please-die-now.mdx`
- **URL**: `https://gist.github.com/4538958`
- **Files**: 1 (`gistfile1.html`)
- **Language**: HTML → fence tag: `html`
- **Status**: Retrieved ✅

```html
<!--[if gt IE 8]><!-->\n
<script type="text/javascript" src="blanket.js"></script>
\n<!--<![endif]-->
```

### Gist 2 — `4539327`

- **Post**: `blanket-js-qunit-and-ie8-please-die-now.mdx`
- **URL**: `https://gist.github.com/4539327`
- **Files**: 1 (`blanket.diff`)
- **Language**: Diff → fence tag: `diff`
- **Status**: Retrieved ✅

### Gist 3 — `4539471`

- **Post**: `blanket-js-qunit-and-ie8-please-die-now.mdx`
- **URL**: `https://gist.github.com/4539471`
- **Files**: 1 (`gistfile1.html`)
- **Language**: HTML → fence tag: `html`
- **Status**: Retrieved ✅

```html
<!-- saved from url=(0016)http://localhost -->
```

### Gist 4 — `4079379`

- **Post**: `fun-with-castle-dynamicproxy.mdx`
- **URL**: `https://gist.github.com/4079379`
- **Files**: 1 (`Validation.cs`)
- **Language**: C# → fence tag: `csharp`
- **Status**: Retrieved ✅

### Gist 5 — `4079245`

- **Post**: `fun-with-castle-dynamicproxy.mdx`
- **URL**: `https://gist.github.com/4079245`
- **Files**: 1 (`ValidationListenerExtensions.cs`)
- **Language**: C# → fence tag: `csharp`
- **Status**: Retrieved ✅

### Gist 6 — `4109938`

- **Post**: `fun-with-castle-dynamicproxy-part-ii.mdx`
- **URL**: `https://gist.github.com/4109938`
- **Files**: 1 (`CloseConnectionInterceptor.cs`)
- **Language**: C# → fence tag: `csharp`
- **Status**: Retrieved ✅

### Gist 7 — `4079035`

- **Post**: `explaining-sqlite-foreign-keys-support-with-unit-tests.mdx`
- **URL**: `https://gist.github.com/4079035`
- **Files**: 1 (`SQLiteForeignKeysTests.cs`)
- **Language**: C# → fence tag: `csharp`
- **Status**: Retrieved ✅

### Gist 8 — `orient-man/7804310`

- **Post**: `how-to-put-your-toe-into-asp-net-mvc-integration-testing.mdx`
- **URL**: `https://gist.github.com/orient-man/7804310`
- **Files**: 1 (`SmokeTests.cs`)
- **Language**: C# → fence tag: `csharp`
- **Status**: Retrieved ✅

---

## Decision Record

### DR-001: Language Tags

- **Decision**: Use the language tag returned by the GitHub Gist API, mapped to the
  canonical Shiki/rehype-pretty-code language identifier.
- **Rationale**: API metadata is authoritative; it matches the file extension used
  when the gist was created. Shiki supports all identified languages (`html`, `diff`,
  `csharp`).
- **Mapping used**:

  | API `language` | Fence tag |
  | -------------- | --------- |
  | `HTML`         | `html`    |
  | `Diff`         | `diff`    |
  | `C#`           | `csharp`  |

### DR-002: Single-File Gists Only

- **Decision**: All 8 gists contain exactly one file each. The multi-file rule
  (FR-008) does not apply to any of the identified gists, but is documented in
  the spec for completeness.
- **Rationale**: Confirmed by API response — each gist returned one `files` entry.

### DR-003: Attribution Link Placement

- **Decision**: Place `[View on GitHub](url)` on a new line immediately after the
  closing fence of each code block, separated by one blank line.
- **Rationale**: Consistent with Markdown conventions; the blank line prevents the
  link from being parsed as part of the code block by some renderers.
- **Alternatives considered**: Inline text after the code block — rejected because
  it would attach the link to surrounding prose rather than to the code block itself.

### DR-004: Bare URL Replacement Pattern

- **Decision**: Replace the bare URL token (e.g., `https://gist.github.com/4538958`)
  with the fenced code block + attribution link, preserving all surrounding prose.
- **Rationale**: The bare URL appears mid-sentence in most posts. Removing only the
  URL and inserting the block+link after the preceding sentence preserves the
  authorial voice.
- **Scope check**: The post
  `checking-for-outdated-package-references-during-build-with-fake-paket.mdx`
  contains a gist URL inside a Markdown link (`[Gist](url)`). This URL is NOT in
  the list of 8 bare URLs and MUST NOT be modified (FR-003).

---

## Rendering Pipeline Verification

- **Decision**: No changes to the rendering pipeline are required.
- **Rationale**: The existing `rehype-pretty-code` (Shiki) pipeline already handles
  fenced code blocks with language tags for `html`, `diff`, and `csharp`.
  All post files use `format: 'md'` compilation mode, which processes standard
  Markdown fenced code blocks. Pasting content as fenced blocks is sufficient.
- **Verified**: `next.config.mjs` and `src/` components were inspected; no custom
  gist-embed handling exists that could interfere with the pasted blocks.

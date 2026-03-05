# Data Model: Fix Gist Embeds Not Rendering

**Date**: 2026-02-28  
**Feature**: [spec.md](./spec.md)  
**Phase**: 1 — Design & Contracts

## Overview

This feature has no application data model — it is a pure content transformation.
The "entities" documented here are the content objects that must be identified,
retrieved, and transformed in the 5 affected post files.

---

## Entity: GistReference

A `GistReference` is a bare gist URL appearing in a post file as plain text
(not inside Markdown link syntax).

| Field      | Type    | Description                                                                           |
| ---------- | ------- | ------------------------------------------------------------------------------------- |
| `url`      | string  | Full URL: `https://gist.github.com/{id}` or `https://gist.github.com/{username}/{id}` |
| `gistId`   | string  | Numeric ID portion of the URL                                                         |
| `username` | string? | Optional username prefix (e.g., `orient-man`)                                         |
| `postFile` | string  | Path relative to repo root: `content/posts/*.mdx`                                     |
| `format`   | enum    | `short` (numeric-only) \| `prefixed` (username/id)                                    |

**Validation rules**:

- A `GistReference` MUST NOT appear inside Markdown link syntax `[text](url)`.
- A `GistReference` MUST match the regex: `https://gist\.github\.com/(?:[a-z0-9_-]+/)?[0-9a-f]+`
  appearing as a standalone token (not embedded in a link).

---

## Entity: GistFile

A `GistFile` is one source code file contained within a gist.

| Field      | Type   | Description                                         |
| ---------- | ------ | --------------------------------------------------- |
| `filename` | string | Original filename as stored in the gist             |
| `language` | string | Language as reported by the GitHub Gist API         |
| `fenceTag` | string | Shiki language identifier for the fenced code block |
| `content`  | string | Raw source code content                             |

---

## Entity: InlinedCodeBlock

The Markdown artifact that replaces a `GistReference` in a post file.

| Field             | Type          | Description                                           |
| ----------------- | ------------- | ----------------------------------------------------- |
| `gistReference`   | GistReference | The original reference being replaced                 |
| `files`           | GistFile[]    | One or more files (all files from the gist, in order) |
| `attributionLink` | string        | Markdown link: `[View on GitHub](url)`                |

**Rendered form** (single-file gist):

````text
```{fenceTag}
{content}
```

[View on GitHub]({url})
````

**Rendered form** (multi-file gist — not applicable to any known instance, but specified):

````text
**`{filename1}`**

```{fenceTag1}
{content1}
```

**`{filename2}`**

```{fenceTag2}
{content2}
```

[View on GitHub]({url})
````

---

## Complete Replacement Inventory

All 8 replacements required. Listed in the order they should be applied per file.

### `content/posts/blanket-js-qunit-and-ie8-please-die-now.mdx`

| #   | Gist URL                          | Filename         | Language | Fence Tag |
| --- | --------------------------------- | ---------------- | -------- | --------- |
| 1   | `https://gist.github.com/4538958` | `gistfile1.html` | HTML     | `html`    |
| 2   | `https://gist.github.com/4539327` | `blanket.diff`   | Diff     | `diff`    |
| 3   | `https://gist.github.com/4539471` | `gistfile1.html` | HTML     | `html`    |

### `content/posts/fun-with-castle-dynamicproxy.mdx`

| #   | Gist URL                          | Filename                          | Language | Fence Tag |
| --- | --------------------------------- | --------------------------------- | -------- | --------- |
| 4   | `https://gist.github.com/4079379` | `Validation.cs`                   | C#       | `csharp`  |
| 5   | `https://gist.github.com/4079245` | `ValidationListenerExtensions.cs` | C#       | `csharp`  |

### `content/posts/fun-with-castle-dynamicproxy-part-ii.mdx`

| #   | Gist URL                          | Filename                        | Language | Fence Tag |
| --- | --------------------------------- | ------------------------------- | -------- | --------- |
| 6   | `https://gist.github.com/4109938` | `CloseConnectionInterceptor.cs` | C#       | `csharp`  |

### `content/posts/explaining-sqlite-foreign-keys-support-with-unit-tests.mdx`

| #   | Gist URL                          | Filename                    | Language | Fence Tag |
| --- | --------------------------------- | --------------------------- | -------- | --------- |
| 7   | `https://gist.github.com/4079035` | `SQLiteForeignKeysTests.cs` | C#       | `csharp`  |

### `content/posts/how-to-put-your-toe-into-asp-net-mvc-integration-testing.mdx`

| #   | Gist URL                                     | Filename        | Language | Fence Tag |
| --- | -------------------------------------------- | --------------- | -------- | --------- |
| 8   | `https://gist.github.com/orient-man/7804310` | `SmokeTests.cs` | C#       | `csharp`  |

---

## Out-of-Scope Reference (MUST NOT be modified)

| Post                                                                        | URL                                                                   | Context                            | Action        |
| --------------------------------------------------------------------------- | --------------------------------------------------------------------- | ---------------------------------- | ------------- |
| `checking-for-outdated-package-references-during-build-with-fake-paket.mdx` | `https://gist.github.com/orient-man/c29c299ed970fd097f80124ffde734ce` | Inside Markdown link `[Gist](url)` | **No change** |

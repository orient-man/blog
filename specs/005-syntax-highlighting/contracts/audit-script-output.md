# Contract: Audit Script Output Format

**Feature**: 005-syntax-highlighting  
**Phase**: 1 — Design  
**Date**: 2026-03-01

## Overview

`scripts/audit-code-blocks.ts` is a read-only diagnostic tool.
It reads all MDX posts and outputs a structured report identifying posts that
likely contain un-fenced code content requiring manual conversion.

This contract defines the script's interface: CLI flags, exit codes, and output
schema (both JSON and human-readable formats).

---

## CLI Interface

```
Usage: npx tsx scripts/audit-code-blocks.ts [OPTIONS]

Options:
  --json          Output machine-readable JSON to stdout
  --paths-only    Output only the file paths of flagged posts, one per line
  --help, -h      Print this usage message

Exit codes:
  0   Script ran successfully (flagged posts may or may not exist)
  1   Script error (unreadable files, unexpected exception)
```

**Note**: A non-zero exit code indicates a script failure, not the presence of
flagged posts. Finding flagged posts is a normal outcome and exits with 0.

---

## JSON Output Schema

When `--json` is passed, stdout contains a single JSON object:

```json
{
  "generatedAt": "2026-03-01T10:00:00.000Z",
  "totalPosts": 33,
  "flaggedCount": 5,
  "posts": [
    {
      "filePath": "content/posts/2013-04-12-checking-for-outdated-package-references.mdx",
      "slug": "checking-for-outdated-package-references",
      "flagged": true,
      "existingFencedBlocks": 0,
      "heuristics": [
        {
          "type": "shell-command",
          "lineNumber": 42,
          "excerpt": "$ paket outdated --strict"
        },
        {
          "type": "indented-block",
          "lineNumber": 58,
          "excerpt": "    <ItemGroup>"
        }
      ]
    }
  ]
}
```

### Top-Level Fields

| Field          | Type                | Description                                                       |
| -------------- | ------------------- | ----------------------------------------------------------------- |
| `generatedAt`  | ISO 8601 string     | UTC timestamp of script execution                                 |
| `totalPosts`   | number              | Total MDX files scanned                                           |
| `flaggedCount` | number              | Number of posts where `flagged === true`                          |
| `posts`        | `PostAuditResult[]` | One entry per **flagged** post only (unflagged posts are omitted) |

### `PostAuditResult`

| Field                  | Type          | Description                                                |
| ---------------------- | ------------- | ---------------------------------------------------------- |
| `filePath`             | string        | Path relative to repository root                           |
| `slug`                 | string        | Post slug (derived from filename)                          |
| `flagged`              | boolean       | Always `true` in this array (unflagged posts are excluded) |
| `existingFencedBlocks` | number        | Count of fenced code blocks already present                |
| `heuristics`           | `Heuristic[]` | One entry per detected pattern instance                    |

### `Heuristic`

| Field        | Type        | Description                                     |
| ------------ | ----------- | ----------------------------------------------- |
| `type`       | string enum | See heuristic types below                       |
| `lineNumber` | number      | 1-based line number in the MDX file             |
| `excerpt`    | string      | Up to 80 characters of the flagged line content |

### Heuristic Types

| Type               | Detection Rule                                                                                                                       |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------ |
| `shell-command`    | Line (trimmed) starts with `$`, `>`, or a known CLI prefix (`npm`, `npx`, `paket`, `nuget`, `mono`, `dotnet`, `git`, `curl`, `wget`) |
| `indented-block`   | Line starts with 4+ spaces or a tab, outside of an existing fenced block, and is not front matter                                    |
| `long-inline-code` | Inline backtick span (`` `…` ``) whose content exceeds 30 characters                                                                 |
| `raw-xml-html`     | Line contains an XML/HTML tag pattern (`<[A-Za-z]`) outside of a fenced block and not inside an MDX JSX expression                   |

---

## Human-Readable Output (default, no flags)

When run without `--json`, the script prints a summary table to stdout:

```
Audit: Code Block Coverage
==========================
Scanned:  33 posts
Flagged:   5 posts requiring review

FLAGGED POSTS:
  content/posts/2013-04-12-checking-for-outdated-package-references.mdx
    Line  42  [shell-command]  $ paket outdated --strict
    Line  58  [indented-block] <ItemGroup>

  content/posts/2012-11-03-how-not-to-upgrade-to-asp-net-core.mdx
    Line  15  [shell-command]  $ paket update
    ...

Run with --json for machine-readable output.
```

---

## Constraints

- The script MUST be read-only — it MUST NOT modify any MDX files
- The script MUST complete in under 5 seconds for 33 posts
- The script MUST print errors to stderr and exit with code 1 on failure
- The script MUST NOT require a running Next.js dev server
- Output to stdout MUST be clean (no progress/log noise when `--json` is used)

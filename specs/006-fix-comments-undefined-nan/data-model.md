# Data Model: Fix Comments Showing "undefined NaN, NaN"

**Feature**: 006-fix-comments-undefined-nan
**Phase**: 1 — Design
**Date**: 2026-03-01

## Overview

This feature is a pure bug fix with no new data structures or storage.
The "data model" describes the `Comment` entity, the normalization contract
introduced by this fix, and the before/after transformation pipeline.

---

## Entities

### 1. `Comment`

Represents a single historical WordPress comment associated with a blog post.

| Field       | Type (after fix)                        | Source                                    | Notes                                                                                                   |
| ----------- | --------------------------------------- | ----------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `author`    | `string`                                | YAML frontmatter                          | Display name of the comment author                                                                      |
| `date`      | `string` — ISO 8601 date (`YYYY-MM-DD`) | YAML frontmatter, normalized at load time | **Before fix**: could be a `Date` object from gray-matter. **After fix**: always a `YYYY-MM-DD` string. |
| `content`   | `string`                                | YAML frontmatter                          | Comment body; may contain simple HTML entities                                                          |
| `avatarUrl` | `string \| undefined`                   | YAML frontmatter                          | Optional avatar URL; not present in existing data                                                       |

**Invariants (after fix)**:

- `date` MUST be a `string` by the time it leaves `loadPosts()` in `content.ts`
- `date` SHOULD match the pattern `/^\d{4}-\d{2}-\d{2}$/` for all valid comments
- `date` MAY be an empty string `""` for comments with missing/malformed frontmatter dates; the renderer MUST display "Unknown date" in this case
- `author` and `content` are passed through unchanged

---

### 2. `Post` (partial — comments field only)

The `Post` entity is unchanged by this fix.
The `comments` field type is already correctly declared as `Comment[] | undefined`.
This fix enforces the `Comment.date` contract at load time.

```typescript
// src/lib/types.ts — unchanged
export interface Comment {
  author: string;
  date: string; // ISO 8601 date string — NOW GUARANTEED at load time
  content: string;
  avatarUrl?: string;
}
```

---

## Normalization Contract

The normalization introduced by this fix establishes a clear contract boundary:

```
BOUNDARY: loadPosts() in src/lib/content.ts
  INPUT:  comment.date may be a Date object (gray-matter output)
  OUTPUT: comment.date is always a string (YYYY-MM-DD or "")
```

All consumers of `Comment` data (rendering components, future features) may rely
on `comment.date` being a `string`. No consumer needs to handle `Date` objects.

---

## Data Transformation Pipeline

### Before Fix

```
YAML frontmatter (date: 2013-09-25)
        │
        ▼ gray-matter
        │  comment.date = Date object  ← gray-matter auto-converts bare dates
        │
        ▼ content.ts:66
        │  comments: data.comments ?? undefined  ← NO normalization
        │  comment.date is still a Date object
        │
        ▼ Comment.tsx:41
        │  String(comment.date)  ← produces locale string
        │  e.g. "Wed Sep 25 2013 02:00:00 GMT+0200 ..."
        │
        ▼ formatDate()
        │  new Date("Wed Sep 25 2013...T00:00:00Z")  ← Invalid Date
        │
        ▼ Output: "undefined NaN, NaN"  ← BUG
```

### After Fix

```
YAML frontmatter (date: 2013-09-25)
        │
        ▼ gray-matter
        │  comment.date = Date object
        │
        ▼ content.ts (normalized mapping)
        │  c.date instanceof Date → c.date.toISOString().slice(0, 10)
        │  comment.date = "2013-09-25"  ← normalized string
        │
        ▼ Comment.tsx
        │  safeDateDisplay("2013-09-25")
        │  → { dateTime: "2013-09-25", label: "September 25, 2013" }
        │
        ▼ formatDate("2013-09-25")
        │  new Date("2013-09-25T00:00:00Z")  ← Valid Date
        │
        ▼ Output: "September 25, 2013"  ← CORRECT
```

### Fallback Path (empty/malformed date)

```
YAML frontmatter (date: "" or date: not-a-date)
        │
        ▼ content.ts (normalized mapping)
        │  String("") = "" OR String("not-a-date") = "not-a-date"
        │  comment.date = "" or "not-a-date"
        │
        ▼ Comment.tsx safeDateDisplay()
        │  if (!dateStr) → { dateTime: '', label: 'Unknown date' }
        │  if (isNaN(d.getTime())) → { dateTime: dateStr, label: 'Unknown date' }
        │
        ▼ Output: "Unknown date"  ← GRACEFUL FALLBACK
```

---

## File Relationships

```
content/posts/*.mdx
    └── parsed by → gray-matter (YAML date → Date object)
    └── normalized by → src/lib/content.ts (Date → "YYYY-MM-DD" string)
    └── rendered by → src/components/Comment.tsx (string → human-readable label)
                          └── uses → src/lib/utils.ts formatDate()

src/lib/types.ts
    └── defines Comment interface (date: string — contract enforced by content.ts)
```

---

## What Does NOT Change

| Item                                          | Status                                                  |
| --------------------------------------------- | ------------------------------------------------------- |
| `src/lib/types.ts` — `Comment` interface      | Unchanged — `date: string` was already correct          |
| `src/lib/utils.ts` — `formatDate()`           | Unchanged — works correctly for valid ISO strings       |
| `src/lib/types.ts` — `Post` interface         | Unchanged                                               |
| `src/components/CommentList.tsx`              | Unchanged — just renders a list of `Comment` components |
| `content/posts/*.mdx`                         | Unchanged — FR-007 prohibits modifying source files     |
| Post-level date normalization in `content.ts` | Unchanged — FR-006 prohibits altering it                |

# Quickstart: Fix Comments Showing "undefined NaN, NaN"

**Feature**: 006-fix-comments-undefined-nan
**Phase**: 1 — Design
**Date**: 2026-03-01
**Audience**: Implementing agent / developer

This guide provides a step-by-step implementation sequence.
The fix requires changes to exactly 2 files and introduces zero new dependencies.

---

## Prerequisites

```bash
# Verify the feature branch
git branch --show-current
# Expected: 006-fix-comments-undefined-nan

# Verify the project builds cleanly before starting
npm run build
# Note the current error (or broken comment dates) as a baseline
```

---

## Step 1 — Normalize Comment Dates at Load Time

**File**: `src/lib/content.ts`

**What**: Replace the pass-through assignment at line 66 with a mapping that
normalizes each comment's `date` field, using the same `instanceof Date` pattern
already applied to the post-level date (lines 56–58).

**Current code (line 66)**:

```typescript
comments: data.comments ?? undefined,
```

**Replace with**:

```typescript
comments: Array.isArray(data.comments)
  ? data.comments.map((c: Record<string, unknown>) => ({
      ...c,
      date: c.date instanceof Date
        ? c.date.toISOString().slice(0, 10)
        : String(c.date ?? ''),
    }))
  : undefined,
```

**Why `Array.isArray` guard**: `data.comments` is typed as `unknown`.
The guard ensures we only map when it is actually an array, which also handles
posts that have no `comments:` key at all (they continue to return `undefined`).

**Why spread then overwrite**: `...c` preserves `author`, `content`, and `avatarUrl`
unchanged. Only `date` is rewritten.

**Verification**: After this change, `comment.date` will be a `"YYYY-MM-DD"` string
for all 16 existing comments. The post-level date normalization on lines 56–58
is untouched.

---

## Step 2 — Add Graceful Fallback in the Comment Renderer

**File**: `src/components/Comment.tsx`

**What**: Remove the now-redundant `typeof` guards and add a helper that returns
"Unknown date" for empty or unparseable date strings.

**Current code (lines 38–42)**:

```tsx
<time
  dateTime={
    typeof comment.date === "string" ? comment.date : String(comment.date)
  }
  className="text-xs text-gray-400 dark:text-gray-500"
>
  {formatDate(
    typeof comment.date === "string" ? comment.date : String(comment.date),
  )}
</time>
```

**Replace with** (add helper before the component return, use it in JSX):

```tsx
// Add near the top of the component function, before the return statement:
function safeDateDisplay(dateStr: string): { dateTime: string; label: string } {
  if (!dateStr) return { dateTime: "", label: "Unknown date" };
  const d = new Date(dateStr + "T00:00:00Z");
  if (isNaN(d.getTime())) return { dateTime: dateStr, label: "Unknown date" };
  return { dateTime: dateStr, label: formatDate(dateStr) };
}

const { dateTime, label } = safeDateDisplay(comment.date);
```

```tsx
// Replace the <time> element:
<time dateTime={dateTime} className="text-xs text-gray-400 dark:text-gray-500">
  {label}
</time>
```

**Why a helper function**: Keeps the JSX clean. Avoids duplicating the validation
logic across `dateTime` and the display label. Makes the fallback path explicit
and easy to test mentally.

**Note**: The `safeDateDisplay` helper can be defined as a plain function inside
the component body, or extracted to `src/lib/utils.ts` if reuse is anticipated.
For this fix, inline is sufficient.

---

## Step 3 — Build and Verify

```bash
# Full static build — must complete with zero errors
npm run build

# Serve the output locally
npx serve out
```

**Manual verification checklist**:

1. Open any of the 9 posts with comments (e.g., the post with the most comments).
2. Scroll to the comments section.
3. Verify each comment shows a date like "September 25, 2013" — not "undefined NaN, NaN".
4. Check the `<time>` element's `datetime` attribute in browser DevTools — must be "2013-09-25" (ISO 8601).
5. Switch between light and dark modes — comment dates should remain readable in both.
6. Verify post-level dates in the article header are unchanged and still display correctly.

**Success criteria** (from spec.md):

- [ ] SC-001: All comments across all 9 posts show correctly formatted dates; zero instances of "undefined", "NaN", or blank date text
- [ ] SC-002: Build succeeds with no errors or warnings related to comment date parsing
- [ ] SC-003: A comment with a deliberately missing or malformed date (test manually by editing a post temporarily) shows "Unknown date" and the build still succeeds
- [ ] SC-004: The `<time>` `datetime` attribute contains a valid ISO 8601 date string for every comment with a valid date

---

## Implementation Summary

| Step | File                         | Change                                                                                |
| ---- | ---------------------------- | ------------------------------------------------------------------------------------- |
| 1    | `src/lib/content.ts:66`      | Normalize `data.comments` — map each comment's `date` through `instanceof Date` check |
| 2    | `src/components/Comment.tsx` | Add `safeDateDisplay()` helper; remove `typeof` guards; add "Unknown date" fallback   |
| 3    | —                            | Build and verify manually                                                             |

**Total**: 2 files changed, 0 new dependencies, 0 new files.

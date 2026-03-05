# Research: Fix Comments Showing "undefined NaN, NaN"

**Feature**: 006-fix-comments-undefined-nan
**Phase**: 0 — Discovery
**Date**: 2026-03-01

## 1. Root Cause Analysis

### 1.1 The Bug

All 9 posts with historical WordPress comments display comment dates as
"undefined NaN, NaN" instead of a human-readable date like "September 25, 2013".

### 1.2 Data Flow Trace

```
content/posts/*.mdx  (frontmatter contains comments[].date: 2013-09-25)
        │
        ▼ gray-matter (YAML parser)
        │  → bare date values (YYYY-MM-DD) in YAML are parsed as JavaScript Date objects
        │  → data.comments[0].date is a Date object, not a string
        │
        ▼ src/lib/content.ts:66
        │  post.comments = data.comments ?? undefined
        │  → Date objects pass through WITHOUT normalization
        │  → post-level date IS normalized (line 56-58), comments are NOT
        │
        ▼ src/components/Comment.tsx:38,41
        │  typeof comment.date === 'string' ? comment.date : String(comment.date)
        │  → typeof Date === 'object', so String(comment.date) is called
        │  → String(new Date('2013-09-25')) → "Wed Sep 25 2013 02:00:00 GMT+0200 ..."
        │  → This is NOT a valid ISO 8601 date string
        │
        ▼ src/lib/utils.ts:15
        │  new Date("Wed Sep 25 2013 02:00:00 GMT+0200 ..." + 'T00:00:00Z')
        │  → "Wed Sep 25 2013 02:00:00 GMT+0200 ...T00:00:00Z" is not parseable
        │  → new Date() returns Invalid Date
        │
        ▼ src/lib/utils.ts:16
           MONTH_NAMES[NaN]  → undefined
           d.getUTCDate()    → NaN
           d.getUTCFullYear()→ NaN
           result: "undefined NaN, NaN"  ← THE BUG
```

### 1.3 Why Post-Level Dates Work

`src/lib/content.ts` lines 56–58 already apply the correct normalization for the
top-level post date:

```typescript
date: data.date instanceof Date
  ? data.date.toISOString().slice(0, 10)
  : String(data.date ?? '1970-01-01'),
```

This converts `Date` objects to `"YYYY-MM-DD"` strings before they reach the renderer.
Comment dates at line 66 receive no such treatment.

### 1.4 Confirmation

Root cause confirmed by Node.js REPL verification:

```javascript
// gray-matter converts bare YAML dates to Date objects
const d = new Date('2013-09-25')  // → Wed Sep 25 2013 02:00:00 GMT+0200

// String() on a Date object produces a locale string, NOT ISO 8601
String(d)  // → "Wed Sep 25 2013 02:00:00 GMT+0200 (Central European Summer Time)"

// formatDate appends T00:00:00Z to this garbage
new Date(String(d) + 'T00:00:00Z')  // → Invalid Date

// MONTH_NAMES[NaN] === undefined
// Invalid Date getters return NaN
// Result: "undefined NaN, NaN"
```

## 2. Affected Scope

### 2.1 Posts with Comments

9 posts have `comments:` arrays in their frontmatter.
All 16 total comment entries have `date` values in `YYYY-MM-DD` format,
which gray-matter unconditionally converts to `Date` objects.
All 16 are affected by this bug.

### 2.2 Files Involved

| File | Role | Action Required |
|------|------|----------------|
| `src/lib/content.ts` | Data loading — converts frontmatter to typed `Post` objects | Normalize comment dates at line 66 |
| `src/components/Comment.tsx` | Rendering — displays a single comment | Remove redundant `typeof` guards; add Invalid Date fallback |
| `src/lib/utils.ts` | `formatDate()` utility | No change needed — works correctly when given a valid ISO string |
| `src/lib/types.ts` | `Comment` interface | No change needed — `date: string` is already correct |

## 3. Fix Strategy

### 3.1 Primary Fix: Normalize at Load Time (content.ts)

The correct architectural fix is to normalize comment dates in `loadPosts()`,
immediately after `gray-matter` parses the frontmatter.
This follows the existing pattern for post-level dates and ensures all downstream
consumers receive a guaranteed `string` in `YYYY-MM-DD` format.

**Change at `src/lib/content.ts:66`**:

```typescript
// BEFORE:
comments: data.comments ?? undefined,

// AFTER:
comments: Array.isArray(data.comments)
  ? data.comments.map((c: Record<string, unknown>) => ({
      ...c,
      date: c.date instanceof Date
        ? c.date.toISOString().slice(0, 10)
        : String(c.date ?? ''),
    }))
  : undefined,
```

This spreads the original comment object and overwrites only the `date` field,
preserving `author`, `content`, and `avatarUrl` unchanged.

### 3.2 Secondary Fix: Defensive Rendering (Comment.tsx)

With the primary fix in place, `comment.date` will always be a string when it
reaches the renderer. The existing `typeof` guards become unnecessary.
Additionally, a graceful fallback handles the edge case where the string is
empty or unparseable (satisfying FR-004 and US2).

**Change at `src/components/Comment.tsx`**:

```typescript
// BEFORE (lines 38-42):
<time
  dateTime={typeof comment.date === 'string' ? comment.date : String(comment.date)}
  ...
>
  {formatDate(typeof comment.date === 'string' ? comment.date : String(comment.date))}
</time>

// AFTER:
// Helper to safely format a date string
function safeDateDisplay(dateStr: string): { dateTime: string; label: string } {
  if (!dateStr) return { dateTime: '', label: 'Unknown date' };
  const d = new Date(dateStr + 'T00:00:00Z');
  if (isNaN(d.getTime())) return { dateTime: dateStr, label: 'Unknown date' };
  return { dateTime: dateStr, label: formatDate(dateStr) };
}

// Usage:
const { dateTime, label } = safeDateDisplay(comment.date);
<time dateTime={dateTime} ...>{label}</time>
```

### 3.3 Why Fix at Both Layers

- **Load time** (content.ts): Ensures the `Comment` type contract (`date: string`)
  is upheld for all consumers, present and future. Prevents the bug from
  reappearing if a new renderer is added.
- **Render time** (Comment.tsx): Provides defensive fallback for empty or
  non-parseable strings (future-proofing per FR-004). Cleans up dead code
  (`typeof` guards that are only needed because the load-time fix was missing).

## 4. Alternatives Considered

| Approach | Verdict | Reason |
|----------|---------|--------|
| Fix only in `Comment.tsx` (parse the Date object at render time) | Rejected | Violates the type contract; `comment.date` type is `string`; upstream fix is cleaner |
| Fix only in `content.ts` | Acceptable minimum | Satisfies FR-001 to FR-003, FR-005 to FR-007; does not satisfy FR-004 (fallback) |
| Fix in `formatDate()` (detect `Date` objects) | Rejected | `formatDate` takes a `string` parameter; changing its signature widens scope unnecessarily |
| Add a new utility function | Rejected | Overkill; the fix is small enough to inline in the two affected files |

## 5. Risk Register

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Spread operator drops unknown comment fields | Low | Low | Explicit `...c` preserves all fields; only `date` is overwritten |
| `toISOString().slice(0, 10)` changes timezone for edge-case dates | Very Low | Low | All existing comment dates are mid-year (no DST boundary issues); UTC-normalized |
| Post-level date normalization accidentally touched | None | High | Primary fix is scoped to `data.comments` mapping only; post date lines are unchanged |
| `Invalid Date` from future malformed frontmatter causes build error | Resolved | High | Graceful fallback in Comment.tsx returns "Unknown date" rather than crashing |

## 6. Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Where to apply primary fix | `content.ts` (load time) | Consistent with existing post-level normalization; single source of truth |
| Where to add fallback | `Comment.tsx` (render time) | Defensive; covers edge cases not possible to produce from current data |
| New dependencies | None | Reuses existing `instanceof Date` → `toISOString()` pattern already in codebase |
| Modify MDX source files | No | FR-007 explicitly prohibits this |
| Modify `formatDate()` | No | Its interface is correct; callers must pass valid ISO strings |

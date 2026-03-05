# Tasks: Fix Comments Showing "undefined NaN, NaN"

**Input**: Design documents from `/specs/006-fix-comments-undefined-nan/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Tests**: Not requested — no test tasks generated.
Verification is manual: build the site and inspect comment dates in a browser.

**Organization**: Tasks grouped by user story.
US1 (fix dates) and US2 (graceful fallback) are implemented together in the same
2-file change — US2 hardening is added incrementally on top of US1.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to

---

## Phase 1: Setup

**Purpose**: Verify working environment before touching source files.

- [ ] T001 Confirm feature branch is `006-fix-comments-undefined-nan` (`git branch --show-current`)
- [ ] T002 [P] Confirm project builds cleanly before changes (`npm run build`)

**Checkpoint**: Branch confirmed, baseline build status known.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: No shared infrastructure required — this fix has no foundational
prerequisites beyond a clean build. This phase is intentionally empty.

_All user story work may begin immediately after Phase 1._

---

## Phase 3: User Story 1 — Comment Dates Display Correctly (Priority: P1) 🎯 MVP

**Goal**: All 16 comment date values across the 9 affected posts render as
"Month Day, Year" (e.g., "September 25, 2013") instead of "undefined NaN, NaN".

**Independent Test**: Visit any post with comments (e.g., open the built site
with `npx serve out` after `npm run build`). Every comment should show a
human-readable date. Zero instances of "undefined", "NaN", or blank date text.

### Implementation for User Story 1

- [ ] T003 [US1] Normalize comment dates at load time in `src/lib/content.ts` — replace the pass-through `comments: data.comments ?? undefined` on line 66 with a mapping that applies `instanceof Date → toISOString().slice(0, 10)` to each comment's `date` field (see quickstart.md Step 1 for exact code)
- [ ] T004 [US1] Run `npm run build` and verify zero build errors related to comment date parsing

**Checkpoint**: US1 complete — all existing comment dates display correctly.

---

## Phase 4: User Story 2 — Graceful Handling of Malformed Comment Dates (Priority: P2)

**Goal**: Comments with missing, empty, or unparseable date values render
"Unknown date" as a fallback rather than crashing or showing broken text.
The build completes successfully regardless of malformed date data.

**Independent Test**: Temporarily edit one comment in a post's frontmatter to
have a missing or invalid date (e.g., `date: "not-a-date"`). Run `npm run build`
— build must succeed. Open the post — the comment must show "Unknown date"
rather than "undefined NaN, NaN" or a blank.

### Implementation for User Story 2

- [ ] T005 [US2] Add `safeDateDisplay()` helper and update the `<time>` element in `src/components/Comment.tsx` — remove the redundant `typeof` guards, add Invalid Date detection, return `{ dateTime: '', label: 'Unknown date' }` for empty/unparseable dates (see quickstart.md Step 2 for exact code)
- [ ] T006 [US2] Run `npm run build` and verify the build still succeeds
- [ ] T007 [US2] Manually test malformed-date fallback: temporarily set a comment date to `""` or `"not-a-date"` in any post's frontmatter, build, verify "Unknown date" is shown, then restore the original value

**Checkpoint**: US2 complete — malformed dates are handled gracefully.

---

## Phase 5: Polish & Verification

**Purpose**: Full end-to-end verification against all success criteria.

- [ ] T008 Run full build and serve locally (`npm run build && npx serve out`)
- [ ] T009 [P] Verify SC-001: visit all 9 posts with comments; confirm every comment date shows "Month Day, Year" format — zero instances of "undefined", "NaN", or blank
- [ ] T010 [P] Verify SC-004: inspect `<time datetime="...">` attribute in browser DevTools on at least 3 comments; confirm valid ISO 8601 string (e.g., `"2013-09-25"`)
- [ ] T011 Verify SC-006: confirm post-level dates in article headers are unchanged and still display correctly (FR-006 guard)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Empty — no blocking work
- **US1 (Phase 3)**: Depends on Phase 1 only; 1 task
- **US2 (Phase 4)**: Depends on Phase 3 (builds on the normalized `date: string` established by T003)
- **Polish (Phase 5)**: Depends on Phases 3 and 4 being complete

### User Story Dependencies

- **US1 (P1)**: Independent — can start after Phase 1
- **US2 (P2)**: Depends on US1 (the `safeDateDisplay` helper in `Comment.tsx` assumes `comment.date` is already a string, which T003 guarantees)

### Within Each User Story

- T003 (US1 data layer) must complete before T004 (US1 build check)
- T005 (US2 rendering layer) must complete before T006/T007 (US2 build + manual test)
- T003 must complete before T005 (string contract must be established before renderer is simplified)

### Parallel Opportunities

- T001 and T002 (Phase 1) can run in parallel
- T009 and T010 (Phase 5) can run in parallel

---

## Parallel Example: Phase 5 Verification

```bash
# These two checks can be done simultaneously (different posts / DevTools tabs):
Task T009: "Visit all 9 posts with comments, confirm readable dates"
Task T010: "Inspect <time datetime> attribute in DevTools on 3+ comments"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001–T002)
2. Complete Phase 3: User Story 1 (T003–T004) — **1 line changed in content.ts**
3. **STOP and VALIDATE**: Open the built site; confirm all comment dates are readable
4. Ship — this alone fixes the visible bug for all readers

### Incremental Delivery

1. Complete Phase 1 → branch and baseline confirmed
2. Complete Phase 3 (US1, T003–T004) → core bug fixed, independently verifiable
3. Complete Phase 4 (US2, T005–T007) → defensive hardening added
4. Complete Phase 5 (T008–T011) → full success criteria validated

### Summary

| Phase    | Tasks     | Files Changed                | Deliverable                   |
| -------- | --------- | ---------------------------- | ----------------------------- |
| 1 Setup  | T001–T002 | —                            | Clean baseline                |
| 3 US1    | T003–T004 | `src/lib/content.ts`         | Bug fixed for all 16 comments |
| 4 US2    | T005–T007 | `src/components/Comment.tsx` | Graceful fallback added       |
| 5 Polish | T008–T011 | —                            | All success criteria verified |

**Total tasks**: 11
**Files changed**: 2 (`src/lib/content.ts`, `src/components/Comment.tsx`)
**New dependencies**: 0
**New files**: 0

---

## Notes

- [P] tasks = different files or independent checks, no dependencies on each other
- [Story] label maps task to user story for traceability
- No test framework — verification is manual build + browser inspection
- Commit after T004 (US1 complete) and after T007 (US2 complete) as logical checkpoints
- Do NOT modify MDX source files (FR-007) or post-level date normalization (FR-006)

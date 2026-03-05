# Tasks: Fix GFM Strikethrough Rendering

**Input**: Design documents from `/specs/004-fix-gfm-strikethrough/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, quickstart.md ✅

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- Exact file paths included in descriptions

---

## Phase 1: Setup (Install Dependency)

**Purpose**: Add `remark-gfm` to the project before any source edits.

- [ ] T001 Add `"remark-gfm": "^4.0.0"` to `dependencies` in `package.json` and run `npm install`

**Checkpoint**: `node_modules/remark-gfm` exists and `package-lock.json` is updated.

---

## Phase 2: User Story 1 — Strikethrough Text Renders Correctly (Priority: P1) 🎯 MVP

**Goal**: `~~text~~` in existing blog posts renders as struck-through text instead of literal tildes.

**Independent Test**: Open `content/posts/there-is-no-such-thing-as-a-free-free-monad.mdx` in the built site and confirm `~~framework~~` on line 26 displays with `text-decoration: line-through`.

### Implementation for User Story 1

- [ ] T002 [P] [US1] Add `import remarkGfm from 'remark-gfm'` and `remarkPlugins: [remarkGfm]` to the `evaluate()` call in `src/app/[year]/[month]/[day]/[slug]/page.tsx`
- [ ] T003 [P] [US1] Add `import remarkGfm from 'remark-gfm'` and `remarkPlugins: [remarkGfm]` to the `evaluate()` call in `src/app/page/[slug]/page.tsx`
- [ ] T004 [US1] Run `npm run build` and confirm the build succeeds with no new errors

**Checkpoint**: User Story 1 is fully functional — existing strikethrough in published posts renders correctly.

---

## Phase 3: User Story 2 — Author Uses Strikethrough in Future Posts (Priority: P2)

**Goal**: The `@next/mdx` pipeline also supports `~~text~~` so that any `.md`/`.mdx` file processed at build time via `next.config.mjs` renders strikethrough correctly.

**Independent Test**: Verify that `next.config.mjs` includes `remarkGfm` in its plugin list and that the build still succeeds.

### Implementation for User Story 2

- [ ] T005 [US2] Add `import remarkGfm from 'remark-gfm'` and `remarkPlugins: [remarkGfm]` to the `createMDX()` options in `next.config.mjs`
- [ ] T006 [US2] Run `npm run build` and confirm the build still succeeds with no new errors

**Checkpoint**: All three rendering paths (2× `evaluate()` + `createMDX()`) include `remarkGfm`.

---

## Phase 4: User Story 3 — Other GFM Extensions Continue Working (Priority: P3)

**Goal**: Confirm that GFM tables and task lists also render correctly as a natural side-effect of enabling `remark-gfm`.

**Independent Test**: Manually inspect the built site for any post that uses GFM tables or task lists; confirm they render as structured HTML.  
_(No existing posts use these features; this story is validated by the build succeeding and the absence of regressions.)_

### Implementation for User Story 3

- [ ] T007 [US3] Follow all verification steps in `specs/004-fix-gfm-strikethrough/quickstart.md` and confirm all acceptance criteria pass (SC-001 through SC-004)

**Checkpoint**: All success criteria met — strikethrough works, no regressions, build clean.

---

## Phase 5: Polish & Cross-Cutting Concerns

- [ ] T008 Commit all changed source files (`package.json`, `package-lock.json`, `next.config.mjs`, `src/app/[year]/[month]/[day]/[slug]/page.tsx`, `src/app/page/[slug]/page.tsx`) with message `feat(004): enable remark-gfm for GFM strikethrough rendering`
- [ ] T009 Run `.specify/scripts/bash/update-agent-context.sh opencode` to regenerate `AGENTS.md`
- [ ] T010 Commit updated `AGENTS.md` with message `chore: update agent context after 004-fix-gfm-strikethrough implementation`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **US1 (Phase 2)**: Depends on T001 (npm install) — T002 and T003 can run in parallel
- **US2 (Phase 3)**: Depends on T001; T005 can run in parallel with T002/T003
- **US3 (Phase 4)**: Depends on Phases 2 and 3 being complete
- **Polish (Phase 5)**: Depends on all user story phases complete

### Parallel Opportunities

T002, T003, and T005 all touch different files with no mutual dependencies — they can all run in parallel once T001 is done:

```bash
# After T001 (npm install):
Task: T002 — src/app/[year]/[month]/[day]/[slug]/page.tsx
Task: T003 — src/app/page/[slug]/page.tsx
Task: T005 — next.config.mjs
```

---

## Implementation Strategy

### MVP (User Story 1 Only)

1. Complete T001: Install `remark-gfm`
2. Complete T002 + T003 in parallel: Add plugin to both `evaluate()` call sites
3. Complete T004: Build and verify
4. **STOP and VALIDATE**: Confirm `~~framework~~` renders in the affected post
5. Continue to US2 and US3

### Full Delivery

1. T001 → T002 + T003 + T005 (parallel) → T004 → T006 → T007 → T008 → T009 → T010

---

## Summary

| Metric                 | Value                         |
| ---------------------- | ----------------------------- |
| Total tasks            | 10                            |
| Phase 1 (Setup)        | 1                             |
| US1 tasks              | 3                             |
| US2 tasks              | 2                             |
| US3 tasks              | 1                             |
| Polish tasks           | 3                             |
| Parallel opportunities | T002, T003, T005 (after T001) |
| MVP scope              | Phase 1 + Phase 2 (T001–T004) |

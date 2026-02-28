# Tasks: Fix Gist Embeds Not Rendering

**Input**: Design documents from `/specs/003-fix-gist-embeds/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅

**Tests**: Not requested — manual visual inspection per plan.md.

**Organization**: Tasks grouped by user story.
No Setup or Foundational phases required — the repository and content structure already exist.
All gist content has been retrieved and is recorded in `research.md`.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no shared dependencies)
- **[Story]**: User story this task belongs to (US1/US2/US3)

---

## Phase 3: User Story 1 — Reader Sees Gist Code Inline (Priority: P1) 🎯 MVP

**Goal**: Replace all 8 bare gist URLs across 5 post files with static fenced code blocks
containing the gist content pasted directly, each followed by a `[View on GitHub](url)`
attribution link.

**Independent Test**: Run `npm run dev`, visit each of the 5 affected posts, and confirm
zero bare gist URLs appear — only rendered code blocks with attribution links.
Source: spec.md acceptance scenarios 1–5.

- [ ] T001 [P] [US1] Replace 3 bare gist URLs (4538958, 4539327, 4539471) with fenced code blocks + attribution links in `content/posts/blanket-js-qunit-and-ie8-please-die-now.mdx`
- [ ] T002 [P] [US1] Replace 2 bare gist URLs (4079379, 4079245) with fenced code blocks + attribution links in `content/posts/fun-with-castle-dynamicproxy.mdx`
- [ ] T003 [P] [US1] Replace 1 bare gist URL (4109938) with fenced code block + attribution link in `content/posts/fun-with-castle-dynamicproxy-part-ii.mdx`
- [ ] T004 [P] [US1] Replace 1 bare gist URL (4079035) with fenced code block + attribution link in `content/posts/explaining-sqlite-foreign-keys-support-with-unit-tests.mdx`
- [ ] T005 [P] [US1] Replace 1 bare gist URL (orient-man/7804310) with fenced code block + attribution link in `content/posts/how-to-put-your-toe-into-asp-net-mvc-integration-testing.mdx`

**Checkpoint**: All 5 posts show inline code when viewed in `npm run dev`. Zero bare gist URLs remain.

---

## Phase 4: User Story 2 — Gist Code Has Syntax Highlighting (Priority: P2)

**Goal**: Confirm that all inlined code blocks render with language-appropriate syntax
highlighting. This is satisfied automatically by the language fence tags applied in Phase 3
(`html`, `diff`, `csharp`) via the existing `rehype-pretty-code` (Shiki) pipeline.

**Independent Test**: Visit a post with a C# gist (e.g., `fun-with-castle-dynamicproxy`)
and confirm syntax-coloured output. Visit `blanket-js-qunit-and-ie8-please-die-now` and
confirm the diff block renders with diff highlighting.

- [ ] T006 [US2] Verify syntax highlighting is active for all 8 inlined code blocks by visual inspection in `npm run dev` — confirm `html`, `diff`, and `csharp` fence tags produce coloured output with no rendering errors

**Checkpoint**: Syntax highlighting confirmed for all language types used.

---

## Phase 5: User Story 3 — Markdown Gist Links Remain Unchanged (Priority: P3)

**Goal**: Confirm that the Markdown-linked gist URL in
`checking-for-outdated-package-references-during-build-with-fake-paket.mdx` was NOT
modified and still renders as a clickable link.

**Independent Test**: Visit `checking-for-outdated-package-references-during-build-with-fake-paket`
and confirm the word "Gist" is a clickable hyperlink pointing to
`https://gist.github.com/orient-man/c29c299ed970fd097f80124ffde734ce`, not a code block.

- [ ] T007 [US3] Verify `content/posts/checking-for-outdated-package-references-during-build-with-fake-paket.mdx` is unmodified and the `[Gist](url)` link still renders as a clickable link in `npm run dev`

**Checkpoint**: Non-regression confirmed — Markdown-linked gist unaffected.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Build validation and completeness scan.

- [ ] T008 Run `npm run build` and confirm the static export completes with zero errors (satisfies SC-002 in `specs/003-fix-gist-embeds/spec.md`)
- [ ] T009 [P] Scan all files in `content/posts/` for any remaining bare gist URLs matching `https://gist.github.com/` not inside Markdown link syntax — confirm zero results

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 3 (US1)**: No prerequisites — can start immediately. All 5 tasks are independent (different files) and can run in parallel.
- **Phase 4 (US2)**: Depends on Phase 3 completion — language fence tags must be in place before verifying highlighting.
- **Phase 5 (US3)**: Independent of Phases 3 and 4 — can run at any time (file is not being modified).
- **Phase 6 (Polish)**: Depends on Phases 3, 4, and 5 being complete.

### User Story Dependencies

- **US1 (P1)**: No dependencies — start immediately.
- **US2 (P2)**: Depends on US1 (fence tags must exist to verify highlighting).
- **US3 (P3)**: Independent — the file it covers is out of scope and untouched.

### Within Phase 3

- T001–T005 touch different files → all can run in parallel.
- Each task is self-contained: paste code block, add attribution link, save.

---

## Parallel Example: Phase 3 (US1)

```text
# All 5 tasks can be dispatched simultaneously:
Task T001: blanket-js-qunit-and-ie8-please-die-now.mdx  (3 gist refs)
Task T002: fun-with-castle-dynamicproxy.mdx              (2 gist refs)
Task T003: fun-with-castle-dynamicproxy-part-ii.mdx      (1 gist ref)
Task T004: explaining-sqlite-foreign-keys-support-with-unit-tests.mdx  (1 gist ref)
Task T005: how-to-put-your-toe-into-asp-net-mvc-integration-testing.mdx (1 gist ref)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 3: US1 (T001–T005) — all in parallel
2. **STOP and VALIDATE**: `npm run dev`, visit all 5 posts, confirm code blocks visible
3. Proceed to Phase 4 (T006) and Phase 5 (T007)
4. Run Phase 6 (T008–T009) to confirm clean build

### Reference: Gist Content Source

All gist content to paste is recorded in `specs/003-fix-gist-embeds/research.md`.
Language fence tags are recorded in `specs/003-fix-gist-embeds/data-model.md`.
Attribution link format: `[View on GitHub](https://gist.github.com/{id})`

---

## Notes

- [P] tasks touch different files — no conflicts, safe to run in parallel
- All gist content was retrieved on 2026-02-28 and stored in research.md — no internet access needed during implementation
- Do not modify `checking-for-outdated-package-references-during-build-with-fake-paket.mdx` at any point
- The `GistEmbed.tsx` component is out of scope — do not remove or modify it
- Commit after completing all Phase 3 tasks, then again after Phase 6

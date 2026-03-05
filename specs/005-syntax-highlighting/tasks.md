# Tasks: Syntax Highlighting for Code Blocks

**Input**: Design documents from `/specs/005-syntax-highlighting/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: No test framework exists. All verification is manual (build + browser). Test tasks are NOT included.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- Single project: `src/`, `scripts/`, `content/` at repository root
- Config files at repository root (`next.config.mjs`)

---

## Phase 1: Setup

**Purpose**: Verify existing infrastructure is in place — no new packages or project scaffolding needed.

- [ ] T001 Verify `rehype-pretty-code`, `shiki`, `remark-gfm` are installed in `package.json` and `node_modules/` is populated
- [ ] T002 Verify the feature branch is `005-syntax-highlighting` and working tree is clean

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Build-time plugin infrastructure and CSS that ALL user stories depend on. MUST complete before any user story phase.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

### Copy-Button Build Plugin

- [ ] T003 Create `rehypeCopyButton` rehype plugin in `src/lib/rehype-copy-button.ts` — visit every `<figure data-rehype-pretty-code-figure>` node and append `<button data-copy-btn>Copy</button>` child element (see quickstart.md Step 3 and data-model.md entity `HighlightedCodeBlock`)

### Plugin Registration (3 pipeline locations)

- [ ] T004 [P] Register `rehypeCopyButton` in `src/app/[year]/[month]/[day]/[slug]/page.tsx` — add import and append to `rehypePlugins` array AFTER `rehypePrettyCode` in the `evaluate()` call
- [ ] T005 [P] Register `rehypeCopyButton` in `src/app/page/[slug]/page.tsx` — add import and append to `rehypePlugins` array AFTER `rehypePrettyCode` in the `evaluate()` call
- [ ] T006 [P] Register `rehypeCopyButton` in `next.config.mjs` — add import and append to `rehypePlugins` array AFTER `rehypePrettyCode` in the `withMDX()` options

### Inline Clipboard Script

- [ ] T007 Add inline clipboard `<script>` to `src/app/layout.tsx` — event delegation handler for `[data-copy-btn]` clicks that copies `pre.innerText` via `navigator.clipboard.writeText()`, sets `data-copied` attribute for 2 seconds feedback (see quickstart.md Step 6)

### CSS: Line Numbers

- [ ] T008 [P] Add CSS counter line-number rules to `src/styles/globals.css` — `[data-rehype-pretty-code-figure] [data-line]::before` with `counter-increment: line`, `content: counter(line)`, `user-select: none`, `tabular-nums` (FR-012; `counter-reset: line` already exists on `code` selector)

### CSS: Copy Button Styles

- [ ] T009 [P] Add copy-button CSS to `src/styles/globals.css` — `[data-rehype-pretty-code-figure]` gets `position: relative`; `[data-copy-btn]` positioned top-right, hidden by default, visible on figure hover; `[data-copy-btn][data-copied]::after` shows "Copied!" feedback (see quickstart.md Step 5)

**Checkpoint**: At this point, any post with existing fenced code blocks should show line numbers, a copy button on hover, and the clipboard script should work. Token colours are NOT yet wired — that is US1.

---

## Phase 3: User Story 1 — Reader Views Code with Language-Appropriate Highlighting (Priority: P1) 🎯 MVP

**Goal**: Fenced code blocks display with syntax highlighting that matches the programming language. Keywords, strings, types, and comments are visually distinct. Untagged blocks render as plain monospaced text.

**Independent Test**: Open any code-heavy post (e.g., one with C# or F# samples), verify coloured tokens appear in code blocks. Open a post with an untagged code block, verify it renders as plain monospaced text without errors.

### Implementation for User Story 1

- [ ] T010 [US1] Add dual-theme Shiki token CSS to `src/styles/globals.css` — `code[data-theme*=" "], code[data-theme*=" "] span { color: var(--shiki-light); }` and `.dark code[data-theme*=" "], .dark code[data-theme*=" "] span { color: var(--shiki-dark); }` (see quickstart.md Step 1 and research.md Section 2.2)
- [ ] T011 [US1] Build the site with `npm run build` and verify: (a) build completes with zero errors, (b) at least one code-heavy post displays coloured tokens, (c) untagged code blocks render as plain monospaced text (SC-004, FR-005, FR-006)

**Checkpoint**: User Story 1 is complete. Code blocks now show language-appropriate syntax highlighting. This is the MVP — the core value proposition is delivered.

---

## Phase 4: User Story 2 — Reader Views Code Comfortably in Light and Dark Themes (Priority: P2)

**Goal**: Highlighting colours adapt when the user toggles between light and dark themes. All token text meets WCAG AA contrast (4.5:1) in both themes.

**Independent Test**: Open a code-heavy post, switch between light and dark modes, verify token colours change and remain readable in both contexts.

### Implementation for User Story 2

- [ ] T012 [US2] Verify dual-theme switching works end-to-end — open a code-heavy post in browser, toggle dark mode via the existing `.dark` class toggle, confirm `--shiki-light` / `--shiki-dark` CSS custom properties switch correctly and tokens change colour
- [ ] T013 [US2] Spot-check WCAG AA contrast (4.5:1 minimum) for at least 5 token types (keyword, string, comment, type, variable) in both `github-light` and `github-dark` themes in `src/styles/globals.css` — adjust `--code-bg` or add overrides if any token fails contrast check (SC-002)
- [ ] T014 [US2] Verify long code lines scroll horizontally without layout overflow in both themes — check `overflow-x: auto` on `pre` element in `src/styles/globals.css` (FR-009)

**Checkpoint**: User Story 2 is complete. Code blocks are readable and accessible in both light and dark theme contexts.

---

## Phase 5: User Story 3 — All Code-Heavy Posts Display Highlighting After Migration (Priority: P2)

**Goal**: Every existing post that contains code content (commands, config, multi-line code) displays properly fenced, language-tagged, syntax-highlighted code blocks.

**Independent Test**: Run the audit script, then open 5 code-heavy posts from different time periods and verify each displays highlighted code blocks.

### Audit Script

- [ ] T015 [US3] Create content audit script `scripts/audit-code-blocks.ts` — read all `.mdx` files from `content/posts/`, strip frontmatter with `gray-matter`, apply four heuristics (`shell-command`, `indented-block`, `long-inline-code`, `raw-xml-html`) per contracts/audit-script-output.md, skip lines inside existing fenced blocks, support `--json`, `--paths-only`, and default human-readable output modes, exit 0 on success (FR-014)
- [ ] T016 [US3] Run audit script with `npx tsx scripts/audit-code-blocks.ts` and review output — confirm it identifies the ~5-8 posts flagged in research.md Section 5.2

### Manual Content Conversion

- [ ] T017 [P] [US3] Convert un-fenced code to fenced code blocks in `content/posts/checking-for-outdated-package-references-during-build-with-fake-paket.mdx` — wrap code content with appropriate language tags (`bash`, `xml` per research.md)
- [ ] T018 [P] [US3] Convert un-fenced code to fenced code blocks in `content/posts/how--not--to-upgrade-to-asp-net-core-2-0-just-yet-with-paket.mdx` — wrap code content with appropriate language tags (`bash`, `text`)
- [ ] T019 [P] [US3] Convert un-fenced code to fenced code blocks in `content/posts/chutzpah-to-run-javascript-tests.mdx` — wrap code content with appropriate language tags (`json`, `bash`)
- [ ] T020 [P] [US3] Convert un-fenced code to fenced code blocks in `content/posts/tips-for-running-visualstudio-2010-resharper-7-on-32-bit-windows.mdx` — wrap code content with appropriate language tags (`text`, `xml`)
- [ ] T021 [P] [US3] Convert un-fenced code to fenced code blocks in `content/posts/for-the-record-how-to-run-nuget-exe-on-os-x-mountain-lion.mdx` — wrap code content with appropriate language tags (`bash`)
- [ ] T022 [US3] Convert un-fenced code in any additional posts flagged by audit script beyond the 5 listed above (if any — research.md estimates up to 8 total)
- [ ] T023 [US3] Build the site with `npm run build` and verify all converted posts render correctly with highlighted code blocks and no build errors (SC-001, SC-004)

**Checkpoint**: User Story 3 is complete. All code-heavy posts across the blog now display syntax-highlighted code blocks.

---

## Phase 6: User Story 4 — Author Writes New Posts with Highlighting (Priority: P3)

**Goal**: Authors write standard fenced code blocks with language tags in new MDX files and highlighting activates automatically at build time.

**Independent Test**: Create a temporary test MDX file with fenced code blocks in various languages, build, and verify highlighted output.

### Implementation for User Story 4

- [ ] T024 [US4] Create a test post `content/posts/test-syntax-highlighting.mdx` with fenced code blocks in at least 10 languages (C#, F#, C++, JavaScript, TypeScript, HTML, CSS, XML, Bash, Diff) plus one untagged block and one with a misspelled tag — build and verify each renders correctly (FR-001, FR-005, FR-006, SC-003)
- [ ] T025 [US4] Verify edge cases in the test post: empty code block, special characters (`<`, `>`, `&`), very long line, inline backtick code — confirm no rendering errors and inline code is NOT processed by block highlighting (FR-010, FR-011, SC-004)
- [ ] T026 [US4] Remove the test post `content/posts/test-syntax-highlighting.mdx` after verification (cleanup — not published content)

**Checkpoint**: User Story 4 is complete. The authoring workflow supports syntax highlighting for new posts with zero additional configuration.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final validation across all stories and cleanup.

- [ ] T027 Full site build with `npm run build` — verify zero errors and zero warnings related to code blocks (SC-004, SC-006)
- [ ] T028 Spot-check at least 5 code-heavy posts in browser: tokens coloured, line numbers visible, copy button works, dark/light toggle switches colours, clipboard content excludes line numbers (SC-001, SC-002, SC-005, SC-006)
- [ ] T029 Verify no new npm dependencies were added — `git diff package.json` should show no dependency changes (plan.md constraint)
- [ ] T030 Verify inline clipboard script is <10 lines in `src/app/layout.tsx` (plan.md constraint, SC-005)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 — BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Phase 2 — activates token colours
- **User Story 2 (Phase 4)**: Depends on Phase 3 (US1) — theme verification requires tokens to be visible
- **User Story 3 (Phase 5)**: Depends on Phase 2 only — audit and content conversion can proceed as soon as the pipeline works; however, visual verification benefits from US1 being complete
- **User Story 4 (Phase 6)**: Depends on Phase 2 only — new-post authoring works once the pipeline is wired
- **Polish (Phase 7)**: Depends on all user stories being complete

### User Story Dependencies

- **US1 (P1)**: Depends on Foundational (Phase 2). No dependencies on other stories.
- **US2 (P2)**: Depends on US1 (needs visible tokens to verify contrast). Light coupling.
- **US3 (P2)**: Depends on Foundational (Phase 2). Independent of US1/US2 for content conversion; visual verification benefits from US1.
- **US4 (P3)**: Depends on Foundational (Phase 2). Independent of other stories.

### Within Each User Story

- Implementation tasks are sequentially ordered (each builds on the previous)
- Verification tasks come last in each phase
- Content conversion tasks (T017–T021) within US3 can run in parallel

### Parallel Opportunities

Within Phase 2 (Foundational):

- T004, T005, T006 can run in parallel (different files, same change pattern)
- T008, T009 can run in parallel (different CSS sections, no overlap)

Within Phase 5 (US3):

- T017, T018, T019, T020, T021 can ALL run in parallel (different content files)

Cross-story parallelism:

- US3 content conversion (T015–T022) can proceed in parallel with US1 (T010–T011) after Phase 2 completes
- US4 test post (T024–T026) can proceed in parallel with US2 (T012–T014) after Phase 2 completes

---

## Parallel Examples

### Foundational Phase — Plugin Registration

```
# Launch all 3 plugin registrations together:
Task T004: Register rehypeCopyButton in src/app/[year]/[month]/[day]/[slug]/page.tsx
Task T005: Register rehypeCopyButton in src/app/page/[slug]/page.tsx
Task T006: Register rehypeCopyButton in next.config.mjs
```

### User Story 3 — Content Conversion

```
# Launch all 5 known post conversions together:
Task T017: Convert content/posts/checking-for-outdated-package-references-during-build-with-fake-paket.mdx
Task T018: Convert content/posts/how--not--to-upgrade-to-asp-net-core-2-0-just-yet-with-paket.mdx
Task T019: Convert content/posts/chutzpah-to-run-javascript-tests.mdx
Task T020: Convert content/posts/tips-for-running-visualstudio-2010-resharper-7-on-32-bit-windows.mdx
Task T021: Convert content/posts/for-the-record-how-to-run-nuget-exe-on-os-x-mountain-lion.mdx
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (verification only)
2. Complete Phase 2: Foundational (plugin + CSS infrastructure)
3. Complete Phase 3: User Story 1 (dual-theme token CSS)
4. **STOP and VALIDATE**: Build site, open a code-heavy post, confirm coloured tokens
5. MVP is delivered — core syntax highlighting works

### Incremental Delivery

1. Setup + Foundational → Pipeline infrastructure ready
2. Add US1 (token CSS) → Build and verify → **MVP shipped**
3. Add US2 (theme contrast) → Verify both themes → Accessible highlighting
4. Add US3 (content audit + conversion) → All posts covered → Full blog coverage
5. Add US4 (new post authoring) → Edge case validation → Author-ready
6. Polish → Full site verification → Feature complete

### Recommended Execution Order (Single Developer)

Phase 1 → Phase 2 → Phase 3 (MVP) → Phase 4 → Phase 5 → Phase 6 → Phase 7

# Tasks: GitHub Pages Deployment

**Input**: Design documents from `/specs/002-gh-pages-deploy/`
**Prerequisites**: plan.md ✓, spec.md ✓, research.md ✓, data-model.md ✓, quickstart.md ✓

**Tests**: No test tasks — the spec specifies manual verification only (see quickstart.md).

**Organization**: Tasks are grouped by user story. US3 (manual trigger) is merged into the
US1 phase because it is a single YAML line in the same `deploy.yml` file.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: Which user story this task belongs to (US1–US4)
- Exact file paths are included in every description

---

## Phase 1: Setup

**Purpose**: Create the directory structure required by GitHub Actions.

- [ ] T001 Create `.github/workflows/` directory (e.g., add `.github/workflows/.gitkeep` or proceed directly to T002)

---

## Phase 2: User Story 1+3 — Automated Deployment on Push + Manual Trigger (Priority: P1+P3) 🎯 MVP

**Goal**: A push to `main` (or a manual `workflow_dispatch` trigger) automatically builds
the static site and deploys it to GitHub Pages. The author never runs a manual deploy command.

**Independent Test**: Push a trivial commit to `main`; verify the workflow runs and the site
is live within 5 minutes. Also click "Run workflow" in the Actions UI to confirm
`workflow_dispatch` works.

### Implementation for User Stories 1 & 3

- [ ] T002 [US1] Create `.github/workflows/deploy.yml` — workflow skeleton: `name`, `on` block
  (`push: branches: [main]` + `workflow_dispatch: {}`), top-level `permissions`
  (`contents: read`, `pages: write`, `id-token: write`), and `concurrency` group
  (`group: "pages"`, `cancel-in-progress: true`) per data-model.md § 1
- [ ] T003 [US1] Add `build` job to `.github/workflows/deploy.yml` — steps in order:
  `actions/checkout@v4`, `actions/setup-node@v4` (node-version: "20", cache: "npm"),
  `actions/configure-pages@v5` (no `static_site_generator` option), `actions/cache@v4`
  (path: `.next/cache`, key pattern from research.md § 5), `npm ci`, `npm run build`,
  `actions/upload-pages-artifact@v4` (path: `./out`) per data-model.md § 1
- [ ] T004 [US1] Add `deploy` job to `.github/workflows/deploy.yml` — `needs: [build]`,
  `runs-on: ubuntu-latest`, `environment: { name: github-pages, url: ${{ steps.deployment.outputs.page_url }} }`,
  single step `actions/deploy-pages@v4` with `id: deployment` per data-model.md § 1
  and research.md § 2 (permissions scoped to deploy job only)

**Checkpoint**: After T004 the workflow is complete. Push to `main` to trigger the first
deployment. Verify in the Actions tab that both `build` and `deploy` jobs succeed.

---

## Phase 3: User Story 2 — Custom Domain Access (Priority: P2)

**Goal**: The blog is accessible at `https://blog.orientman.com` with HTTPS enforced.

**Independent Test**: Resolve `blog.orientman.com` in DNS and load the URL — the blog
homepage MUST render over HTTPS with a valid certificate.

### Implementation for User Story 2

- [ ] T005 [P] [US2] Create `public/CNAME` — single line, no trailing newline:
  `blog.orientman.com` per data-model.md § 2 and research.md § 7

**Checkpoint**: After T005 and a successful deployment, GitHub Pages reads `out/CNAME`
and configures the custom domain. Complete the one-time manual DNS setup from
quickstart.md § "One-Time Manual Setup" (GitHub Pages source + DNS CNAME record).

---

## Phase 4: User Story 4 — Build Status Visibility (Priority: P4)

**Goal**: The repository README displays a workflow status badge reflecting the latest
deployment run.

**Independent Test**: View the repository README on GitHub and verify the badge
shows the correct status (green after a successful run, red after a forced failure).

### Implementation for User Story 4

- [ ] T006 [P] [US4] Create `README.md` at the repository root — project title
  (`# orientman-blog`), deployment status badge
  (`[![Deploy](https://github.com/orient-man/orientman-blog/actions/workflows/deploy.yml/badge.svg)](https://github.com/orient-man/orientman-blog/actions/workflows/deploy.yml)`),
  and a brief description of the project per data-model.md § 3 and research.md § 8

**Checkpoint**: After T006, the README badge is visible on the repository home page.
Badge reflects live workflow status — no configuration needed beyond creating the file.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Validate the complete implementation against all requirements before
considering the feature done.

- [ ] T007 Validate `.github/workflows/deploy.yml` against all 13 functional requirements
  (FR-001 through FR-013) from spec.md — confirm each FR is satisfied by the workflow
  or documented as a manual prerequisite (FR-012)
- [ ] T008 Run the verification checklist from `specs/002-gh-pages-deploy/quickstart.md`
  after the first successful deployment — confirm HTTPS, all routes, search, RSS feed,
  sitemap, and README badge all work at `https://blog.orientman.com`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **US1+US3 (Phase 2)**: Depends on Phase 1 (directory must exist)
- **US2 (Phase 3)**: Independent of Phase 2 — can run in parallel with Phase 2
- **US4 (Phase 4)**: Independent of Phase 2 — can run in parallel with Phase 2 and 3
- **Polish (Phase 5)**: Depends on Phases 1–4 complete and first deployment successful

### User Story Dependencies

- **US1+US3 (P1+P3)**: Start after T001 — no dependencies on other stories
- **US2 (P2)**: No code dependencies — `public/CNAME` is standalone; needs DNS setup (manual)
- **US4 (P4)**: No code dependencies — `README.md` is standalone; badge URL is fixed

### Within Phase 2 (US1+US3)

- T002 MUST complete before T003 (build job added to file created in T002)
- T003 MUST complete before T004 (deploy job references build job)
- T002 → T003 → T004 (strictly sequential — same file)

### Parallel Opportunities

- T005 [US2] and T006 [US4] can both start immediately after T001 and run in parallel
- T005 and T006 can also run in parallel with T002–T004 (different files)
- T007 and T008 are sequential checkpoints — T007 first (static review), T008 after deployment

---

## Parallel Example

```text
After T001 completes, launch all three tracks simultaneously:

Track A (US1+US3 — must do sequentially):
  T002 → T003 → T004   (.github/workflows/deploy.yml)

Track B (US2 — single task):
  T005                 (public/CNAME)

Track C (US4 — single task):
  T006                 (README.md)

Then sequentially:
  T007 → T008          (validation + live checklist)
```

---

## Implementation Strategy

### MVP First (User Stories 1+3 Only — Phases 1–2)

1. Complete Phase 1: T001 — create directory
2. Complete Phase 2: T002 → T003 → T004 — create full `deploy.yml`
3. **STOP and VALIDATE**: Push to `main`; confirm build and deploy jobs succeed in Actions UI
4. Site is live (at `orient-man.github.io/orientman-blog` until custom domain is configured)

### Full Delivery (All User Stories)

1. Complete MVP (Phases 1–2)
2. Complete Phase 3 (T005) — add `public/CNAME`; complete manual DNS setup from quickstart.md
3. Complete Phase 4 (T006) — add `README.md` with badge
4. Complete Phase 5 (T007–T008) — validate all FRs; run live verification checklist

### Notes

- T005 and T006 involve one-line/stub files — commit them together with the workflow or
  separately; either works
- The DNS step (quickstart.md § Step 2) is outside the repository and takes minutes to
  hours to propagate; start it early
- `next.config.mjs` and `package.json` are **not modified** — the existing config is
  already correct (no `basePath`, `output: 'export'` set, lifecycle hooks handle full build)
- `.gitignore` already excludes `out/` and `.next/` — no changes needed

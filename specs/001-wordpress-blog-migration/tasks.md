# Tasks: WordPress Blog Migration

**Input**: Design documents from `/specs/001-wordpress-blog-migration/`
**Prerequisites**: plan.md, spec.md, data-model.md, contracts/routes.md, contracts/components.md, research.md, quickstart.md

**Tests**: Not included. Tests were not explicitly requested in the feature specification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- Single Next.js project at repository root
- Source code: `src/`
- Content: `content/`
- Migration scripts: `scripts/`
- Config files at root: `next.config.mjs`, `tailwind.config.ts`, `tsconfig.json`, `package.json`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization, dependency installation, and configuration files

- [ ] T001 Initialize Next.js 14 project with TypeScript: `package.json`, `tsconfig.json`, `next.config.mjs` (set `output: 'export'`, `trailingSlash: true`, `images: { unoptimized: true }`)
- [ ] T002 Install production dependencies: `@next/mdx`, `@mdx-js/loader`, `@mdx-js/react`, `gray-matter`, `rehype-pretty-code`, `shiki`, `@tailwindcss/typography`
- [ ] T003 Install dev dependencies: `tailwindcss`, `postcss`, `autoprefixer`, `fast-xml-parser`, `turndown`, `@types/turndown`, `tsx`
- [ ] T004 [P] Configure Tailwind CSS: `tailwind.config.ts` with `@tailwindcss/typography` plugin, dark mode (`class` strategy), content paths
- [ ] T005 [P] Create `src/styles/globals.css` with Tailwind directives (`@tailwind base/components/utilities`) and custom dark mode styles
- [ ] T006 [P] Create `mdx-components.tsx` at project root with initial MDX component mapping (empty overrides, will be populated later)
- [ ] T007 [P] Create directory structure: `content/posts/`, `content/pages/`, `content/data/`, `public/images/posts/`, `src/app/`, `src/components/`, `src/lib/`, `scripts/`
- [ ] T008 Configure `@next/mdx` in `next.config.mjs` with `rehype-pretty-code` and Shiki for build-time syntax highlighting

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core TypeScript types, content loading API, and migration scripts that MUST be complete before ANY user story can be implemented

**CRITICAL**: No user story work can begin until this phase is complete

- [ ] T009 Create TypeScript interfaces in `src/lib/types.ts`: `Post`, `CategorySlug`, `Category`, `Tag`, `Comment`, `StaticPage`, `BlogrollEntry` (per data-model.md)
- [ ] T010 Create constants in `src/lib/types.ts`: `CATEGORIES` array (2 fixed categories) and `TAG_SLUG_MAP` for special character tags (F# -> fsharp, C# -> csharp, etc.)
- [ ] T011 [P] Create utility functions in `src/lib/utils.ts`: date formatting (`formatDate`), slug generation (`slugify`), reading time estimation, excerpt generation (first 160 chars)
- [ ] T012 Implement content loading API in `src/lib/content.ts`: `getAllPosts()`, `getPostBySlug()`, `getPostsByCategory()`, `getPostsByTag()`, `getPostsByMonth()`, `getAllTags()`, `getAllCategories()`, `getArchiveMonths()`, `getAllPages()`, `getPageBySlug()`, `getBlogroll()` — using `fs.readFileSync` + `gray-matter` (per data-model.md Content Loading API)
- [ ] T013 Create WordPress WXR migration script `scripts/migrate.ts`: parse WXR XML with `fast-xml-parser`, convert HTML to MDX with `turndown`, extract frontmatter fields per Migration Field Mapping in data-model.md, emit MDX files to `content/posts/` and `content/pages/`
- [ ] T014 [P] Create image download script `scripts/download-images.ts`: scan migrated MDX files for WordPress-hosted image URLs, download to `public/images/posts/{slug}/`, rewrite image paths in MDX
- [ ] T015 [P] Create migration validation script `scripts/validate-migration.ts`: verify post count matches WXR, check for missing frontmatter fields, detect broken image references, report unhandled shortcodes
- [ ] T016 Run migration: execute `scripts/migrate.ts` against WordPress WXR export, then `scripts/download-images.ts`, then `scripts/validate-migration.ts` — resolve any issues until validation passes
- [ ] T017 [P] Create `content/data/blogroll.json` with 11 blogroll entries from original WordPress "Blogs I Follow" widget (name + URL for each)

**Checkpoint**: Foundation ready — content is migrated, types are defined, loading API works. User story implementation can now begin.

---

## Phase 3: User Story 1 - Read Any Existing Blog Post (Priority: P1) MVP

**Goal**: A reader can navigate to any migrated post and see faithful content: text, code with syntax highlighting, gist embeds, images, quote-format styling, original URL
**Spec**: FR-001, FR-002, FR-003, FR-004, FR-005, FR-015, FR-017, FR-020
**Independent Test**: Open 5 representative posts (code-heavy, images, gist embed, quote-format, Polish) and verify each renders correctly

### Implementation for User Story 1

- [ ] T018 [US1] Create root layout `src/app/layout.tsx`: HTML head with metadata, site header ("Just A Programmer" / "Don Quixote fighting entropy"), main content area, basic responsive shell (sidebar integration deferred to US4)
- [ ] T019 [US1] Create post page route `src/app/[year]/[month]/[day]/[slug]/page.tsx`: implement `generateStaticParams()` from `getAllPosts()` (year/month/day/slug extraction), render full MDX content, display post metadata (title, date, author, category link, tag links), previous/next post navigation
- [ ] T020 [P] [US1] Create `src/components/GistEmbed.tsx` client component: iframe/script embed for GitHub gists, fallback link to `https://gist.github.com/{id}`, loading skeleton (props: `id`, `file?`)
- [ ] T021 [P] [US1] Create `src/components/TweetEmbed.tsx` server component: static blockquote with tweet text + link to original URL, styled distinctly (props: `url`, `content?`, `author?`)
- [ ] T022 [P] [US1] Create `src/components/QuotePost.tsx` server component: large blockquote styling with decorative quotation marks and distinct background/border (props: `children`)
- [ ] T023 [US1] Update `mdx-components.tsx` to register `GistEmbed`, `TweetEmbed` in the MDX component mapping so they are available in all MDX files without explicit imports
- [ ] T024 [US1] Verify syntax highlighting: confirm `rehype-pretty-code` renders code blocks with Shiki highlighting for C#, F#, C++, JavaScript, HTML/CSS across representative posts
- [ ] T025 [US1] Verify URL preservation (FR-020): confirm that post routes produce URLs matching `/YYYY/MM/DD/slug/` pattern with zero-padded months and days, matching original WordPress structure

**Checkpoint**: Any migrated post can be read at its original URL with full content fidelity. This is the MVP.

---

## Phase 4: User Story 2 - Browse and Discover Posts (Priority: P2)

**Goal**: A reader can browse the homepage post listing, filter by category, filter by tag, and browse monthly archives
**Spec**: FR-006, FR-007, FR-008, FR-009
**Independent Test**: Navigate homepage, click category/tag/archive links, verify correct filtered post sets

### Implementation for User Story 2

- [ ] T026 [P] [US2] Create `src/components/PostCard.tsx` server component: post title (linked), formatted date, excerpt, category badge, tag pills (max 5 + "+N more"), visual distinction for quote-format posts
- [ ] T027 [US2] Create `src/components/PostList.tsx` client component: renders list of `<PostCard>`, client-side pagination (10 per page), "Newer"/"Older" buttons, post count display
- [ ] T028 [US2] Create homepage `src/app/page.tsx`: call `getAllPosts()`, render `<PostList>` with all posts sorted newest-first
- [ ] T029 [P] [US2] Create category page `src/app/category/[slug]/page.tsx`: `generateStaticParams()` for 2 categories, render `<PostList>` filtered by category, category name as heading
- [ ] T030 [P] [US2] Create tag page `src/app/tag/[slug]/page.tsx`: `generateStaticParams()` from `getAllTags()`, render `<PostList>` filtered by tag, tag name as heading
- [ ] T031 [P] [US2] Create archive page `src/app/archive/[year]/[month]/page.tsx`: `generateStaticParams()` from `getArchiveMonths()`, render `<PostList>` filtered by month, "Archive: Month Year" heading

**Checkpoint**: Readers can browse all posts via homepage, categories, tags, and monthly archives. Combined with US1, the blog is functionally navigable.

---

## Phase 5: User Story 3 - View Static Pages (Priority: P3)

**Goal**: A reader can access the Curriculum Vitae page and any other static pages, visually distinct from blog posts
**Spec**: FR-010
**Independent Test**: Navigate to CV page, verify full content renders, confirm no date/category/tag metadata shown

### Implementation for User Story 3

- [ ] T032 [US3] Migrate CV content: ensure `content/pages/curriculum-vitae.mdx` exists with correct frontmatter (`title`, `slug`) and full page content from WordPress
- [ ] T033 [US3] Create static page route `src/app/page/[slug]/page.tsx`: `generateStaticParams()` from `getAllPages()`, render full MDX content, no date/category/tag display (visually distinct from posts per US3-2)

**Checkpoint**: Static pages are accessible and visually distinct from posts.

---

## Phase 6: User Story 4 - Site Identity and Sidebar (Priority: P4)

**Goal**: The blog displays its identity (title, subtitle, about) and supplementary navigation (tag cloud, categories, archive links, blogroll) on every page
**Spec**: FR-011, FR-012, FR-013
**Independent Test**: Load any page, verify site title/subtitle, about section, tag cloud, categories, blogroll, archive links are present and functional

### Implementation for User Story 4

- [ ] T034 [US4] Enhance root layout `src/app/layout.tsx`: integrate `<Sidebar>` component, responsive layout (sidebar beside content on desktop, collapsible on mobile), footer with copyright
- [ ] T035 [US4] Create `src/components/Sidebar.tsx` server component: About section (author bio), Categories links, `<TagCloud>`, Archive monthly links, Blogroll ("Blogs I Follow"), Recent Posts (last 5) — receives `allTags`, `archiveMonths`, `blogroll` as props
- [ ] T036 [P] [US4] Create `src/components/TagCloud.tsx` server component: tags as clickable pills linked to `/tag/{slug}/`, size/weight varies by post count, max ~20 tags with "View all tags" link
- [ ] T037 [P] [US4] Create `src/components/DarkModeToggle.tsx` client component: reads `localStorage` preference on mount (fallback to `prefers-color-scheme`), toggles `dark` class on `<html>`, sun/moon icon button
- [ ] T038 [US4] Pass sidebar data from layout: in `src/app/layout.tsx`, call `getAllTags()`, `getArchiveMonths()`, `getBlogroll()` and pass to `<Sidebar>`

**Checkpoint**: Every page shows full site identity and navigation. The blog feels complete.

---

## Phase 7: User Story 5 - Search Across Posts (Priority: P5)

**Goal**: A reader can search for keywords and find matching posts via client-side search
**Spec**: FR-014
**Independent Test**: Search for a known term (e.g., "F# monads"), verify matching posts appear in results; search for nonsense term, verify "no results" message

### Implementation for User Story 5

- [ ] T039 [US5] Install Pagefind: add `pagefind` as dev dependency, add post-build script to `package.json` (`"postbuild": "npx pagefind --site out"`)
- [ ] T040 [US5] Create `src/components/SearchInput.tsx` client component: mount Pagefind UI on client-side hydration via dynamic import of `/pagefind/pagefind-ui.js`, search input with placeholder
- [ ] T041 [US5] Create search page `src/app/search/page.tsx`: render `<SearchInput>` component, Pagefind handles result display
- [ ] T042 [US5] Add Pagefind `data-pagefind-body` attributes to post content area in `src/app/[year]/[month]/[day]/[slug]/page.tsx` so Pagefind indexes post content correctly
- [ ] T043 [US5] Verify search: run build, confirm Pagefind index is generated in `out/pagefind/`, test search for known terms returns expected posts

**Checkpoint**: Client-side search works across all post content. No server-side backend needed.

---

## Phase 8: User Story 6 - Reader Comments (Priority: P6)

**Goal**: Historical WordPress comments are displayed on posts that had them. No new commenting.
**Spec**: FR-016, FR-021
**Independent Test**: Open a post that had comments on WordPress, verify comments display with author names, dates, and content

### Implementation for User Story 6

- [ ] T044 [P] [US6] Create `src/components/Comment.tsx` server component: render comment author name, formatted date, content (plain text or sanitized HTML), optional avatar (Gravatar or initials)
- [ ] T045 [US6] Create `src/components/CommentList.tsx` server component: "Comments (N)" heading, list of `<Comment>` components, note "Comments are from the original WordPress blog. New comments are not supported."
- [ ] T046 [US6] Integrate comments into post page: in `src/app/[year]/[month]/[day]/[slug]/page.tsx`, render `<CommentList>` below post content when `post.comments` exists and is non-empty

**Checkpoint**: Historical comments are preserved and visible. Migration fidelity is complete.

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Final touches that improve quality across all user stories

- [ ] T047 [P] Create 404 page `src/app/not-found.tsx`: friendly message with navigation links back to homepage
- [ ] T048 [P] Generate sitemap: build-time `sitemap.xml` covering all posts, pages, categories, tags, and archive months (via `next-sitemap` or custom build script)
- [ ] T049 [P] Generate RSS feed: build-time `public/feed.xml` with all posts (title, date, excerpt, link)
- [ ] T050 Responsive QA: verify all pages are usable on mobile (text readable without horizontal scrolling, navigation accessible, sidebar collapses correctly) per FR-019
- [ ] T051 Lighthouse optimization: target Performance >= 90, FCP < 1.5s, total JS bundle < 200kB — optimize images, verify code splitting, minimize client component JS
- [ ] T052 Run `scripts/validate-migration.ts` final pass: confirm 100% post count (SC-001), all code blocks highlighted (SC-002), no broken images (SC-003), all sidebar elements present (SC-006)
- [ ] T053 Run quickstart.md validation: follow the quickstart.md steps from scratch to confirm a new developer can set up and build the project

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user stories
- **US1 (Phase 3)**: Depends on Foundational — delivers MVP
- **US2 (Phase 4)**: Depends on Foundational — can run in parallel with US1 (different files)
- **US3 (Phase 5)**: Depends on Foundational — can run in parallel with US1/US2
- **US4 (Phase 6)**: Depends on Foundational — benefits from US2 components (PostCard) but not strictly required
- **US5 (Phase 7)**: Depends on US1 (needs post pages to exist for Pagefind indexing)
- **US6 (Phase 8)**: Depends on US1 (integrates into post page)
- **Polish (Phase 9)**: Depends on all user stories being complete

### User Story Dependencies

- **US1 (P1)**: Can start after Foundational (Phase 2) — No dependencies on other stories
- **US2 (P2)**: Can start after Foundational (Phase 2) — Independent of US1 (different route files)
- **US3 (P3)**: Can start after Foundational (Phase 2) — Fully independent
- **US4 (P4)**: Can start after Foundational (Phase 2) — Enhances layout from US1 but does not require it
- **US5 (P5)**: Requires US1 post pages to be built for Pagefind to index them
- **US6 (P6)**: Requires US1 post page route to exist (comments render on post pages)

### Within Each User Story

- Types/models before services
- Content loading API before route pages
- Components before pages that use them
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel (T004, T005, T006, T007)
- Foundational: T011, T014, T015, T017 can run in parallel with each other (after T009 types exist)
- US1: T020, T021, T022 (three embed/display components) can run in parallel
- US2: T029, T030, T031 (category, tag, archive pages) can run in parallel
- US4: T036, T037 (TagCloud, DarkModeToggle) can run in parallel
- US6: T044 (Comment component) can be built in parallel with other stories
- Polish: T047, T048, T049 (404, sitemap, RSS) can run in parallel

---

## Parallel Example: Phase 2 Foundational

```
# After T009 (types) and T010 (constants) are done:

# These can run in parallel:
Task T011: "Create utility functions in src/lib/utils.ts"
Task T014: "Create image download script scripts/download-images.ts"
Task T015: "Create migration validation script scripts/validate-migration.ts"
Task T017: "Create content/data/blogroll.json with 11 entries"
```

## Parallel Example: User Story 1 Components

```
# After T018 (root layout) is done:

# These three components can be built in parallel:
Task T020: "Create GistEmbed.tsx client component"
Task T021: "Create TweetEmbed.tsx server component"
Task T022: "Create QuotePost.tsx server component"
```

## Parallel Example: User Story 2 Listing Pages

```
# After T026 (PostCard) and T027 (PostList) are done:

# These three routes can be built in parallel:
Task T029: "Create category page src/app/category/[slug]/page.tsx"
Task T030: "Create tag page src/app/tag/[slug]/page.tsx"
Task T031: "Create archive page src/app/archive/[year]/[month]/page.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL — blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Open 5 representative posts at their original URLs, verify content fidelity
5. Deploy if ready — the blog is readable

### Incremental Delivery

1. Setup + Foundational -> Foundation ready
2. Add US1 -> Test post rendering -> Deploy (MVP!)
3. Add US2 -> Test browsing/listing -> Deploy
4. Add US3 -> Test CV page -> Deploy
5. Add US4 -> Test sidebar/identity -> Deploy
6. Add US5 -> Test search -> Deploy
7. Add US6 -> Test comments -> Deploy
8. Polish -> Final QA -> Deploy

### Parallel Team Strategy

With multiple developers after Foundational is done:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: US1 (post rendering) + US6 (comments — integrates into US1)
   - Developer B: US2 (browsing/listing) + US3 (static pages)
   - Developer C: US4 (sidebar/identity) + US5 (search — needs US1 pages built first)
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies between them
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- No test tasks included — tests were not requested in the spec
- Constitution check: all tasks maintain Simplicity (static export, minimal deps) and Content-First (MDX canonical)

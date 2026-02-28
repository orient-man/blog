# Feature Specification: Fix Gist Embeds Not Rendering

**Feature Branch**: `003-fix-gist-embeds`  
**Created**: 2026-02-28  
**Status**: Draft  
**Input**: User description: "Fix 'Gist Embeds Not Rendering' issue from specs/001-wordpress-blog-migration/migration-audit.md"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Reader Sees Gist Code Inline (Priority: P1)

A blog reader visits one of the 5 affected posts and sees the referenced GitHub Gist code
displayed inline within the post body, rather than a bare URL or plain-text link.
The code is visually formatted and readable without requiring the reader to leave the blog.

**Why this priority**: This is the core problem — 8 gist references across 5 posts are
currently non-functional. Readers see meaningless URLs instead of the code samples that
are essential to understanding each post's technical content.

**Independent Test**: Visit any of the 5 affected posts and confirm that every gist
reference renders visible code content inline, without navigating away from the page.

**Acceptance Scenarios**:

1. **Given** a reader visits `blanket-js-qunit-and-ie8-please-die-now`, **When** the page loads, **Then** all 3 gist references display their code content inline within the post body.
2. **Given** a reader visits `fun-with-castle-dynamicproxy`, **When** the page loads, **Then** both gist references display their code content inline within the post body.
3. **Given** a reader visits `fun-with-castle-dynamicproxy-part-ii`, **When** the page loads, **Then** the gist reference displays its code content inline.
4. **Given** a reader visits `explaining-sqlite-foreign-keys-support-with-unit-tests`, **When** the page loads, **Then** the gist reference displays its code content inline.
5. **Given** a reader visits `how-to-put-your-toe-into-asp-net-mvc-integration-testing`, **When** the page loads, **Then** the gist reference (which includes a username in the URL) displays its code content inline.

---

### User Story 2 - Gist Code Has Syntax Highlighting (Priority: P2)

When gist code is displayed inline, it SHOULD have syntax highlighting appropriate to the
programming language used in the gist (e.g., C#, JavaScript, F#).
This makes code samples readable and consistent with standard developer blog conventions.

**Why this priority**: Syntax highlighting significantly improves readability of code
samples, but the gist content is still useful without it.
This is an enhancement on top of the P1 rendering fix.

**Independent Test**: Visit a post with a gist containing C# or JavaScript code and
confirm the rendered code block displays with language-appropriate color highlighting.

**Acceptance Scenarios**:

1. **Given** a gist contains code in a recognized language, **When** the post renders, **Then** the code block displays with syntax highlighting for that language.
2. **Given** a gist contains code in an unrecognized or unspecified language, **When** the post renders, **Then** the code block displays as plain monospaced text without errors.

---

### User Story 3 - Markdown Gist Links Remain Unchanged (Priority: P3)

Posts that already use gist URLs as standard Markdown link targets (e.g., `[text](gist-url)`)
MUST NOT be altered.
Only bare, unlinked gist URLs should be transformed into embedded code.

**Why this priority**: Prevents regression in posts that correctly use gist URLs as
navigation links.
One known case exists in
`checking-for-outdated-package-references-during-build-with-fake-paket.mdx`.

**Independent Test**: Visit the post containing the Markdown-linked gist and confirm it
still renders as a clickable text link, not an embedded code block.

**Acceptance Scenarios**:

1. **Given** a post contains a gist URL as a Markdown link target `[text](gist-url)`, **When** the page renders, **Then** the URL remains a clickable link pointing to the gist on GitHub.
2. **Given** a post contains a bare gist URL not wrapped in Markdown link syntax, **When** the page renders, **Then** the URL is replaced with inline code content.

---

### Edge Cases

- What happens when GitHub is unreachable or a gist returns an error?
  The system MUST render gracefully — either a cached/static version of the code or a
  fallback link to the gist on GitHub.
- What happens when a gist URL uses the legacy short numeric ID format (e.g., `/4538958`)
  vs. the username-prefixed format (e.g., `/orient-man/7804310`)?
  Both formats MUST be handled.
- What happens when a gist contains multiple files?
  The system MUST display all files from the gist, or clearly indicate which file is shown.
- What happens when a gist has been deleted from GitHub?
  The system MUST NOT crash or produce a build error; a fallback message or link SHOULD
  be displayed.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST render inline code content for all 8 bare gist URLs across the 5 affected posts.
- **FR-002**: The system MUST support both legacy short-form gist IDs (e.g., `4538958`) and username-prefixed gist URLs (e.g., `orient-man/7804310`).
- **FR-003**: The system MUST NOT modify gist URLs that are used as standard Markdown link targets (e.g., `[text](url)`).
- **FR-004**: The system MUST render gist code content without requiring readers to navigate to an external site.
- **FR-005**: The system MUST produce valid static HTML output compatible with the existing static export build process.
- **FR-006**: The system SHOULD apply syntax highlighting to rendered gist code when the programming language can be determined from gist metadata.
- **FR-007**: The system MUST handle gist unavailability gracefully — if a gist cannot be retrieved, a fallback (link to GitHub or descriptive message) MUST be shown instead of producing a build failure.
- **FR-008**: The system MUST handle multi-file gists by displaying all files contained in the gist.
- **FR-009**: The rendered gist code MUST be visually consistent with other code displays on the blog (matching existing code block styling).

### Key Entities

- **Gist Reference**: A URL matching the pattern `https://gist.github.com/{id}` or
  `https://gist.github.com/{username}/{id}` appearing as bare text (not inside Markdown
  link syntax) in post content.
  8 known instances across 5 posts.
- **Gist Content**: The source code file(s) contained within a GitHub Gist, including
  filename and language metadata used to determine syntax highlighting.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All 8 gist references across 5 posts render visible code content when viewed — zero bare gist URLs remain in the rendered page output.
- **SC-002**: The blog's static build completes successfully with no errors related to gist content retrieval or rendering.
- **SC-003**: All existing Markdown-linked gist URLs (at least 1 known instance) continue to render as clickable links, confirmed by visual inspection.
- **SC-004**: Both gist URL formats (numeric-only and username-prefixed) render correctly — verified across all 8 instances covering both format types.
- **SC-005**: When a gist is unavailable, the affected post still renders and serves a readable fallback rather than failing the build or showing an empty section.

## Assumptions

- The 8 gist URLs documented in the migration audit are the complete set of bare gist URLs
  across all posts.
  No additional undocumented instances exist.
- The referenced gists are public GitHub Gists accessible without authentication.
- The existing `format: 'md'` compilation mode is preserved — the fix MUST work within
  the Markdown-only rendering pipeline without switching to full MDX mode.
- The existing `GistEmbed.tsx` component MAY be reused, modified, or replaced as needed
  by the implementation — there is no requirement to preserve its current form.
- Gist content retrieval happens at build time (the site is statically exported), not at
  runtime in the reader's browser.
- The GitHub Gist API does not require authentication for public gist access.

## Scope Boundaries

**In scope:**

- Rendering the 8 identified bare gist URLs as inline code in the 5 affected posts
- Supporting both legacy numeric and username-prefixed gist URL formats
- Graceful fallback when a gist is unavailable
- Syntax highlighting for rendered gist code (language from gist metadata)
- Multi-file gist display

**Out of scope:**

- Gist URLs correctly used as Markdown link targets (already working, must not change)
- Tweet embed rendering (separate audit item)
- Adding fenced code blocks to non-gist code samples (separate audit item)
- Changes to the `format: 'md'` compilation mode
- Support for private gists requiring authentication
- Adding gist embed capability to new posts created after this fix

# Feature Specification: Fix Gist Embeds Not Rendering

**Feature Branch**: `003-fix-gist-embeds`  
**Created**: 2026-02-28  
**Status**: Draft  
**Input**: User description: "Fix 'Gist Embeds Not Rendering' issue from specs/001-wordpress-blog-migration/migration-audit.md"

## Clarifications

### Session 2026-02-28

- Q: Embed strategy — build-time auto-embed, manual inline, or client-side iframe? → A: Manual inline — fetch each gist once and paste as fenced code blocks directly in the post files.
- Q: Should embedded code blocks include attribution to the original gist? → A: Yes — include a `[View on GitHub](url)` link below each code block.

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
Only bare, unlinked gist URLs should be replaced with pasted inline code.

**Why this priority**: Prevents regression in posts that correctly use gist URLs as
navigation links.
One known case exists in
`checking-for-outdated-package-references-during-build-with-fake-paket.mdx`.

**Independent Test**: Visit the post containing the Markdown-linked gist and confirm it
still renders as a clickable text link, not a code block.

**Acceptance Scenarios**:

1. **Given** a post contains a gist URL as a Markdown link target `[text](gist-url)`, **When** the page renders, **Then** the URL remains a clickable link pointing to the gist on GitHub.
2. **Given** a post contains a bare gist URL not wrapped in Markdown link syntax, **When** the page renders, **Then** the URL is replaced with a pasted fenced code block followed by a `[View on GitHub](url)` link.

---

### Edge Cases

- What happens if a gist is unretrievable at the time of content migration?
  The author MUST replace the bare URL with a descriptive fallback link to the gist on
  GitHub (e.g., `[View gist on GitHub](url)`), so the post contains no broken or empty content.
- What happens when a gist URL uses the legacy short numeric ID format (e.g., `/4538958`)
  vs. the username-prefixed format (e.g., `/orient-man/7804310`)?
  Both formats MUST be handled identically — content pasted as fenced code blocks.
- What happens when a gist contains multiple files?
  All files MUST be pasted as separate fenced code blocks, each labeled with the filename.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The 8 bare gist URLs across the 5 affected posts MUST be replaced with fenced code blocks containing the gist content pasted directly into each post file.
- **FR-002**: Both legacy short-form gist IDs (e.g., `4538958`) and username-prefixed gist URLs (e.g., `orient-man/7804310`) MUST be retrieved and inlined.
- **FR-003**: Gist URLs used as standard Markdown link targets (e.g., `[text](url)`) MUST NOT be modified.
- **FR-004**: Gist code content MUST be embedded as static text directly within post files, requiring no external fetching at build time or runtime.
- **FR-005**: The post files MUST remain valid Markdown and produce valid static HTML output compatible with the existing static export build process.
- **FR-006**: Each fenced code block SHOULD carry the correct language tag (e.g., ` ```csharp `) so syntax highlighting activates via the existing highlighting pipeline.
- **FR-007**: If a gist is unretrievable at the time of content migration, the author MUST include a descriptive fallback link to the gist on GitHub in place of the code block.
- **FR-008**: For multi-file gists, all files MUST be pasted as separate fenced code blocks, each labeled with the filename.
- **FR-009**: The rendered gist code MUST be visually consistent with other code displays on the blog (matching existing code block styling).
- **FR-010**: Each embedded gist code block MUST be followed by a `[View on GitHub](url)` link to the original GitHub Gist.

### Key Entities

- **Gist Reference**: A URL matching the pattern `https://gist.github.com/{id}` or
  `https://gist.github.com/{username}/{id}` appearing as bare text (not inside Markdown
  link syntax) in post content.
  8 known instances across 5 posts.
- **Gist Content**: The source code file(s) contained within a GitHub Gist, including
  filename and language metadata used to determine the fenced code block language tag.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All 8 gist references across 5 posts render visible code content when viewed — zero bare gist URLs remain in the rendered page output.
- **SC-002**: The blog's static build completes successfully with no errors related to post content.
- **SC-003**: All existing Markdown-linked gist URLs (at least 1 known instance) continue to render as clickable links, confirmed by visual inspection.
- **SC-004**: Both gist URL formats (numeric-only and username-prefixed) are inlined correctly — verified across all 8 instances.
- **SC-005**: Each inlined code block is followed by a `[View on GitHub](url)` link pointing to the original gist.
- **SC-006**: If any gist was unretrievable at content-migration time, its post contains a descriptive fallback link to GitHub rather than missing or broken content.

## Assumptions

- The 8 gist URLs documented in the migration audit are the complete set of bare gist URLs
  across all posts.
  No additional undocumented instances exist.
- The referenced gists are currently public and accessible for one-time manual content retrieval.
- The existing `format: 'md'` compilation mode is preserved — embedded code uses standard
  Markdown fenced code blocks, requiring no changes to the rendering pipeline.
- The existing `GistEmbed.tsx` component is not used by this feature and MAY be removed or
  retained independently.
- Gist content is captured once during development and pasted into post files as static
  Markdown. There is no ongoing dependency on GitHub availability at build or read time.

## Scope Boundaries

**In scope:**

- Replacing all 8 bare gist URLs in 5 post files with pasted fenced code blocks
- Including a `[View on GitHub](url)` attribution link after each code block
- Using correct language tags on fenced code blocks to activate syntax highlighting
- Handling multi-file gists by pasting all files as separate code blocks
- Providing a fallback link for any gist that cannot be retrieved

**Out of scope:**

- Gist URLs correctly used as Markdown link targets (already working, must not change)
- Automated gist fetching at build time or runtime
- Tweet embed rendering (separate audit item)
- Adding fenced code blocks to non-gist code samples (separate audit item)
- Changes to the `format: 'md'` compilation mode
- Support for private gists requiring authentication

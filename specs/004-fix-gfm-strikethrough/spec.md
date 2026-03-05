# Feature Specification: Fix GFM Strikethrough Rendering

**Feature Branch**: `004-fix-gfm-strikethrough`  
**Created**: 2026-03-01  
**Status**: Draft  
**Input**: User description: "fix: strikethrough (~~) formatting is not working in my blog posts"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Strikethrough Text Renders Correctly (Priority: P1)

A blog reader visits a post that contains strikethrough formatting (e.g., `~~framework~~`).
Instead of seeing the raw tilde characters, the reader sees the word displayed with a horizontal line through it, clearly indicating the author's intent to mark the text as deleted or corrected.

**Why this priority**: This is the core defect being fixed. At least one published post ("There Is No Such Thing as a Free (Free Monad)") uses `~~framework~~` syntax that currently renders as literal `~~framework~~` instead of struck-through text. This degrades the author's intended meaning for readers.

**Independent Test**: Can be fully tested by opening the affected post in a browser and confirming the strikethrough text is visually styled with a line-through decoration.

**Acceptance Scenarios**:

1. **Given** a blog post containing `~~framework~~` in its Markdown content, **When** a reader opens the post in any modern browser, **Then** the word "framework" is displayed with a visible line-through decoration and the tilde characters are not shown.
2. **Given** a blog post containing a sentence with mixed formatting such as `**bold** and ~~struck~~`, **When** a reader views the post, **Then** each formatting type renders correctly and they do not interfere with each other.
3. **Given** a blog post with no strikethrough syntax, **When** a reader opens the post, **Then** the post renders exactly as before with no visual changes or regressions.

---

### User Story 2 - Author Uses Strikethrough in Future Posts (Priority: P2)

A blog author writes a new post and uses the standard `~~text~~` syntax to indicate corrections, humorous asides, or editorial revisions.
The author expects this widely-recognized Markdown convention to work without any special configuration or workarounds.

**Why this priority**: Beyond fixing existing content, the author needs confidence that standard GFM formatting conventions work reliably for all future posts. This eliminates the need for HTML workarounds like `<del>text</del>`.

**Independent Test**: Can be tested by creating a new post with strikethrough syntax, building the site, and confirming the rendered output displays line-through text.

**Acceptance Scenarios**:

1. **Given** the author creates a new blog post with `~~outdated information~~` in the body, **When** the site is built and the post is viewed, **Then** "outdated information" renders with a line-through decoration.
2. **Given** the author uses strikethrough across multiple paragraphs and alongside other formatting, **When** the site is built, **Then** all strikethrough instances render correctly without breaking adjacent content.

---

### User Story 3 - Other GFM Extensions Continue Working (Priority: P3)

As a side effect of enabling strikethrough support, other GitHub Flavored Markdown extensions become available.
If the author later uses GFM tables, task lists, or autolinks in posts, these SHOULD also render correctly.

**Why this priority**: While no existing posts currently use GFM tables or task lists, enabling the GFM processing layer provides these capabilities for free. This prevents the same class of bug from arising for other GFM features in the future.

**Independent Test**: Can be tested by creating a test post containing a GFM table and a task list, building the site, and confirming they render as structured HTML elements.

**Acceptance Scenarios**:

1. **Given** a post contains a GFM pipe-delimited table, **When** the post is rendered, **Then** the table displays as a structured HTML table with proper rows and columns.
2. **Given** a post contains a task list (`- [x] done`, `- [ ] pending`), **When** the post is rendered, **Then** the list displays with checkboxes indicating completion state.

---

### Edge Cases

- What happens when tildes appear in non-strikethrough contexts (e.g., a code block containing `~/.bashrc` or inline code with `~~`)?
  - Tildes inside fenced code blocks and inline code spans MUST be preserved as literal characters and NOT converted to strikethrough.
- What happens when strikethrough spans multiple lines (e.g., `~~start\n...end~~`)?
  - Multi-line strikethrough SHOULD follow GFM specification behavior (strikethrough does not span across block-level elements).
- What happens when the `~~` markers are unmatched (e.g., `~~orphaned`)?
  - Unmatched tildes MUST render as literal `~~` characters, per GFM specification.
- What happens to existing posts that do not use any GFM-specific features?
  - They MUST render identically to their current output with zero regressions.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The content rendering pipeline MUST convert `~~text~~` syntax to visually struck-through text in all blog post pages.
- **FR-002**: Strikethrough rendering MUST work in both existing posts and newly created posts without any per-post configuration.
- **FR-003**: Tildes inside fenced code blocks and inline code spans MUST remain as literal characters and MUST NOT be converted to strikethrough.
- **FR-004**: The fix MUST NOT break any existing rendered content, including syntax highlighting, inline formatting (bold, italic, links), or block-level elements (headings, lists, blockquotes).
- **FR-005**: The fix MUST apply to all content rendering paths used by blog posts and static pages.
- **FR-006**: Other GFM extensions (tables, task lists, autolinks) SHOULD also render correctly as a natural consequence of the fix.
- **FR-007**: The static export build process MUST continue to succeed without errors after the fix is applied.

## Assumptions

- The `~~text~~` syntax follows the [GitHub Flavored Markdown Spec](https://github.github.com/gfm/#strikethrough-extension-) definition of strikethrough.
- The blog's content compilation pipeline supports adding processing steps (remark plugins or equivalent) without requiring a fundamental architecture change.
- The author's existing use of `~~framework~~` in "There Is No Such Thing as a Free (Free Monad)" is the only currently affected post, though the fix must be generic.
- The fix aligns with the project constitution's simplicity principle: it addresses a standard Markdown convention that readers and authors expect to work out of the box.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of `~~text~~` occurrences in blog post content render with a visible line-through decoration across all modern browsers (Chrome, Firefox, Safari, Edge).
- **SC-002**: Zero visual regressions in any of the 33 existing blog posts after the fix is applied.
- **SC-003**: The site builds successfully with no new errors or warnings related to the content rendering pipeline.
- **SC-004**: Tildes in code blocks remain untouched -- any existing inline code or fenced code block containing `~` characters renders identically to its pre-fix output.

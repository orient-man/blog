# Feature Specification: Syntax Highlighting for Code Blocks

**Feature Branch**: `005-syntax-highlighting`  
**Created**: 2026-03-01  
**Status**: Draft  
**Input**: User description: "add feature: syntax highlighting for code blocks"

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Reader Views Code with Language-Appropriate Highlighting (Priority: P1)

A blog reader navigates to a post that contains code samples (e.g., a C# tutorial or an F# functional programming discussion).
The code blocks on the page display with syntax highlighting that matches the programming language used, making keywords, strings, types, and comments visually distinct.
The reader can quickly scan and understand the code structure without manually parsing raw text.

**Why this priority**: Syntax highlighting is the core value proposition of this feature.
Without it, code-heavy posts (the majority of the blog's technical content) are significantly harder to read.
This directly fulfills the blog's Content-First principle by prioritizing the reading experience.

**Independent Test**: Can be fully tested by opening any code-heavy post (e.g., one containing C# or F# samples) and verifying that code blocks display with colored, language-aware highlighting.
Delivers immediate reading-experience improvement.

**Acceptance Scenarios**:

1. **Given** a post contains a fenced code block with a language tag (e.g., ` ```csharp `), **When** the reader loads the page, **Then** the code renders with syntax highlighting appropriate to that language (keywords, strings, comments, and types are visually differentiated).
2. **Given** a post contains multiple code blocks in different languages (e.g., C# and JavaScript), **When** the reader views the page, **Then** each code block is highlighted according to its own language, not a single shared style.
3. **Given** a post contains a fenced code block without a language tag, **When** the reader loads the page, **Then** the code block renders as plain monospaced text without broken or incorrect highlighting.

---

### User Story 2 - Reader Views Code Comfortably in Light and Dark Themes (Priority: P2)

A blog reader views code blocks and the highlighting colors are appropriate for the current visual theme.
In a light-background context, colors are readable against a light surface.
In a dark-background context, colors are readable against a dark surface.
The reader never encounters low-contrast or invisible text in code blocks.

**Why this priority**: The blog already uses dual themes (light/dark).
If highlighting colors clash with the background theme, code becomes harder to read than having no highlighting at all.
This is essential for accessibility and reading comfort.

**Independent Test**: Can be tested by switching between light and dark theme contexts and verifying code block text remains readable with appropriate contrast in both.

**Acceptance Scenarios**:

1. **Given** a reader views a highlighted code block in a light theme context, **When** they inspect the code, **Then** all highlighted text has sufficient contrast against the light background (minimum WCAG AA contrast ratio of 4.5:1 for normal text).
2. **Given** a reader views the same code block in a dark theme context, **When** they inspect the code, **Then** all highlighted text has sufficient contrast against the dark background.
3. **Given** a reader switches from light to dark theme (or vice versa), **When** they view a code block, **Then** the highlighting colors adapt to remain readable in the new theme.

---

### User Story 3 - All Code-Heavy Posts Display Highlighting After Migration (Priority: P2)

A blog reader browses older posts that were migrated from WordPress.
Any code samples in these posts -- whether originally pasted as raw text, inline backtick spans, or gist references -- now appear as properly formatted, syntax-highlighted code blocks.
The reader experiences consistent code presentation across all posts regardless of their original publication date.

**Why this priority**: The migration audit identified that many posts have code content not wrapped in fenced code blocks, meaning the highlighting pipeline cannot activate on them.
Addressing this content gap is what makes the highlighting feature actually useful across the entire blog, not just new posts.

**Independent Test**: Can be tested by selecting 5 code-heavy posts from different time periods and verifying each one displays highlighted code blocks where code content exists.

**Acceptance Scenarios**:

1. **Given** a migrated post contains code that was originally raw text or inline backtick spans, **When** a reader views the post, **Then** the code appears in a properly formatted code block with syntax highlighting.
2. **Given** a migrated post has code samples in a specific language (e.g., C#), **When** the reader views the post, **Then** the code block carries the correct language tag so highlighting matches the language used.
3. **Given** a migrated post contained a mix of code and prose, **When** the reader views the post, **Then** only the code portions are in code blocks; surrounding prose remains as regular text.

---

### User Story 4 - Author Writes New Posts with Highlighting (Priority: P3)

A blog author creates a new post containing code samples.
They write standard Markdown fenced code blocks with a language identifier (e.g., ` ```csharp `).
When the post is published, the code blocks automatically render with syntax highlighting without any additional steps or configuration.

**Why this priority**: Supporting new content authoring is important but secondary to fixing the existing content gap.
The authoring workflow already supports fenced code blocks via standard Markdown conventions.

**Independent Test**: Can be tested by creating a new MDX file with fenced code blocks in various languages, building the site, and verifying the output contains highlighted code.

**Acceptance Scenarios**:

1. **Given** an author creates a new post with a ` ```csharp ` fenced code block, **When** the site is built, **Then** the published post displays the code with C# syntax highlighting.
2. **Given** an author uses an unsupported or misspelled language tag (e.g., ` ```cshapr `), **When** the site is built, **Then** the code renders as plain monospaced text and the build does not fail.

---

### Edge Cases

- What happens when a code block has no language tag? It MUST render as plain monospaced text without errors.
- What happens when a code block uses a language tag not supported by the highlighter? It MUST fall back to plain monospaced text gracefully.
- What happens when code contains special characters (e.g., HTML entities like `<`, `>`, `&`)? They MUST render correctly without being interpreted as markup.
- What happens when a very long code line exceeds the viewport width? The code block MUST remain usable (horizontal scrolling or wrapping).
- What happens when a code block is empty (opening and closing fence with no content)? It MUST not cause a rendering error.
- What happens when code appears inside inline backticks rather than fenced blocks? Inline code MUST remain styled as inline code and not be processed through the block highlighting pipeline.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: The blog MUST render fenced code blocks with syntax highlighting for all languages used in existing posts (at minimum: C#, F#, C++, JavaScript, TypeScript, HTML, CSS, XML, Bash, and Diff).
- **FR-002**: Each fenced code block MUST carry the correct language tag corresponding to the code's actual programming language.
- **FR-003**: All existing posts with code content that is not currently in fenced code blocks MUST be audited and converted to properly tagged fenced code blocks.
- **FR-004**: The blog MUST support dual-theme highlighting -- code MUST be readable in both light and dark visual contexts.
- **FR-005**: Code blocks without a language tag MUST render as plain monospaced text without errors or broken highlighting.
- **FR-006**: Code blocks with an unrecognized language tag MUST fall back gracefully to plain monospaced text.
- **FR-007**: Syntax highlighting MUST occur at build time, producing static output with no client-side rendering overhead.
- **FR-008**: The highlighting MUST NOT break or alter existing rendered content (prose, images, links, other formatting).
- **FR-009**: Long code lines MUST be handled with horizontal scrolling to prevent layout overflow.
- **FR-010**: Special characters in code (e.g., `<`, `>`, `&`, quotes) MUST render literally, not be interpreted as markup.
- **FR-011**: Inline code (single backtick) MUST NOT be processed by the block-level highlighting pipeline.
- **FR-012**: Fenced code blocks MUST display line numbers to aid reference and readability.
- **FR-013**: Fenced code blocks MUST include a copy-to-clipboard button that copies the raw code text to the user's clipboard; a minimal client-side script is acceptable for this interaction only.
- **FR-014**: The content audit for un-fenced code MUST follow a hybrid approach: a script identifies posts that likely contain un-fenced code (commands, config snippets, multi-line code), and the author manually reviews and converts each flagged post to a properly tagged fenced code block.

### Assumptions

- The highlighting infrastructure (build-time highlighter with VS Code TextMate grammars) is already installed and configured in the project per the decisions documented in specs/001-wordpress-blog-migration.
- The dual-theme configuration (github-dark / github-light) is already in place with supporting styles.
- The content audit from spec 003 (gist embeds) has already converted some gist references to fenced code blocks in approximately 5 posts. This feature covers the remaining posts.
- Posts that reference code only via external links (and do not contain actual code text in the post body) are out of scope -- no fenced code blocks need to be created for them.
- The minimum set of supported languages (C#, F#, C++, JavaScript, TypeScript, HTML, CSS, XML, Bash, Diff) covers all languages found in existing posts. If additional languages are discovered during the audit, they will be added.
- Of the 33 migrated posts, approximately 22 have no fenced code blocks; however only an estimated 5-8 of those actually contain code content (commands, config snippets, or multi-line code). These are the posts requiring manual conversion. The remaining posts without fenced blocks are prose-only and need no action.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: 100% of posts containing code samples display syntax-highlighted code blocks when viewed in a browser (verified by auditing every code-heavy post).
- **SC-002**: All code blocks render with readable contrast in both light and dark theme contexts (minimum WCAG AA contrast ratio of 4.5:1).
- **SC-003**: Code blocks in at least 10 distinct languages render with language-appropriate highlighting (keywords, strings, types, and comments are visually differentiated).
- **SC-004**: Zero build failures or rendering errors caused by code block content (including empty blocks, missing language tags, or special characters).
- **SC-005**: Page load performance is unchanged -- syntax highlighting adds zero additional client-side processing time (all highlighting is pre-rendered at build time). The copy-to-clipboard button is the sole permitted client-side interaction; its script MUST be minimal (no additional library dependencies).
- **SC-006**: The site build completes successfully with all code blocks highlighted, verified by building the full site and spot-checking at least 5 code-heavy posts.

## Dependencies

- **Spec 001** (WordPress Blog Migration): Defines the core requirement for syntax highlighting (FR-003) and the technology decision for the highlighting pipeline.
- **Spec 003** (Fix Gist Embeds): Has already converted some gist URLs to fenced code blocks in approximately 5 posts. This feature covers the remaining code content across all posts.
- **Spec 004** (Fix GFM Strikethrough): Confirmed that the remark/rehype pipeline order is compatible and the strikethrough fix does not interfere with highlighting.

## Clarifications

### Session 2026-03-01

- Q: Are line numbers and copy-to-clipboard in scope for this feature, or explicitly out of scope? → A: Both are in scope — include line numbers on fenced code blocks and a copy-to-clipboard button.
- Q: What approach should be used to audit and convert un-fenced code posts? → A: Hybrid — a script identifies posts likely containing un-fenced code, and the author manually reviews and converts each flagged post.
- Q: How many posts are expected to require code block conversion during the audit? → A: Medium scope (~5-8 posts) — posts containing any code content (commands, config snippets, or multi-line blocks), not just posts with obvious multi-line code.

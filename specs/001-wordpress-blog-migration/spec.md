# Feature Specification: WordPress Blog Migration

**Feature Branch**: `001-wordpress-blog-migration`  
**Created**: 2026-02-26  
**Status**: Draft  
**Input**: User description: "Migrate all content and features from the existing WordPress blog at orientman.wordpress.com to a new static blog"

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Read Any Existing Blog Post (Priority: P1)

A reader navigates to the new blog and reads any post that previously existed on the WordPress blog. The post displays its full content faithfully — including text, code snippets with syntax highlighting, embedded images, and embedded GitHub gists. The post shows its original publication date, author, categories, and tags.

**Why this priority**: Without faithful content rendering, the blog has no value. This is the foundational requirement — every other feature depends on content being present and readable.

**Independent Test**: Can be fully tested by selecting 5 representative posts (one code-heavy, one with embedded images, one with a gist embed, one quote-type post, one Polish-language post) and verifying each renders correctly with all its original content elements intact.

**Acceptance Scenarios**:

1. **Given** the new blog is deployed, **When** a reader opens any migrated post, **Then** they see the full original post content including title, publication date, author name ("Marcin Malinowski"), body text, and all inline media.
2. **Given** a post contains code snippets, **When** a reader views that post, **Then** code blocks are displayed with syntax highlighting appropriate to the language (e.g., C#, F#, JavaScript).
3. **Given** a post contains an embedded GitHub gist, **When** a reader views that post, **Then** the gist content is displayed (either embedded live or as a formatted code block with a link to the original gist).
4. **Given** a post contains embedded images, **When** a reader views that post, **Then** all images are displayed correctly (hosted locally or via preserved external URLs).
5. **Given** a post is a "quote" format type, **When** a reader views it, **Then** it is visually distinguished from standard posts (e.g., styled as a blockquote).

---

### User Story 2 - Browse and Discover Posts (Priority: P2)

A reader visits the blog homepage and sees a paginated or scrollable list of posts, ordered newest-first. They can browse by category (English posts vs. Polish posts), by tag (e.g., "F#", ".NET", "TDD"), and by date archive (monthly). They can navigate between post listings and individual posts easily.

**Why this priority**: Content discovery is the second most important feature after content itself. Without browsing and filtering, readers cannot find relevant posts among the ~6+ years of archives.

**Independent Test**: Can be fully tested by navigating the homepage, clicking through to category pages ("Posts In English", "Wpisy po polsku"), clicking a tag (e.g., "F#"), and clicking an archive month — each should show the correct filtered set of posts.

**Acceptance Scenarios**:

1. **Given** the blog homepage is loaded, **When** a reader views it, **Then** they see a list of posts ordered by publication date (newest first) with post titles, dates, and excerpts or summaries.
2. **Given** the blog has 2 categories ("Posts In English (Wpisy po angielsku)" and "Wpisy po polsku (Posts In Polish)"), **When** a reader clicks a category, **Then** only posts belonging to that category are listed.
3. **Given** the blog has 40+ tags, **When** a reader clicks a tag (e.g., ".NET"), **Then** only posts tagged with that label are listed.
4. **Given** the blog spans February 2011 to August 2017, **When** a reader selects a month from the archive, **Then** only posts from that month are listed.
5. **Given** the post listing has many entries, **When** a reader reaches the end of the visible list, **Then** they can access additional posts (via pagination, infinite scroll, or similar mechanism).

---

### User Story 3 - View Static Pages (Priority: P3)

A reader navigates to the "Curriculum Vitae" page (or any other static page from the original blog). The page renders its full content and is accessible from the site navigation.

**Why this priority**: Static pages are low in volume (only the CV page was identified) but important for completeness — they represent evergreen content distinct from date-ordered posts.

**Independent Test**: Can be fully tested by clicking the CV link in the site navigation and verifying the full page content renders correctly.

**Acceptance Scenarios**:

1. **Given** the original blog has a "Curriculum Vitae" static page, **When** a reader navigates to it via the site menu, **Then** the full CV content is displayed.
2. **Given** a static page exists, **When** it is accessed, **Then** it is visually distinct from blog posts (no publication date, no category/tag metadata displayed).

---

### User Story 4 - Site Identity and Sidebar Information (Priority: P4)

A reader sees the blog's identity — title ("Just A Programmer"), subtitle ("Don Quixote fighting entropy"), and author bio in an about section. Supplementary navigation elements are available: a tag cloud, categories list, recent posts, archive links, and a blogroll ("Blogs I Follow" with 11 external blog links).

**Why this priority**: Site identity and sidebar content provide context and personality. They are not essential for reading individual posts but contribute to the blog's completeness and navigability.

**Independent Test**: Can be fully tested by loading any page and verifying the site title, subtitle, about section, tag cloud, categories list, and blogroll are present and functional.

**Acceptance Scenarios**:

1. **Given** any page is loaded, **When** a reader views the site header or branding area, **Then** they see the blog title "Just A Programmer" and subtitle "Don Quixote fighting entropy".
2. **Given** the sidebar (or equivalent navigation area) is visible, **When** a reader views it, **Then** they see an author bio/about section, a tag cloud or tag list, a categories list, recent posts links, and archive links.
3. **Given** the original blog had a "Blogs I Follow" widget with 11 external blogs, **When** a reader views the blogroll, **Then** all 11 blogs are listed with working links to their URLs.

---

### User Story 5 - Search Across Posts (Priority: P5)

A reader searches for a keyword (e.g., "F# monads") and sees a list of matching posts. Search works across post titles, content, tags, and categories.

**Why this priority**: Search is a convenience feature. With ~6 years of technical content, it's valuable but not essential — readers can also browse by category, tag, and archive. Given the static site constraint, search must work without a server-side backend.

**Independent Test**: Can be fully tested by searching for a known term that appears in specific posts and verifying those posts appear in results.

**Acceptance Scenarios**:

1. **Given** the blog has a search input, **When** a reader types a query and submits, **Then** matching posts are listed with titles and links.
2. **Given** a search query matches content in post bodies, titles, or tags, **When** results are displayed, **Then** all relevant posts are included.
3. **Given** a search query has no matches, **When** results are displayed, **Then** the reader sees a clear "no results found" message.

---

### User Story 6 - Reader Comments (Priority: P6)

A reader can view existing comments that were on the original WordPress posts. New commenting capability is out of scope for this migration.

**Why this priority**: Comments are the lowest-priority content because they are supplementary to the posts themselves. Preserving existing comments maintains historical context. No new commenting system is needed.

**Independent Test**: Can be fully tested by opening a post that had comments on the original WordPress blog and verifying the legacy comments are visible.

**Acceptance Scenarios**:

1. **Given** a post had comments on the original WordPress blog, **When** a reader views that post on the new blog, **Then** the original comments are displayed with their author names, dates, and content.
2. New commenting capability is out of scope for this migration. Only historical comments are preserved.

---

### Edge Cases

- What happens when a post contains WordPress-specific shortcodes or embeds that have no static equivalent? The migration must identify and handle these gracefully (convert to plain content or flag for manual review).
- How does the blog handle posts with mixed-language content (some posts contain both English and Polish text)? Category assignment should follow the original WordPress categorization.
- What happens when an embedded image URL from WordPress is no longer accessible? Images should be downloaded and hosted locally as part of the migration to avoid broken links.
- How does the blog handle the transition from WordPress URLs to new URLs? The new blog MUST preserve the original WordPress URL structure (e.g., `/2017/08/15/post-slug/`) to maintain SEO and existing inbound links.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: The blog MUST contain all posts from the original WordPress blog at orientman.wordpress.com (~6 years of archives, February 2011 through August 2017).
- **FR-002**: Each migrated post MUST retain its original title, full body content, publication date, author attribution, category assignments, and tag assignments.
- **FR-003**: The blog MUST render code blocks with syntax highlighting for languages used in posts (at minimum: C#, F#, C++, JavaScript, HTML/CSS).
- **FR-004**: The blog MUST display embedded GitHub gists — either as live embeds or as static code blocks with a link to the original gist URL.
- **FR-005**: The blog MUST host or preserve all images from original posts so that no images display as broken.
- **FR-006**: The blog MUST support two content categories: "Posts In English (Wpisy po angielsku)" and "Wpisy po polsku (Posts In Polish)".
- **FR-007**: The blog MUST support all original tags (40+ tags including .NET, F#, C#, C++, TDD, JavaScript, git, Functional Programming, ASP.NET MVC, Books, Conferences, Career, Tools, Refactoring, etc.).
- **FR-008**: The blog MUST provide a homepage listing posts in reverse chronological order.
- **FR-009**: The blog MUST provide category listing pages, tag listing pages, and date-based archive pages.
- **FR-010**: The blog MUST include the "Curriculum Vitae" static page with its original content.
- **FR-011**: The blog MUST display site branding: title "Just A Programmer" and subtitle "Don Quixote fighting entropy".
- **FR-012**: The blog MUST include an author bio/about section visible from any page.
- **FR-013**: The blog MUST include a blogroll section listing 11 external blogs from the original "Blogs I Follow" widget.
- **FR-014**: The blog MUST provide search functionality that works without a server-side backend (client-side search).
- **FR-015**: The blog MUST visually distinguish quote-type posts from standard posts.
- **FR-016**: The blog MUST preserve existing comments from the original WordPress posts, displaying them with author names, dates, and content.
- **FR-017**: All blog content MUST be authored and stored in Markdown format (per the Content-First constitution principle).
- **FR-018**: The blog MUST be fully static — no server-side runtime, no databases, no dynamic backends (per the Simplicity constitution principle).
- **FR-019**: The blog MUST be responsive and readable on both desktop and mobile devices, with a modern tech blog aesthetic (dark mode support, polished code blocks, contemporary typography and layout).
- **FR-020**: The blog MUST preserve the original WordPress URL structure (e.g., `/2017/08/15/post-slug/`) so that existing inbound links and search engine rankings are maintained.
- **FR-021**: New commenting capability is out of scope. The blog MUST only preserve and display historical comments from the original WordPress posts.

### Key Entities

- **Post**: A blog entry with title, body (Markdown), publication date, author, one category, one or more tags, optional comments, and a format type (standard or quote).
- **Category**: A top-level content grouping. Two categories exist: English posts and Polish posts. Each post belongs to exactly one category.
- **Tag**: A descriptive label for cross-cutting topics (e.g., "F#", "TDD", "Books"). A post can have zero or more tags. 40+ tags exist in the original blog.
- **Comment**: A reader contribution on a post, with author name, date, and text content. Only exists on posts that had comments on the original WordPress blog.
- **Static Page**: A standalone page not part of the chronological post stream (e.g., Curriculum Vitae). Has a title and body content but no date/category/tag metadata.
- **Blogroll Entry**: An external blog reference with a name and URL. 11 entries exist in the original blog's "Blogs I Follow" list.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: 100% of original WordPress posts are present on the new blog with no missing content (verified by comparing post count and spot-checking representative posts).
- **SC-002**: All code blocks in migrated posts render with syntax highlighting (verified by checking at least 5 code-heavy posts).
- **SC-003**: All images in migrated posts display correctly with no broken image links (verified by automated link/image checking).
- **SC-004**: Every post is accessible via its category page, relevant tag pages, and the correct monthly archive page.
- **SC-005**: The blog loads and renders entirely as static files — no server-side processing required at runtime.
- **SC-006**: The "Curriculum Vitae" page and all sidebar elements (about, tag cloud, categories, blogroll) are present and functional.
- **SC-007**: The blog is usable on mobile devices (text is readable without horizontal scrolling, navigation is accessible).
- **SC-008**: Search returns relevant results for queries matching post titles, content, and tags.

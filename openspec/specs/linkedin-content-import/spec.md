## ADDED Requirements

### Requirement: FR-001 LinkedIn articles converted to MDX posts
Each LinkedIn long-form article MUST be converted to an MDX file in `content/posts/`.
The file MUST follow the existing naming convention: `{slug}.mdx` where slug is a kebab-case identifier derived from the article title.

#### Scenario: Long-form article conversion
- **WHEN** a LinkedIn article titled "The Prophet Who Might Be Right" is migrated
- **THEN** the system creates `content/posts/prophet-who-might-be-right.mdx` with the full article content in Markdown format

#### Scenario: Polish article with diacritics in title
- **WHEN** a LinkedIn article with Polish diacritics in the title is migrated
- **THEN** the slug MUST be ASCII-only kebab-case (diacritics stripped, e.g. "Czekając" becomes "czekajac")

### Requirement: FR-002 LinkedIn short posts converted to MDX posts
Each LinkedIn short post MUST be converted to an MDX file in `content/posts/` using the `standard` format.
Short posts MUST receive the same treatment as long-form articles regarding frontmatter, URL structure, and taxonomy.

#### Scenario: Short post conversion
- **WHEN** a LinkedIn short post titled "OpenCode, terminal i era ai-adminów" is migrated
- **THEN** the system creates `content/posts/opencode-terminal-i-era-ai-adminow.mdx` with format `standard`

### Requirement: FR-003 Frontmatter includes all standard fields plus linkedinUrl
Every migrated post MUST include all standard frontmatter fields: `title`, `date`, `author`, `slug`, `category`, `tags`, `format`.
Every migrated post MUST include a `linkedinUrl` field containing the original LinkedIn URL.
The `wordpressUrl` field MUST be set to an empty string for LinkedIn-sourced posts (preserving backward compatibility).

#### Scenario: Complete frontmatter for a LinkedIn article
- **WHEN** a LinkedIn article published on Feb 17, 2026 is migrated
- **THEN** frontmatter includes `date: 2026-02-17`, `author: orientman`, `format: standard`, `linkedinUrl: https://www.linkedin.com/pulse/...`, and `wordpressUrl: ""`

### Requirement: FR-004 Category assignment by language
English-language posts MUST be assigned `category: posts-in-english`.
Polish-language posts MUST be assigned `category: wpisy-po-polsku`.

#### Scenario: English article categorization
- **WHEN** "The Prophet Who Might Be Right" (written in English) is migrated
- **THEN** frontmatter includes `category: posts-in-english`

#### Scenario: Polish article categorization
- **WHEN** "Czekając na AGI..." (written in Polish) is migrated
- **THEN** frontmatter includes `category: wpisy-po-polsku`

### Requirement: FR-005 Content preserved as valid Markdown
Article content MUST be converted to valid Markdown.
Blockquotes MUST use Markdown `>` syntax.
Links MUST use Markdown `[text](url)` syntax.
Paragraph breaks MUST be preserved.
Section headings MUST use appropriate `##`/`###` levels consistent with the existing blog (post title is `h1`, so article sections start at `##`).

#### Scenario: Blockquote preservation
- **WHEN** a LinkedIn article containing quoted text from an interview is migrated
- **THEN** the quotes appear as Markdown blockquotes (`> ...`) in the MDX file

#### Scenario: Link preservation
- **WHEN** a LinkedIn article containing hyperlinks is migrated
- **THEN** links point to the original external URLs (not LinkedIn redirect URLs)

### Requirement: FR-006 Date-based URL structure
Migrated posts MUST use the existing date-based URL scheme: `/{year}/{month}/{day}/{slug}/`.
The date components MUST be derived from the original LinkedIn publication date.

#### Scenario: URL generation for migrated article
- **WHEN** an article published on Feb 17, 2026 with slug `prophet-who-might-be-right` is migrated
- **THEN** the post is accessible at `/2026/02/17/prophet-who-might-be-right/`

### Requirement: FR-007 linkedinUrl field added to Post type
The TypeScript `Post` interface MUST include an optional `linkedinUrl` field of type `string`.
The content loader MUST pass through the `linkedinUrl` value from frontmatter when present.

#### Scenario: Post type supports linkedinUrl
- **WHEN** a post MDX file includes `linkedinUrl` in frontmatter
- **THEN** the loaded Post object includes the `linkedinUrl` value

#### Scenario: Existing posts without linkedinUrl
- **WHEN** an existing WordPress-migrated post (without `linkedinUrl`) is loaded
- **THEN** the `linkedinUrl` field is `undefined` (no runtime error)

### Requirement: FR-008 Tags reflect content topics
Each migrated post MUST include relevant tags that integrate with the existing tag taxonomy.
Tags MUST be slugified consistently with existing posts (lowercase, hyphens).

#### Scenario: AI-related article tagging
- **WHEN** an article about AI topics is migrated
- **THEN** tags include relevant topic slugs (e.g., `ai`, `agi`) that appear in the tag cloud and tag pages

## Context

The blog was migrated from WordPress to a Next.js static site (spec 001).
All 33 existing posts originate from WordPress and carry a `wordpressUrl` field.
The blog has been dormant since August 2017.
Two recent LinkedIn articles and one short post need to be added as native blog posts.

The existing content pipeline is straightforward:
1. MDX files in `content/posts/` with YAML frontmatter
2. `gray-matter` parses frontmatter; `@mdx-js/mdx` `evaluate()` renders content
3. `generateStaticParams()` builds `/{year}/{month}/{day}/{slug}/` routes from the date field
4. No new dependencies or pipeline changes are needed

## Goals / Non-Goals

**Goals:**

- Add 3 LinkedIn-sourced posts as first-class blog content
- Extend the frontmatter schema with `linkedinUrl` for provenance tracking
- Integrate new posts with existing taxonomy (categories, tags, archives, search)
- Preserve original LinkedIn publication dates for URL generation and chronological ordering

**Non-Goals:**

- Automated LinkedIn-to-blog pipeline or scraping tool (this is a one-time manual migration)
- Displaying `linkedinUrl` in the post UI (can be added later if desired)
- Changing the rendering pipeline or adding new dependencies
- Migrating LinkedIn comments or reactions
- Creating a new post format for short-form content (use `standard`)

## Decisions

### D1: `linkedinUrl` as optional field alongside existing `wordpressUrl`

Add `linkedinUrl?: string` to the `Post` interface.
Keep `wordpressUrl` as-is (required, empty string for non-WordPress posts).

**Rationale**: Making `wordpressUrl` optional would require updating all 33 existing posts or adding fallback logic.
An empty string is already the effective "no value" for WordPress posts without a URL.
The `linkedinUrl` field is optional because most posts will never have one.

**Alternative considered**: A generic `sourceUrl` field replacing both `wordpressUrl` and `linkedinUrl`.
Rejected because it would be a breaking change affecting existing posts and does not carry source-type semantics.

### D2: Short posts use `standard` format, no new format type

LinkedIn short posts are stored as regular `standard` format posts.

**Rationale**: The existing `quote` format is for styled quotations, not short-form content.
Short LinkedIn posts are just shorter articles — the reading experience is the same.
Adding a new format would require component changes for minimal benefit (Principle I: Simplicity).

### D3: LinkedIn redirect URLs replaced with direct URLs

LinkedIn wraps external links in redirect URLs (`linkedin.com/redir/redirect?url=...`).
These MUST be unwrapped to their target URLs in the migrated content.

**Rationale**: LinkedIn redirects may break over time and add unnecessary dependency on LinkedIn infrastructure.

### D4: Content authored as one-sentence-per-line Markdown

Following the project convention, migrated content uses one sentence per line where practical.
This differs from the original LinkedIn formatting but improves diff readability.

**Rationale**: Consistency with existing codebase conventions.
Content formatting is invisible to readers (rendered HTML is identical).

### D5: Tag selection strategy

New tags introduced: `ai`, `agi`, `education`, `opencode`, `linux`, `book-review`.
These are chosen to be broad enough to be reusable for future posts on similar topics.

**Rationale**: The existing tag set is heavy on .NET/C#/JavaScript from the WordPress era.
The new content reflects a topic shift toward AI and tooling.
Tags should be specific enough to be useful but general enough to accumulate posts over time.

## Risks / Trade-offs

**[LinkedIn content may be truncated in public fetch]** → Both articles were fully accessible via public LinkedIn pulse URLs.
The short post was provided directly by the author.
All content has been captured.

**[`wordpressUrl: ""` for non-WordPress posts]** → This is a minor semantic inaccuracy.
Mitigation: A future change could refactor to `sourceUrl` + `sourceType` if more source platforms are added.
For 3 posts this is acceptable.

**[Date accuracy for the short post]** → The exact publication date of the short post is approximate (~early March 2026).
Mitigation: Author confirms the date during implementation.

## Open Questions

- Should the post page UI eventually display a "Originally published on LinkedIn" link?
  (Out of scope for this change but worth noting for future work.)

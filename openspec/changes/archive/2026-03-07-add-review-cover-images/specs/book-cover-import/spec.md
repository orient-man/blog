## MODIFIED Requirements

### Requirement: FR-003 Cover image inserted at top of MDX body

After downloading a cover image, the script SHALL insert a Markdown image line at the top of the MDX body (immediately after the frontmatter closing `---` delimiter).
The image MUST use the format `!["<post title>"](/images/posts/<slug>/cover.<ext>)`.
Existing frontmatter fields and post content MUST be preserved exactly.
If the MDX body already contains the cover image line, the script MUST skip insertion.

**Note**: This import behavior is now historical.
New convention is to store the cover image path in the `coverImage` frontmatter field rather than as an inline Markdown image in the body.
The 25 existing review posts that have inline cover images SHALL have the inline image line removed and a `coverImage` frontmatter field added instead.

#### Scenario: Image line inserted after download

- **WHEN** the script downloads a cover image for `thinking-fast-and-slow-review.mdx` with title `"Thinking, fast and slow" - Daniel Kahneman`
- **THEN** the first line after the frontmatter `---` is `!["Thinking, fast and slow" - Daniel Kahneman](/images/posts/thinking-fast-and-slow-review/cover.jpg)`
- **AND** the original post body follows after a blank line

#### Scenario: Migrated post uses frontmatter field

- **WHEN** a review post has been migrated to the new convention
- **THEN** the post has `coverImage: /images/posts/<slug>/cover.jpg` in frontmatter
- **AND** the inline `![...]()` image line is no longer present in the MDX body

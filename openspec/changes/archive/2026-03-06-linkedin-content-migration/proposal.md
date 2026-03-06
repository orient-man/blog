## Why

The blog has been dormant since 2017 (last WordPress-era post).
Recent LinkedIn articles and posts represent active writing that should live on the blog — the canonical home for the author's content.
LinkedIn content is ephemeral, algorithm-gated, and not under the author's control.
Migrating it to the static blog aligns with Constitution Principle II (Content-First): Markdown as the canonical format, reducing friction between writing and publishing.

## What Changes

- Add 2 long-form LinkedIn articles as MDX posts in `content/posts/`
- Add 1 short LinkedIn post as an MDX post in `content/posts/`
- Extend frontmatter schema with an optional `linkedinUrl` field to preserve provenance (parallel to existing `wordpressUrl`)
- Add appropriate tags for the new AI/technology topic cluster
- Update TypeScript types to include `linkedinUrl` in the post schema

## Capabilities

### New Capabilities

- `linkedin-content-import`: Converting LinkedIn articles and short posts to the blog's MDX format, including frontmatter schema extension (`linkedinUrl`), content formatting, and integration with existing taxonomy (categories, tags, URL structure).

### Modified Capabilities

_None.
The existing content model, routing, and rendering pipeline handle new posts without requirement changes.
The `linkedinUrl` field is additive and optional._

## Impact

- **Content**: 3 new MDX files in `content/posts/`
- **Types**: `src/lib/types.ts` — add optional `linkedinUrl` to post frontmatter type
- **Content loader**: `src/lib/content.ts` — pass through `linkedinUrl` if present
- **Dependencies**: None added (aligns with Principle I: Simplicity)
- **Build**: Static export unchanged; 3 additional pages generated
- **Routing**: Existing `/{year}/{month}/{day}/{slug}/` pattern covers new posts automatically

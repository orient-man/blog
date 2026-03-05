## Why

Post summaries on the main listing page are rendered as unformatted plain text.
The current `generateExcerpt()` strips all Markdown syntax and dumps the result into a `<p>` tag, losing inline formatting (bold, links, emphasis), blockquote structure, and paragraph separation.
Summaries SHOULD look like a preview of the actual post, honoring the Content-First principle (Constitution II) that design decisions prioritize reading experience.

## What Changes

- Replace the regex-based plain-text excerpt generator with a unified/remark pipeline that compiles the first portion of each post's Markdown into HTML.
- Preserve inline formatting: bold, italic, strikethrough, links, inline code.
- Preserve blockquote styling (important for quote-format posts).
- Replace fenced code blocks with a `...` placeholder paragraph.
- Strip headings, images, and MDX/JSX components from excerpts.
- Render the HTML excerpt in PostCard using Tailwind Typography `prose` classes for consistent styling.
- Keep the existing plain-text excerpt path for SEO meta descriptions and RSS feeds.
- Zero new dependencies — all required packages (`unified`, `remark-parse`, `remark-gfm`, `remark-rehype`, `hast-util-to-html`) are already transitive deps of `@mdx-js/mdx`, consistent with the Simplicity principle (Constitution I).

## Capabilities

### New Capabilities

_None — this enhances an existing capability._

### Modified Capabilities

- `post-summaries`: Excerpts change from plain-text-only to HTML-rendered with inline Markdown formatting preserved.
  Plain-text excerpts remain available for SEO and RSS contexts.

## Impact

- `src/lib/utils.ts` — new `generateHtmlExcerpt()` function; existing `generateExcerpt()` retained for plain-text contexts.
- `src/lib/content.ts` — post loading adds an HTML excerpt field alongside the existing plain-text excerpt.
- `src/lib/types.ts` — `Post` type gains an `htmlExcerpt` field.
- `src/components/PostCard.tsx` — renders HTML excerpt with `prose` classes via `dangerouslySetInnerHTML`.
- RSS feed generation and SEO meta tags continue using the existing plain-text excerpt unchanged.

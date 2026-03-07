## Why

Book review posts have cover images stored in `public/images/posts/<slug>/cover.jpg` (25 of 27 reviews), but these are only visible inside the post body as inline Markdown images.
Visitors browsing the listing pages see text-only cards with no visual hint of what book is being reviewed.
Surfacing covers in post summaries strengthens the Content-First principle by making the reading experience richer and more scannable.

## What Changes

- Add `coverImage` optional frontmatter field to the `Post` type and content loader.
- Add `coverImage` to the 25 review posts that have existing cover files; remove the inline `![...]()` from their MDX body to avoid duplication.
- Render a thumbnail on the right side of PostCard when `coverImage` is present; shrink on mobile, absent when field is missing (no placeholder).
- Render the cover image on the post detail page between the header metadata and the prose content, replacing the inline image that was previously part of the Markdown body.

## Capabilities

### New Capabilities

- `review-cover-display`: Rendering of book review cover images in PostCard summaries and on the post detail page header area.

### Modified Capabilities

- `post-summaries`: PostCard gains an optional cover image thumbnail (Layout D — image on the right).
- `book-cover-import`: Cover images move from inline Markdown body to explicit `coverImage` frontmatter field; inline image lines removed from MDX body.

## Impact

- **Types**: `Post` interface in `src/lib/types.ts` gains `coverImage?: string`.
- **Content loader**: `src/lib/content.ts` reads `coverImage` from frontmatter.
- **PostCard component**: `src/components/PostCard.tsx` gains optional thumbnail rendering.
- **Post detail page**: `src/app/[year]/[month]/[day]/[slug]/page.tsx` renders cover from frontmatter instead of relying on inline Markdown.
- **Content files**: 25 `content/posts/*-review.mdx` files updated (add frontmatter field, remove inline image).
- **No new dependencies**: uses plain `<img>` tags consistent with existing codebase (no `next/image`).

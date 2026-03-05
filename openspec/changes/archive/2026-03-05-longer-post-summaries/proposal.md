## Why

Post summaries on listing pages are truncated to 160 characters, producing 1-2 sentence snippets that strip all personality from the writing.
The original WordPress blog displayed full post content on listing pages, giving readers enough context to decide whether to click through.
Increasing excerpt length to ~500 characters (roughly one paragraph) better preserves the author's voice and matches the content-first reading experience (Constitution Principle II).

## What Changes

- Increase the default excerpt length in `generateExcerpt()` from 160 to 500 characters.
- Align the RSS feed excerpt length from 200 to 500 characters for consistency.
- Keep the CSS `line-clamp-6` safety net in PostCard but no other visual changes are needed — the card layout already handles longer text gracefully.

## Capabilities

### New Capabilities

- `post-summaries`: Defines requirements for how post excerpts are generated, their length, and where they appear (listing pages, RSS feeds, SEO metadata).

### Modified Capabilities

_(none — no existing spec-level requirements are changing)_

## Impact

- `src/lib/utils.ts` — `generateExcerpt()` default `maxLength` parameter change.
- `scripts/generate-feeds.ts` — RSS feed excerpt truncation length.
- `src/components/PostCard.tsx` — verify `line-clamp` accommodates longer text (may need adjustment).
- SEO `og:description` meta tags will contain longer text; search engines typically truncate at ~155-160 chars on their end, so this is safe.
- No new dependencies. No breaking changes.

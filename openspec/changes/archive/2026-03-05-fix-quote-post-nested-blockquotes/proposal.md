## Why

Quote-format posts that contain Markdown blockquotes (`>`) render with double blockquote styling.
The `QuotePost` component wraps the entire MDX body in a `<blockquote>`, and Markdown `>` blocks inside produce nested `<blockquote>` elements.
This creates overlapping left borders, double italic text, and a confusing visual hierarchy — violating the Content-First principle (Constitution II) that prioritizes reading experience.

All 3 quote-format posts are affected: `tdd-by-example-quotes`, `is-dead`, `refactoring-is-like-eating-a-proper-diet`.

## What Changes

- Replace the outer `<blockquote>` in `QuotePost.tsx` with a non-semantic `<div>` wrapper.
- Remove `italic` and `text-lg` from the outer wrapper classes so only inner Markdown blockquotes receive quote-specific typography (via Tailwind Typography prose styles).
- Keep all decorative elements (quotation marks, green background, left border) unchanged.
- No MDX content files change.
  No routing or page-level logic changes.

## Capabilities

### New Capabilities

_None._

### Modified Capabilities

_None — this is a rendering bug fix within existing component implementation, not a spec-level behavior change._

## Impact

- **Code**: `src/components/QuotePost.tsx` — single component change.
- **Visual**: All 3 quote-format posts render with a clear visual hierarchy: green wrapper for the post "type", inner left-bordered blockquotes for actual quoted text, normal text for narration.
- **Semantic HTML**: Improves correctness — narration text is no longer wrapped in `<blockquote>`.
- **Dependencies**: None added or removed.

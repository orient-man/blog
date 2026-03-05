## Context

The blog's sidebar tag cloud (`src/components/TagCloud.tsx`) currently uses four discrete Tailwind size tiers based on a tag's count ratio to the maximum count.
This produces a flat appearance where most tags look nearly identical in size.
The original WordPress blog used `wp_tag_cloud`, which applies continuous logarithmic font sizing — each tag's visual weight directly reflects its post frequency.

The `/tags/` index page (`src/app/tags/page.tsx`) renders all tags at a uniform `text-sm` size, losing the popularity signal entirely.

Tag display names fall back to the raw slug when no `TAG_SLUG_MAP` entry exists.
This is correct for single-word slugs (`refactoring`) but tags with intentional hyphens (`dependency-injection`) should preserve them in the display name.

Current files involved:
- `src/components/TagCloud.tsx` — sidebar tag cloud with 4-tier sizing
- `src/app/tags/page.tsx` — tags index with uniform sizing
- `src/lib/content.ts` — `getAllTags()` builds `Tag[]` with display names
- `src/lib/types.ts` — `Tag` interface, `TAG_SLUG_MAP`
- `src/lib/utils.ts` — `slugify()` utility

## Goals / Non-Goals

**Goals:**

- Replace discrete 4-tier sizing with continuous logarithmic scaling matching WordPress `wp_tag_cloud` behavior.
- Apply weighted sizing to both the sidebar tag cloud and the `/tags/` index page.
- Preserve hyphens in tag display names (e.g., `dependency-injection` stays as-is).
- Keep existing pill styling, colors, hover effects, and dark mode support intact.
- Zero new dependencies.

**Non-Goals:**

- Changing tag slugs, URLs, or routing.
- Redesigning the overall tag pill appearance (shape, color scheme).
- Adding tag management, editing, or creation UI.
- Changing how tags are stored in MDX frontmatter.

## Decisions

### Decision 1: Logarithmic scale (not linear)

**Choice**: Use `Math.log()` to map counts to font sizes.

**Rationale**: A linear scale lets one very popular tag (e.g., count=20) compress all other tags (count=1–3) to near-minimum size.
Logarithmic scaling compresses the high end and spreads out the low end, making mid-range tags visually distinguishable.
This matches WordPress's `wp_tag_cloud` implementation.

**Algorithm**:
```typescript
function tagFontSize(
  count: number,
  minCount: number,
  maxCount: number,
  minSize = 0.75,
  maxSize = 1.5,
): number {
  if (minCount === maxCount) return (minSize + maxSize) / 2;
  const ratio = (Math.log(count) - Math.log(minCount))
              / (Math.log(maxCount) - Math.log(minCount));
  return minSize + ratio * (maxSize - minSize);
}
```

**Alternatives considered**:
- *Linear scale*: Simpler but poor visual distribution. Rejected.
- *Square root scale*: Less spread than log. WordPress uses log. Rejected.
- *Bucket-based* (current approach): Loses the continuous feel. This is what we're replacing.

### Decision 2: Inline `style={{ fontSize }}` for continuous sizing

**Choice**: Use inline `style={{ fontSize: '1.12rem' }}` on each tag link element, combined with Tailwind classes for everything else (colors, padding, hover, etc.).

**Rationale**: Tailwind utility classes are discrete (`text-xs`, `text-sm`, `text-base`, `text-lg`).
Arbitrary value classes like `text-[0.87rem]` would work but generate unique classes per tag, bloating the stylesheet.
Inline styles for `fontSize` alone keep the CSS clean while Tailwind handles all other styling.

**Alternatives considered**:
- *Tailwind arbitrary values* (`text-[Xrem]`): Works but generates many unique classes. Rejected for stylesheet bloat.
- *CSS custom properties + calc()*: Over-engineered for this use case. Rejected.
- *Pure inline styles for everything*: Loses Tailwind's hover/dark mode support. Rejected.

### Decision 3: Shared utility function in `utils.ts`

**Choice**: Extract `tagFontSize()` into `src/lib/utils.ts` so both `TagCloud.tsx` and `tags/page.tsx` use the same sizing logic.

**Rationale**: DRY — the sidebar tag cloud and tags index page must use identical sizing for visual consistency.
`utils.ts` already contains helper functions (`slugify`, `estimateReadingTime`).

### Decision 4: Display names preserve hyphens via slug fallback

**Choice**: In `getAllTags()` at `content.ts:131`, the fallback `slugToName[slug] ?? slug` already returns the slug when no `TAG_SLUG_MAP` entry exists.
Since `slugify()` preserves hyphens (it lowercases and converts spaces to hyphens), hyphenated tags like `dependency-injection` already have the correct slug.
The only change needed is ensuring no additional transformation strips hyphens from the display name.

**Rationale**: Minimal change — the current code path is almost correct.
We just need to verify the `slugify()` function preserves hyphens and the display-name fallback doesn't alter them.

## Risks / Trade-offs

- **[Risk] Inline `fontSize` may not scale with user's browser font-size preferences** → Mitigation: Using `rem` units ensures sizes scale proportionally with the root font size, respecting user preferences.
- **[Risk] Very small font sizes could be hard to read** → Mitigation: Minimum size set to `0.75rem` (12px at default root), which is readable. Can be adjusted if needed.
- **[Risk] Tags with count=1 might be too small on mobile** → Mitigation: `0.75rem` is the same as `text-xs` which is already used in the current implementation for low-count tags.
- **[Trade-off] Losing Tailwind's `font-weight` variation** → The current 4-tier system varies both size and weight. The new continuous system varies only size for simplicity. Tags remain readable without weight variation.

## Open Questions

None — the approach is straightforward and all decisions are resolved.

## Context

The `QuotePost` component (`src/components/QuotePost.tsx`) wraps the entire MDX body for `format: "quote"` posts in a `<blockquote>` element with decorative styling (green background, left border, large quotation marks).

When the MDX content contains Markdown `>` blocks, these become nested `<blockquote>` elements.
The outer `<blockquote>` applies `italic` and `text-lg`; the inner blockquotes receive additional styling from Tailwind Typography's prose rules (`--tw-prose-quote-borders`).
The result is double left borders, double italic, and a confusing visual hierarchy.

All 3 quote-format posts exhibit this problem.

## Goals / Non-Goals

**Goals:**
- Eliminate the visual doubling of blockquote styles in quote-format posts.
- Preserve the decorative appearance that distinguishes quote posts (green background, left border, quotation marks).
- Improve semantic HTML correctness — narration text should not be inside `<blockquote>`.

**Non-Goals:**
- Redesigning the overall quote post visual treatment.
- Changing MDX content files.
- Modifying how `format: "quote"` is detected or routed in `page.tsx`.

## Decisions

### D1: Replace outer `<blockquote>` with `<div>`

**Decision**: Change the wrapper element in `QuotePost` from `<blockquote>` to `<div>`.

**Rationale**: The outer wrapper is decorative — it signals "this is a quote-type post" visually, but the actual quoted text lives in Markdown `>` blocks.
Using `<div>` avoids nested blockquote styling and is semantically correct since the wrapper contains both narration and quotes.

**Alternatives considered**:
- *CSS overrides for nested blockquotes*: Fragile, relies on specificity battles between Tailwind Typography and custom styles.
- *Remove Markdown `>` from content*: Loses the visual distinction between narration and quoted text.

### D2: Remove `italic` and `text-lg` from wrapper

**Decision**: Drop `italic` and `text-lg` classes from the outer wrapper.

**Rationale**: `italic` was appropriate when the entire content was treated as a quotation; now narration text should render normally.
`text-lg` forced larger text on all content; prose defaults and Typography's own blockquote sizing are sufficient.
Inner `<blockquote>` elements still receive italic from Tailwind Typography automatically.

### D3: Keep all other styling unchanged

**Decision**: Retain `border-l-4`, `bg-brand-50`, `rounded-r`, `leading-relaxed`, padding, and decorative quotation mark spans.

**Rationale**: These provide the visual distinction for quote-format posts without conflicting with inner blockquote styles.

## Risks / Trade-offs

- **[Subtle visual change]** Narration text in quote posts will no longer be italic or larger. This is intentional — it creates a clearer hierarchy — but is a visible change for returning readers. Mitigation: the 3 affected posts are low-traffic archive content.
- **[Accessibility]** The outer wrapper is no longer a `<blockquote>`, so screen readers will not announce the wrapper as a quotation. Mitigation: the actual quoted text inside Markdown `>` blocks retains proper `<blockquote>` semantics, which is more correct.

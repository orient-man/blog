## Context

Cover images currently use a single `max-w-xs` (320px) constraint on the detail page and `w-12`/`w-16`/`w-20` (48–80px) on PostCard.
This was designed for portrait book covers (~310–500px wide) which are the majority of posts.
Non-book posts with landscape/wide images (1672×941px, 1360×760px) are crushed into the same small space.

Current rendering pipeline is simple: frontmatter `coverImage` → native `<img>` with Tailwind classes.
No `next/image` (static export incompatible), no build-time image processing.

## Goals / Non-Goals

**Goals:**

- Allow non-book cover images to render at a visually appropriate larger size
- Keep the default (compact) behavior unchanged for the majority of review posts
- Provide a simple opt-in mechanism via frontmatter
- Slightly bump compact mode from `max-w-xs` (320px) to `max-w-sm` (384px) for better book cover rendering

**Non-Goals:**

- Automatic aspect-ratio detection at build time
- Image optimization or resizing pipeline
- Different PostCard layouts (image-above-title) — we stay with the same row layout, just wider thumbnails
- Supporting more than two modes (compact/full)

## Decisions

### D1: Opt-in via `coverSize` frontmatter field

**Choice:** Add `coverSize?: "full"` to frontmatter schema.
Default is compact (no annotation required).

**Alternatives considered:**
- `coverType: book | hero` — "hero" is layout jargon, not descriptive of the image
- Automatic detection via image dimensions at build time — adds build complexity, violates Simplicity principle
- Slug-based heuristic (`*-review` = compact) — fragile, non-explicit

**Rationale:** Explicit opt-in keeps it simple, backward-compatible, and doesn't require build tooling.
Only ~2 posts need the annotation today.

### D2: Tailwind class switching for sizing

**Choice:** Conditional Tailwind classes based on `coverSize` value.

| Context | Compact (default) | Full |
|---------|-------------------|------|
| Detail page `<img>` | `max-w-sm` (384px) | `max-w-2xl` (672px) |
| PostCard `<img>` | `w-12 sm:w-16 md:w-20` | `w-20 sm:w-28 md:w-36` |

**Rationale:** Pure CSS solution, no JavaScript runtime, no layout shift.
The `max-w-2xl` choice for full mode matches the prose content area width, so images sit naturally within the reading column.

### D3: Bump compact mode from `max-w-xs` to `max-w-sm`

**Choice:** Increase the default constraint from 320px to 384px.

**Rationale:** Many book covers are 350–500px natural width.
At 320px they're slightly down-scaled for no benefit.
384px gives them a bit more room without becoming disproportionate in the layout.

## Risks / Trade-offs

- [Risk] Future posts might forget `coverSize: full` for landscape images → author sees small rendering, easy to fix by adding the field.
  Mitigation: Low stakes; author will notice immediately.

- [Trade-off] Two-mode system is simpler than continuous/automatic but less "magic."
  Acceptable because the blog has ~30 posts, manual control is fine at this scale.

- [Risk] Bumping compact from 320→384px may slightly change appearance of existing review posts.
  Mitigation: Most book covers are 310–370px natural width, so they'll just render at natural size (won't upscale). Change is minimal.

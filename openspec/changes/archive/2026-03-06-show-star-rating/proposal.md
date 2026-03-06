## Why

The 27 book review posts already store a numeric `rating` field (1–5, half-star increments) in frontmatter, but the value is never rendered.
Readers cannot see the reviewer's rating without opening the LibraryThing link.
Displaying a visual star rating on both post pages and post cards makes book reviews more scannable and useful, aligning with the Content-First principle by surfacing existing metadata that aids reading decisions.

## What Changes

- Add a reusable `StarRating` component that renders filled, half-filled, and empty stars for a given numeric rating (0.5–5.0).
- Display the star rating on the single post page for book reviews, near the post header.
- Display the star rating on `PostCard` when the post has a rating, giving readers a quick visual signal in list views.
- No new dependencies — stars rendered with inline SVG or CSS, keeping the static site simple.

## Capabilities

### New Capabilities

- `star-rating-display`: Visual star rating component and its integration into post pages and post cards for book reviews.

### Modified Capabilities

_(none — no existing spec-level requirements change; this adds a new UI element using data already present)_

## Impact

- **Components**: New `StarRating` component; modifications to `PostCard.tsx` and the single post page (`[slug]/page.tsx`).
- **Types**: `PostCard` props will include `rating` from the existing `Post` interface.
- **Dependencies**: None added — pure CSS/SVG approach.
- **Content**: No changes to MDX files or frontmatter schema.

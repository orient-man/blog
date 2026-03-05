## Why

The blog was migrated from WordPress but lost its visual identity in the process.
The original Chateau theme had distinctive elements — a green accent color, serif headings, editorial date blocks, and a top-of-page green border — that gave the site personality.
The current blue-accented design looks generic.
Restoring these visual cues as a "spiritual successor" honours the blog's history while keeping modern improvements like dark mode and card-based navigation, aligning with Constitution Principle II (Content-First) by improving the reading experience through typographic hierarchy and visual identity.

## What Changes

- Replace the blue (`#2563eb`) accent color system with Chateau green (`#88c34b`) across all components and CSS variables.
- Add a 3-4px solid green top border across the full page width.
- Introduce serif font family (Georgia/Lora) for the site title (italic) and post headings (non-italic); body text remains sans-serif.
- Restore the subtitle tilde prefix: "~ Don Quixote fighting entropy".
- Redesign post card date display as a styled block (large day number, weekday, month/year) floated left of card content.
- Increase post card excerpt length from 3 lines to 6-8 lines for a more editorial feel.
- Add a CV page link to the top header navigation.
- Adapt the green color scale for dark mode with lighter variants for readability.

## Capabilities

### New Capabilities
- `chateau-theme`: Visual styling overhaul — accent color system, top border, serif typography, date block design, excerpt length, header nav link, and dark mode color adaptation.

### Modified Capabilities

_(No existing spec-level requirements change.
The modifications are purely visual/presentational and do not alter the functional behavior defined in existing specs.)_

## Impact

- **Tailwind config**: New custom `brand` color scale and `serif` font family in `tailwind.config.ts`.
- **Global CSS**: 6 CSS variable definitions in `globals.css` change from blue to green values.
- **11 component/page files**: All blue Tailwind utility classes replaced with brand green equivalents (`Sidebar.tsx`, `PostCard.tsx`, `TagCloud.tsx`, `RelatedPosts.tsx`, `GistEmbed.tsx`, `TweetEmbed.tsx`, `QuotePost.tsx`, `layout.tsx`, `not-found.tsx`, `tags/page.tsx`, `[slug]/page.tsx`).
- **Font loading**: Possible addition of Google Fonts import for Lora (or reliance on system Georgia).
- **No new runtime dependencies** — all changes are CSS/Tailwind configuration, keeping with Constitution Principle I (Simplicity).
- **No breaking changes** to content, URLs, or build pipeline.

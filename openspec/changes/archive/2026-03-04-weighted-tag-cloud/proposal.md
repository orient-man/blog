## Why

The current tag cloud uses four discrete size tiers (`text-xs`/`text-sm` with varying font-weight), producing a flat appearance where most tags look identical.
WordPress rendered tag clouds with continuous, proportional font sizing — tags used in many posts appeared visibly larger than rare tags, giving readers an instant visual map of the blog's topic landscape.
Additionally, tag display names that contain hyphens (e.g., `dependency-injection`) currently fall back to the raw slug as their display name, losing the deliberate formatting from the original WordPress taxonomy.
Restoring WordPress-parity tag sizing and proper hyphenated display names aligns with Constitution Principle II (Content-First): the tag cloud is a navigation aid that helps readers discover content by topic at a glance.

## What Changes

- Replace the four-tier discrete sizing in `TagCloud.tsx` with a continuous logarithmic scale that maps each tag's post count to a font size within a defined min–max range (matching WordPress `wp_tag_cloud` behavior).
- Apply the same weighted sizing approach to the `/tags/` index page so the all-tags view also communicates relative popularity.
- Preserve hyphenated tag display names (e.g., `dependency-injection`, `aspnet-mvc`) instead of collapsing them to single words or stripping hyphens.
- Ensure tags defined with explicit hyphens in frontmatter retain those hyphens in their display name throughout the site (tag cloud, tags index, post cards, post headers).

## Capabilities

### New Capabilities

- `weighted-tag-cloud`: Proportional tag sizing algorithm and hyphenated tag display names across all tag rendering surfaces.

### Modified Capabilities

- `tags-index`: The tags index page adds weighted font sizing per tag (currently renders uniform-sized pills).

## Impact

- `src/components/TagCloud.tsx` — rewrite sizing logic from discrete tiers to continuous scale
- `src/app/tags/page.tsx` — add weighted sizing (currently all tags use `text-sm`)
- `src/lib/content.ts` — adjust `getAllTags()` display-name fallback to preserve hyphens instead of returning raw slugs
- `src/lib/utils.ts` — add a `tagFontSize()` helper function
- No new dependencies required; pure Tailwind classes plus inline `fontSize` styles
- No changes to tag slugs, URLs, or routing

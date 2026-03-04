## 1. Remove TAG_SLUG_MAP constant

- [x] T001 (P1) Delete the `TAG_SLUG_MAP` constant and its JSDoc comment from `src/lib/types.ts` (lines 30-42). Keep the `Tag` interface and all other exports unchanged.

## 2. Simplify slugify utility

- [x] T002 (P1) Remove the `TAG_SLUG_MAP` import from `src/lib/utils.ts`. Remove the `if (TAG_SLUG_MAP[name])` shortcut from `slugify()`. The function becomes a pure string transformation: lowercase, replace non-alphanumeric runs with hyphens, trim leading/trailing hyphens. Update the JSDoc to remove the TAG_SLUG_MAP reference.

## 3. Simplify content loading

- [x] T003 (P1) Remove the `TAG_SLUG_MAP` import from `src/lib/content.ts`. In `loadPosts()`, simplify the tag normalization: since frontmatter tags are already slugs, call `slugify(s)` directly without the map-lookup branch (line 50).
- [x] T004 (P1) In `getAllTags()` in `src/lib/content.ts`, remove the reverse-map construction (lines 115-120). Set `name: slug` directly in the tag object, removing the `slugToName[slug] ?? slug` fallback.

## 4. Clean up migration script

- [x] T005 (P2) Remove the standalone `TAG_SLUG_MAP` constant and `toTagSlug()` helper from `scripts/migrate.ts`. Replace the `toTagSlug()` call site with the generic slug algorithm (lowercase, strip non-alphanumeric, hyphenate).

## 5. Verify build

- [x] T006 (P1) Run `npm run build` and confirm the static export succeeds with no TypeScript errors and no broken tag pages.

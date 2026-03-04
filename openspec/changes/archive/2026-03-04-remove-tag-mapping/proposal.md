## Why

The `TAG_SLUG_MAP` constant is a hardcoded lookup table that maps six display names (`F#`, `C#`, `C++`, `.NET`, `ASP.NET MVC`, `ASP.NET`) to URL-safe slugs.
Since all post frontmatter already stores tags in slug form (e.g., `fsharp`, `csharp`, `cpp`), the forward-mapping path is dead code at runtime — tags never arrive as display names.
The reverse-mapping path (slug → display name) adds complexity for minimal visual benefit.
Removing it aligns with the constitution's Simplicity principle: eliminate code that serves no functional purpose and reduce the maintenance surface.

## What Changes

- **Remove** the `TAG_SLUG_MAP` constant from `src/lib/types.ts`.
- **Simplify** the `slugify()` function in `src/lib/utils.ts` — remove the map-lookup shortcut, keep only the generic slug algorithm.
- **Simplify** `loadPosts()` in `src/lib/content.ts` — tags are already slugs in frontmatter, so the map lookup is unnecessary.
- **Simplify** `getAllTags()` in `src/lib/content.ts` — remove the reverse-map construction; use the slug as the display name for all tags.
- **Clean up** the standalone `TAG_SLUG_MAP` copy in `scripts/migrate.ts`.
- **BREAKING**: Tags previously shown as `F#`, `C#`, `C++`, `.NET`, `ASP.NET MVC`, `ASP.NET` will now display as `fsharp`, `csharp`, `cpp`, `dotnet`, `aspnet-mvc`, `aspnet`.
  No URL or routing changes — all `/tag/{slug}/` paths remain identical.

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `weighted-tag-cloud`: FR-003 currently requires `TAG_SLUG_MAP` entries to retain their mapped display name.
  This requirement will be removed — all tags use their slug as the display name.
- `tags-index`: Scenario "Clicking a tag named F#" references the display name `F#`.
  This will change to use the slug `fsharp` as the display name.

## Impact

- **Files directly modified**: `src/lib/types.ts`, `src/lib/utils.ts`, `src/lib/content.ts`, `scripts/migrate.ts`
- **Transitive consumers** (no code changes needed, behavior changes via data flow): all pages and components that call `getAllTags()` or `slugify()` — tag cloud, tags index, tag pages, post cards, post detail pages.
- **No URL changes**: Tag page routes (`/tag/fsharp/`, `/tag/csharp/`, etc.) are unaffected.
- **Visual change**: Six tags lose their special display names in the UI.
- **No dependency changes**: No packages added or removed.

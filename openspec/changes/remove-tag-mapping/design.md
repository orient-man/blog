## Context

The codebase contains a `TAG_SLUG_MAP` constant in `src/lib/types.ts` that maps six display names to URL-safe slugs.
It was created during the WordPress migration (`scripts/migrate.ts`) to handle tags with special characters (`F#`, `C#`, `C++`, `.NET`, `ASP.NET MVC`, `ASP.NET`).

The migration script already converted all frontmatter tags to slug form.
At runtime, the map is used in three places:
1. `slugify()` in `src/lib/utils.ts` — checks the map before falling back to generic slugification (dead path since tags are already slugs).
2. `loadPosts()` in `src/lib/content.ts` — checks the map when normalizing frontmatter tags (dead path since tags are already slugs).
3. `getAllTags()` in `src/lib/content.ts` — builds a reverse map to recover display names for the six special tags.

Only use case 3 has any runtime effect.
The cost is a hardcoded constant that must be maintained in sync between two files, an extra code path in `slugify()`, and an extra code path in `loadPosts()`.

## Goals / Non-Goals

**Goals:**
- Remove the `TAG_SLUG_MAP` constant and all code paths that reference it.
- Simplify `slugify()`, `loadPosts()`, and `getAllTags()` by removing dead map-lookup branches.
- Clean up the standalone copy in `scripts/migrate.ts`.

**Non-Goals:**
- Changing any tag slugs or URL routes — all `/tag/{slug}/` paths remain identical.
- Introducing a new display-name system (e.g., frontmatter metadata, tag registry files).
- Modifying post frontmatter content.

## Decisions

### D1: Remove the constant entirely (not inline it)

**Decision**: Delete `TAG_SLUG_MAP` from `src/lib/types.ts` rather than moving it to a local scope.

**Rationale**: The forward-mapping use cases are dead code.
The only live use (reverse mapping in `getAllTags()`) is not needed once we accept slugs as display names.
Inlining would preserve unnecessary complexity.

**Alternative considered**: Move display names to frontmatter as a `tagDisplayNames` field.
Rejected — adds authoring burden and frontmatter complexity for minimal visual value.

### D2: Use slug directly as Tag.name

**Decision**: In `getAllTags()`, set `name: slug` for all tags, removing the reverse-map construction.

**Rationale**: This is the simplest approach.
The `Tag` interface keeps its `name` field (for rendering), but the value is now always the slug.
No interface changes needed — just a data change.

### D3: Simplify slugify() to pure algorithm

**Decision**: Remove the `TAG_SLUG_MAP[name]` check from `slugify()`.
The function becomes a pure string transformation: lowercase, replace non-alphanumeric with hyphens, trim hyphens.

**Rationale**: No caller passes display names with special characters at runtime.
Tags in frontmatter are already slugs; category names don't use the map.

### D4: Keep migration script functional but remove dead map

**Decision**: Remove the `TAG_SLUG_MAP` constant and `toTagSlug()` helper from `scripts/migrate.ts`.
Replace with the same generic slug algorithm.

**Rationale**: The migration has already been run.
If re-run, the generic algorithm would produce different slugs for the six special tags — but since the migration is a one-time historical operation, this is acceptable.
The script exists for reference, not for re-execution.

## Risks / Trade-offs

**[Visual regression for six tags]** → Accepted trade-off.
Tags `fsharp`, `csharp`, `cpp`, `dotnet`, `aspnet-mvc`, `aspnet` will display as their slug instead of `F#`, `C#`, etc.
This is the intended outcome per the proposal.

**[Migration script behavior change]** → Low risk.
The migration script is historical and not intended for re-execution.
If ever needed again, the six special slugs can be handled manually.

**[Spec delta required]** → Handled by this change.
The `weighted-tag-cloud` spec FR-003 explicitly references `TAG_SLUG_MAP`.
The delta spec removes that clause.

## Open Questions

None — the scope is well-defined and the approach is straightforward.

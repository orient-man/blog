## MODIFIED Requirements

### Requirement: FR-003 Hyphenated tag display names

Tags whose slug contains hyphens SHALL display with hyphens preserved in their display name.
The display name for a tag like `dependency-injection` SHALL be `dependency-injection`, not `dependencyinjection` or `dependency injection`.
All tags SHALL use their slug as the display name.
No special-case display-name mapping SHALL exist.

#### Scenario: Hyphenated slug displays with hyphen

- **WHEN** a tag has the slug `dependency-injection`
- **THEN** its display name is `dependency-injection` across all rendering surfaces (tag cloud, tags index, post cards, post headers)

#### Scenario: Former special-case tags use slug as display name

- **WHEN** a tag has the slug `fsharp`
- **THEN** its display name is `fsharp` (not `F#`)

#### Scenario: Former special-case tag dotnet uses slug

- **WHEN** a tag has the slug `dotnet`
- **THEN** its display name is `dotnet` (not `.NET`)

#### Scenario: Simple single-word slugs are unaffected

- **WHEN** a tag has the slug `refactoring`
- **THEN** its display name is `refactoring`

## REMOVED Requirements

### Requirement: FR-003 Hyphenated tag display names (TAG_SLUG_MAP clause)

The following clause from the original FR-003 is removed:
> "Tags with explicit entries in `TAG_SLUG_MAP` SHALL continue to use their mapped display name (e.g., slug `fsharp` displays as `F#`)."

**Reason**: The `TAG_SLUG_MAP` constant is being removed entirely.
All tags now use their slug as the display name.
**Migration**: No data migration needed.
Frontmatter already stores tags as slugs.
The only visible change is that six tags lose their special display names in the UI.

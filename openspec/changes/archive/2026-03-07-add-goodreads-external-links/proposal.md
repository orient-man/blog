## Why

The blog currently uses separate named frontmatter fields (`librarythingUrl`, `linkedinUrl`) to link back to content origins.
Adding Goodreads links — a natural complement to the 27 LibraryThing reviews — would require yet another one-off field, compounding the pattern.
Replacing all named URL fields with a generic `externalLinks` array solves the immediate need (Goodreads) while making future link types zero-effort.

## What Changes

- **BREAKING**: Remove `librarythingUrl` and `linkedinUrl` frontmatter fields from the `Post` type and all 30 MDX files.
- Introduce an `externalLinks` array in frontmatter and the `Post` type (`{ label: string; url: string }[]`).
- Migrate all 27 book review posts to carry both a LibraryThing and a Goodreads link in `externalLinks`.
- Migrate all 3 LinkedIn posts to carry a LinkedIn link in `externalLinks`.
- Update the post detail page to render `externalLinks` generically ("Also on {label} &#8594;") instead of per-field conditionals.
- Add a new script to fetch the Goodreads RSS feed, match reviews to existing posts, and inject Goodreads URLs.
- Update `import-librarything.ts` and `import-covers.ts` to work with the new `externalLinks` format.

## Capabilities

### New Capabilities

- `external-links`: Generic external-link data model, frontmatter schema, rendering, and migration of existing named URL fields.
- `goodreads-import`: Script to fetch the Goodreads RSS feed, match entries to existing book-review posts, and write Goodreads URLs into `externalLinks`.

### Modified Capabilities

- `librarything-reviews-import`: The import script MUST emit `externalLinks` instead of `librarythingUrl`.
- `book-cover-import`: The cover script MUST identify review posts via `externalLinks` (label "LibraryThing") instead of `librarythingUrl`.

## Impact

- **Type system**: `Post` interface in `src/lib/types.ts` — fields removed, new field added.
- **Content loader**: `src/lib/content.ts` — read `externalLinks` instead of two named fields.
- **Post detail page**: `src/app/[year]/[month]/[day]/[slug]/page.tsx` — replace per-field link blocks with a loop.
- **Frontmatter**: 30 MDX files rewritten (27 reviews + 3 LinkedIn posts).
- **Scripts**: `scripts/import-librarything.ts`, `scripts/import-covers.ts` updated; new `scripts/import-goodreads.ts` added.
- **Dependencies**: None added — Goodreads RSS is fetched with Node built-in `fetch`.

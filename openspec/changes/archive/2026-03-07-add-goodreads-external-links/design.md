## Context

The blog stores 30 posts that link back to their original publication platform: 27 book reviews with `librarythingUrl` and 3 LinkedIn articles with `linkedinUrl`.
These are separate optional fields on the `Post` TypeScript interface, loaded individually from frontmatter, and rendered with per-field conditional blocks in the post detail template.
Adding Goodreads links for the same 27 reviews would require a third named field, continuing an unsustainable pattern.

The Goodreads data is freely available via a public RSS feed (`https://www.goodreads.com/review/list_rss/13930842?shelf=read`) with no authentication required.
Each item contains a `book_id` usable to construct a canonical URL (`https://www.goodreads.com/book/show/{book_id}`).

## Goals / Non-Goals

**Goals:**

- Replace `librarythingUrl` and `linkedinUrl` with a single generic `externalLinks` array so future link types require zero code changes.
- Add Goodreads URLs to all 27 book review posts.
- Automate Goodreads URL discovery via an RSS-based matching script.
- Keep the migration fully backwards-compatible at the rendered output level (same visual appearance, same URLs).

**Non-Goals:**

- Importing Goodreads review text or ratings (only URLs).
- Building a reusable "link aggregator" beyond the blog's own needs.
- Adding Goodreads to any non-review posts.
- Changing the visual design of the external-links section (beyond making it generic).

## Decisions

### D1: Generic `externalLinks` array over named fields

**Decision**: Use `externalLinks: { label: string; url: string }[]` in frontmatter and the `Post` type.

**Alternatives considered**:
- *Option A: Add `goodreadsUrl` field* — Simplest short-term, but cements the one-field-per-platform pattern. Would require code changes for every future platform.
- *Option B (chosen): Generic array* — One-time migration cost, then zero-effort for new link types.

**Rationale**: Aligns with the Simplicity principle — less code to maintain, fewer conditionals in templates.

### D2: Consistent "Also on {label}" wording

**Decision**: Render every external link as `Also on {label} →`, regardless of whether the content originated there.

**Alternatives considered**:
- *"Originally on" vs "Also on" distinction* — Adds complexity for no reader benefit. The destination is what matters.

### D3: Goodreads matching via RSS feed with two-pass strategy

**Decision**: A new script fetches the Goodreads RSS feed (paginated), then matches entries to existing posts using:
1. First pass: normalized title comparison (lowercase, stripped punctuation/diacritics).
2. Second pass (fallback): author name matching combined with date proximity.

**Rationale**: Titles differ across platforms (e.g., Polish vs English editions). The two-pass approach handles both exact and fuzzy cases. The RSS feed requires no API key.

### D4: Standalone migration script for frontmatter rewrite

**Decision**: A one-shot migration script reads all 30 affected MDX files, replaces `librarythingUrl`/`linkedinUrl` with `externalLinks`, and writes them back. Run once, then the old fields are gone.

**Rationale**: Clean break. No need to support both old and new formats simultaneously since there is no runtime migration concern (static export).

### D5: No new npm dependencies

**Decision**: Use Node.js built-in `fetch` for HTTP, built-in `fs`/`path` for file I/O, and existing `gray-matter` for frontmatter parsing.

**Rationale**: Aligns with the Simplicity principle — minimise dependencies.

## Risks / Trade-offs

- **[Goodreads title mismatch]** → Two-pass matching strategy with manual override map for edge cases. Script MUST log unmatched entries for human review.
- **[RSS feed format change]** → The script is run once; future changes to the feed do not affect already-imported URLs.
- **[Breaking existing `import-librarything.ts` and `import-covers.ts`]** → Both scripts are updated in the same change. They are offline tools, not runtime code, so the blast radius is contained.
- **[30-file frontmatter rewrite]** → The migration script is deterministic and idempotent. Verify by diffing output against expected format before committing.

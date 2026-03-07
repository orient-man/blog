## Why

The original WordPress blog displayed a Goodreads "Currently Reading" widget in the sidebar (user ID 13930842, `currently-reading` shelf).
The migration audit flagged this as a MEDIUM-priority gap — a personality element that humanises the blog beyond just code posts.
The Goodreads RSS feed is publicly available and already used by the `import-goodreads.ts` script for the `goodreads-import` capability, so the data source is proven.

Adding this widget aligns with Constitution Principle II (Content-First): it enriches the reading experience by showing what the author is reading, without adding runtime complexity.
The build-time approach aligns with Principle I (Simplicity): no server-side runtime, no client-side JS, no external proxy dependencies.

## What Changes

- Add a prebuild script that fetches the Goodreads `currently-reading` RSS shelf and writes a static JSON file.
- Add a `getCurrentlyReading()` data loader in `src/lib/content.ts`.
- Add a `CurrentlyReading` server component that renders book covers, titles, authors, and a link to the full shelf.
- Integrate the component into the sidebar between Tags and Archive sections.
- Add the fetch script to the `prebuild` npm hook alongside the existing RSS generation.

## Capabilities

### New Capabilities

- `goodreads-reading-list`: Sidebar widget displaying up to 5 books from the Goodreads "currently-reading" shelf, fetched at build time from the public RSS feed, with book covers, styled placeholders for missing covers, and links to Goodreads.

### Modified Capabilities

_(none — this is a new sidebar section with no changes to existing spec-level behaviour)_

## Impact

- **New files**: `scripts/fetch-currently-reading.ts`, `content/data/currently-reading.json`, `src/components/CurrentlyReading.tsx`
- **Modified files**: `src/lib/content.ts` (new loader), `src/components/Sidebar.tsx` (new section), `src/app/layout.tsx` (pass data), `package.json` (prebuild hook)
- **Dependencies**: None new — uses existing `gray-matter`-style pattern; RSS parsing via regex (same approach as `import-goodreads.ts`)
- **Build pipeline**: `prebuild` step gains a network dependency on `goodreads.com`; mitigated by fallback to cached JSON on failure

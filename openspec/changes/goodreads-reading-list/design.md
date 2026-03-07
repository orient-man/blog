## Context

The blog sidebar (`src/components/Sidebar.tsx`) has seven sections rendered as a server component.
All sidebar data is computed at build time from the filesystem — posts, tags, archive months, and blogroll all follow this pattern.
The site uses `output: 'export'` (static HTML, no server runtime).

The existing `scripts/import-goodreads.ts` already fetches a Goodreads RSS feed (the `read` shelf) and parses it with regex-based XML extraction.
The `content/data/blogroll.json` file demonstrates the pattern of committing a data file that is read at build time by `src/lib/content.ts`.

## Goals / Non-Goals

**Goals:**

- Restore the Goodreads "Currently Reading" widget from the original WordPress blog.
- Fetch data at build time and render statically — no client-side JavaScript.
- Gracefully handle fetch failures without breaking the build.
- Show book covers where available, with a visually consistent styled placeholder where not.

**Non-Goals:**

- Real-time or near-real-time reading list updates (build-time staleness is acceptable).
- Client-side fetching, CORS proxies, or Goodreads API key integration.
- Displaying reading progress, ratings, or review text.
- Supporting shelves other than `currently-reading`.

## Decisions

### D1: Build-time fetch via prebuild script

**Decision:** Add `scripts/fetch-currently-reading.ts` executed in the `prebuild` npm hook.

**Alternatives considered:**
- *Client-side fetch in `useEffect()`* — Rejected because Goodreads RSS does not set CORS headers; would require a proxy service, adding a runtime dependency and fragility.
- *GitHub Actions scheduled rebuild* — Useful future enhancement but orthogonal; the script itself is the same either way.

**Rationale:** Matches the existing `scripts/import-goodreads.ts` pattern and `scripts/generate-rss.ts` prebuild hook.
The script reuses the same regex-based RSS parsing approach already proven in `import-goodreads.ts`.

### D2: JSON cached in git as fallback

**Decision:** Commit `content/data/currently-reading.json` to git.
The fetch script overwrites it on success; on failure, the existing file persists.

**Alternatives considered:**
- *Fail the build on fetch failure* — Rejected; would block deploys when Goodreads is temporarily unavailable.
- *Generate an empty file on failure* — Partially adopted: only if no cached file exists at all (first-ever run scenario).

**Rationale:** A stale reading list is far better than no reading list or a broken build.

### D3: `_SX98_` cover image size

**Decision:** Use the `<book_medium_image_url>` field (98px wide) from the RSS feed.

**Alternatives considered:**
- *`_SX50_` (small)* — Too blurry at sidebar scale, especially on retina displays.
- *`_SX318_` (large)* — Excessive for a sidebar thumbnail; wastes bandwidth.

**Rationale:** 98px native width is a good fit for the sidebar's `lg:w-64 xl:w-72` container.
At the expected render size of ~48-64px, 98px provides sufficient detail including on 2x displays.

### D4: Nophoto detection via URL substring

**Decision:** Detect Goodreads placeholder images by checking if the URL contains `nophoto`.

**Rationale:** All Goodreads placeholder images use URLs matching `s.gr-assets.com/assets/nophoto/book/`.
This is a simple, reliable heuristic with no false positives observed across the full RSS feed.

### D5: Styled placeholder with author initials

**Decision:** When `coverUrl` is null, render a coloured rectangle with the author's initials (first letter of first name + first letter of last name) using the blog's brand green palette.

**Alternatives considered:**
- *Generic book icon* — Less personal, doesn't help distinguish entries.
- *Hide the image entirely* — Creates uneven layout between entries with and without covers.

**Rationale:** Initials provide a recognisable visual anchor while keeping layout consistent.

### D6: Server component, no client JS

**Decision:** `CurrentlyReading.tsx` is a server component (no `"use client"` directive).

**Rationale:** All data is available at build time via the JSON file.
No interactivity is needed — the widget is a static list of links.
This ships zero additional JavaScript to the client.

### D7: Sidebar integration via props

**Decision:** Follow the existing pattern: `layout.tsx` calls `getCurrentlyReading()` and passes data as props to `Sidebar`, which renders `CurrentlyReading` inline.

**Rationale:** Consistent with how `recentPosts`, `allTags`, `archiveMonths`, and `blogroll` are already passed.

## Risks / Trade-offs

- **[Stale data]** The reading list only updates on deploy.
  Mitigation: Acceptable trade-off per constitution Principle I.
  A future scheduled GitHub Actions workflow could trigger periodic rebuilds.

- **[Goodreads RSS discontinuation]** Goodreads could remove or change the RSS feed format.
  Mitigation: The cached JSON fallback ensures the site keeps working.
  The widget degrades to showing the last-known reading list.

- **[Cover image hotlinking]** Cover images are served from `i.gr-assets.com`.
  If Goodreads blocks hotlinking, covers would break silently.
  Mitigation: The styled placeholder already handles missing images gracefully.
  A future enhancement could download covers to `public/images/` at build time.

- **[Large currently-reading shelf]** If the shelf grows very large, the RSS feed may paginate.
  Mitigation: The `currently-reading` shelf is typically small (currently 12 books).
  The display cap at 5 means pagination is unnecessary — the first page of RSS results suffices.

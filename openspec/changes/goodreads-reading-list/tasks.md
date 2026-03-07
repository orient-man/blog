## 1. Build-time Data Pipeline (P1)

- [ ] 1.1 Create `scripts/fetch-currently-reading.ts` — fetch Goodreads RSS for `currently-reading` shelf, parse XML via regex (reuse pattern from `import-goodreads.ts`), detect `nophoto` placeholder URLs and set `coverUrl` to null, write `content/data/currently-reading.json`
- [ ] 1.2 Implement fallback behaviour — on fetch failure, log warning and keep existing JSON; if no JSON exists at all, write empty books array; always exit 0
- [ ] 1.3 Run the script once to generate the initial `content/data/currently-reading.json` and commit it to git as the fallback cache
- [ ] 1.4 Add the script to `package.json` `prebuild` hook alongside `generate-rss.ts`

## 2. Data Loader (P1)

- [ ] 2.1 Add `getCurrentlyReading()` function to `src/lib/content.ts` — reads and returns the parsed JSON from `content/data/currently-reading.json`, with a TypeScript interface for the data shape

## 3. Component (P1)

- [ ] 3.1 Create `src/components/CurrentlyReading.tsx` as a server component — accepts books array, max count (default 5), and shelf URL as props
- [ ] 3.2 Render each book with cover image (`<img>` with book title as alt text), title linked to Goodreads URL, and author name
- [ ] 3.3 Implement styled placeholder for missing covers — coloured rectangle with author initials using brand palette, matching cover image dimensions
- [ ] 3.4 Add "View on Goodreads" footer link opening in new tab

## 4. Sidebar Integration (P1)

- [ ] 4.1 Update `src/app/layout.tsx` to call `getCurrentlyReading()` and pass the data to `Sidebar`
- [ ] 4.2 Update `src/components/Sidebar.tsx` — add `CurrentlyReading` section between Tags and Archive, only rendered when books array is non-empty

## 5. Verification (P2)

- [ ] 5.1 Run `npm run build` and verify the widget renders correctly in the static output
- [ ] 5.2 Run `npm run lint` and fix any warnings or errors

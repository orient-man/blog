## 1. Excerpt generation (P1)

- [ ] 1.1 Change `generateExcerpt()` default `maxLength` from 160 to 500 in `src/lib/utils.ts`
- [ ] 1.2 Update the JSDoc comment on `generateExcerpt()` to reflect the new default

## 2. RSS feed alignment (P1)

- [ ] 2.1 Change the `.slice(0, 200)` truncation in `scripts/generate-feeds.ts` to `.slice(0, 500)`
- [ ] 2.2 Verify the feed excerpt adds `…` only when content is actually truncated

## 3. PostCard display (P2)

- [ ] 3.1 Change `line-clamp-6` to `line-clamp-10` on the excerpt `<p>` in `src/components/PostCard.tsx`

## 4. Verification (P2)

- [ ] 4.1 Run `npm run build` and confirm no build errors
- [ ] 4.2 Spot-check 3-5 posts on the local dev server to verify excerpt length and visual appearance
- [ ] 4.3 Verify RSS feed output contains longer excerpts by inspecting generated feed files

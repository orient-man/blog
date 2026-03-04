## 1. Sizing utility (FR-001, FR-002)

- [ ] 1.1 T001 [P1] Add `tagFontSize(count, minCount, maxCount, minSize?, maxSize?)` function to `src/lib/utils.ts` using logarithmic scale per design Decision 1
- [ ] 1.2 T002 [P1] Verify edge case: when `minCount === maxCount`, return midpoint `(minSize + maxSize) / 2`

## 2. Tag display names (FR-003)

- [ ] 2.1 T003 [P1] Verify `slugify()` in `src/lib/utils.ts` preserves hyphens (lowercase + spaces-to-hyphens, no hyphen stripping)
- [ ] 2.2 T004 [P1] Confirm `getAllTags()` display-name fallback in `src/lib/content.ts:131` returns slug as-is for tags without a `TAG_SLUG_MAP` entry (hyphens preserved)
- [ ] 2.3 T005 [P1] If any tag frontmatter uses multi-word names like `dependency injection` (with space), add entries to `TAG_SLUG_MAP` or verify `slugify()` converts to `dependency-injection`

## 3. Sidebar tag cloud (FR-004)

- [ ] 3.1 T006 [P1] Refactor `src/components/TagCloud.tsx` — replace 4-tier `sizeClass` logic with `tagFontSize()` call
- [ ] 3.2 T007 [P1] Apply result as inline `style={{ fontSize: '${size}rem' }}` on each tag `<Link>`
- [ ] 3.3 T008 [P2] Preserve existing pill styling: `rounded-full`, background/text colors, hover states, `transition-colors`
- [ ] 3.4 T009 [P2] Keep `title` attribute showing post count

## 4. Tags index page (FR-005, tags-index delta)

- [ ] 4.1 T010 [P2] Update `src/app/tags/page.tsx` to compute `minCount`/`maxCount` from the full tag list
- [ ] 4.2 T011 [P2] Apply `tagFontSize()` with inline `fontSize` style to each tag link
- [ ] 4.3 T012 [P2] Maintain alphabetical sort and post-count display in parentheses

## 5. Verification (FR-006, SC)

- [ ] 5.1 T013 [P2] Run `npm run build` and confirm no TypeScript or build errors
- [ ] 5.2 T014 [P3] Visually inspect sidebar tag cloud — confirm variable sizing, hover effects, dark mode
- [ ] 5.3 T015 [P3] Visually inspect `/tags/` page — confirm weighted sizing, alphabetical order, count labels
- [ ] 5.4 T016 [P3] Verify tag links still navigate to correct `/tag/{slug}/` pages (FR-006)

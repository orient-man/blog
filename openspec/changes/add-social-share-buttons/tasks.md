## 1. Extract shared icons

- [ ] 1.1 Create `src/components/icons.tsx` exporting the `socialIcons` record (x, facebook, linkedin, github, rss SVGs) and a `CopyLinkIcon` and `CheckIcon` SVG
- [ ] 1.2 Refactor `src/components/Sidebar.tsx` to import `socialIcons` from the new icons module instead of defining them inline
- [ ] 1.3 Verify sidebar renders identically after refactor (`npm run build && npm run lint`)

## 2. Implement ShareButtons component

- [ ] 2.1 Create `src/components/ShareButtons.tsx` as a `"use client"` component accepting `url: string` and `title: string` props
- [ ] 2.2 Render X/Twitter icon link with intent URL `https://twitter.com/intent/tweet?text={title}&url={url}&via=orientman`
- [ ] 2.3 Render Facebook icon link with share URL `https://www.facebook.com/sharer/sharer.php?u={url}`
- [ ] 2.4 Render LinkedIn icon link with share URL `https://www.linkedin.com/sharing/share-offsite/?url={url}`
- [ ] 2.5 Render copy-link button with `navigator.clipboard.writeText(url)` and icon-swap feedback (~2s)
- [ ] 2.6 Add `aria-label` to each button and `target="_blank" rel="noopener noreferrer"` to external links

## 3. Integrate into post page

- [ ] 3.1 Import `ShareButtons` in `src/app/[year]/[month]/[day]/[slug]/page.tsx`
- [ ] 3.2 Construct canonical URL from `siteConfig.siteUrl` and route params
- [ ] 3.3 Render `<ShareButtons>` between the post content div and the comments div, wrapped in `data-pagefind-ignore`
- [ ] 3.4 Style with `border-t` separator consistent with post navigation section

## 4. Verify

- [ ] 4.1 Run `npm run lint` and fix any warnings or errors
- [ ] 4.2 Run `npm run build` and verify static export succeeds

## 1. Extract shared icons

- [x] 1.1 Create `src/components/icons.tsx` exporting the `socialIcons` record (x, facebook, linkedin, github, rss SVGs) and a `CopyLinkIcon` and `CheckIcon` SVG
- [x] 1.2 Refactor `src/components/Sidebar.tsx` to import `socialIcons` from the new icons module instead of defining them inline
- [x] 1.3 Verify sidebar renders identically after refactor (`npm run build && npm run lint`)

## 2. Implement ShareButtons component

- [x] 2.1 Create `src/components/ShareButtons.tsx` as a `"use client"` component accepting `url: string` and `title: string` props
- [x] 2.2 Render X/Twitter icon link with intent URL `https://twitter.com/intent/tweet?text={title}&url={url}&via=orientman`
- [x] 2.3 Render Facebook icon link with share URL `https://www.facebook.com/sharer/sharer.php?u={url}`
- [x] 2.4 Render LinkedIn icon link with share URL `https://www.linkedin.com/sharing/share-offsite/?url={url}`
- [x] 2.5 Render copy-link button with `navigator.clipboard.writeText(url)` and icon-swap feedback (~2s)
- [x] 2.6 Add `aria-label` to each button and `target="_blank" rel="noopener noreferrer"` to external links

## 3. Integrate into post page

- [x] 3.1 Import `ShareButtons` in `src/app/[year]/[month]/[day]/[slug]/page.tsx`
- [x] 3.2 Construct canonical URL from `siteConfig.siteUrl` and route params
- [x] 3.3 Render `<ShareButtons>` between the post content div and the comments div, wrapped in `data-pagefind-ignore`
- [x] 3.4 Style with `border-t` separator consistent with post navigation section

## 4. Verify

- [x] 4.1 Run `npm run lint` and fix any warnings or errors
- [x] 4.2 Run `npm run build` and verify static export succeeds

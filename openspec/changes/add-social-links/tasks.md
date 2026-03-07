## 1. Site Config Module (P1)

- [ ] 1.1 Create `src/lib/siteConfig.ts` with all site metadata: `title`, `titleTemplate`, `description`, `author`, `tagline`, `siteUrl`, `gravatarHash`, `goatcounterId`, and `socialLinks` array (X, Facebook, LinkedIn, GitHub, RSS in that order).
- [ ] 1.2 Add TypeScript types for the config shape and social link entries.

## 2. Config Consolidation -- Layout & Metadata (P1)

- [ ] 2.1 Update `src/app/layout.tsx` metadata export to use `siteConfig.title`, `siteConfig.titleTemplate`, `siteConfig.description`, and `siteConfig.title` for OpenGraph `siteName`.
- [ ] 2.2 Update `src/app/layout.tsx` header to use `siteConfig.title` and `siteConfig.tagline`.
- [ ] 2.3 Update `src/app/layout.tsx` footer copyright to use `siteConfig.author`.
- [ ] 2.4 Update `src/app/layout.tsx` GoatCounter script to use `siteConfig.goatcounterId`.

## 3. Config Consolidation -- Route Pages (P1)

- [ ] 3.1 Update `src/app/page.tsx` metadata to use `siteConfig.title` and `siteConfig.tagline`.
- [ ] 3.2 Update `src/app/tag/[slug]/page.tsx` page title to use `siteConfig.title`.
- [ ] 3.3 Update `src/app/category/[slug]/page.tsx` page title to use `siteConfig.title`.
- [ ] 3.4 Update `src/app/archive/[year]/[month]/page.tsx` page title to use `siteConfig.title`.

## 4. Config Consolidation -- Components & Libs (P1)

- [ ] 4.1 Update `src/components/Sidebar.tsx` gravatar URL to use `siteConfig.gravatarHash` and alt text to use `siteConfig.author`.
- [ ] 4.2 Update `src/components/Sidebar.tsx` author name link text to use `siteConfig.author`.
- [ ] 4.3 Update `src/lib/content.ts` default author fallback to use `siteConfig.author`.

## 5. Config Consolidation -- Feed Script (P2)

- [ ] 5.1 Update `scripts/generate-feeds.ts` to import `siteConfig` and replace hardcoded `SITE_URL`, feed title, and description.

## 6. Social Links in Sidebar (P1)

- [ ] 6.1 Create inline SVG icon map for the 5 platforms (X, Facebook, LinkedIn, GitHub, RSS) using `currentColor` and consistent sizing (`w-5 h-5`).
- [ ] 6.2 Add social link row to `Sidebar.tsx` About section, below the bio paragraph and above "Recent Posts", reading from `siteConfig.socialLinks`.
- [ ] 6.3 Ensure accessibility: `aria-label` on each anchor, `aria-hidden="true"` on each SVG.
- [ ] 6.4 Ensure external links use `target="_blank"` and `rel="noopener noreferrer"`; RSS link is same-tab.
- [ ] 6.5 Style icons: `text-gray-400 dark:text-gray-500` default, `hover:text-brand-600 dark:hover:text-brand-400` on hover, `transition-colors`.

## 7. Verification (P1)

- [ ] 7.1 Run `npm run build` and confirm static export succeeds with no errors.
- [ ] 7.2 Run `npm run lint` and resolve any warnings or errors.
- [ ] 7.3 Visually verify social icons render correctly in the sidebar About section.

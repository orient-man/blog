## 1. Fix Feed Generator (FR-001)

- [x] 1.1 Update `SITE_URL` in `scripts/generate-feeds.ts` from `https://orientman.wordpress.com` to `https://blog.orientman.com`

## 2. Download CV Images (FR-003)

- [x] 2.1 Create `public/images/pages/` directory
- [x] 2.2 Download `image_22831397.png` from WordPress uploads to `public/images/pages/`
- [x] 2.3 Download `img_7517.jpg` from WordPress uploads to `public/images/pages/`
- [x] 2.4 Download `10547033_943021912409928_6724674747851123165_o.jpg` from WordPress uploads to `public/images/pages/`

## 3. Fix Content Links (FR-002, FR-003)

- [x] 3.1 In `content/posts/chutzpah-to-run-javascript-tests.mdx`: replace 2 WordPress links to `/2013/01/15/blanket-js-qunit-and-ie8-please-die-now/`
- [x] 3.2 In `content/posts/good-times-bad-times.mdx`: replace 1 WordPress link to `/2013/06/06/testing-and-refactoring-legacy-code/`
- [x] 3.3 In `content/pages/curriculum-vitae-pl.mdx`: update 3 image references to use `/images/pages/` local paths
- [x] 3.4 In `content/pages/curriculum-vitae-pl.mdx`: update Blog link to `https://blog.orientman.com/`
- [x] 3.5 In `content/pages/curriculum-vitae-pl.mdx`: replace 2 internal blog links to relative paths (`/2014/02/22/git-jest-git/` and `/2013/06/06/testing-and-refactoring-legacy-code/`)

## 4. Verification

- [x] 4.1 Run `npm run prebuild` and verify `sitemap.xml` and `feed.xml` contain only `blog.orientman.com` URLs
- [x] 4.2 Grep codebase for remaining actionable `orientman.wordpress.com` references (excluding specs/ archive, wordpressUrl frontmatter, and comment content)
- [x] 4.3 Run `npm run build` to confirm no breakage

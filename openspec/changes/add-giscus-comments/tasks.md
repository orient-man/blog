## 1. GitHub Setup (manual, outside codebase)

- [ ] 1.1 Enable Discussions on `orient-man/blog` (Settings > Features)
- [ ] 1.2 Create "Blog Comments" Discussion category (Announcement type)
- [ ] 1.3 Install the Giscus GitHub App on `orient-man/blog`
- [ ] 1.4 Obtain `repoId` and `categoryId` from https://giscus.app

## 2. Dependency

- [ ] 2.1 Install `@giscus/react` (`npm install @giscus/react`)

## 3. Site Configuration

- [ ] 3.1 Add Giscus config values (`repo`, `repoId`, `categoryId`) to
  `src/lib/siteConfig.ts`

## 4. GiscusComments Component

- [ ] 4.1 Create `src/components/GiscusComments.tsx` as a `"use client"`
  component with:
  - `IntersectionObserver` lazy loading (200px `rootMargin`)
  - `MutationObserver` dark mode sync on `<html>` class
  - `<Giscus>` with `mapping="pathname"`, `reactionsEnabled="1"`,
    `inputPosition="top"`, `loading="lazy"`, `lang="en"`

## 5. Post Page Integration

- [ ] 5.1 Update `src/app/[year]/[month]/[day]/[slug]/page.tsx` comment
  section to render `<GiscusComments>` when `post.comments` is empty/absent,
  and `<CommentList>` when legacy comments exist (ternary replacement of
  current `&&` conditional)

## 6. Verification

- [ ] 6.1 Run `npm run lint` and fix any warnings/errors
- [ ] 6.2 Run `npm run build` and confirm static export succeeds
- [ ] 6.3 Manually verify: post with legacy comments still shows `CommentList`
- [ ] 6.4 Manually verify: post without legacy comments shows Giscus widget

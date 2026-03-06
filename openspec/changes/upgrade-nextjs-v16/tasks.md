## 1. Dependency Upgrades (P1)

- [x] T001 Create feature branch `feature/upgrade-nextjs-v16`
- [x] T002 Upgrade `react` and `react-dom` to ^19 in `package.json`
- [x] T003 Upgrade `@types/react` and `@types/react-dom` to React 19-compatible versions
- [x] T004 Upgrade `next` to ^16 in `package.json`
- [x] T005 Upgrade `@next/mdx` to ^16 in `package.json`
- [x] T006 Run `npm install` and resolve any peer dependency conflicts
- [x] T007 Verify `eslint-config-next` ^16.1.6 remains compatible (already installed)

## 2. Async Params Migration (P1)

- [x] T008 Convert `src/app/[year]/[month]/[day]/[slug]/page.tsx`: update `PostPage` and `generateMetadata` to use `Promise<T>` params with `await`
- [x] T009 Convert `src/app/tag/[slug]/page.tsx`: make `TagPage` async, update `generateMetadata` to use `Promise<T>` params with `await`
- [x] T010 Convert `src/app/page/[slug]/page.tsx`: update `StaticPage` and `generateMetadata` to use `Promise<T>` params with `await`
- [x] T011 Convert `src/app/category/[slug]/page.tsx`: make `CategoryPage` async, update `generateMetadata` to use `Promise<T>` params with `await`
- [x] T012 Convert `src/app/archive/[year]/[month]/page.tsx`: make `ArchivePage` async, update `generateMetadata` to use `Promise<T>` params with `await`

## 3. Configuration Updates (P2)

- [x] T013 Review and update `next.config.mjs` for any deprecated config keys or required changes
- [x] T014 Verify `mdx-components.tsx` is compatible with `@next/mdx` v16
- [x] T015 Update `tsconfig.json` if Next.js 16 requires changes (run `npx next typegen` if applicable)

## 4. Build Validation (P1)

- [x] T016 Run `npm run build` and fix any build errors
- [x] T017 If Turbopack fails with MDX pipeline, add `--webpack` flag to build script and rebuild
- [x] T018 Run `npm run lint` and fix any new lint errors
- [x] T019 Run `npm run format:check` and fix any formatting issues introduced by code changes

## 5. Output Verification (P1)

- [x] T020 Compare `out/` directory structure before and after upgrade to verify all routes are generated
- [x] T021 Spot-check rendered HTML for posts with syntax highlighting, GFM tables, and custom MDX components
- [x] T022 Verify the site serves correctly with `npx serve out` -- check homepage, post pages, tag pages, search

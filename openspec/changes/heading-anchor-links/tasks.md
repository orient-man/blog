## 1. Dependencies

- [x] 1.1 Install `rehype-slug` and `rehype-autolink-headings` via npm

## 2. Rehype Plugin Integration

- [x] 2.1 Add `rehype-slug` and `rehype-autolink-headings` (wrap mode) to the `@next/mdx` plugin chain in `next.config.mjs`, before `rehype-pretty-code`
- [x] 2.2 Add the same plugins to the `evaluate()` call in the blog post route (`src/app/[year]/[month]/[day]/[slug]/page.tsx`)
- [x] 2.3 Add the same plugins to the `evaluate()` call in the static page route (`src/app/page/[slug]/page.tsx`)

## 3. Styling

- [x] 3.1 Add CSS for the hover `#` indicator via `::after` pseudo-element on heading anchor links in `src/styles/globals.css`
- [x] 3.2 Add `scroll-margin-top` to headings with `id` attributes to offset for the fixed header

## 4. Verification and Docs

- [x] 4.1 Run `npm run build` and verify headings in generated HTML have `id` attributes and anchor links
- [x] 4.2 Run `npm run lint` and fix any warnings or errors
- [x] 4.3 Add a changelog entry to `CHANGELOG.md` under a new version

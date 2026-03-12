## 1. Dependencies

- [ ] 1.1 Install `rehype-slug` and `rehype-autolink-headings` via npm

## 2. Rehype Plugin Integration

- [ ] 2.1 Add `rehype-slug` and `rehype-autolink-headings` (wrap mode) to the `@next/mdx` plugin chain in `next.config.mjs`, before `rehype-pretty-code`
- [ ] 2.2 Add the same plugins to the `evaluate()` call in the blog post route (`src/app/[year]/[month]/[day]/[slug]/page.tsx`)
- [ ] 2.3 Add the same plugins to the `evaluate()` call in the static page route (`src/app/page/[slug]/page.tsx`)

## 3. Styling

- [ ] 3.1 Add CSS for the hover `#` indicator via `::after` pseudo-element on heading anchor links in `src/styles/globals.css`
- [ ] 3.2 Add `scroll-margin-top` to headings with `id` attributes to offset for the fixed header

## 4. Verification and Docs

- [ ] 4.1 Run `npm run build` and verify headings in generated HTML have `id` attributes and anchor links
- [ ] 4.2 Run `npm run lint` and fix any warnings or errors
- [ ] 4.3 Add a changelog entry to `CHANGELOG.md` under a new version

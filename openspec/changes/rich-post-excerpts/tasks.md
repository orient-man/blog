## 1. Type and data plumbing

- [ ] 1.1 Add `htmlExcerpt?: string` field to the `Post` interface in `src/lib/types.ts`
- [ ] 1.2 Wire `htmlExcerpt` into post loading in `src/lib/content.ts` — call `generateHtmlExcerpt()` and assign to the new field alongside the existing `excerpt`

## 2. Excerpt pipeline

- [ ] 2.1 Implement `generateHtmlExcerpt()` in `src/lib/utils.ts` using unified + remark-parse + remark-gfm + remark-rehype + hast-util-to-html (all transitive deps, no installs needed)
- [ ] 2.2 Implement the custom `remarkExcerptTransform` remark plugin that walks the mdast: keep paragraphs/blockquotes/lists, replace code fences with `...` placeholder (collapse consecutive), strip headings/images/html/jsx, stop at ~500 chars of text content
- [ ] 2.3 Ensure frontmatter is stripped from raw content before passing to the pipeline

## 3. PostCard rendering

- [ ] 3.1 Update PostCard to render `htmlExcerpt` via `dangerouslySetInnerHTML` in a `<div>` with `prose prose-sm dark:prose-invert` classes, falling back to plain-text `excerpt` in a `<p>` when `htmlExcerpt` is unavailable

## 4. Verification

- [ ] 4.1 Run `npm run build` and confirm it succeeds with no errors
- [ ] 4.2 Spot-check excerpts for representative posts: code-heavy (fun-with-castle-dynamicproxy), quote-format (the-humble-programmer-quotes), link-heavy (testing-and-refactoring-legacy-code), bold/emphasis (there-is-no-such-thing-as-a-free-free-monad)
- [ ] 4.3 Verify RSS feed and SEO meta descriptions still use plain-text excerpts (no HTML leaking)

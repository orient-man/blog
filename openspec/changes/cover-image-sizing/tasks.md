## 1. Data Model

- [x] 1.1 Add `coverSize?: "full"` to the `Post` type in `src/lib/types.ts`
- [x] 1.2 Read `coverSize` from frontmatter in `src/lib/content.ts` and pass it through to the Post object

## 2. Detail Page Rendering

- [x] 2.1 Update cover image in `src/app/[year]/[month]/[day]/[slug]/page.tsx`: apply `max-w-sm` for compact (default) and `max-w-2xl` for `coverSize: full`

## 3. PostCard Rendering

- [x] 3.1 Pass `coverSize` prop through to PostCard in `src/components/PostCard.tsx`
- [x] 3.2 Apply wider thumbnail classes (`w-20 sm:w-28 md:w-36`) when `coverSize` is `"full"`, keep existing classes for compact

## 4. Content Migration

- [x] 4.1 Add `coverSize: full` to frontmatter of `content/posts/agentic-frameworks-vs-agentic-coding-tools.mdx`
- [x] 4.2 Add `coverSize: full` to frontmatter of `content/posts/you-dont-need-an-app-for-that.mdx` (verify it has coverImage first)

## 5. Verification

- [x] 5.1 Run `npm run lint` and fix any errors
- [x] 5.2 Run `npm run build` and verify no build failures

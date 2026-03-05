## 1. Color System & Config (P1)

- [x] 1.1 T001 Add custom `brand` color scale (shades 50-950 based on `#88c34b`) to `tailwind.config.ts`
- [x] 1.2 T002 Add `serif` font family (`Lora`, `Georgia`, `serif`) to `tailwind.config.ts`
- [x] 1.3 T003 Import Lora font (Regular 400 + Italic 400i) via `next/font/google` in `layout.tsx`
- [x] 1.4 T004 Update CSS custom properties in `globals.css`: change `--link`, `--link-hover`, `--accent` from blue to green values in both `:root` and `.dark` rulesets

## 2. Layout & Chrome (P1)

- [x] 2.1 T005 Add 4px fixed top border div in `layout.tsx` with `background: #88c34b`
- [x] 2.2 T006 Update site subtitle to "~ Don Quixote fighting entropy" (tilde prefix) in `layout.tsx`
- [x] 2.3 T007 Add "CV" link to the top header navigation in `layout.tsx`
- [x] 2.4 T008 Apply serif italic font class to site title in `layout.tsx`

## 3. Post Card Redesign (P1)

- [x] 3.1 T009 Restructure `PostCard.tsx` date display as a left-floated block (large day, weekday, month/year)
- [x] 3.2 T010 Increase excerpt line clamp from 3 to 6 in `PostCard.tsx`
- [x] 3.3 T011 Replace all blue utility classes with brand green equivalents in `PostCard.tsx`

## 4. Component Color Migration (P2)

- [x] 4.1 T012 Replace blue utility classes with brand green in `Sidebar.tsx`
- [x] 4.2 T013 Replace blue utility classes with brand green in `TagCloud.tsx`
- [x] 4.3 T014 Replace blue utility classes with brand green in `RelatedPosts.tsx`
- [x] 4.4 T015 Replace blue utility classes with brand green in `GistEmbed.tsx`
- [x] 4.5 T016 Replace blue utility classes with brand green in `TweetEmbed.tsx`
- [x] 4.6 T017 Replace blue utility classes with brand green in `QuotePost.tsx`

## 5. Page Color Migration (P2)

- [x] 5.1 T018 Replace blue utility classes with brand green in `not-found.tsx`
- [x] 5.2 T019 Replace blue utility classes with brand green in `tags/page.tsx`
- [x] 5.3 T020 Replace blue utility classes with brand green in `[slug]/page.tsx`

## 6. Post Title Typography (P2)

- [x] 6.1 T021 Apply serif (non-italic) font class to post titles in `PostCard.tsx`
- [x] 6.2 T022 Apply serif (non-italic) font class to post title h1 in `[slug]/page.tsx`

## 7. Verification (P3)

- [x] 7.1 T023 Run `npm run build` and verify zero errors
- [ ] 7.2 T024 Visually verify light mode: green accents, top border, serif headings, date blocks, extended excerpts
- [ ] 7.3 T025 Visually verify dark mode: green accent adaptation, contrast readability

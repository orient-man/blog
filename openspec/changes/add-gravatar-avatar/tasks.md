## 1. Preparation

- [x] 1.1 Compute the MD5 hash of `orientman@gmail.com` (lowercase, trimmed) and verify the Gravatar URL `https://gravatar.com/avatar/<hash>?s=128&d=mp` returns a valid image in a browser

## 2. Sidebar Avatar Implementation

- [x] 2.1 Add a Gravatar `<img>` element to the About section in `src/components/Sidebar.tsx`, placed above the bio paragraphs, using the hardcoded MD5 hash
- [x] 2.2 Style the avatar with Tailwind classes: `rounded-full w-32 h-32 mx-auto mb-4 ring-2 ring-gray-200 dark:ring-gray-700`
- [x] 2.3 Set `alt` attribute to the author name and add `width`/`height` attributes for layout stability

## 3. Verification

- [x] 3.1 Run `npm run build` and confirm no build errors
- [x] 3.2 Run `npm run dev` and visually verify the avatar displays correctly in both light and dark modes
- [x] 3.3 Confirm no new dependencies were added to `package.json`

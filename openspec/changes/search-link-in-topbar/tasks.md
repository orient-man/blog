## 1. Desktop Header Search Link

- [x] 1.1 Add a `<Link href="/search/">Search</Link>` to the desktop `<nav>` in `src/app/layout.tsx`, placed between the CV link and `<DarkModeToggle />` (P1)
- [x] 1.2 Apply the same className as the existing Home and CV links (`text-gray-600 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors`) (P1)

## 2. Mobile Header Search Link

- [x] 2.1 Update the `sm:hidden` block in the header to include a Search link alongside `<DarkModeToggle />` (P1)
- [x] 2.2 Wrap the Search link and DarkModeToggle in a flex container with `gap-4` for spacing (P2)

## 3. Verification

- [x] 3.1 Run `npm run lint` and fix any warnings or errors (P1)
- [x] 3.2 Run `npm run build` to confirm static export succeeds (P1)

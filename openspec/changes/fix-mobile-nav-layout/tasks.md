## 1. Restructure Header Layout

- [ ] 1.1 (P1) Change header container classes from `flex items-center justify-between` to `flex flex-col sm:flex-row sm:items-center sm:justify-between` in `src/app/layout.tsx`
- [ ] 1.2 (P1) Delete the duplicate mobile nav `<div>` block (`sm:hidden flex ...`) — keep only the desktop `<nav>` element
- [ ] 1.3 (P1) Update the remaining `<nav>` classes: remove `hidden sm:flex`, add `flex`, `self-end`, `mt-3 sm:mt-0`

## 2. Verification

- [ ] 2.1 (P2) Verify layout renders correctly at 375px, 414px, 640px, and 1024px viewport widths
- [ ] 2.2 (P2) Confirm all four nav items (Home, CV, Search, DarkModeToggle) are visible and interactive at every tested width
- [ ] 2.3 (P1) Run `npm run lint` and resolve any warnings or errors

## 3. Release

- [ ] 3.1 (P1) Add a patch version entry to `CHANGELOG.md` under Fixed

## 1. Create CHANGELOG.md

- [x] 1.1 Create `CHANGELOG.md` in repo root with file header and format note (P1)
- [x] 1.2 Add retroactive entries for v1.0.0–v1.0.4 (genesis and post-migration fixes, Feb 28–Mar 1) (P1)
- [x] 1.3 Add retroactive entries for v1.1.0–v1.7.0 (sidebar, tags, pagination, theme, excerpts, Mar 3–5) (P1)
- [x] 1.4 Add retroactive entries for v1.8.0–v1.12.0 (Next.js 16, content migrations, reviews, Mar 6) (P1)
- [x] 1.5 Add retroactive entries for v1.13.0–v1.20.1 (engagement, discovery, polish, Mar 7) (P1)

## 2. Update AGENTS.md

- [x] 2.1 Add "Versioning" section to AGENTS.md requiring changelog bumps on every change (P1)

## 3. Verify

- [x] 3.1 Confirm all 31 versions are present and map to the correct PRs (P2)
  - Actual count: 34 versions (v1.0.0–v1.20.0), not 31 — original estimate undercounted
  - PR#6 and PR#33 are skipped PR numbers (never existed in merge history)
  - Each of the 34 merge commits maps to exactly one version entry per D2
- [x] 3.2 Run `npm run lint` to ensure no lint issues introduced (P2)

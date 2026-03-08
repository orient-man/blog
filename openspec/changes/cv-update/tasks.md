## 1. Content — Create English CV page (P1)

- [x] 1.1 Create `content/pages/curriculum-vitae.mdx` with frontmatter (title: "Curriculum Vitae", date: 2026-03-08, author: orientman, slug: curriculum-vitae)
- [x] 1.2 Write Introduction section — translate and update from Polish CV (20+ years experience)
- [x] 1.3 Write About Me section — translate personality paragraph to EN, keep existing image reference
- [x] 1.4 Write Contact section — Email, LinkedIn, Blog, GitHub, Twitter
- [x] 1.5 Write Programming Interests section — FP, Event Sourcing & CQRS, DDD, Software Craftsmanship, Software Architecture
- [x] 1.6 Write Education section — M.Sc CS + B.Sc Math at MIM UW; keep thesis link, books link, conference list, badges image
- [x] 1.7 Write Talks section — add 4Developers 2017 entry (slides link), translate all existing entries and audience quotes to EN, keep presentation image
- [x] 1.8 Write Experience section — Allegro (roles only), FinAi (with PDF descriptions), mBank (with FxPos description), translate PIĄTKA/Konsorcjum Progres/Empolis/McKinsey/other projects from Polish CV

## 2. Navigation — Update links (P1)

- [x] 2.1 Update `src/app/layout.tsx` desktop nav link (line 122): `/page/curriculum-vitae-pl/` → `/page/curriculum-vitae/`
- [x] 2.2 Update `src/app/layout.tsx` mobile nav link (line 142): `/page/curriculum-vitae-pl/` → `/page/curriculum-vitae/`
- [x] 2.3 Update `src/app/layout.tsx` footer nav link (line 192): `/page/curriculum-vitae-pl/` → `/page/curriculum-vitae/`
- [x] 2.4 Update `src/components/Sidebar.tsx` About section link (line 56): `/page/curriculum-vitae-pl/` → `/page/curriculum-vitae/`

## 3. Verification (P1)

- [x] 3.1 Run `npm run lint` — all warnings and errors MUST be resolved
- [x] 3.2 Run `npm run build` — verify static export succeeds and `out/page/curriculum-vitae/index.html` exists
- [x] 3.3 Verify old Polish CV still builds at `out/page/curriculum-vitae-pl/index.html`

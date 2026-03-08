## ADDED Requirements

### Requirement: FR-001 English CV page exists

The site SHALL serve a static English-language Curriculum Vitae page at `/page/curriculum-vitae/`.
The page SHALL be an MDX file in `content/pages/` with slug `curriculum-vitae`.
The page SHALL be rendered by the existing static page route handler with no code changes to routing.

#### Scenario: CV page is accessible

- **WHEN** a visitor navigates to `/page/curriculum-vitae/`
- **THEN** the page renders with the full English CV content

#### Scenario: CV page is included in static export

- **WHEN** `npm run build` completes
- **THEN** `out/page/curriculum-vitae/index.html` EXISTS in the output directory

### Requirement: FR-002 CV contains current career history

The CV experience section SHALL list employment in reverse chronological order.
The section SHALL include, at minimum:

| Employer | Period | Role(s) |
|----------|--------|---------|
| Allegro | Feb 2020 – Present | Principal Software Engineer (Nov 2022 – Present), Senior Software Engineer (Feb 2020 – Oct 2022) |
| FinAi | Apr 2017 – Jan 2020 | Senior .NET Developer |
| mBank | 2015–2017 | IT Expert |
| PIĄTKA | 2003–2015 | Tech Lead, Lead Developer |
| Konsorcjum Progres | 2010–2014 | Co-Founder, Software Architect |
| Empolis | 2002–2003 | Consultant |
| McKinsey | 2001 | Consultant |

Allegro SHALL list roles only (no project descriptions).
FinAi SHALL include project descriptions (rules engine, workflow state machines, biometry verification, back office, bank statement analysis).
mBank SHALL include FxPos project description (foreign currency position & pricing engine).
PIĄTKA, Konsorcjum Progres, Empolis, McKinsey, and other projects SHALL be translated from the existing Polish CV content.

#### Scenario: Experience section is complete and current

- **WHEN** a visitor reads the Experience section
- **THEN** all employers above are listed with correct periods and roles

#### Scenario: Allegro entry has roles only

- **WHEN** a visitor reads the Allegro entry
- **THEN** only role titles and date ranges are shown, with no project descriptions

### Requirement: FR-003 CV contains talks section with 2017 entry

The talks section SHALL include all entries from the existing Polish CV, translated to English.
The section SHALL additionally include a 4Developers 2017 entry with a link to slides at `https://orient-man.github.io/devLDZ-2017/`.

#### Scenario: 2017 talk is listed

- **WHEN** a visitor reads the Talks section
- **THEN** an entry for 4Developers 2017 is present with a working slides link

#### Scenario: Existing talks are translated

- **WHEN** a visitor reads the Talks section
- **THEN** all talk entries from the Polish CV are present in English, including audience quotes

### Requirement: FR-004 CV contains standard sections

The CV page SHALL include the following sections in order:
1. Introduction (professional summary)
2. About Me (personality paragraph, photo)
3. Contact (Email, LinkedIn, Blog, GitHub, Twitter)
4. Programming Interests (FP, Event Sourcing & CQRS, DDD, Software Craftsmanship, Software Architecture)
5. Education (M.Sc CS + B.Sc Math, MIM UW; thesis link; books; conferences; badges image)
6. Talks
7. Experience

#### Scenario: All sections render in order

- **WHEN** a visitor loads the CV page
- **THEN** all seven sections are present in the specified order

### Requirement: FR-005 Navigation links point to English CV

All site navigation links that previously pointed to `/page/curriculum-vitae-pl/` SHALL point to `/page/curriculum-vitae/`.
This applies to: header desktop nav, header mobile nav, footer nav, and sidebar About section.

#### Scenario: Header CV link navigates to English CV

- **WHEN** a visitor clicks the "CV" link in the header
- **THEN** they are navigated to `/page/curriculum-vitae/`

#### Scenario: Sidebar author link navigates to English CV

- **WHEN** a visitor clicks the author name in the sidebar About section
- **THEN** they are navigated to `/page/curriculum-vitae/`

### Requirement: FR-006 Old Polish CV remains accessible

The existing Polish CV file SHALL NOT be deleted.
The page at `/page/curriculum-vitae-pl/` SHALL remain accessible via direct URL.
No navigation element SHALL link to the old Polish CV.

#### Scenario: Old CV accessible by direct URL

- **WHEN** a visitor navigates directly to `/page/curriculum-vitae-pl/`
- **THEN** the Polish CV renders correctly

#### Scenario: Old CV not in navigation

- **WHEN** a visitor inspects the header, footer, and sidebar navigation
- **THEN** no link to `/page/curriculum-vitae-pl/` is present

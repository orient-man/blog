## Requirements

### Requirement: FR-001 Privacy-first page-view analytics

The blog MUST include lightweight, privacy-respecting page-view analytics.
Analytics MUST NOT use cookies, local storage, or any client-side state that persists across sessions.
Analytics MUST NOT require a cookie consent banner.
Analytics MUST be GDPR-compliant by design, not merely by policy.

#### Scenario: Visitor loads a page

- **WHEN** a visitor loads any page on the blog
- **THEN** a single analytics event is sent to the analytics provider
- **AND** no cookies or local storage entries are created

#### Scenario: No consent banner required

- **WHEN** a visitor loads any page on the blog
- **THEN** no cookie consent banner, modal, or interstitial is displayed

### Requirement: FR-002 GoatCounter as analytics provider

The blog MUST use GoatCounter (goatcounter.com) as its analytics provider.
The GoatCounter subdomain MUST be `orientman` (dashboard at `orientman.goatcounter.com`).

**Rationale -- GoatCounter over alternatives:**

| Criterion | GoatCounter | Plausible | Umami | Cabin |
|---|---|---|---|---|
| Cost | Free hosted | $9/mo minimum | Free (self-host only) | Free (30-day retention) |
| Privacy model | Aggregate-only tables, structurally unlinkable | Hash-based, policy-backed | Hash-based, policy-backed | Policy-backed |
| Open source | Yes (EUPL) | Yes (AGPL) | Yes (MIT) | No |
| Self-hostable | Yes (single Go binary) | Yes (Elixir + ClickHouse) | Yes (Node + PostgreSQL) | No |
| Data retention | Unlimited (free tier) | Unlimited (paid) | Unlimited (self-host) | 30 days (free) / unlimited ($19/mo) |
| Dependencies added | Zero (external script) | Zero (external script) | Node + DB (self-host) | Zero (external script) |

GoatCounter was selected because it is the only option that satisfies all of the following simultaneously:
- Free with unlimited data retention
- Strongest privacy model (aggregate-only, not hash-based)
- Fully open source and self-hostable as a single binary (exit strategy)
- Zero npm dependencies, zero infrastructure (Constitution Principle I: Simplicity)

Plausible was rejected because $9/month is unnecessary overhead for a personal blog.
Umami was rejected because self-hosting requires a Node server and PostgreSQL database, violating the Simplicity principle.
Cabin was rejected because the free tier retains only 30 days of data, and the paid tier ($19/month) is more expensive than Plausible.

#### Scenario: Dashboard accessible

- **GIVEN** the GoatCounter account subdomain is `orientman`
- **WHEN** a user navigates to `https://orientman.goatcounter.com`
- **THEN** the public analytics dashboard is displayed

### Requirement: FR-003 Public analytics dashboard

The GoatCounter dashboard MUST be configured as publicly accessible.
No authentication SHALL be required to view the dashboard.

#### Scenario: Public dashboard visibility

- **WHEN** any visitor navigates to `https://orientman.goatcounter.com`
- **THEN** aggregate page-view statistics are displayed without requiring login

### Requirement: FR-004 Script-only tracking

Analytics MUST use only the GoatCounter JavaScript snippet.
A `<noscript>` tracking pixel MUST NOT be included.
The script MUST be loaded from the official GoatCounter CDN (`//gc.zgo.at/count.js`).

#### Scenario: Script tag present in HTML output

- **WHEN** the static HTML for any page is inspected
- **THEN** a `<script>` element with `src="//gc.zgo.at/count.js"` and `data-goatcounter="https://orientman.goatcounter.com/count"` is present
- **AND** no `<noscript>` element referencing GoatCounter exists

### Requirement: FR-005 Next.js Script component integration

The GoatCounter script MUST be loaded via the Next.js `next/script` component with `strategy="afterInteractive"`.
This ensures the analytics script does not block page rendering or hydration.
The script element MUST be placed inside the root layout (`src/app/layout.tsx`).

#### Scenario: Script loading strategy

- **WHEN** the page loads in a browser
- **THEN** the GoatCounter script loads after the page becomes interactive
- **AND** the script does not delay First Contentful Paint or Largest Contentful Paint

### Requirement: FR-006 No new npm dependencies

No new runtime or build-time npm dependencies SHALL be introduced for analytics.
The GoatCounter script is loaded externally at runtime; no npm package is needed.
This aligns with Constitution Principle I: Simplicity.

#### Scenario: Dependency check

- **WHEN** the analytics implementation is reviewed
- **THEN** `package.json` has no new entries in `dependencies` or `devDependencies` compared to before this change

### Requirement: FR-007 Static export compatibility

The analytics implementation MUST be compatible with Next.js static export (`output: "export"`).
No server-side runtime, middleware, or API routes SHALL be required.

#### Scenario: Build succeeds with static export

- **WHEN** `npm run build` is executed
- **THEN** the build completes successfully with `output: "export"`
- **AND** the generated HTML files in `out/` contain the GoatCounter script tag

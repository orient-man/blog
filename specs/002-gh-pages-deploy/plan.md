# Implementation Plan: GitHub Pages Deployment

**Branch**: `002-gh-pages-deploy` | **Date**: 2026-02-28 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-gh-pages-deploy/spec.md`

## Summary

Deploy the static Next.js blog to GitHub Pages with automated CI/CD on push to `main`,
custom domain `blog.orientman.com`, manual re-deploy via `workflow_dispatch`, and a
README status badge.
The deployment pipeline adds exactly three files to the repository:
`.github/workflows/deploy.yml`, `public/CNAME`, and `README.md`.
Zero changes are made to existing source, content, or configuration files.

## Technical Context

**Language/Version**: YAML (GitHub Actions workflow); TypeScript 5.x / Node.js 20 LTS (build runtime)
**Primary Dependencies**: `actions/checkout@v4`, `actions/setup-node@v4`, `actions/configure-pages@v5`, `actions/upload-pages-artifact@v4`, `actions/deploy-pages@v4`, `actions/cache@v4`
**Storage**: N/A — no new data storage; workflow builds `out/` directory and uploads as GitHub Pages artifact
**Testing**: Manual verification (push to `main`, check live site within 5 minutes; see [quickstart.md](./quickstart.md))
**Target Platform**: GitHub Pages (CDN-served static files at `blog.orientman.com`)
**Project Type**: CI/CD pipeline (GitHub Actions workflow)
**Performance Goals**: Full build-and-deploy completes within 5 minutes of push to `main` (SC-001)
**Constraints**: Repository must be public or on a paid GitHub plan; Pages source must be set to "GitHub Actions" in Settings (FR-012); no `basePath` or `assetPrefix` in `next.config.mjs` (FR-008)
**Scale/Scope**: ~120 static pages; 1 workflow file; 1 CNAME file; 1 README file

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

### Pre-Research Gate (PASSED)

| Principle             | Status | Evidence                                                                                                                                                                                |
| --------------------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **I. Simplicity**     | PASS   | Single YAML workflow file and one plain-text CNAME file. Zero new npm packages. All actions are official GitHub first-party. No database, no server runtime, no dynamic backends added. |
| **II. Content-First** | PASS   | The deployment pipeline is purely infrastructure — it builds existing MDX content and publishes it. No changes to content format, authoring workflow, or reading experience.            |

No dependency justification table required — GitHub Actions are CI/CD infrastructure,
not application dependencies, and introduce no runtime complexity.

### Post-Design Re-Check (PASSED)

| Principle             | Status | Notes                                                                                                                                                                    |
| --------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **I. Simplicity**     | PASS   | Three new files total (deploy.yml, CNAME, README.md). No new npm dependencies. No changes to existing build config. Infrastructure is 100% declarative YAML.             |
| **II. Content-First** | PASS   | Deployment is transparent to content authors: write MDX, push to `main`, site updates automatically. The custom domain improves the reading experience with a clean URL. |

## Project Structure

### Documentation (this feature)

```text
specs/002-gh-pages-deploy/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

No `contracts/` directory — this feature exposes no external interfaces.
See [research.md](./research.md) § 10 for rationale.

### Source Code (repository root)

```text
.github/
└── workflows/
    └── deploy.yml        # GitHub Actions workflow (NEW)

public/
├── CNAME                 # Custom domain file: "blog.orientman.com" (NEW)
├── feed.xml              # (existing — generated at build time)
├── images/               # (existing)
└── sitemap.xml           # (existing — generated at build time)

README.md                 # Repository README with status badge (NEW)
```

All other files (`src/`, `content/`, `scripts/`, `next.config.mjs`, `package.json`,
`tailwind.config.ts`, `tsconfig.json`, etc.) are **unchanged**.

**Structure Decision**: No new directories under `src/` or `content/`.
CI/CD infrastructure lives in `.github/workflows/` (GitHub convention).
The CNAME file lives in `public/` so Next.js copies it to `out/` during static export.

## Complexity Tracking

No constitution violations. No complexity exceptions needed.

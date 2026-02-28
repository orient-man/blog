# Data Model: GitHub Pages Deployment

**Feature**: `002-gh-pages-deploy` | **Date**: 2026-02-28
**Phase**: 1 — Data Model Definition

## Overview

This feature introduces CI/CD infrastructure only — no application data entities,
no database schemas, no TypeScript interfaces. The "data model" consists of the
three configuration files that define the deployment pipeline and its runtime
behaviour.

## Entities

### 1. Workflow Configuration

**File**: `.github/workflows/deploy.yml`
**Format**: YAML (GitHub Actions workflow syntax)
**Created by**: Implementation (not yet exists)

#### Schema

```yaml
name: string                    # Workflow display name in Actions UI
                                # Value: "Deploy to GitHub Pages"

on:
  push:
    branches: [string]          # Trigger branches
                                # Value: ["main"]
  workflow_dispatch: {}         # Manual trigger (no inputs required)

permissions:
  contents: string              # "read" — checkout only
  pages: string                 # "write" — deploy to Pages (top-level for build job)
  id-token: string              # "write" — OIDC token for Pages API (top-level)

concurrency:
  group: string                 # Value: "pages"
  cancel-in-progress: boolean   # Value: true (cancels in-progress on new push)

jobs:
  build:
    runs-on: string             # Value: "ubuntu-latest"
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: string  # Value: "20"
          cache: string         # Value: "npm"
      - uses: actions/configure-pages@v5
      - uses: actions/cache@v4
        with:
          path: string          # Value: ".next/cache"
          key: string           # Dynamic: os + lockfile hash + source hash
          restore-keys: string  # Dynamic: os + lockfile hash (partial restore)
      - run: string             # Value: "npm ci"
      - run: string             # Value: "npm run build"
      - uses: actions/upload-pages-artifact@v4
        with:
          path: string          # Value: "./out"

  deploy:
    needs: [string]             # Value: ["build"]
    runs-on: string             # Value: "ubuntu-latest"
    environment:
      name: string              # Value: "github-pages"
      url: string               # Dynamic: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/deploy-pages@v4
        id: string              # Value: "deployment"
```

#### Key Constraints

- `deploy` job MUST declare `permissions: { pages: write, id-token: write }`.
  These permissions MUST NOT be set on the `build` job.
- `deploy` job MUST set `environment.name: github-pages` for OIDC validation.
- `actions/upload-pages-artifact` artifact name defaults to `github-pages` —
  `actions/deploy-pages` looks for this name by default. No explicit `artifact_name`
  needed.
- `configure-pages` MUST NOT receive `static_site_generator: next` — see
  [research.md § 3](./research.md#3-configure-pages-no-static_site_generator-option).

---

### 2. CNAME Record

**File**: `public/CNAME`
**Format**: Plain text, single line, no trailing newline
**Created by**: Implementation (not yet exists)

#### Content

```
blog.orientman.com
```

#### Constraints

- MUST contain exactly one line with the bare domain (no `https://`, no trailing slash).
- MUST be placed in `public/` so Next.js copies it to `out/CNAME` during `next build`.
- MUST match the DNS CNAME record configured at the registrar
  (`blog.orientman.com` → `orient-man.github.io`).
- GitHub Pages reads this file to configure the custom domain and provision the
  HTTPS certificate automatically.

---

### 3. README

**File**: `README.md`
**Format**: Markdown
**Created by**: Implementation (not yet exists)

#### Schema

```markdown
# orientman-blog

[![Deploy](badge-url)](workflow-url)

Short description of the project.
```

#### Key Fields

| Field | Value |
|-------|-------|
| Badge image URL | `https://github.com/orient-man/orientman-blog/actions/workflows/deploy.yml/badge.svg` |
| Badge link URL | `https://github.com/orient-man/orientman-blog/actions/workflows/deploy.yml` |
| Badge alt text | `Deploy` |

#### Constraints

- The badge MUST reference the workflow filename `deploy.yml` exactly.
- The badge MUST reference the correct GitHub org/user (`orient-man`) and
  repository name (`orientman-blog`).

## Entity Relationships

```text
README.md
  └── references → .github/workflows/deploy.yml  (via badge URL)

.github/workflows/deploy.yml
  └── builds → out/                              (Next.js static export)
      └── contains → out/CNAME                  (copied from public/CNAME)

public/CNAME
  └── copied to → out/CNAME                     (by next build)
  └── read by → GitHub Pages                    (to configure custom domain)
```

## State Transitions

The workflow has two terminal states per run:

```text
triggered (push / workflow_dispatch)
  └── build job
        ├── [FAIL] → no deployment; previous site unchanged; email notification sent
        └── [PASS] → deploy job
                        ├── [FAIL] → deployment error; previous site unchanged
                        └── [PASS] → site live at blog.orientman.com
```

The concurrency group ensures at most one run is active at any time.
A new trigger cancels any in-progress run before starting.

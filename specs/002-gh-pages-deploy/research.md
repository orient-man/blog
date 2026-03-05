# Research: GitHub Pages Deployment

**Feature**: `002-gh-pages-deploy` | **Date**: 2026-02-28
**Phase**: 0 — Technology Research

## Summary

This feature adds a GitHub Actions workflow to deploy the existing Next.js static
export to GitHub Pages with a custom domain. All decisions below are resolved —
no NEEDS CLARIFICATION items remain.

## 1. GitHub Actions: Official Pages Action Versions

**Decision**: Use the following official GitHub Pages action versions:

| Action                          | Version | Purpose                                    |
| ------------------------------- | ------- | ------------------------------------------ |
| `actions/checkout`              | `v4`    | Checkout repository source                 |
| `actions/setup-node`            | `v4`    | Install Node.js 20 LTS with npm cache      |
| `actions/configure-pages`       | `v5`    | Enable Pages and extract metadata          |
| `actions/cache`                 | `v4`    | Cache `.next/cache` for incremental builds |
| `actions/upload-pages-artifact` | `v4`    | Package `out/` as a deployable artifact    |
| `actions/deploy-pages`          | `v4`    | Deploy artifact to GitHub Pages            |

**Rationale**: These are the current latest stable major versions of all official
GitHub Pages actions. Verified against:

- `actions/deploy-pages` README (latest release: v4.0.5)
- `actions/upload-pages-artifact` README (latest release: v4.0.0, August 2025)
- `actions/configure-pages` README (latest release: v5.0.0)
- Official `actions/starter-workflows` Next.js template (uses these exact versions)

**Alternatives considered**: Third-party actions such as
`JamesIves/github-pages-deploy-action` — rejected because official actions are
maintained by GitHub, integrate with the Pages deployment API via OIDC, and
provide the `github-pages` environment URL in the Actions UI.

## 2. Workflow Structure: Two Jobs (build + deploy)

**Decision**: Split the workflow into two jobs: `build` and `deploy`.

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      [
        checkout,
        setup-node,
        configure-pages,
        cache,
        install,
        build,
        upload-artifact,
      ]

  deploy:
    needs: build
    permissions:
      pages: write
      id-token: write
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps: [deploy-pages]
```

**Rationale**:

- `deploy` only runs after `build` succeeds (`needs: build`), satisfying FR-010.
- Sensitive permissions (`pages: write`, `id-token: write`) are scoped to the
  `deploy` job only — the `build` job needs only `contents: read`.
- The `environment: github-pages` setting creates a deployment record in the
  GitHub UI with the live URL and deployment history.
- Matches the pattern recommended by `actions/deploy-pages` and
  `actions/upload-pages-artifact` documentation.

**Alternatives considered**: Single-job workflow — simpler, but mixes build and
deploy permissions in one job. Also loses the GitHub deployment environment UI.

## 3. configure-pages: No static_site_generator Option

**Decision**: Use `actions/configure-pages@v5` **without** `static_site_generator: next`.

```yaml
- name: Setup Pages
  uses: actions/configure-pages@v5
```

**Rationale**: The `static_site_generator: next` option auto-injects
`basePath: '/blog'` into `next.config.mjs` based on the repository name.
With a custom domain (`blog.orientman.com`), the site serves from root `/` — no
`basePath` is needed or desired. Injecting `basePath` would break all routes and
asset paths on the custom domain.

The existing `next.config.mjs` already has:

- `output: 'export'` — static export enabled
- `images: { unoptimized: true }` — required for static export (no image optimisation server)
- `trailingSlash: true` — clean URLs

`configure-pages` without the `static_site_generator` option still enables the
Pages API and extracts metadata (e.g., `base_url`) without modifying the config.

**Alternatives considered**:

- `static_site_generator: next` — **actively harmful** with a custom domain;
  would inject `basePath: '/blog'` breaking all routes.
- Skipping `configure-pages` entirely — possible, but loses the automatic Pages
  API enablement step and environment metadata.

## 4. Build Command: npm run build (Full Pipeline via Lifecycle Hooks)

**Decision**: Use a single `npm run build` command in the workflow.

**Rationale**: The existing `package.json` defines npm lifecycle hooks:

```json
"prebuild": "tsx scripts/generate-feeds.ts",
"build": "next build",
"postbuild": "npx pagefind --site out"
```

npm automatically runs `prebuild` before `build` and `postbuild` after `build`.
A single `npm run build` executes the full pipeline:

1. `tsx scripts/generate-feeds.ts` — generates RSS feed and sitemap into `public/`
2. `next build` — static export to `out/` (includes `public/` contents)
3. `npx pagefind --site out` — builds search index into `out/`

This satisfies FR-004 without any changes to `package.json` or additional workflow steps.

**Alternatives considered**:

- `npx next build` — would skip `prebuild` and `postbuild` hooks, missing feed
  generation and Pagefind indexing.
- Calling each script separately in the workflow — redundant, error-prone,
  and duplicates the existing lifecycle hook configuration.

## 5. Caching: Two-Layer Strategy

**Decision**: Use two caching layers:

1. **npm dependency cache** via `actions/setup-node@v4` with `cache: 'npm'`:
   - Caches `node_modules` based on `package-lock.json` hash
   - Automatic — no separate step needed

2. **Next.js build cache** via `actions/cache@v4`:
   - Caches `.next/cache` for incremental builds
   - Key: `{os}-nextjs-{lockfile-hash}-{source-hash}`
   - Restore key: `{os}-nextjs-{lockfile-hash}-` (partial match on lockfile only)

```yaml
- name: Restore cache
  uses: actions/cache@v4
  with:
    path: .next/cache
    key: ${{ runner.os }}-nextjs-${{ hashFiles('**/package-lock.json') }}-${{ hashFiles('**.[jt]s', '**.[jt]sx') }}
    restore-keys: |
      ${{ runner.os }}-nextjs-${{ hashFiles('**/package-lock.json') }}-
```

**Rationale**: The two caches target different bottlenecks. The npm cache avoids
re-downloading ~200MB of dependencies on every run. The Next.js build cache avoids
re-compiling unchanged pages — particularly useful for the ~120 static pages and
Shiki syntax highlighting (which is slow on first build).

**Alternatives considered**: `actions/cache` for `node_modules` directly — less
reliable than `setup-node`'s built-in cache because it must be manually keyed.

## 6. Concurrency: cancel-in-progress: true

**Decision**: Use a concurrency group that **cancels** in-progress deployments
when a newer commit is pushed.

```yaml
concurrency:
  group: "pages"
  cancel-in-progress: true
```

**Rationale**: FR-009 explicitly requires "cancelling any in-progress deployment
when a newer commit is pushed." The official Next.js starter workflow uses
`cancel-in-progress: false` as a conservative default (to avoid interrupting
production deployments mid-flight). Our spec overrides this with `true` because
the author wants the latest commit to always win. For a personal blog with
infrequent pushes, the risk of a partially interrupted deployment is negligible
compared to the benefit of always deploying the latest version.

**Alternatives considered**: `cancel-in-progress: false` (starter default) —
rejected per FR-009.

## 7. CNAME File: public/CNAME

**Decision**: Place a plain-text file at `public/CNAME` containing exactly:

```
blog.orientman.com
```

**Rationale**: Next.js static export copies everything from `public/` into `out/`
during `next build`. The CNAME file will automatically appear as `out/CNAME` in
the deployed artifact — no workflow changes, no postbuild script, no `next.config.mjs`
changes needed. This is the standard approach for custom domains on GitHub Pages.

The DNS CNAME record (`blog.orientman.com` → `orient-man.github.io`) is a
one-time manual step outside the repository scope (documented in quickstart.md).

**Alternatives considered**:

- Adding a postbuild step to copy the CNAME — unnecessary; `public/` is the
  correct mechanism.
- Storing CNAME in the repo root and copying via workflow — more complex,
  error-prone.

## 8. Status Badge: GitHub Actions Workflow Badge

**Decision**: Add the following badge to `README.md`:

```markdown
![Deploy](https://github.com/orient-man/blog/actions/workflows/deploy.yml/badge.svg)
```

**Rationale**: The standard GitHub Actions status badge format. It reflects the
latest workflow run status in real time. No third-party badge services (Shields.io,
etc.) needed — the GitHub-native badge is sufficient per FR-011.

The badge links to the Actions run history for quick navigation:

```markdown
[![Deploy](https://github.com/orient-man/blog/actions/workflows/deploy.yml/badge.svg)](https://github.com/orient-man/blog/actions/workflows/deploy.yml)
```

## 9. Node.js Version: 20

**Decision**: Use Node.js `"20"` in `actions/setup-node`.

**Rationale**: Matches `@types/node: "^20"` in `package.json`, satisfies FR-003
("install Node.js 20 LTS"), and is the LTS version recommended for the project.
Using the major version string `"20"` (rather than `"20.x"` or a pinned patch)
allows Actions to resolve the latest Node.js 20 LTS patch automatically.

## 10. contracts/ Directory: Not Applicable

**Decision**: No `contracts/` directory is created for this feature.

**Rationale**: This feature adds a GitHub Actions workflow (internal CI/CD
infrastructure) and a CNAME text file. It exposes no external interfaces — no
APIs, no CLI commands, no library exports, no schemas consumed by other systems.
The workflow YAML is consumed only by GitHub Actions, not by any downstream
caller that requires a versioned contract.

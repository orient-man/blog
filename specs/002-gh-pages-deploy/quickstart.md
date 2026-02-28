# Quickstart: GitHub Pages Deployment

**Feature**: `002-gh-pages-deploy` | **Date**: 2026-02-28
**Phase**: 1 — Deployment Setup Guide

## Prerequisites

| Requirement | Details |
|-------------|---------|
| GitHub account | Must have push access to `orient-man/orientman-blog` |
| Repository visibility | Must be **public** (or GitHub Pro/Team/Enterprise for private) |
| DNS access | Must be able to add a CNAME record for `blog.orientman.com` |
| Node.js 20 LTS | For local build verification only (`node --version`) |

## One-Time Manual Setup

These two steps are performed once when first setting up the repository.
They are outside the automated workflow and cannot be scripted.

### Step 1: Configure GitHub Pages Source

1. Navigate to the repository on GitHub:
   `https://github.com/orient-man/orientman-blog`
2. Click **Settings** → **Pages** (left sidebar)
3. Under **Build and deployment** → **Source**, select **GitHub Actions**
4. Click **Save**

> **Why**: The `actions/deploy-pages` action requires the Pages source to be
> set to "GitHub Actions". If this is set to "Deploy from a branch", the deploy
> step will fail with a permissions error on the first run.

### Step 2: Configure DNS CNAME Record

At your DNS provider (registrar or DNS host for `orientman.com`), add:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| `CNAME` | `blog` | `orient-man.github.io` | 3600 (or auto) |

This points `blog.orientman.com` to GitHub Pages.

> **DNS propagation**: Changes may take minutes to several hours to propagate.
> The site will be accessible at the GitHub Pages URL
> (`orient-man.github.io/orientman-blog`) immediately after first deployment,
> and at `blog.orientman.com` once DNS propagates and GitHub provisions the
> HTTPS certificate (usually within 15 minutes of DNS propagation).

## Automated Deployment

Once the setup steps above are complete, deployment is fully automatic.

### Push to main

```bash
git push origin main
```

The workflow triggers automatically. Expected timeline:

| Step | Duration |
|------|----------|
| Runner provisioning | ~15s |
| Checkout + setup | ~20s |
| npm ci (cached) | ~30s |
| npm run build | ~60–120s |
| Upload artifact | ~15s |
| Deploy to Pages | ~30s |
| **Total** | **~3–4 minutes** |

The site is live at `https://blog.orientman.com` within 5 minutes.

### Monitor the Run

Navigate to:
`https://github.com/orient-man/orientman-blog/actions`

The latest run will appear at the top. Click it to see per-step logs.

## Manual Re-Deploy (workflow_dispatch)

Useful for re-deploying after a transient failure or after changing a GitHub Pages setting.

1. Navigate to:
   `https://github.com/orient-man/orientman-blog/actions/workflows/deploy.yml`
2. Click **Run workflow** → **Run workflow**
3. The full build-and-deploy pipeline executes from the current `main` branch tip.

## Verification Checklist

After the first successful deployment, verify:

- [ ] `https://blog.orientman.com` loads the blog homepage
- [ ] The browser shows a valid HTTPS certificate (padlock icon, no warnings)
- [ ] `http://blog.orientman.com` redirects to `https://blog.orientman.com`
- [ ] A sample post URL loads correctly (e.g., `https://blog.orientman.com/blog/some-slug/`)
- [ ] Search works (Pagefind index is included in the deployment)
- [ ] RSS feed accessible at `https://blog.orientman.com/feed.xml`
- [ ] Sitemap accessible at `https://blog.orientman.com/sitemap.xml`
- [ ] The README badge in the repository shows a green "passing" state
- [ ] The GitHub repository Settings > Pages shows `https://blog.orientman.com`
      as the custom domain with "HTTPS enforced" checked

## Failure Notifications

When a workflow run fails:

- GitHub sends an email to the repository owner (default GitHub notification behaviour).
- No additional configuration is needed.
- The previous live site remains unchanged — a failed build never deploys.
- Check the Actions run logs for the specific error.

## Troubleshooting

### "Pages source must be set to GitHub Actions"

**Symptom**: The `deploy` job fails with a permissions or configuration error.
**Fix**: Complete [Step 1](#step-1-configure-github-pages-source) above.

### Site loads at github.io URL but not at blog.orientman.com

**Symptom**: `orient-man.github.io/orientman-blog` works but `blog.orientman.com` shows an error or DNS failure.
**Fix**: Verify the DNS CNAME record in [Step 2](#step-2-configure-dns-cname-record).
DNS propagation can take up to 24 hours. Check with:

```bash
dig CNAME blog.orientman.com
# Expected: blog.orientman.com. 3600 IN CNAME orient-man.github.io.
```

### Asset paths broken (CSS/JS not loading)

**Symptom**: The site loads but has no styles or broken images.
**Cause**: `next.config.mjs` has a `basePath` or `assetPrefix` set incorrectly.
**Fix**: Ensure `next.config.mjs` does **not** set `basePath` or `assetPrefix`
(FR-008). These are only needed when serving from a subpath — the custom domain
serves from root.

### HTTPS certificate not provisioned

**Symptom**: Browser shows a certificate warning at `https://blog.orientman.com`.
**Fix**: Wait 15–30 minutes after DNS propagation for GitHub to provision the
Let's Encrypt certificate. Then in Settings > Pages, ensure "Enforce HTTPS" is
checked.

### Build fails locally but not in CI (or vice versa)

**Symptom**: Inconsistent build failures.
**Fix**: Ensure local Node.js version matches CI (`node --version` should be 20.x).
Run the full pipeline locally to reproduce:

```bash
npm ci
npm run build   # runs prebuild → build → postbuild
```

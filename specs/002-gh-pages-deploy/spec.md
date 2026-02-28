# Feature Specification: GitHub Pages Deployment

**Feature Branch**: `002-gh-pages-deploy`  
**Created**: 2026-02-28  
**Status**: Draft  
**Input**: User description: "Publish the static Next.js blog on GitHub Pages with automated CI/CD deployment and custom domain blog.orientman.com"

## Clarifications

### Session 2026-02-28

- Q: How is the author notified of build failures? → A: Default GitHub email notifications only (zero config). No additional notification infrastructure (Slack, webhooks) is needed.
- Q: Should the GitHub Pages "Source" prerequisite (Settings > Pages > Source = "GitHub Actions") be documented? → A: Yes, add as a documented prerequisite in the spec.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Automated Deployment on Push (Priority: P1)

The blog author pushes a commit to the `main` branch (e.g., a new post or a styling fix).
A CI/CD pipeline automatically builds the static site and deploys it to GitHub Pages.
The author does not need to run any manual deployment commands — the updated site is live within minutes.

**Why this priority**: Without automated deployment, the blog cannot go live.
This is the foundational requirement — every other feature depends on the site being publicly accessible.

**Independent Test**: Can be fully tested by pushing a trivial change to `main` and verifying the live site updates within 5 minutes.

**Acceptance Scenarios**:

1. **Given** the GitHub repository has the Actions workflow configured, **When** the author pushes a commit to `main`, **Then** the workflow triggers automatically, builds the static site, and deploys it to GitHub Pages.
2. **Given** the workflow is running, **When** the build step executes, **Then** it runs `npm ci`, the prebuild script (feed/sitemap generation), `next build` (static export), and the postbuild script (Pagefind indexing) — producing the `out/` directory.
3. **Given** the build completes successfully, **When** the deployment step executes, **Then** the contents of `out/` are published to GitHub Pages and the site is accessible at the public URL.
4. **Given** the build fails (e.g., TypeScript error, missing dependency), **When** the workflow completes, **Then** the deployment step is skipped, the previous live site remains unchanged, and the author is notified via GitHub's default email notification.

---

### User Story 2 - Custom Domain Access (Priority: P2)

A reader navigates to `blog.orientman.com` in their browser and sees the blog.
The custom domain is configured so that GitHub Pages serves the site under this subdomain.

**Why this priority**: The custom domain is the public-facing URL for the blog.
Without it the site would only be accessible at `orient-man.github.io/orientman-blog` which is not user-friendly and would require `basePath` configuration.

**Independent Test**: Can be fully tested by resolving `blog.orientman.com` in DNS and loading the URL — the blog homepage MUST render.

**Acceptance Scenarios**:

1. **Given** the repository contains a `CNAME` file with `blog.orientman.com`, **When** GitHub Pages serves the site, **Then** requests to `blog.orientman.com` return the blog content.
2. **Given** the DNS CNAME record for `blog.orientman.com` points to `orient-man.github.io`, **When** a reader navigates to `https://blog.orientman.com`, **Then** the connection is served over HTTPS with a valid certificate (GitHub Pages enforces HTTPS).
3. **Given** a reader navigates to `http://blog.orientman.com`, **When** the request reaches GitHub Pages, **Then** the reader is redirected to `https://blog.orientman.com`.

---

### User Story 3 - Manual Deployment Trigger (Priority: P3)

The blog author triggers the deployment workflow manually from the GitHub Actions UI (workflow_dispatch) without pushing a new commit.
This is useful for re-deploying after a transient failure or after changing a GitHub Pages setting.

**Why this priority**: Manual triggers are a convenience for recovery and debugging.
They are not required for normal operation but prevent the author from needing to create empty commits to force a redeploy.

**Independent Test**: Can be fully tested by clicking "Run workflow" in the GitHub Actions UI and verifying the site is redeployed.

**Acceptance Scenarios**:

1. **Given** the workflow supports `workflow_dispatch`, **When** the author clicks "Run workflow" in the Actions UI, **Then** the full build-and-deploy pipeline executes.
2. **Given** a manual run is triggered, **When** the workflow completes, **Then** the result (success/failure) is visible in the Actions run history.

---

### User Story 4 - Build Status Visibility (Priority: P4)

The blog author can see whether the latest deployment succeeded or failed by checking the GitHub repository.
A status badge in the README shows the current deployment state.

**Why this priority**: Visibility into build health is a convenience — the author should not need to navigate to the Actions tab to know if the site is healthy.
This is the lowest priority because the site is either live or it is not, and the Actions tab already provides detailed status.

**Independent Test**: Can be fully tested by viewing the repository README and verifying the badge reflects the latest workflow run status.

**Acceptance Scenarios**:

1. **Given** the repository README includes a deployment status badge, **When** the latest workflow run succeeds, **Then** the badge shows a "passing" state.
2. **Given** the latest workflow run fails, **When** the author views the badge, **Then** it shows a "failing" state.

---

### Edge Cases

- What happens when the `CNAME` file is missing from the build output? The workflow MUST ensure the `CNAME` file is included in the deployed artifact (it lives in `public/` and Next.js copies `public/` contents to `out/`).
- What happens when DNS is not yet configured? The site will be accessible at `orient-man.github.io/orientman-blog` (with broken asset paths) until DNS propagates. DNS configuration is a one-time manual step outside the repository scope.
- What happens when the repository is private? GitHub Pages for private repositories requires a GitHub Pro/Team/Enterprise plan. The repository SHOULD be public for free GitHub Pages hosting.
- What happens when a concurrent push occurs during an active deployment? GitHub Actions handles this via concurrency groups — the in-progress deployment SHOULD be cancelled in favour of the newer one.
- What happens when the GitHub Pages source is not configured? The repository Settings > Pages > Source MUST be set to "GitHub Actions" (not "Deploy from a branch") before the first deployment. Without this, the `actions/deploy-pages` step will fail with a permissions error. This is a one-time manual prerequisite performed once when the repository is first set up.
- How does the author learn about build failures? GitHub's built-in email notifications (enabled by default for the repository owner) notify the author when a workflow run fails. No additional notification services (Slack, webhooks) are required.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The repository MUST contain a GitHub Actions workflow file that triggers on pushes to the `main` branch.
- **FR-002**: The workflow MUST also support manual triggering via `workflow_dispatch`.
- **FR-003**: The workflow MUST install Node.js 20 LTS and project dependencies using `npm ci`.
- **FR-004**: The workflow MUST execute the full build pipeline: prebuild (feed/sitemap generation), build (Next.js static export), and postbuild (Pagefind indexing).
- **FR-005**: The workflow MUST upload the `out/` directory as a GitHub Pages artifact and deploy it using the official `actions/deploy-pages` action.
- **FR-006**: The workflow MUST cache npm dependencies to reduce build times on subsequent runs.
- **FR-007**: The repository MUST contain a `CNAME` file in the `public/` directory with the value `blog.orientman.com` so it is included in the static export output.
- **FR-008**: The `next.config.mjs` MUST NOT set `basePath` or `assetPrefix` (custom domain serves from root — no changes needed).
- **FR-009**: The workflow MUST use a concurrency group so that only one deployment runs at a time, cancelling any in-progress deployment when a newer commit is pushed.
- **FR-010**: The workflow MUST NOT deploy if the build step fails.
- **FR-011**: The repository README SHOULD include a GitHub Actions status badge for the deployment workflow.
- **FR-012**: The repository's GitHub Pages source MUST be configured to "GitHub Actions" in Settings > Pages before the first deployment. This is a one-time manual prerequisite outside the automated workflow.
- **FR-013**: Build failure notifications MUST rely on GitHub's default email notifications. No additional notification services (Slack, webhooks) are required.

### Key Entities

- **Workflow**: A GitHub Actions YAML configuration file defining the build-and-deploy pipeline. Located at `.github/workflows/deploy.yml`.
- **CNAME File**: A plain text file containing the custom domain. Located at `public/CNAME`, copied to `out/CNAME` during build.
- **Pages Artifact**: The `out/` directory contents uploaded as a deployable artifact by `actions/upload-pages-artifact`.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A push to `main` triggers the workflow and the site is live at `blog.orientman.com` within 5 minutes.
- **SC-002**: The deployed site serves all 120 static pages with no 404 errors on previously working routes.
- **SC-003**: The site is accessible over HTTPS at `blog.orientman.com` with a valid certificate.
- **SC-004**: A failed build (e.g., intentionally introduced syntax error) does NOT result in a deployment — the previous site version remains live and the author receives a GitHub email notification.
- **SC-005**: A manual `workflow_dispatch` trigger produces an identical deployment to a push-triggered run.
- **SC-006**: The repository README displays a workflow status badge that accurately reflects the latest run.

## ADDED Requirements

### Requirement: FR-001 Framework dependency versions

The project MUST upgrade `next` to version 16.x.
The project MUST upgrade `@next/mdx` to version 16.x.
The project MUST upgrade `react` and `react-dom` to version 19.x.
The project MUST upgrade `@types/react` and `@types/react-dom` to React 19-compatible versions.
All upgraded packages MUST resolve without peer dependency conflicts.

#### Scenario: Package versions after upgrade

- **WHEN** a developer runs `npm ls next react react-dom @next/mdx`
- **THEN** `next` resolves to 16.x, `react` and `react-dom` resolve to 19.x, and `@next/mdx` resolves to 16.x

#### Scenario: No peer dependency warnings

- **WHEN** a developer runs `npm install`
- **THEN** no unresolved peer dependency conflicts are reported for the upgraded packages

### Requirement: FR-002 Async params migration

All page components and `generateMetadata` functions that receive `params` MUST declare the `params` prop as `Promise<T>` and MUST `await` it before accessing parameter values.
The following files MUST be updated:
- `src/app/[year]/[month]/[day]/[slug]/page.tsx` (PostPage + generateMetadata)
- `src/app/tag/[slug]/page.tsx` (TagPage + generateMetadata)
- `src/app/page/[slug]/page.tsx` (StaticPage + generateMetadata)
- `src/app/category/[slug]/page.tsx` (CategoryPage + generateMetadata)
- `src/app/archive/[year]/[month]/page.tsx` (ArchivePage + generateMetadata)

#### Scenario: Post page renders with async params

- **WHEN** a visitor navigates to `/2024/01/15/some-post/`
- **THEN** the post page renders correctly with the resolved `year`, `month`, `day`, and `slug` parameters

#### Scenario: Tag page renders with async params

- **WHEN** a visitor navigates to `/tag/typescript/`
- **THEN** the tag page renders correctly with the resolved `slug` parameter

#### Scenario: Category page renders with async params

- **WHEN** a visitor navigates to `/category/programming/`
- **THEN** the category page renders correctly with the resolved `slug` parameter

#### Scenario: Archive page renders with async params

- **WHEN** a visitor navigates to `/archive/2024/01/`
- **THEN** the archive page renders correctly with the resolved `year` and `month` parameters

#### Scenario: Static page renders with async params

- **WHEN** a visitor navigates to `/page/about/`
- **THEN** the static page renders correctly with the resolved `slug` parameter

#### Scenario: generateMetadata produces correct metadata

- **WHEN** any dynamic route page is built
- **THEN** the `generateMetadata` function awaits `params` and returns correct `title` and `description` metadata

### Requirement: FR-003 Static export output

The project MUST continue to use `output: 'export'` in `next.config.mjs`.
The static build MUST produce an `out/` directory containing all generated HTML, CSS, JS, and asset files.
The build output MUST include all existing routes: homepage, post pages, tag pages, category pages, archive pages, static pages, tags index, and search page.

#### Scenario: Static build succeeds

- **WHEN** a developer runs `npm run build`
- **THEN** the build completes without errors and produces an `out/` directory

#### Scenario: All routes present in output

- **WHEN** the build completes
- **THEN** `out/index.html` exists (homepage)
- **AND** post HTML files exist under `out/YYYY/MM/DD/slug/index.html`
- **AND** `out/tags/index.html` exists
- **AND** `out/search/index.html` exists

### Requirement: FR-004 MDX pipeline compatibility

The MDX processing pipeline MUST produce correct HTML output after the upgrade.
Syntax highlighting via `rehype-pretty-code` and `shiki` MUST render code blocks with correct theme colors.
GitHub Flavored Markdown via `remark-gfm` MUST render tables, strikethrough, and task lists correctly.
Custom MDX components (`GistEmbed`, `TweetEmbed`) registered in `mdx-components.tsx` MUST continue to function.

#### Scenario: Syntax highlighted code block

- **WHEN** a post contains a fenced code block with a language tag
- **THEN** the rendered HTML contains `<pre>` and `<code>` elements with Shiki-generated syntax highlighting spans

#### Scenario: GFM table rendering

- **WHEN** a post contains a GFM pipe table
- **THEN** the rendered HTML contains a `<table>` element with correct rows and cells

#### Scenario: Custom MDX component

- **WHEN** a post contains a `<GistEmbed>` or `<TweetEmbed>` component
- **THEN** the component renders correctly in the built output

### Requirement: FR-005 Build completes under supported bundler

The project MUST build successfully using either Turbopack (Next.js 16 default) or webpack (via `--webpack` flag).
If Turbopack is incompatible with the MDX pipeline, the build scripts MUST be configured to use webpack explicitly.

#### Scenario: Build with Turbopack

- **WHEN** a developer runs `npm run build` without the `--webpack` flag
- **THEN** the build completes successfully, OR the project explicitly configures webpack as the bundler

#### Scenario: Build with webpack fallback

- **WHEN** Turbopack is incompatible with the MDX pipeline
- **THEN** the `build` script in `package.json` MUST include the `--webpack` flag and the build completes successfully

### Requirement: FR-006 Linting passes

The `npm run lint` command MUST pass with zero errors after the upgrade.
The `eslint-config-next` package MUST be compatible with the installed `next` version.

#### Scenario: Lint check passes

- **WHEN** a developer runs `npm run lint`
- **THEN** ESLint exits with code 0 and reports no errors

### Requirement: FR-007 No new runtime dependencies

The upgrade MUST NOT introduce any new runtime dependencies beyond the version bumps of existing packages.
This aligns with Constitution Principle I (Simplicity).

#### Scenario: Dependency count unchanged

- **WHEN** the upgrade is complete
- **THEN** `package.json` has no new entries in `dependencies` beyond the existing packages at updated versions

### Requirement: FR-008 Identical user-facing behavior

All existing URLs, page content, styling, and navigation MUST remain identical after the upgrade.
No visual regressions SHALL be introduced.

#### Scenario: Homepage content unchanged

- **WHEN** a visitor loads the homepage
- **THEN** the page content, layout, and styling are visually identical to the pre-upgrade version

#### Scenario: Post content unchanged

- **WHEN** a visitor loads any blog post
- **THEN** the post content, syntax highlighting, comments section, and related posts render identically

#### Scenario: URL structure preserved

- **WHEN** any existing URL is requested
- **THEN** the corresponding page is served (no 404s for previously working URLs)

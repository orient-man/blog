# Implementation Plan: WordPress Blog Migration

**Branch**: `001-wordpress-blog-migration` | **Date**: 2026-02-27 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-wordpress-blog-migration/spec.md`

## Summary

Migrate all content from the WordPress blog at orientman.wordpress.com (~30 posts,
2 categories, 40+ tags, 1 static page, 11 blogroll entries, spanning Feb 2011 – Aug 2017)
to a fully static Next.js blog using `output: 'export'`. Content is stored as MDX files
with YAML frontmatter in the repository. No databases, no server-side runtime.

## Technical Context

**Language/Version**: TypeScript 5.x, Node.js 20 LTS
**Primary Dependencies**: Next.js 14 (`output: 'export'`), `@next/mdx`, `gray-matter`, `rehype-pretty-code` (Shiki), Tailwind CSS, `@tailwindcss/typography`, Pagefind
**Storage**: Filesystem only — MDX files in `content/posts/`, images in `public/images/`
**Testing**: Vitest (unit), Playwright (smoke/integration for static output)
**Target Platform**: Static files served from any CDN / static host (GitHub Pages, Vercel Static, Netlify)
**Project Type**: Static website (Next.js App Router with static export)
**Performance Goals**: Lighthouse Performance score >= 90; First Contentful Paint < 1.5s; total JS bundle < 200kB
**Constraints**: No server-side runtime; no ISR/SSR; no cookies/sessions; no dynamic API routes; all routes must use `generateStaticParams()`
**Scale/Scope**: ~30 posts, 2 categories, 40+ tags, 1 static page, 11 blogroll entries

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Pre-Research Gate (PASSED)

| Principle | Status | Evidence |
|-----------|--------|----------|
| **I. Simplicity** | PASS | Static export (`output: 'export'`), no database, no server runtime, no dynamic backends. Content lives in git as MDX files. |
| **II. Content-First** | PASS | MDX/Markdown is the canonical format. All posts authored in Markdown with YAML frontmatter. Tooling (rehype, remark) serves content readability. |

### Dependency Justification

Each dependency is justified against the Simplicity principle ("if a feature can be achieved with plain HTML, CSS, or Markdown, that approach MUST be preferred"):

| Dependency | Why Plain HTML/CSS/MD Is Insufficient | Minimality |
|------------|---------------------------------------|------------|
| Next.js | Provides static site generation with React component model for MDX; manages routing, image optimization at build time, code splitting. Plain HTML would require manual templating for ~30 posts and all listing pages. | Single framework replaces multiple build tools |
| `@next/mdx` | Enables MDX → React component pipeline at build time. Plain Markdown cannot embed interactive components (gist viewer, tweet embed). | Official Next.js plugin, minimal config |
| `gray-matter` | Parses YAML frontmatter from MDX files. No built-in Node.js YAML parser for this format. | 0 dependencies, 3kB |
| `rehype-pretty-code` + Shiki | Build-time syntax highlighting producing static HTML. Plain `<pre>` blocks have no highlighting. Runtime alternatives (Prism.js) add JS payload. | Zero runtime JS — all highlighting baked into HTML at build |
| Tailwind CSS + `@tailwindcss/typography` | Utility CSS with `prose` classes for Markdown content. Hand-written CSS for responsive design + typography would be larger and harder to maintain. | Purged at build time; only used classes ship |
| Pagefind | Post-build search indexer. Client-side search with <300kB index. Alternative (Lunr/Fuse) requires loading all content into JS bundle. Plain HTML has no search. | Runs post-build, minimal runtime footprint |
| `fast-xml-parser` + `turndown` | One-time migration script only. Parses WordPress WXR export XML and converts HTML to Markdown. Not shipped to production. | Dev dependency only, not in production bundle |

### Post-Design Re-Check

| Principle | Status | Notes |
|-----------|--------|-------|
| **I. Simplicity** | PASS | Single Next.js project. No monorepo. No backend. 7 production dependencies, all build-time focused. Migration tools are dev-only. |
| **II. Content-First** | PASS | MDX files are the single source of truth. Adding a new post = adding an MDX file. No database migrations, no CMS. |

## Project Structure

### Documentation (this feature)

```text
specs/001-wordpress-blog-migration/
├── plan.md              # This file
├── research.md          # Phase 0 output — technology research
├── data-model.md        # Phase 1 output — entity schemas
├── quickstart.md        # Phase 1 output — local dev setup
├── contracts/           # Phase 1 output — route & component contracts
│   ├── routes.md        #   URL route contracts
│   └── components.md    #   Page component contracts
└── tasks.md             # Phase 2 output (/speckit.tasks — NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
content/
├── posts/                          # One MDX file per blog post
│   ├── 2011-02-first-post.mdx
│   ├── ...
│   └── 2017-08-last-post.mdx
├── pages/                          # Static pages (CV)
│   └── curriculum-vitae.mdx
└── data/
    └── blogroll.json               # 11 blogroll entries

public/
├── images/                         # Downloaded WordPress media
│   └── posts/                      #   Organized by post slug
└── favicon.ico

src/
├── app/
│   ├── layout.tsx                  # Root layout (header, sidebar, footer)
│   ├── page.tsx                    # Homepage — post listing (newest first)
│   ├── blog/
│   │   └── [slug]/
│   │       └── page.tsx            # Individual post page
│   ├── page/
│   │   └── [slug]/
│   │       └── page.tsx            # Static pages (CV)
│   ├── category/
│   │   └── [slug]/
│   │       └── page.tsx            # Category listing
│   ├── tag/
│   │   └── [slug]/
│   │       └── page.tsx            # Tag listing
│   ├── archive/
│   │   └── [year]/
│   │       └── [month]/
│   │           └── page.tsx        # Monthly archive listing
│   └── search/
│       └── page.tsx                # Search results (Pagefind UI)
├── components/
│   ├── PostCard.tsx                # Post summary card for listings
│   ├── PostList.tsx                # Paginated post list
│   ├── Sidebar.tsx                 # About, categories, tags, blogroll, archive
│   ├── TagCloud.tsx                # Tag cloud widget
│   ├── GistEmbed.tsx               # GitHub gist embed component
│   ├── TweetEmbed.tsx              # Static tweet embed
│   ├── Comment.tsx                 # Legacy comment display
│   ├── CommentList.tsx             # Comment thread for a post
│   ├── SearchInput.tsx             # Pagefind search widget
│   └── QuotePost.tsx               # Quote-format post styling
├── lib/
│   ├── content.ts                  # Load & query MDX files (getPosts, getBySlug, etc.)
│   ├── types.ts                    # TypeScript interfaces (Post, Category, Tag, etc.)
│   └── utils.ts                    # Date formatting, slug generation, etc.
└── styles/
    └── globals.css                 # Tailwind directives + custom styles

scripts/
├── migrate.ts                      # WordPress WXR → MDX conversion script
├── download-images.ts              # Download WordPress-hosted images
└── validate-migration.ts           # Post-migration content verification

tests/
├── unit/
│   ├── content.test.ts             # Content loading logic tests
│   └── utils.test.ts               # Utility function tests
└── e2e/
    └── smoke.test.ts               # Playwright smoke tests on static output

next.config.mjs                     # Static export config
tailwind.config.ts                  # Tailwind + typography plugin
tsconfig.json
mdx-components.tsx                  # MDX component mapping (required by @next/mdx)
package.json
```

**Structure Decision**: Single Next.js project with App Router. Content separated from
source code (`content/` vs `src/`). Migration scripts in `scripts/` are dev-only tools.
This is the simplest structure that satisfies all requirements — no monorepo, no separate
backend, no shared packages.

## Complexity Tracking

No constitution violations. All dependencies justified above. No complexity exceptions needed.

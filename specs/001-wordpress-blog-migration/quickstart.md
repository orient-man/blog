# Quickstart: WordPress Blog Migration

**Feature**: `001-wordpress-blog-migration` | **Date**: 2026-02-27
**Phase**: 1 — Developer Quickstart

## Prerequisites

| Tool | Version | Check Command |
|------|---------|--------------|
| Node.js | 20 LTS (>=20.0.0) | `node --version` |
| npm | >=10.0.0 | `npm --version` |
| Git | >=2.30 | `git --version` |

## Initial Setup

```bash
# Clone and enter the repository
git clone <repo-url>
cd blog

# Switch to the feature branch
git checkout 001-wordpress-blog-migration

# Install dependencies
npm install
```

## Development Server

```bash
# Start Next.js dev server (with hot reload)
npm run dev
```

Opens at `http://localhost:3000`. Changes to source files and MDX content
trigger instant reload.

## Build & Export

```bash
# Full static build (generates out/ directory)
npm run build

# Build includes:
#   1. next build       — compile Next.js app
#   2. pagefind         — index static HTML for search
```

The static output is in the `out/` directory. Serve it locally to verify:

```bash
npx serve out
```

## Content Workflow

### Adding a New Post

1. Create `content/posts/{slug}.mdx`
2. Add frontmatter:

```yaml
---
title: "My New Post"
date: "2026-02-27"
author: "Marcin Malinowski"
category: "posts-in-english"
tags: ["topic-a", "topic-b"]
format: "standard"
slug: "my-new-post"
wordpressUrl: "/2026/02/27/my-new-post/"
---
```

3. Write content in MDX below the frontmatter
4. Run `npm run dev` to preview

### Adding Images

1. Place image files in `public/images/posts/{post-slug}/`
2. Reference in MDX: `![Alt text](/images/posts/{post-slug}/filename.png)`

### Using Custom Components in MDX

```mdx
{/* GitHub Gist */}
<GistEmbed id="abc123def456" />

{/* Tweet (static snapshot) */}
<TweetEmbed url="https://twitter.com/user/status/123" content="Tweet text here" author="@user" />
```

No imports needed — components are registered globally in `mdx-components.tsx`.

## Migration from WordPress

### Step 1: Export WordPress Content

1. Log in to WordPress Dashboard at orientman.wordpress.com
2. Go to Tools → Export → All Content
3. Download the WXR (XML) file
4. Save it as `scripts/wordpress-export.xml`

### Step 2: Run Migration Script

```bash
# Convert WXR XML to MDX files
npx tsx scripts/migrate.ts scripts/wordpress-export.xml

# Download all images referenced in posts
npx tsx scripts/download-images.ts

# Verify migration completeness
npx tsx scripts/validate-migration.ts
```

### Step 3: Review Output

- Check `content/posts/` — one `.mdx` file per post (~30 files)
- Check `content/pages/` — `curriculum-vitae.mdx`
- Check `content/data/blogroll.json` — 11 entries
- Check `public/images/posts/` — downloaded media files
- Review any warnings from the validation script (unconverted shortcodes, missing images)

## Testing

```bash
# Unit tests
npm run test

# E2E smoke tests (requires build first)
npm run build
npm run test:e2e
```

## Project Scripts

| Script | Command | Purpose |
|--------|---------|---------|
| `dev` | `npm run dev` | Next.js development server |
| `build` | `npm run build` | Static export + Pagefind indexing |
| `test` | `npm run test` | Run Vitest unit tests |
| `test:e2e` | `npm run test:e2e` | Run Playwright smoke tests |
| `lint` | `npm run lint` | ESLint + Prettier check |
| `migrate` | `npx tsx scripts/migrate.ts <wxr-file>` | WordPress → MDX conversion |
| `download-images` | `npx tsx scripts/download-images.ts` | Download WordPress-hosted images |
| `validate` | `npx tsx scripts/validate-migration.ts` | Post-migration content verification |

## Key Files

| File | Purpose |
|------|---------|
| `next.config.mjs` | Static export config (`output: 'export'`) |
| `tailwind.config.ts` | Tailwind + Typography plugin |
| `mdx-components.tsx` | Global MDX component mapping |
| `src/lib/content.ts` | Content loading API (getPosts, getBySlug, etc.) |
| `src/lib/types.ts` | TypeScript interfaces |
| `content/posts/` | Blog post MDX files |
| `content/pages/` | Static page MDX files |
| `content/data/blogroll.json` | Blogroll entries |

# Research: WordPress Blog Migration

**Feature**: `001-wordpress-blog-migration` | **Date**: 2026-02-27
**Phase**: 0 — Technology Research

## 1. Source Content Analysis

### WordPress Blog Inventory

| Metric | Value |
|--------|-------|
| URL | orientman.wordpress.com |
| Active period | February 2011 – August 2017 |
| Total posts | ~30 |
| Categories | 2: "Posts In English (Wpisy po angielsku)", "Wpisy po polsku (Posts In Polish)" |
| Tags | 40+ (.NET, F#, C#, C++, TDD, JavaScript, git, Functional Programming, ASP.NET MVC, Books, Conferences, Career, Tools, Refactoring, etc.) |
| Static pages | 1: "Curriculum Vitae (pl)" |
| Blogroll entries | 11 ("Blogs I Follow") |
| Post formats | Standard posts, Quote-type posts (~3 identified) |
| Posts with comments | 5–6 posts, 1–4 comments each |
| Languages | Polish and English |
| Site title | "Just A Programmer" |
| Site subtitle | "Don Quixote fighting entropy" |
| Author | Marcin Malinowski |

### Embedded Content Types

| Type | Frequency | Conversion Strategy |
|------|-----------|-------------------|
| GitHub Gists | Multiple posts | Custom `<GistEmbed>` MDX component; fallback to static code block + link |
| Code blocks | Most posts | Direct Markdown fenced blocks with language tags; rehype-pretty-code at build |
| Images | Multiple posts | Download from WordPress CDN (`i0.wp.com`), store in `public/images/posts/` |
| Embedded tweets | Rare | Static snapshot or `<TweetEmbed>` component with link |
| WordPress shortcodes | Unknown | Identify during migration, convert or flag for manual review |

### WordPress Export Format (WXR)

WordPress exports content as WXR (WordPress eXtended RSS), an XML format.

**Contains**: posts (title, content as HTML, date, slug, status, categories, tags, comments), pages, authors, categories, tags
**Does NOT contain**: media files (images, uploads)
**Media strategy**: Parse `<wp:attachment_url>` elements in WXR to get image URLs, then download separately

## 2. Technology Decisions

### 2.1 Framework: Next.js with Static Export

**Decision**: Next.js 14 with `output: 'export'`

**Rationale**:
- User requirement — Next.js was explicitly specified
- `output: 'export'` generates a fully static `out/` directory (HTML, CSS, JS)
- No server runtime needed at deploy time
- React component model enables rich MDX content (gist embeds, custom widgets)
- Mature ecosystem with excellent TypeScript support

**Key Constraints of Static Export**:
- All dynamic routes MUST use `generateStaticParams()` with `dynamicParams = false`
- No ISR (Incremental Static Regeneration)
- No Server Actions
- No rewrites or header-based redirects (use `<meta>` refresh or JS redirect if needed)
- No default `next/image` loader (use `unoptimized: true` or custom static loader)
- No `cookies()` or `headers()` server functions

**Alternatives Rejected**:
| Alternative | Why Rejected |
|-------------|-------------|
| Hugo | User specified Next.js; Go templating less flexible for custom components |
| Astro | Excellent for static blogs, but user specified Next.js |
| Eleventy | Simpler but lacks React component model for MDX embeds |
| Gatsby | Heavier build process, declining ecosystem |

### 2.2 Content Format: MDX with Frontmatter

**Decision**: MDX files with YAML frontmatter, processed by `@next/mdx` + `gray-matter`

**Rationale**:
- MDX = Markdown + JSX — allows embedding React components (GistEmbed, TweetEmbed) directly in content
- YAML frontmatter stores structured metadata (title, date, tags, category) alongside content
- `@next/mdx` is the official Next.js MDX integration for App Router
- `gray-matter` is the standard frontmatter parser (0 deps, 3kB)
- Requires `mdx-components.tsx` at project root (App Router requirement)

**Frontmatter via remark-frontmatter vs gray-matter**:
- `remark-frontmatter` operates in the remark/rehype pipeline — good for rendering, not for querying
- `gray-matter` parses frontmatter outside the pipeline — better for building post indexes and listings
- Decision: Use `gray-matter` for content loading (listings, metadata queries) and let `@next/mdx` handle rendering

**Alternatives Rejected**:
| Alternative | Why Rejected |
|-------------|-------------|
| Plain Markdown + remark | Cannot embed React components for gists/tweets |
| `next-mdx-remote` | Requires server runtime (`getServerSideProps`); incompatible with static export |
| CMS (Contentful, Sanity) | Violates Simplicity principle; adds external dependency |

### 2.3 Syntax Highlighting: rehype-pretty-code + Shiki

**Decision**: `rehype-pretty-code` with Shiki as the highlighter

**Rationale**:
- Build-time highlighting — zero runtime JavaScript shipped to client
- Uses VS Code's TextMate grammars (same highlighting as the editor)
- Supports line highlighting, word highlighting, line numbers
- Produces static HTML with inline styles — works perfectly with static export
- Supports all required languages: C#, F#, C++, JavaScript, HTML/CSS, XSLT

**Configuration**:
```js
// next.config.mjs (inside mdx plugin options)
rehypePlugins: [
  [rehypePrettyCode, {
    theme: 'one-dark-pro', // or 'github-dark'
    keepBackground: true,
  }]
]
```

**Alternatives Rejected**:
| Alternative | Why Rejected |
|-------------|-------------|
| Prism.js | Runtime JS; must load language grammars client-side |
| highlight.js | Runtime JS; less accurate highlighting than TextMate grammars |
| `@shikijs/rehype` | Lower-level; rehype-pretty-code provides better defaults and line features |

### 2.4 Search: Pagefind

**Decision**: Pagefind as a post-build search indexer

**Rationale**:
- Runs after `next build && next export` — indexes the static HTML output
- Generates a chunked search index (<300kB typical for ~30 posts)
- Ships a tiny JS widget; loads index chunks on demand
- No server-side component — fully client-side
- Works with any static site generator

**Integration**:
```bash
# Add to build script in package.json
"build": "next build && pagefind --site out"
```

The `<SearchInput>` component mounts the Pagefind UI widget.

**Alternatives Rejected**:
| Alternative | Why Rejected |
|-------------|-------------|
| Lunr.js | Requires loading entire index into memory; larger payload for full-text |
| Fuse.js | Fuzzy search but requires all content in JS bundle |
| Algolia | External service; violates Simplicity (adds dependency on third-party API) |

### 2.5 Styling: Tailwind CSS + @tailwindcss/typography

**Decision**: Tailwind CSS with the Typography plugin

**Rationale**:
- `prose` classes from Typography plugin handle Markdown content beautifully — headings, paragraphs, lists, code blocks, blockquotes, tables
- Utility-first approach keeps CSS maintainable
- Purged at build time — only used classes ship in production
- Dark mode via `dark:` variant (class-based toggle)
- Responsive design via `sm:`, `md:`, `lg:` breakpoints

**Alternatives Rejected**:
| Alternative | Why Rejected |
|-------------|-------------|
| CSS Modules | More boilerplate; no built-in typography system for Markdown |
| styled-components | Runtime CSS-in-JS; adds JS payload |
| Plain CSS | Higher maintenance for responsive design + typography |

### 2.6 Migration Pipeline

**Decision**: Custom Node.js script using `fast-xml-parser` + `turndown`

**Rationale**:
- WordPress exports content as WXR (XML) — need XML parser
- `fast-xml-parser` is fast, well-maintained, handles WXR's nested structure
- `turndown` converts HTML → Markdown with configurable rules
- Custom script allows handling WordPress-specific patterns:
  - `[caption]` shortcodes → Markdown image with caption
  - `<script src="gist.github.com/...">` → `<GistEmbed id="..." />` MDX component
  - Embedded tweets → `<TweetEmbed url="..." />` or static blockquote
- Dev dependency only — not shipped to production

**Pipeline Steps**:
1. Export WordPress content via WXR (Dashboard → Tools → Export → All Content)
2. Run `scripts/migrate.ts`: parse WXR XML, extract posts/pages/comments/categories/tags
3. For each post: convert HTML body → Markdown via Turndown, generate YAML frontmatter, write `.mdx` file
4. Run `scripts/download-images.ts`: find all image URLs in posts, download to `public/images/posts/`, update paths in MDX
5. Run `scripts/validate-migration.ts`: verify post count, check for broken image refs, flag unconverted shortcodes

**Alternatives Rejected**:
| Alternative | Why Rejected |
|-------------|-------------|
| wp2static | Exports rendered HTML pages, not structured content; no frontmatter |
| wordpress-export-to-markdown (npm) | Produces plain Markdown; no MDX component support; limited shortcode handling |
| Manual copy-paste | ~30 posts is borderline but still error-prone and tedious |

## 3. URL Structure Preservation

**Requirement**: FR-020 — preserve original WordPress URLs

**WordPress URL pattern**: `https://orientman.wordpress.com/YYYY/MM/DD/post-slug/`

**Implementation**:
- Next.js route: `app/[...slug]/page.tsx` catch-all route OR nested `app/[year]/[month]/[day]/[slug]/page.tsx`
- Simpler approach: store the full WordPress path in frontmatter as `wordpressPath`, use `generateStaticParams()` to emit matching routes
- `trailingSlash: true` in `next.config.mjs` to match WordPress convention

**Decision**: Use `app/[year]/[month]/[day]/[slug]/page.tsx` with `generateStaticParams()`.
Each post's frontmatter contains `date` — extract year/month/day from it. This approach:
- Maps 1:1 to WordPress URLs
- Uses standard Next.js dynamic segments (no catch-all complexity)
- Each segment is typed and validated

## 4. Image Handling

**Challenge**: WordPress images are hosted on `i0.wp.com` CDN. These URLs may break.

**Strategy**:
1. During migration, extract all `<img>` URLs from post HTML
2. Download each image to `public/images/posts/{post-slug}/`
3. Replace URLs in Markdown output with local paths `/images/posts/{post-slug}/filename.ext`
4. Use `next/image` with `unoptimized: true` (static export limitation) or plain `<img>` tags

**next/image in static export**:
- Default loader requires a server — not available in static export
- Options: `unoptimized: true` (serves original images) or custom loader that just returns the path
- For ~30 posts with modest image count, `unoptimized: true` is sufficient

## 5. Dark Mode Strategy

**Requirement**: FR-019 — modern tech blog aesthetic with dark mode support

**Implementation**:
- Tailwind's `darkMode: 'class'` strategy
- Toggle button in header saves preference to `localStorage`
- CSS transitions for smooth theme switching
- Code block themes: use Shiki dual-theme (`one-dark-pro` for dark, `github-light` for light)
- `rehype-pretty-code` supports `theme: { dark: '...', light: '...' }` for dual themes

## 6. Open Questions

| # | Question | Impact | Proposed Resolution |
|---|----------|--------|-------------------|
| 1 | Is the WordPress WXR export file already available, or must it be exported? | Blocks migration script | User to export via WordPress Dashboard → Tools → Export |
| 2 | Should the blogroll be a sidebar widget or a dedicated page? | FR-013 layout | Sidebar widget (matches original WordPress layout) |
| 3 | Hosting target? (GitHub Pages, Vercel, Netlify, other) | Deployment config, CI/CD | Defer to implementation phase; all work with static `out/` |
| 4 | Custom domain? | DNS config | Defer to deployment phase |
| 5 | Should embedded tweets use live oEmbed or static snapshots? | Tweet component complexity | Static snapshots (simpler, no external API dependency) |

# Route Contracts: WordPress Blog Migration

**Feature**: `001-wordpress-blog-migration` | **Date**: 2026-02-27
**Phase**: 1 — Contracts

## Overview

All routes are statically generated at build time using `generateStaticParams()`.
No server-side rendering. `next.config.mjs` sets `output: 'export'` and `trailingSlash: true`.

## Route Table

| Route Pattern       | Page File                                  | Purpose                                      | Params Source                            | Spec Requirement       |
| ------------------- | ------------------------------------------ | -------------------------------------------- | ---------------------------------------- | ---------------------- |
| `/`                 | `app/page.tsx`                             | Homepage — paginated post list, newest first | None                                     | FR-008                 |
| `/YYYY/MM/DD/slug/` | `app/[year]/[month]/[day]/[slug]/page.tsx` | Individual post                              | `generateStaticParams()` from all posts  | FR-001, FR-002, FR-020 |
| `/page/slug/`       | `app/page/[slug]/page.tsx`                 | Static page (CV)                             | `generateStaticParams()` from all pages  | FR-010                 |
| `/category/slug/`   | `app/category/[slug]/page.tsx`             | Posts in a category                          | `generateStaticParams()` from categories | FR-006, FR-009         |
| `/tag/slug/`        | `app/tag/[slug]/page.tsx`                  | Posts with a tag                             | `generateStaticParams()` from tags       | FR-007, FR-009         |
| `/archive/YYYY/MM/` | `app/archive/[year]/[month]/page.tsx`      | Monthly archive                              | `generateStaticParams()` from months     | FR-009                 |
| `/search/`          | `app/search/page.tsx`                      | Search page (Pagefind UI)                    | None                                     | FR-014                 |

## Route Details

### 1. Homepage — `/`

**File**: `app/page.tsx`
**Type**: Static (no dynamic segments)
**Data**: `getAllPosts()` — returns all posts sorted newest-first
**Rendering**:

- Paginated list of `<PostCard>` components (10 posts per page)
- Pagination via client-side state or static page generation (`/page/2/`, `/page/3/`)
- Sidebar with about section, categories, tag cloud, blogroll, archive links

**Decision — Pagination Strategy**:
Option A: Client-side pagination (single page, JS toggles visibility)
Option B: Static pagination pages (`/page/2/`, `/page/3/`)

Recommended: **Option A** (client-side). With ~30 posts, all data fits in the initial
page load. Simpler than generating separate pagination pages. Matches WordPress behavior
where older posts are loaded via "Older posts" link.

### 2. Post Page — `/YYYY/MM/DD/slug/`

**File**: `app/[year]/[month]/[day]/[slug]/page.tsx`
**Type**: Dynamic (4 segments), statically generated

**`generateStaticParams()`**:

```typescript
export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => {
    const d = new Date(post.date);
    return {
      year: String(d.getFullYear()),
      month: String(d.getMonth() + 1).padStart(2, "0"),
      day: String(d.getDate()).padStart(2, "0"),
      slug: post.slug,
    };
  });
}
```

**Data**: `getPostBySlug(slug)` — returns full post with content and comments
**Rendering**:

- Full MDX content rendered via `@next/mdx`
- Post metadata: title, date, author, category link, tag links
- If `format === "quote"`: wrap in `<QuotePost>` styling (blockquote visual)
- If `comments` exist: render `<CommentList>` below the post
- Navigation: previous/next post links
- Sidebar (same as homepage)

**URL Preservation Contract (FR-020)**:
The route MUST produce URLs identical to the original WordPress structure:

- WordPress: `https://orientman.wordpress.com/2017/08/15/some-post-slug/`
- New blog: `https://{domain}/2017/08/15/some-post-slug/`
- Month and day MUST be zero-padded (e.g., `08`, `15`)

### 3. Static Page — `/page/slug/`

**File**: `app/page/[slug]/page.tsx`
**Type**: Dynamic (1 segment), statically generated

**`generateStaticParams()`**:

```typescript
export async function generateStaticParams() {
  const pages = getAllPages();
  return pages.map((p) => ({ slug: p.slug }));
}
```

**Data**: `getPageBySlug(slug)`
**Rendering**:

- Full MDX content
- No date, no category, no tags (visually distinct from posts per US3-2)
- Sidebar (same as homepage)

### 4. Category Page — `/category/slug/`

**File**: `app/category/[slug]/page.tsx`
**Type**: Dynamic (1 segment), statically generated

**`generateStaticParams()`**:

```typescript
export async function generateStaticParams() {
  return [{ slug: "posts-in-english" }, { slug: "wpisy-po-polsku" }];
}
```

**Data**: `getPostsByCategory(slug)`
**Rendering**:

- Category name as heading
- List of `<PostCard>` components for posts in this category
- Sidebar

### 5. Tag Page — `/tag/slug/`

**File**: `app/tag/[slug]/page.tsx`
**Type**: Dynamic (1 segment), statically generated

**`generateStaticParams()`**:

```typescript
export async function generateStaticParams() {
  const tags = getAllTags();
  return tags.map((t) => ({ slug: t.slug }));
}
```

**Data**: `getPostsByTag(slug)`
**Rendering**:

- Tag name as heading
- List of `<PostCard>` components
- Sidebar

### 6. Archive Page — `/archive/YYYY/MM/`

**File**: `app/archive/[year]/[month]/page.tsx`
**Type**: Dynamic (2 segments), statically generated

**`generateStaticParams()`**:

```typescript
export async function generateStaticParams() {
  const months = getArchiveMonths();
  return months.map((m) => ({
    year: String(m.year),
    month: String(m.month).padStart(2, "0"),
  }));
}
```

**Data**: `getPostsByMonth(year, month)`
**Rendering**:

- "Archive: Month Year" as heading
- List of `<PostCard>` components
- Sidebar

### 7. Search Page — `/search/`

**File**: `app/search/page.tsx`
**Type**: Static (no dynamic segments)
**Data**: None (Pagefind loads its own index client-side)
**Rendering**:

- `<SearchInput>` component that mounts Pagefind UI
- Results displayed by Pagefind's built-in result rendering
- Sidebar

## Static Export Configuration

```javascript
// next.config.mjs
const nextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};
```

## 404 Handling

Next.js static export generates a `404.html`. Create `app/not-found.tsx` with
a friendly message and navigation links back to the homepage.

## Sitemap

Generate `sitemap.xml` at build time using `next-sitemap` or a custom script
that reads all posts, pages, categories, tags, and archive months.

## RSS Feed

Generate `feed.xml` at build time as a static file in `public/` or via a build
script. Include all posts with title, date, excerpt, and link.

# Component Contracts: WordPress Blog Migration

**Feature**: `001-wordpress-blog-migration` | **Date**: 2026-02-27
**Phase**: 1 — Contracts

## Overview

React components live in `src/components/`. They receive typed props and render
static HTML at build time. No client-side state unless explicitly marked with
`'use client'`.

## Layout Components

### RootLayout

**File**: `src/app/layout.tsx`
**Type**: Server component
**Spec**: FR-011, FR-012, FR-019

```typescript
// Wraps every page. Provides header, sidebar, footer, dark mode class.
interface RootLayoutProps {
  children: React.ReactNode;
}
```

**Responsibilities**:
- HTML `<head>` with metadata, Open Graph tags, favicon
- Site header: title "Just A Programmer", subtitle "Don Quixote fighting entropy"
- `<Sidebar>` on desktop; collapsible on mobile
- Main content area (`{children}`)
- Footer with copyright
- Dark mode toggle (class-based via `'use client'` island)
- Responsive layout: sidebar beside content on desktop, stacked on mobile

### Sidebar

**File**: `src/components/Sidebar.tsx`
**Type**: Server component
**Spec**: FR-012, FR-013, US4

```typescript
interface SidebarProps {
  allTags: Tag[];
  archiveMonths: { year: number; month: number; count: number }[];
  blogroll: BlogrollEntry[];
}
```

**Sections** (in order):
1. **About** — Author bio: "Father of 2, husband, bookworm, stubborn, programmer, conference addict..."
2. **Categories** — Links to `/category/posts-in-english/` and `/category/wpisy-po-polsku/`
3. **Tag Cloud** — `<TagCloud>` component
4. **Archive** — Monthly links: `/archive/2017/08/` etc.
5. **Blogroll** — "Blogs I Follow" with 11 external links
6. **Recent Posts** — Last 5 posts with links

## Content Display Components

### PostCard

**File**: `src/components/PostCard.tsx`
**Type**: Server component
**Spec**: FR-008, US2

```typescript
interface PostCardProps {
  post: Pick<Post, 'title' | 'date' | 'slug' | 'excerpt' | 'category' | 'tags' | 'format' | 'wordpressUrl'>;
}
```

**Renders**:
- Post title (linked to post URL)
- Publication date (formatted: "August 15, 2017")
- Excerpt (first 160 chars of content if no explicit excerpt)
- Category badge
- Tag pills (first 5 tags, "+N more" if truncated)
- Visual distinction for quote-format posts (left border accent or blockquote icon)

### PostList

**File**: `src/components/PostList.tsx`
**Type**: Client component (`'use client'`)
**Spec**: FR-008, US2-5

```typescript
interface PostListProps {
  posts: Post[];
  pageSize?: number;         // Default: 10
  title?: string;            // Optional heading ("Posts tagged F#", "Archive: August 2017")
}
```

**Renders**:
- Optional title/heading
- List of `<PostCard>` components
- Client-side pagination: "Newer" / "Older" buttons
- Post count display ("Showing 1–10 of 30 posts")

**Why client component**: Pagination state is client-side to avoid generating
separate static pages for each page number (simpler per Constitution Principle I).

### QuotePost

**File**: `src/components/QuotePost.tsx`
**Type**: Server component
**Spec**: FR-015, US1-5

```typescript
interface QuotePostProps {
  children: React.ReactNode;  // The quote content (MDX body)
}
```

**Renders**:
- Large blockquote styling
- Decorative quotation marks
- Distinct background/border from standard posts
- Used in MDX when `format === "quote"` — the post page wraps content in this component

## Embedded Content Components

### GistEmbed

**File**: `src/components/GistEmbed.tsx`
**Type**: Client component (`'use client'`)
**Spec**: FR-004, US1-3

```typescript
interface GistEmbedProps {
  id: string;                 // GitHub Gist ID (e.g., "abc123def456")
  file?: string;              // Optional specific file within the gist
}
```

**Renders**:
- Iframe or `<script>` embed loading the GitHub Gist
- Fallback: if gist fails to load, display a link to `https://gist.github.com/{id}`
- Loading skeleton while gist loads

**MDX Usage**:
```mdx
<GistEmbed id="abc123def456" />
```

**Why client component**: Gist loading requires browser-side JavaScript.

### TweetEmbed

**File**: `src/components/TweetEmbed.tsx`
**Type**: Server component
**Spec**: Edge case handling

```typescript
interface TweetEmbedProps {
  url: string;                // Full tweet URL
  content?: string;           // Static tweet text (for snapshot approach)
  author?: string;            // Tweet author
}
```

**Renders**:
- Static blockquote with tweet content + link to original
- No external Twitter/X API dependency (Constitution Principle I: Simplicity)

**Decision**: Static snapshot approach. Embed the tweet text as a styled blockquote
with a link to the original URL. No oEmbed, no external JS.

### Comment

**File**: `src/components/Comment.tsx`
**Type**: Server component
**Spec**: FR-016, FR-021, US6

```typescript
interface CommentProps {
  comment: Comment;           // { author, date, content, avatarUrl? }
}
```

**Renders**:
- Comment author name
- Comment date (formatted)
- Comment content (plain text or sanitized HTML)
- Optional avatar (Gravatar URL if available, otherwise initials)

### CommentList

**File**: `src/components/CommentList.tsx`
**Type**: Server component
**Spec**: FR-016, US6

```typescript
interface CommentListProps {
  comments: Comment[];
}
```

**Renders**:
- "Comments (N)" heading
- List of `<Comment>` components
- Note: "Comments are from the original WordPress blog. New comments are not supported."

## Navigation Components

### TagCloud

**File**: `src/components/TagCloud.tsx`
**Type**: Server component
**Spec**: FR-007, US4-2

```typescript
interface TagCloudProps {
  tags: Tag[];                // All tags with counts
}
```

**Renders**:
- Tags as clickable pills/badges, linked to `/tag/{slug}/`
- Size/weight varies by post count (more posts = larger text or bolder)
- Maximum ~20 tags shown, with "View all tags" link if more exist

### SearchInput

**File**: `src/components/SearchInput.tsx`
**Type**: Client component (`'use client'`)
**Spec**: FR-014, US5

```typescript
interface SearchInputProps {
  placeholder?: string;       // Default: "Search posts..."
}
```

**Renders**:
- Search input field
- Mounts Pagefind UI on client-side hydration
- Displays results inline or navigates to `/search/` page

**Integration**:
```typescript
// Dynamically import Pagefind to avoid SSR issues
useEffect(() => {
  import('/pagefind/pagefind-ui.js').then((module) => {
    new module.PagefindUI({ element: containerRef.current });
  });
}, []);
```

### DarkModeToggle

**File**: `src/components/DarkModeToggle.tsx`
**Type**: Client component (`'use client'`)
**Spec**: FR-019

```typescript
// No props — reads/writes localStorage and toggles `dark` class on <html>
```

**Behavior**:
- On mount: check `localStorage` for preference, fall back to `prefers-color-scheme`
- On click: toggle `dark` class on `<html>`, persist to `localStorage`
- Renders: sun/moon icon button

## MDX Component Mapping

**File**: `mdx-components.tsx` (project root, required by `@next/mdx`)

```typescript
import type { MDXComponents } from 'mdx/types';
import { GistEmbed } from '@/components/GistEmbed';
import { TweetEmbed } from '@/components/TweetEmbed';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    GistEmbed,
    TweetEmbed,
    // Override default elements if needed:
    // pre: CustomCodeBlock,
    // img: OptimizedImage,
  };
}
```

This mapping makes `<GistEmbed>` and `<TweetEmbed>` available in all MDX files
without explicit imports.

## Client vs Server Component Summary

| Component | Type | Reason |
|-----------|------|--------|
| RootLayout | Server | Static shell, no interactivity |
| Sidebar | Server | Static content |
| PostCard | Server | Static rendering |
| PostList | **Client** | Pagination state |
| QuotePost | Server | Static styling wrapper |
| GistEmbed | **Client** | Loads external JS |
| TweetEmbed | Server | Static blockquote |
| Comment | Server | Static rendering |
| CommentList | Server | Static rendering |
| TagCloud | Server | Static rendering |
| SearchInput | **Client** | Pagefind UI requires browser |
| DarkModeToggle | **Client** | localStorage + DOM manipulation |

**Client component count**: 4 out of 12 — minimized per Constitution Principle I.

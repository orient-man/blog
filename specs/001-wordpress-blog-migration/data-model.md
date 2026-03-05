# Data Model: WordPress Blog Migration

**Feature**: `001-wordpress-blog-migration` | **Date**: 2026-02-27
**Phase**: 1 — Data Model Definition

## Overview

All data is stored in the filesystem. There is no database. Content lives in MDX files
with YAML frontmatter. Structured data (blogroll) lives in JSON. TypeScript interfaces
define the shape of each entity at build time.

## Entities

### 1. Post

A blog entry. The primary content unit.

**Storage**: `content/posts/{slug}.mdx`
**Quantity**: ~30

#### Frontmatter Schema

```yaml
---
title: "Post Title" # string, REQUIRED
date: "2017-08-15" # ISO 8601 date, REQUIRED
author: "Marcin Malinowski" # string, REQUIRED
category: "posts-in-english" # slug string, REQUIRED (exactly one)
tags: # string[], REQUIRED (0 or more)
  - "fsharp"
  - "functional-programming"
  - "dotnet"
format: "standard" # "standard" | "quote", REQUIRED
slug: "my-post-slug" # string, REQUIRED (URL-safe)
excerpt: "Brief summary of the post..." # string, OPTIONAL (auto-generated if missing)
wordpressUrl: "/2017/08/15/my-post-slug/" # string, REQUIRED (original WP path for URL preservation)
comments: # Comment[], OPTIONAL
  - author: "Reader Name"
    date: "2017-08-16"
    content: "Great post!"
  - author: "Another Reader"
    date: "2017-08-17"
    content: "Thanks for sharing."
---
MDX content body here...
```

#### TypeScript Interface

```typescript
interface Post {
  // Frontmatter fields
  title: string;
  date: string; // ISO 8601 date string
  author: string;
  category: CategorySlug; // "posts-in-english" | "wpisy-po-polsku"
  tags: string[];
  format: "standard" | "quote";
  slug: string;
  excerpt?: string;
  wordpressUrl: string;
  comments?: Comment[];

  // Computed fields (from content loading)
  content: string; // Raw MDX string (for rendering)
  readingTime?: number; // Estimated minutes
}
```

#### Naming Convention

Filename: `{slug}.mdx` where slug matches the original WordPress slug.
Example: `content/posts/trampolining-in-csharp.mdx`

---

### 2. Category

A top-level content grouping. Two fixed categories.

**Storage**: Derived from post frontmatter — no separate files.
**Quantity**: 2 (fixed)

#### Definition

```typescript
type CategorySlug = "posts-in-english" | "wpisy-po-polsku";

interface Category {
  slug: CategorySlug;
  name: string; // Display name
  description?: string;
}

const CATEGORIES: Category[] = [
  {
    slug: "posts-in-english",
    name: "Posts In English (Wpisy po angielsku)",
  },
  {
    slug: "wpisy-po-polsku",
    name: "Wpisy po polsku (Posts In Polish)",
  },
];
```

**Rationale**: With only 2 categories that never change, a hardcoded constant is simpler
than separate files or frontmatter collection. Posts reference categories by slug.

---

### 3. Tag

A descriptive label for cross-cutting topics.

**Storage**: Derived from post frontmatter — no separate files.
**Quantity**: 40+ (dynamic, collected from all posts)

#### Definition

```typescript
interface Tag {
  slug: string; // URL-safe: "fsharp", "dotnet", "tdd"
  name: string; // Display name: "F#", ".NET", "TDD"
  count: number; // Number of posts with this tag
}
```

**Tag Slug Mapping**: Some tags need explicit slug mapping because their display names
contain special characters:

```typescript
const TAG_SLUG_MAP: Record<string, string> = {
  "F#": "fsharp",
  "C#": "csharp",
  "C++": "cpp",
  ".NET": "dotnet",
  "ASP.NET MVC": "aspnet-mvc",
  // Simple tags use auto-slugify: "TDD" → "tdd", "JavaScript" → "javascript"
};
```

**Collection**: Tags are collected at build time by scanning all post frontmatter.
The `getPosts()` function aggregates unique tags and their counts.

---

### 4. Comment

A reader comment on a post. Historical only — no new comments.

**Storage**: Inline in post frontmatter (YAML array).
**Quantity**: ~10–20 total across 5–6 posts

#### Definition

```typescript
interface Comment {
  author: string; // Commenter's display name
  date: string; // ISO 8601 date string
  content: string; // Plain text or simple HTML
  avatarUrl?: string; // Gravatar or WordPress avatar URL (optional)
}
```

**Rationale for inline storage**: Comments are few (~1–4 per post, only 5–6 posts).
Storing them in frontmatter keeps each post self-contained. No separate comment
files or API needed. This is the simplest approach per Constitution Principle I.

---

### 5. Static Page

A standalone page not in the chronological post stream.

**Storage**: `content/pages/{slug}.mdx`
**Quantity**: 1 (Curriculum Vitae)

#### Frontmatter Schema

```yaml
---
title: "Curriculum Vitae"
slug: "curriculum-vitae"
---
Page content here...
```

#### TypeScript Interface

```typescript
interface StaticPage {
  title: string;
  slug: string;
  content: string; // Raw MDX string
}
```

**Note**: Static pages have no date, category, tags, or comments. They are visually
distinct from posts (per spec acceptance criteria US3-2).

---

### 6. Blogroll Entry

An external blog reference in the "Blogs I Follow" section.

**Storage**: `content/data/blogroll.json`
**Quantity**: 11

#### Schema

```json
[
  {
    "name": "Blog Name",
    "url": "https://example.com"
  }
]
```

#### TypeScript Interface

```typescript
interface BlogrollEntry {
  name: string;
  url: string;
}
```

**Rationale for JSON**: Blogroll entries are pure data (name + URL), not content.
JSON is simpler than MDX for structured data with no prose.

---

## Entity Relationships

```
Post ──────── 1:1 ──────── Category (each post has exactly one category)
Post ──────── M:N ──────── Tag (each post has 0+ tags; each tag spans many posts)
Post ──────── 1:N ──────── Comment (a post has 0+ comments; comments belong to one post)

StaticPage ─── standalone (no relationships)
BlogrollEntry ── standalone (no relationships)
Category ────── standalone (hardcoded constant; posts reference by slug)
```

## Content Loading API

All content is loaded at build time via functions in `src/lib/content.ts`:

```typescript
// Core loading functions
function getAllPosts(): Post[]; // All posts, sorted newest-first
function getPostBySlug(slug: string): Post | undefined; // Single post by slug
function getPostsByCategory(cat: CategorySlug): Post[]; // Filter by category
function getPostsByTag(tagSlug: string): Post[]; // Filter by tag
function getPostsByMonth(year: number, month: number): Post[]; // Filter by month

// Metadata aggregation
function getAllTags(): Tag[]; // All unique tags with counts
function getAllCategories(): Category[]; // Fixed category list
function getArchiveMonths(): { year: number; month: number; count: number }[];

// Static pages
function getAllPages(): StaticPage[];
function getPageBySlug(slug: string): StaticPage | undefined;

// Blogroll
function getBlogroll(): BlogrollEntry[]; // Parse blogroll.json
```

These functions read from the filesystem using `fs.readFileSync` + `gray-matter`
at build time. They are called in `generateStaticParams()` and page components.

## Migration Field Mapping

WordPress WXR field → MDX frontmatter field:

| WXR XML Element                | MDX Frontmatter | Transform                      |
| ------------------------------ | --------------- | ------------------------------ |
| `<title>`                      | `title`         | Direct copy                    |
| `<wp:post_date>`               | `date`          | Parse to ISO 8601              |
| `<dc:creator>`                 | `author`        | Direct copy                    |
| `<category domain="category">` | `category`      | Slugify                        |
| `<category domain="post_tag">` | `tags[]`        | Slugify each                   |
| `<wp:post_name>`               | `slug`          | Direct copy (already URL-safe) |
| `<content:encoded>`            | MDX body        | HTML → Markdown via Turndown   |
| `<excerpt:encoded>`            | `excerpt`       | HTML → plain text              |
| `<wp:post_type>` = "post"      | —               | Emit to `content/posts/`       |
| `<wp:post_type>` = "page"      | —               | Emit to `content/pages/`       |
| `<wp:comment>` children        | `comments[]`    | Extract author, date, content  |
| `<link>` path                  | `wordpressUrl`  | Extract path portion           |
| Post format (from terms)       | `format`        | Map to "standard" or "quote"   |

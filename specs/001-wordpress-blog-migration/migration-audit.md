# Migration Audit Report

**Date:** 2026-02-28  
**Scope:** Full comparison of `orientman.wordpress.com` (source) vs `blog.orientman.com` (new static site)  
**Auditor:** OpenCode AI agent

---

## Executive Summary

The migration of `orientman.wordpress.com` to `blog.orientman.com` (Next.js 14 static export)
is **structurally complete** — all 33 posts, 17 images, 2 categories, 9 comment threads, and
the blogroll are present. However, there are several issues ranging from cosmetic to
medium-severity that should be addressed.

---

## What Is Working Correctly

| Area               | Status  | Notes                                                                          |
| ------------------ | ------- | ------------------------------------------------------------------------------ |
| Post count         | 33/33   | Perfect match                                                                  |
| Images             | 17/17   | All present; no orphans, no missing files, no external CDN refs                |
| Categories         | 2/2     | Correct assignment on all posts                                                |
| Dates              | All 33  | All post dates match WordPress originals                                       |
| Quote format posts | 3/3     | `is-dead`, `tdd-by-example-quotes`, `refactoring-is-like-eating-a-proper-diet` |
| Blogroll           | 11/11   | Same entries, same order                                                       |
| Comments           | 9 posts | Approved WordPress comments preserved as read-only display                     |
| Archive months     | All     | Dynamically generated from post dates — structurally correct                   |
| XML/HTML safety    | n/a     | `format: 'md'` in `evaluate()` correctly handles raw XML in migrated content   |

---

## Issues Found

### HIGH — Tag Display Names (53 of 58 tags affected)

Only 5 tags have proper display names via `TAG_SLUG_MAP` in `src/lib/types.ts`.
The remaining **53 tags display as raw slugs** because `getAllTags()` in `src/lib/content.ts`
falls back to `slugToName[slug] ?? slug` — showing the slug itself when no mapping exists.

Selected examples (most impactful by post count):

| Slug displayed           | Should display as      | Posts affected |
| ------------------------ | ---------------------- | -------------- |
| `tdd`                    | TDD                    | 9              |
| `javascript`             | JavaScript             | 5              |
| `tools`                  | Tools                  | 3              |
| `nuget`                  | NuGet                  | 3              |
| `jquery`                 | jQuery                 | 3              |
| `code-coverage`          | Code Coverage          | 2              |
| `books`                  | Books                  | 2              |
| `dynamicproxy`           | DynamicProxy           | 2              |
| `refactoring`            | Refactoring            | 2              |
| `qunit`                  | QUnit                  | 2              |
| `paket`                  | Paket                  | 2              |
| `aspnetcore`             | ASP.NET Core           | 1              |
| `resharper`              | ReSharper              | 1              |
| `xslt`                   | XSLT                   | 1              |
| `raii`                   | RAII                   | 1              |
| `ioc`                    | IoC                    | 1              |
| `ienumerable`            | IEnumerable            | 1              |
| `fake`                   | FAKE                   | 1              |
| `durabletask`            | DurableTask            | 1              |
| `tpl`                    | TPL                    | 1              |
| `ci`                     | CI                     | 1              |
| `sqlite`                 | SQLite                 | 1              |
| `ssd`                    | SSD                    | 1              |
| `ssl-certs`              | SSL Certs              | 1              |
| `visualstudio`           | VisualStudio           | 1              |
| `mvc`                    | MVC                    | 1              |
| `webforms`               | WebForms               | 1              |
| `mono`                   | Mono                   | 1              |
| `ie`                     | IE                     | 1              |
| `git`                    | Git                    | 1              |
| `github`                 | GitHub                 | 1              |
| `presentations`          | Presentations          | 1              |
| `monads`                 | Monads                 | 1              |
| `async`                  | Async                  | 1              |
| `biometry`               | Biometry               | 1              |
| `decoupling`             | Decoupling             | 1              |
| `dependencyinjection`    | DependencyInjection    | 1              |
| `ninject`                | Ninject                | 1              |
| `integration-testing`    | Integration Testing    | 1              |
| `microsoft-word`         | Microsoft Word         | 1              |
| `miniprofiler`           | MiniProfiler           | 1              |
| `reporting`              | Reporting              | 1              |
| `boost-test-library`     | Boost Test Library     | 1              |
| `functional-programming` | Functional Programming | 1              |
| `career`                 | Career                 | 1              |
| `conferences`            | Conferences            | 1              |
| `constraint-definitions` | Constraint Definitions | 1              |
| `validation`             | Validation             | 1              |
| `dynamic`                | Dynamic                | 1              |
| `coding-style`           | Coding Style           | 1              |
| `git-scm-svn`            | Git-SCM/SVN            | 1              |
| `quotes`                 | Quotes                 | 2              |
| `2013`                   | 2013                   | 1              |

**Fix:** Extend `TAG_SLUG_MAP` in `src/lib/types.ts` with all 53 missing entries.

---

### HIGH — Gist Embeds Not Rendering (8 bare URLs in 5 posts)

A `GistEmbed` component exists at `src/components/GistEmbed.tsx` but is never invoked.
Eight GitHub Gist URLs appear as plain text or plain links in post content. Because posts
are compiled with `format: 'md'`, MDX custom components cannot be used inline — the
component is effectively unreachable from post content.

Affected posts and URLs:

| Post file                                                      | Gist URL(s)                                                                                             |
| -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `blanket-js-qunit-and-ie8-please-die-now.mdx`                  | `https://gist.github.com/4538958`, `https://gist.github.com/4539327`, `https://gist.github.com/4539471` |
| `fun-with-castle-dynamicproxy.mdx`                             | `https://gist.github.com/4079379`, `https://gist.github.com/4079245`                                    |
| `fun-with-castle-dynamicproxy-part-ii.mdx`                     | `https://gist.github.com/4109938`                                                                       |
| `explaining-sqlite-foreign-keys-support-with-unit-tests.mdx`   | `https://gist.github.com/4079035`                                                                       |
| `how-to-put-your-toe-into-asp-net-mvc-integration-testing.mdx` | `https://gist.github.com/orient-man/7804310`                                                            |

Note: `checking-for-outdated-package-references-during-build-with-fake-paket.mdx` contains
one gist URL used as a markdown link target `[text](url)` — this is acceptable as-is.

**Fix options:**

- Implement a rehype plugin that detects bare gist URLs and auto-embeds them as iframes
- Inline the gist content as fenced code blocks in each post

---

### HIGH — No Fenced Code Blocks in Any Post

Zero ` ``` ` fenced code blocks exist across all 33 posts. Code samples appear as:

- Inline backtick spans
- Raw text pasted in paragraphs
- Gist URL references

This means `rehype-pretty-code` (Shiki) syntax highlighting configured in `next.config.mjs`
and `src/app/[year]/[month]/[day]/[slug]/page.tsx` is **never activated** on any post content.
The syntax highlighting infrastructure exists but has no content to highlight.

**Fix:** Review each post with code samples and wrap them in fenced code blocks with
appropriate language tags (e.g., ` ```fsharp `, ` ```csharp `, ` ```javascript `).

---

### MEDIUM — Internal Links Still Point to WordPress (3 posts)

| Post                                                                         | Stale URL                                                                                      |
| ---------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| `content/posts/good-times-bad-times.mdx`                                     | `orientman.wordpress.com/2013/06/06/testing-and-refactoring-legacy-code/`                      |
| `content/posts/chutzpah-to-run-javascript-tests.mdx`                         | `orientman.wordpress.com/2013/01/15/blanket-js-qunit-and-ie8-please-die-now/` (×2)             |
| `content/posts/how-to-put-your-toe-into-asp-net-mvc-integration-testing.mdx` | `orientman.wordpress.com/2013/12/06/how-to-put-your-toe-into-asp-net-mvc-integration-testing/` |

**Fix:** Replace with relative internal links matching the new URL scheme
(e.g., `/2013/06/06/testing-and-refactoring-legacy-code/`).

---

### MEDIUM — Tag Cloud Shows Only 20 of 58 Tags

WordPress displays all 58 tags in a weighted tag cloud. The new site's `TagCloud` component
is capped at `maxTags={20}`, hiding 38 tags from the sidebar. Lower-frequency tags are
inaccessible from the sidebar.

**Fix:** Increase the cap, or add a "View all tags" link to a dedicated `/tags/` index page.

---

### MEDIUM — Goodreads "Currently Reading" Widget Missing

WordPress includes a Goodreads widget (user ID 13930842, "currently-reading" shelf).
The new site has no equivalent. This was a personality element of the original blog.

**Fix:** Decide whether to add a Goodreads integration or intentionally drop this widget.

---

### LOW — About Section Differences

| Aspect          | WordPress               | New Site                                                         |
| --------------- | ----------------------- | ---------------------------------------------------------------- |
| Avatar          | Gravatar image (128 px) | None                                                             |
| Bio text        | English only, longer    | Polish first, then English                                       |
| Missing phrases | —                       | "Believes in chance. Beer philosopher. Occasionally goalkeeper." |
| CV link         | Absent                  | Present (`/page/curriculum-vitae-pl/`)                           |

---

### LOW — YouTube URLs Use HTTP (4 posts)

Four YouTube links across four posts use `http://` instead of `https://`. One is a bare URL
not wrapped in a markdown link.

| Post                                                           | URL                                                     |
| -------------------------------------------------------------- | ------------------------------------------------------- |
| `testing-and-refactoring-legacy-code.mdx`                      | `http://www.youtube.com/watch?v=_NnElPO5BU0`            |
| `how-to-put-your-toe-into-asp-net-mvc-integration-testing.mdx` | `http://www.youtube.com/watch?v=ePyRrb2-fzs`            |
| `git-jest-git.mdx`                                             | `http://www.youtube.com/watch?v=1ffBJ4sVUb4`            |
| `etiuda-filmowa-p-t-czy-stosowac-testy-automatyczne.mdx`       | `http://www.youtube.com/watch?v=8YmVCcXkPK4` (bare URL) |

**Fix:** Update all four to `https://`. Wrap the bare URL in a markdown link.

---

### LOW — Sidebar Widget Order Differs

WordPress order: Tags → Categories → Recent Posts  
New site order: Recent Posts → Categories → Tags

This is a cosmetic difference and may be intentional. Noted for completeness.

---

## Intentional Omissions (Not Bugs)

The following differences exist by design and do not require remediation:

| Item                                                        | Rationale                                                             |
| ----------------------------------------------------------- | --------------------------------------------------------------------- |
| Meta widget (Login, RSS, WordPress.com links)               | WordPress-specific; not applicable to static site                     |
| Live commenting                                             | Out of scope per spec FR-021; historical comments preserved read-only |
| Server-side pagination                                      | Replaced with client-side pagination (`PostList.tsx`)                 |
| Long category slugs (`posts-in-english-wpisy-po-angielsku`) | Shortened intentionally                                               |
| Archive URL format (`/archive/YYYY/MM/` vs `/YYYY/MM/`)     | New URL scheme; no redirects configured                               |
| `GistEmbed` / `TweetEmbed` components unused inline         | `format: 'md'` mode prevents MDX component usage in post bodies       |

---

## Recommended Fix Order

| Priority | Task                                              | Effort                          |
| -------- | ------------------------------------------------- | ------------------------------- |
| 1        | Expand `TAG_SLUG_MAP` with all 53 missing entries | Low — data entry in one file    |
| 2        | Fix 3 internal WordPress cross-links              | Low — targeted find and replace |
| 3        | Upgrade 4 YouTube URLs to HTTPS                   | Low — targeted find and replace |
| 4        | Decide on gist embed strategy and implement       | Medium                          |
| 5        | Add fenced code blocks to posts with code         | High — per-post manual review   |
| 6        | Increase tag cloud limit or add tag index page    | Low                             |
| 7        | Decide on Goodreads widget                        | Low — design decision           |
| 8        | Update About bio text and add avatar              | Low — content update            |

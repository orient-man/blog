## Why

The blog migrated from WordPress but lost the ability to receive new comments.
Nine posts retain frozen WordPress comments rendered read-only, and the UI
explicitly states "New comments are not supported."
Adding a lightweight, GitHub Discussions-backed comment system restores reader
engagement without violating the Simplicity principle (no server-side runtime
or database — comments live in GitHub infrastructure, loaded via an external
iframe identical in pattern to the existing GoatCounter analytics).

## What Changes

- Add a `GiscusComments` client component that embeds the Giscus widget via
  `@giscus/react`.
- Show the Giscus widget on posts that have **no** legacy WordPress comments.
  Posts with existing WordPress comments continue to display `CommentList`
  as before.
- Lazy-load the Giscus iframe using `IntersectionObserver` so it only loads
  when the user scrolls near the comment section (minimal impact on page
  weight).
- Sync the Giscus theme with the existing dark mode toggle via a
  `MutationObserver` on the `<html>` class attribute.
- One new dependency: `@giscus/react` (thin wrapper around the `giscus` web
  component).

## Capabilities

### New Capabilities

- `live-comments`: GitHub Discussions-based comment system for blog posts
  using Giscus, including lazy loading, dark mode sync, and conditional
  rendering based on legacy comment presence.

### Modified Capabilities

(none — existing WordPress comment rendering is unchanged)

## Impact

- **New dependency**: `@giscus/react` (`^3.1.0`), which depends on `giscus`
  (`^1.6.0`).
- **New file**: `src/components/GiscusComments.tsx` (client component).
- **Modified file**: `src/app/[year]/[month]/[day]/[slug]/page.tsx` — comment
  section conditional updated from simple `&&` to ternary.
- **External setup required**: Enable Discussions on `orient-man/blog`,
  create a "Blog Comments" category (Announcement type), install the Giscus
  GitHub App.
- **No build pipeline changes** — static export is unaffected.
- **No breaking changes**.

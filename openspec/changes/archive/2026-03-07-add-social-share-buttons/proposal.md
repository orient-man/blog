## Why

Blog posts have no way for readers to share content to social platforms.
OpenGraph metadata is already present, so shared links preview correctly, but there is no UI to initiate sharing.
Adding share buttons is a low-effort, high-value improvement aligned with the Content-First principle -- making good content easier to spread.

## What Changes

- Add icon-only share buttons below each blog post's content, before the comments section.
- Support three platforms: X/Twitter, Facebook, LinkedIn, plus a copy-link button.
- X/Twitter shares include `via=orientman` attribution.
- Copy-link button provides clipboard access with brief visual feedback.
- Extract existing social SVG icons from Sidebar into a shared module for reuse.

## Capabilities

### New Capabilities

- `social-sharing`: Per-post share buttons (X/Twitter, Facebook, LinkedIn, copy link) rendered below post content.

### Modified Capabilities

None.
The existing `social-links` capability covers sidebar author profile links and is unaffected.

## Impact

- **New file**: `src/components/ShareButtons.tsx` (client component for clipboard API).
- **New file**: `src/components/icons.tsx` (shared SVG icons, extracted from Sidebar).
- **Modified file**: `src/components/Sidebar.tsx` (import icons from shared module instead of inline).
- **Modified file**: `src/app/[year]/[month]/[day]/[slug]/page.tsx` (render ShareButtons between content and comments).
- **Dependencies**: None. Uses only platform intent URLs and the Clipboard API.

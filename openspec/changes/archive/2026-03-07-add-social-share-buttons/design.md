## Context

Blog post pages currently have no sharing affordance.
OpenGraph metadata (title, description, type, publishedTime, authors) is already present in `generateMetadata()`, so link previews work when URLs are shared manually.
The sidebar has author profile links with SVG icons for X/Twitter, Facebook, LinkedIn, GitHub, and RSS, but these are site-wide navigation, not per-post sharing.

The blog is a fully static export (`output: 'export'`), so any solution MUST work without server-side runtime.

## Goals / Non-Goals

**Goals:**
- Give readers a one-click way to share a post on X/Twitter, Facebook, or LinkedIn.
- Provide a copy-link button for platform-agnostic sharing.
- Reuse existing icon assets for visual consistency.
- Keep the implementation minimal and dependency-free.

**Non-Goals:**
- Share count display (requires third-party APIs, violates static-site principle).
- Web Share API integration (potential future enhancement, not in scope).
- Email sharing or other platforms beyond the three specified.
- Floating/sticky share bar (placement is fixed below content).

## Decisions

### D1: Single client component vs. server/client split

**Decision**: Single `"use client"` `ShareButtons` component.

**Alternatives considered**:
- Server component wrapper with client-only `CopyLinkButton`: More aligned with RSC philosophy but over-engineered for 4 small buttons.
- Fully server-rendered with inline `onclick`: Not viable -- Clipboard API requires a client component.

**Rationale**: The hydration cost of 4 buttons is negligible.
A single component is simpler to maintain.
Three of the four buttons are plain `<a>` tags that work without JS; only the copy button needs interactivity.

### D2: Extract shared icons to a common module

**Decision**: Create `src/components/icons.tsx` exporting a `socialIcons` record.
Refactor `Sidebar.tsx` to import from this module instead of defining icons inline.

**Rationale**: The Sidebar already defines the exact SVG icons needed for X, Facebook, and LinkedIn.
Duplicating them in ShareButtons would violate DRY.
A shared module keeps both consumers in sync.

### D3: Placement -- below content, before comments

**Decision**: Render `<ShareButtons>` between the post content `<div>` and the comments `<div>`, wrapped in a `data-pagefind-ignore` container with a top border separator.

**Rationale**: This is the natural "I just finished reading" moment.
It mirrors the visual rhythm of the existing post navigation section (which also uses `border-t`).
Placing at the top would invite sharing before reading.

### D4: Copy-link feedback via icon swap

**Decision**: On click, swap the link icon to a checkmark icon for ~2 seconds using `useState` + `setTimeout`.

**Alternatives considered**:
- Toast notification: Requires a toast system that doesn't exist.
- Tooltip: CSS-only tooltip is possible but less discoverable.

**Rationale**: Icon swap is the simplest visual feedback with zero dependencies.

### D5: URL construction

**Decision**: Accept `url` and `title` as props.
The post page component constructs the canonical URL from `siteConfig.siteUrl` and the existing route params, passing it down.

**Rationale**: Keeps the ShareButtons component generic and testable -- no coupling to route structure or config.

## Risks / Trade-offs

- **[Platform URL changes]** Social platform intent URLs may change over time.
  Mitigation: These URLs have been stable for years. If they change, it's a one-line fix per platform.
- **[Clipboard API browser support]** The `navigator.clipboard` API is not available in insecure contexts (HTTP).
  Mitigation: The blog is served over HTTPS. Fail silently if unavailable.
- **[Icon extraction refactor]** Moving icons out of Sidebar introduces a small refactoring risk.
  Mitigation: The change is mechanical (cut/paste + import). Verified by visual inspection and lint.

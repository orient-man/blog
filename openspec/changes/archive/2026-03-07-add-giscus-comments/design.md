## Context

The blog is a fully static Next.js site (`output: 'export'`) deployed to
GitHub Pages.
Nine posts carry frozen WordPress comments rendered via `CommentList` /
`Comment` server components.
All other posts have no comment capability.

The site currently has four client components (`DarkModeToggle`,
`SearchInput`, `PostList`, `GistEmbed`) and one external service
(GoatCounter analytics).
Adding Giscus follows the same external-iframe pattern as GoatCounter —
the blog stays static, the service runs elsewhere.

The source repo is `orient-man/blog` on GitHub (public, Discussions not
yet enabled).

## Goals / Non-Goals

**Goals:**

- Restore reader engagement via comments on posts that lack legacy comments.
- Keep the integration minimal — one new dependency, one new component.
- Lazy-load so initial page performance is unaffected.
- Sync with existing dark mode toggle seamlessly.

**Non-Goals:**

- Migrating legacy WordPress comments into GitHub Discussions.
- Custom CSS theming for the Giscus iframe (accept default Giscus styling).
- Showing Giscus alongside legacy comments on the same post.
- Comment moderation tooling beyond what GitHub Discussions provides natively.
- Notifications or email alerts for new comments (handled by GitHub itself).

## Decisions

### D1: Use `@giscus/react` over vanilla `<script>` tag

**Choice**: `@giscus/react` (v3.1.0).

**Alternatives considered**:

| Option | Pros | Cons |
|--------|------|------|
| `@giscus/react` | React-native props, handles theme switching via prop changes, typed | One npm dependency |
| Vanilla `<script>` tag | Zero dependencies | Manual DOM management, manual `postMessage` for theme sync, more code |

**Rationale**: The React wrapper is a thin layer (~2KB) that handles iframe
communication and theme switching through props.
Manual script management would duplicate that logic with more code and more
maintenance.
One small dependency is an acceptable trade under the Simplicity principle
given the complexity it absorbs.

### D2: Conditional rendering — exclusive, not additive

**Choice**: Posts with legacy WordPress comments show `CommentList` only.
Posts without show `GiscusComments` only.
Never both on the same post.

**Rationale**: Showing two visually distinct comment systems on one page
creates a confusing UX.
Only 9 posts have legacy comments and they are frozen — no new interaction
is expected there.
This keeps the boundary clean.

### D3: `pathname` mapping strategy

**Choice**: Map Giscus discussions by `pathname`
(e.g., `/2015/03/25/connect-the-dots/`).

**Alternatives considered**:

| Strategy | Stability | Ease | Risk |
|----------|-----------|------|------|
| `pathname` | High (date-based URLs are inherently stable) | Automatic | Breaks if URL structure changes |
| `title` | Medium | Automatic | Titles can change or collide |
| `specific` (manual) | Total | Manual per post | Doesn't scale |

**Rationale**: The blog uses date-based URLs (`/YYYY/MM/DD/slug/`) which are
stable by nature.
The `trailingSlash: true` setting ensures consistent pathnames.

### D4: Lazy loading via `IntersectionObserver`

**Choice**: Wrap the `<Giscus>` component in an `IntersectionObserver` that
triggers when the sentinel element is within 200px of the viewport.

**Rationale**: Blog posts can be long.
Loading the Giscus iframe eagerly adds a network request and iframe render
cost for content below the fold that many readers may never scroll to.
The 200px `rootMargin` provides a buffer so the widget appears loaded by the
time the reader reaches it.
Giscus also has its own `loading="lazy"` prop, giving belt-and-suspenders
coverage.

### D5: Dark mode sync via `MutationObserver`

**Choice**: Observe the `class` attribute on `<html>` for presence of `dark`.

**Alternatives considered**:

| Approach | Pros | Cons |
|----------|------|------|
| `MutationObserver` on `<html>` | Self-contained, no changes to existing code | Slightly indirect |
| Custom event from `DarkModeToggle` | Explicit intent | Requires modifying `DarkModeToggle`; couples the two components |
| `localStorage` polling | No observer needed | Polling is wasteful; race conditions |

**Rationale**: `MutationObserver` is decoupled from `DarkModeToggle` and works
regardless of how the `dark` class gets set (toggle, system preference, or
the inline flash-prevention script in `layout.tsx`).

### D6: Discussion category — "Blog Comments" (Announcement type)

**Choice**: Create a dedicated "Blog Comments" category with Announcement
format.

**Rationale**: Announcement type means only the repo maintainer (Giscus app,
triggered by the first comment on a post) can create new Discussion threads.
Readers can only reply.
This prevents spam threads being created directly in Discussions.

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| `giscus.app` service outage | Graceful degradation — post content renders normally, comment iframe simply absent. Same pattern as GoatCounter. |
| GitHub API rate limits | Giscus handles caching internally. For a personal blog traffic level this is not a practical concern. |
| Reader must have GitHub account to comment | Accepted trade-off. Target audience is developers who likely have GitHub accounts. |
| `@giscus/react` abandoned | The package is a thin wrapper. If abandoned, replacing with a vanilla `<script>` tag is straightforward (~30 lines). |
| URL structure change breaks mapping | Low risk — date-based URLs are inherently stable and the blog has no plans to change them. If needed, Discussions can be manually renamed. |

## Open Questions

- **Q1**: Should the `repoId` and `categoryId` live in `siteConfig.ts` or be
  hardcoded in the component?
  Leaning toward `siteConfig.ts` for consistency with `goatcounterId`.
  Decision deferred to implementation.

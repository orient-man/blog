## Context

The WordPress blog displayed a 128px Gravatar avatar in the sidebar About section.
After migration to Next.js 14 static export, this avatar was not carried over.
The sidebar (`src/components/Sidebar.tsx`) currently has a text-only About section with a Polish bio paragraph and an English bio paragraph linking to the CV page.
The `next.config.mjs` uses `images: { unoptimized: true }`, so standard `<img>` tags work without Next.js image optimization.

## Goals / Non-Goals

**Goals:**

- Restore the author Gravatar avatar in the sidebar About section, matching WordPress parity.
- Keep the implementation minimal — a single `<img>` tag with Tailwind classes.
- Add no new dependencies.

**Non-Goals:**

- Implementing a reusable Avatar component (single-use, single-author blog).
- Supporting configurable author emails or dynamic hash computation.
- Adding Gravatar support to blog post author bylines or comment avatars (separate concern).

## Decisions

### D1: Hardcoded MD5 hash vs. hashing library

**Decision**: Hardcode the pre-computed MD5 hash of `orientman@gmail.com` as a string constant.

**Alternatives considered**:

- Add an `md5` npm package — rejected because it adds a dependency for a single static value.
- Compute at build time via a script — rejected as unnecessary complexity for one value.

**Rationale**: This is a single-author blog. The email never changes at runtime.
Computing the MD5 hash once offline and embedding the result is the simplest approach, consistent with the Simplicity principle.

### D2: Plain `<img>` tag vs. `next/image`

**Decision**: Use a plain `<img>` tag.

**Alternatives considered**:

- `next/image` — rejected because `images.unoptimized: true` is already set in config, making `next/image` add complexity without benefit for an external URL.

**Rationale**: The Gravatar URL is an external resource. A plain `<img>` is simpler and sufficient.

### D3: Placement within sidebar

**Decision**: Place the avatar at the top of the About section, centered above the bio text, inside the existing `<section>` element.

**Rationale**: This mirrors the WordPress layout where the avatar appeared above the bio text in the sidebar widget.

### D4: Styling approach

**Decision**: Use Tailwind utility classes (`rounded-full`, `w-32`, `h-32`, `mx-auto`, `mb-4`) directly on the `<img>` tag.
Add a subtle border ring for dark mode: `ring-2 ring-gray-200 dark:ring-gray-700`.

**Rationale**: Consistent with the existing codebase which uses Tailwind throughout. No custom CSS needed.

## Risks / Trade-offs

- **[External dependency on gravatar.com]** The avatar loads from an external service.
  If Gravatar is down, the `d=mp` fallback parameter tells Gravatar's CDN to serve a placeholder.
  If the CDN itself is unreachable, the image simply won't load — acceptable for a decorative element.

- **[Privacy]** Gravatar URLs expose an MD5 hash of the author's email.
  This is acceptable because the email address (`orientman@gmail.com`) is already public in the WordPress XML export and the blog's existing content.

## Open Questions

(none)

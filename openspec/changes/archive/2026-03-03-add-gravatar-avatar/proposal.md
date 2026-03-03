## Why

The original WordPress blog displayed a 128px Gravatar avatar in the sidebar "About" section.
The migration audit (spec 001) explicitly documents this as a gap: WordPress had the avatar, the new site has "None."
Restoring it improves author identity and visual parity with the old blog, consistent with the Content-First principle of prioritizing reading experience.

## What Changes

- Add the author's Gravatar image to the sidebar "About" section, above the bio text.
- Use a hardcoded Gravatar URL derived from the author email hash — no new runtime or build dependency.
- Display as a rounded image (~128px), matching the old WordPress presentation.

## Capabilities

### New Capabilities

- `gravatar-avatar`: Display the blog author's Gravatar image in the sidebar About section using a static Gravatar URL.

### Modified Capabilities

(none — no existing spec-level requirements change)

## Impact

- **Code**: `src/components/Sidebar.tsx` — add an `<img>` element for the avatar.
- **Dependencies**: None added. The Gravatar URL uses a pre-computed MD5 hash string literal, requiring no hashing library. This aligns with the Simplicity principle.
- **APIs**: Browser-side HTTP request to `gravatar.com` at page load. Static export is unaffected.
- **Performance**: One additional small image request (~5 KB) per page load, cached by the browser.

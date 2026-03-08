## Why

The blog currently uses a generic developer color scheme (cool slate/lime) and system fonts that could belong to any Next.js starter template.
As a personal blog, it should reflect the author's cultural interests — pixel art, point-and-click adventure games (LucasArts/SCUMM), Studio Ghibli, Linux/hacker culture, cyberpunk (Neuromancer), and retro 80s-90s aesthetics.
The approach is "Layered Subtlety": personality accumulates through small visual details layered onto the existing clean layout, preserving the reading experience required by Constitution Principle II (Content-First) while staying within the zero-dependency philosophy of Principle I (Simplicity) by using only CSS techniques and Google Fonts.

## What Changes

- Replace the dark-mode color palette: cool slate/lime → warm indigo/amber/teal (parchment foreground, amber accent, teal links).
- Swap light-mode accent and link colors from green to amber/teal for consistency.
- Update the Tailwind `brand` color scale from green/lime to amber/gold.
- Load Pixelify Sans (Google Font) as a pixel-style UI font for decorative headings, nav labels, tag pills, date labels, and footer.
- Restyle the site title in Pixelify Sans 700.
- Restyle nav buttons with beveled retro panel borders (adventure-game verb bar).
- Replace the 4px solid accent bar with a 6px dithered amber→teal gradient using CSS `repeating-conic-gradient`.
- Restyle sidebar section headings with Pixelify Sans + beveled border.
- Restyle tag pills as inventory-style items with pixel font and beveled borders.
- Apply pixel font to date labels on post cards.
- Add a terminal-prompt-style footer line using VT323 monospace font.
- Apply beveled panel styling to post cards.
- Restyle code block title bars with VT323 font and CRT-inspired look.
- Add very subtle CRT scanline overlay to code blocks via CSS `repeating-linear-gradient`.
- Add pixel-style section dividers (CSS-only diamond/cross patterns).
- Create a 404 page with pixel-art adventure-game scene using PixelLab AI for asset generation.
- Add `prefers-reduced-motion` guards to disable animations/transitions for accessibility.

## Capabilities

### New Capabilities

- `visual-theme`: Color palette, accent bar, fonts (Pixelify Sans, VT323), and global CSS variables that define the blog's visual identity.
- `retro-components`: Beveled panels, pixel-font labels, inventory-style tags, CRT code blocks, terminal footer, and pixel dividers applied to existing layout components.
- `not-found-page`: Custom 404 page featuring a pixel-art adventure-game scene with AI-generated assets.

### Modified Capabilities

_(none — no existing spec-level requirements change; this is purely a visual/presentational layer)_

## Impact

- **Files modified**: `globals.css`, `tailwind.config.ts`, `layout.tsx`, `Sidebar.tsx`, `TagCloud.tsx`, `PostCard.tsx`.
- **Files created**: `src/app/not-found.tsx`, pixel-art assets in `public/images/404/`.
- **Dependencies added**: Pixelify Sans and VT323 via `next/font/google` (no npm packages).
- **Risk**: Low-to-medium. All changes are presentational CSS and font swaps. No data model, routing, or content format changes. The 404 page is a standalone new route with no coupling to existing pages.
- **Body text untouched**: Lora (prose) and JetBrains Mono (code content) remain unchanged, preserving the reading experience.

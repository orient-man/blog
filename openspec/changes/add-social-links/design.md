## Context

Author identity values (site title, author name, tagline, site URL, gravatar hash) are hardcoded in ~30 places across 8 source files.
The blog has no social media links in its layout -- profiles are only mentioned on the CV page.
The codebase uses inline SVGs for all icons (sun/moon in `DarkModeToggle`, stars in `StarRating`) with `currentColor` for theming.
No icon library is installed.

## Goals / Non-Goals

**Goals:**
- Single source of truth for site metadata, importable from any `src/` file or build script.
- Social icon links in the sidebar About section, consistent with existing visual and technical patterns.
- Zero new runtime dependencies.

**Non-Goals:**
- Consolidating values in one-off import/migration scripts (they run once and are done).
- Adding social links to the footer or header (sidebar only).
- Extracting the bio text into config (it is authored prose, not structured data).
- Creating a shared Icon component system (overkill for 5 icons).

## Decisions

### D1: Config location -- `src/lib/siteConfig.ts`

Place the config module at `src/lib/siteConfig.ts`, alongside `content.ts` and `utils.ts`.

**Why not root-level `site.config.ts`?**
All existing lib code lives under `src/lib/`.
A root config file would break the established pattern and require a separate tsconfig path alias.
`scripts/generate-feeds.ts` already imports from `../src/` relative paths, so it can reach `src/lib/` without issues.

### D2: Icon approach -- inline SVG paths in a lookup map

Define a `Record<string, JSX.Element>` mapping platform identifiers to inline SVG elements within the `SocialLinks` component (or a co-located icon map).
Each SVG uses `currentColor` fill/stroke, `aria-hidden="true"`, sized at `w-5 h-5` (20x20).

**Why not `lucide-react` or `react-icons`?**
The project has no icon library and only needs 5 icons.
Adding a dependency for 5 SVGs violates the Simplicity principle.
Inline SVGs match the existing pattern in `DarkModeToggle.tsx` (lines 43-78) and `StarRating.tsx` (line 12).

**Why not a shared `Icon` component?**
With only 5 icons plus the existing 2 (sun/moon, star), a shared abstraction adds indirection without meaningful reuse.
If the icon count grows significantly in the future, this can be revisited.

### D3: Social link order -- social-first

Order: X, Facebook, LinkedIn, GitHub, RSS.

Social platforms first (where the author connects with readers), then developer platform (GitHub), then RSS (content subscription).
This matches the user's stated preference.

### D4: Config structure -- flat object with typed social array

```
siteConfig = {
  title: string,
  titleTemplate: string,
  description: string,
  author: string,
  tagline: string,
  siteUrl: string,
  gravatarHash: string,
  goatcounterId: string,
  socialLinks: Array<{ platform: string, url: string, label: string }>,
}
```

A flat object (not nested) keeps imports simple: `siteConfig.title`, `siteConfig.author`.
The `socialLinks` array is ordered -- rendering order matches array order.
Each social link carries a `label` for accessibility (`aria-label` on the anchor).

### D5: Feed script import strategy

`scripts/generate-feeds.ts` runs via `tsx` outside the Next.js build.
It currently uses relative imports (`../src/lib/content`).
It will import siteConfig the same way: `import { siteConfig } from "../src/lib/siteConfig"`.
No tsconfig path alias changes needed for scripts.

## Risks / Trade-offs

- **[Mechanical refactoring risk]** Replacing strings in 8 files is repetitive but low-risk.
  Mitigation: `npm run build` and `npm run lint` catch any missed or broken imports.
- **[SVG maintenance]** Inline SVG paths for social icons are not auto-updated if platforms change their brand marks.
  Mitigation: Social platform icons are extremely stable; X/Twitter is the only recent change, and we use the current X mark.
- **[Feed script compatibility]** The feed script runs outside Next.js with `tsx`.
  Mitigation: `siteConfig.ts` uses only static values and standard TypeScript -- no Next.js-specific APIs.

## Open Questions

_(none -- all decisions resolved during exploration)_

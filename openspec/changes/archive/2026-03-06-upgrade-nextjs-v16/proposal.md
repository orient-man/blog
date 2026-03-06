## Why

Next.js 14.2.35 is two major versions behind the current stable release (Next.js 16).
The gap introduces growing risk: security patches stop, ecosystem libraries drop support for older versions, and the migration cost compounds with each skipped release.
Next.js 16 requires React 19 and ships Turbopack as the default bundler, delivering faster builds and access to React 19 features.
The upgrade preserves the static export model (Constitution Principle I -- Simplicity) while keeping the dependency chain current and maintainable.

## What Changes

- **BREAKING**: Upgrade `next` from 14.2.35 to 16.x and `@next/mdx` from 14.x to 16.x
- **BREAKING**: Upgrade `react` / `react-dom` from 18.x to 19.x (required by Next.js 16)
- **BREAKING**: Convert all `params` props in page components and `generateMetadata` functions from synchronous access to `Promise`-based (`await params`) -- affects 5 route files, 10 function signatures
- Update `@types/react` and `@types/react-dom` to React 19-compatible versions
- Verify Turbopack compatibility with the MDX pipeline (`@mdx-js/mdx`, `rehype-pretty-code`, `remark-gfm`, `shiki`) or fall back to webpack bundler
- Verify `eslint-config-next` v16 continues to work (already at ^16.1.6 in devDependencies)
- Validate static export (`output: 'export'`) continues to build and produce correct output

## Capabilities

### New Capabilities

- `nextjs-v16-upgrade`: Framework upgrade from Next.js 14 + React 18 to Next.js 16 + React 19, covering dependency updates, async API migration, bundler validation, and build verification

### Modified Capabilities

_(No existing spec-level requirements change. This is an infrastructure upgrade -- all user-facing behavior remains identical.)_

## Impact

- **Dependencies**: `next`, `@next/mdx`, `react`, `react-dom`, `@types/react`, `@types/react-dom` all change major versions
- **Source files**: 5 dynamic route pages must convert `params` to async (`[year]/[month]/[day]/[slug]/page.tsx`, `tag/[slug]/page.tsx`, `page/[slug]/page.tsx`, `category/[slug]/page.tsx`, `archive/[year]/[month]/page.tsx`)
- **Build config**: `next.config.mjs` may need adjustments for Turbopack or MDX loader compatibility
- **CI/CD**: GitHub Actions workflow should continue to work (already uses `eslint .` not `next lint`)
- **No user-facing behavior changes**: All URLs, content rendering, and static output remain identical

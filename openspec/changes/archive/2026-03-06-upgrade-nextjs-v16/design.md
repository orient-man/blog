## Context

The blog runs on Next.js 14.2.35 with React 18, using static export (`output: 'export'`).
The MDX pipeline uses `@next/mdx` 14.x wrapping `@mdx-js/mdx` 3.x with `rehype-pretty-code`, `remark-gfm`, and `shiki` for syntax highlighting.
Five dynamic route files use synchronous `params` access (10 function signatures total).
The project has no custom webpack configuration, no middleware, no `next/image` usage, and no server-side APIs (`cookies`, `headers`).
ESLint is already configured with flat config and `eslint-config-next` ^16.1.6.

## Goals / Non-Goals

**Goals:**

- Upgrade Next.js from 14.2.35 to 16.x and React from 18.x to 19.x
- Migrate all synchronous `params` access to the async `Promise<T>` pattern
- Validate the MDX pipeline works with the new framework version
- Maintain identical static export output and user-facing behavior
- Keep the site as a static export with no server-side runtime (Constitution Principle I)

**Non-Goals:**

- Adopting new Next.js 16 features (React Compiler, Cache Components, View Transitions) -- these can be explored in future changes
- Upgrading Tailwind CSS from v3 to v4 -- separate concern, separate change
- Migrating `next.config.mjs` to `next.config.ts` -- not required, can be done later
- Adding or removing any content or user-facing features

## Decisions

### D1: Direct 14 → 16 jump (not incremental via 15)

**Decision**: Upgrade directly from Next.js 14 to 16, skipping an intermediate v15 step.

**Rationale**: The codebase is small (5 dynamic routes, no middleware, no server APIs).
The breaking changes between 14→15 and 15→16 are well-documented and non-overlapping.
An incremental approach would double the testing effort for no practical benefit given the project size.

**Alternatives considered**:
- 14 → 15 → 16 (rejected: doubles effort, same end result for this small codebase)

### D2: Turbopack-first, webpack fallback

**Decision**: Attempt the build with Turbopack (Next.js 16 default). If the MDX pipeline is incompatible, add `--webpack` to the build script.

**Rationale**: Turbopack is the future direction for Next.js. The project has no custom webpack configuration, which is the most common source of Turbopack incompatibility. The MDX integration via `@next/mdx` is first-party and likely supported. However, the rehype/remark plugin ecosystem has historically had edge cases with Turbopack.

**Alternatives considered**:
- Always use webpack (rejected: misses Turbopack benefits, adds tech debt)
- Always use Turbopack with no fallback (rejected: too risky without testing)

### D3: Mechanical async params transformation

**Decision**: Convert `params` types from `{ slug: string }` to `Promise<{ slug: string }>` and add `const { slug } = await params` at the top of each function body.

**Pattern for page components**:
```typescript
// Before (Next.js 14)
export default function TagPage({ params }: { params: { slug: string } }) {
  const posts = getPostsByTag(params.slug);
}

// After (Next.js 16)
export default async function TagPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const posts = getPostsByTag(slug);
}
```

**Pattern for generateMetadata**:
```typescript
// Before
export function generateMetadata({ params }: { params: { slug: string } }) {
  return { title: params.slug };
}

// After
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return { title: slug };
}
```

**Rationale**: This is the pattern recommended by the Next.js 16 migration guide.
All previously-sync page components (`TagPage`, `CategoryPage`, `ArchivePage`) must become `async` to use `await`.
The two already-async components (`PostPage`, `StaticPage`) just need the type change and destructuring.

### D4: Package upgrade order

**Decision**: Upgrade packages in this order:
1. `react`, `react-dom`, `@types/react`, `@types/react-dom` → v19
2. `next` → v16
3. `@next/mdx` → v16
4. Run `npm install` and resolve any peer conflicts

**Rationale**: React is the foundational peer dependency.
Upgrading it first makes the Next.js peer requirement satisfiable.
Upgrading `@next/mdx` after `next` ensures version alignment.

## Risks / Trade-offs

**[Risk] MDX plugin incompatibility with Turbopack** → Mitigation: Fall back to `--webpack` flag in the build script.
The plugin ecosystem (`rehype-pretty-code`, `remark-gfm`, `shiki`) uses standard unified/rehype/remark APIs that should work regardless of bundler, but the `@next/mdx` integration layer may differ.

**[Risk] React 19 breaking changes in MDX components** → Mitigation: `@mdx-js/react` 3.x and the custom components (`GistEmbed`, `TweetEmbed`) are simple functional components with no deprecated React APIs.
React 19 removes `forwardRef` as a required pattern and changes `ref` handling, but these components don't use refs.
Low risk.

**[Risk] `rehype-pretty-code` or `shiki` incompatibility** → Mitigation: These packages operate at the rehype AST level, independent of React version.
Pin current versions if issues arise.

**[Risk] Subtle rendering differences** → Mitigation: Build the site before and after the upgrade, then diff the `out/` directory contents to catch any unexpected changes.

## Migration Plan

1. Create a feature branch (`feature/upgrade-nextjs-v16`)
2. Upgrade all dependencies
3. Convert async params in all 5 route files
4. Update `next.config.mjs` if needed
5. Run `npm run build` -- debug any issues
6. Run `npm run lint` -- fix any new warnings
7. Diff `out/` before and after to verify identical output
8. Test locally with `npx serve out`

**Rollback**: Revert to the pre-upgrade commit.
No data migration or external service changes are involved.

## Open Questions

- Will the inline `rehypeCopyButton` plugin in `next.config.mjs` (which uses `unist-util-visit`) work under Turbopack?
  If not, it may need to be moved to a separate file or the webpack fallback used.
- Does `@next/mdx` v16 still support the `createMDX()` wrapper pattern used in `next.config.mjs`?

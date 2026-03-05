## Why

The codebase has no linting or formatting tooling.
There are ~30 TypeScript/TSX source files with no style enforcement or automated quality checks.
Adding ESLint and Prettier now while the codebase is small establishes a quality baseline with minimal friction.
This aligns with the Simplicity principle — catching issues early reduces long-term maintenance burden without adding runtime complexity.

## What Changes

- Install ESLint v9 with flat config, Prettier, and supporting plugins as devDependencies.
- Add `eslint.config.mjs` with Next.js, TypeScript, and import-ordering rules (recommended tier).
- Add `.prettierrc.json` for consistent code formatting.
- Add `eslint-config-prettier` to prevent ESLint/Prettier rule conflicts.
- Add npm scripts: `lint`, `lint:fix`, `format`, `format:check`.
- Add `.prettierignore` and configure ESLint ignores for non-source directories (`out/`, `.next/`, `content/`, `node_modules/`).
- Add a lint step to the GitHub Actions deploy workflow (run before build).
- Fix all existing lint and format violations so the codebase passes from day one.

## Capabilities

### New Capabilities

- `linting-and-formatting`: ESLint and Prettier configuration, ignore patterns, npm scripts, CI integration, and auto-fixable rule set for TypeScript, React, and Next.js code.

### Modified Capabilities

_(none — no existing spec-level requirements change)_

## Impact

- **Dependencies**: Adds ~8–10 devDependencies (ESLint, Prettier, typescript-eslint, eslint-config-next, eslint-config-prettier, eslint-plugin-import, related parsers/resolvers).
  Zero runtime dependency changes.
- **Config files**: New `eslint.config.mjs`, `.prettierrc.json`, `.prettierignore` at project root.
- **Scripts**: New `lint`, `lint:fix`, `format`, `format:check` entries in `package.json`.
- **CI**: Modified `.github/workflows/deploy.yml` — added lint step before build.
- **Source code**: Existing `.ts`/`.tsx`/`.mjs`/`.cjs` files will be reformatted and may receive minor lint fixes (unused imports, missing types, etc.).
  No behavioral changes to the application.

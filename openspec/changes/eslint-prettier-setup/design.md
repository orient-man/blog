## Context

The project is a Next.js 14 static blog (TypeScript, ~30 source files) with no existing linting or formatting tooling.
There are no ESLint configs, Prettier configs, ignore files, or related npm scripts.
The CI workflow (`.github/workflows/deploy.yml`) only runs `npm run build` with no quality gates.

The project uses:
- TypeScript 5.x with `strict: true`
- Next.js 14 App Router with static export
- Tailwind CSS for styling
- Path alias `@/*` mapping to `./src/*`
- Mixed module formats: `.mjs` (ESM), `.cjs` (CommonJS), `.ts`/`.tsx` at root and in `src/` and `scripts/`

## Goals / Non-Goals

**Goals:**

- Establish ESLint + Prettier as the standard code quality tooling.
- Provide auto-fixable rules for formatting and import ordering.
- Integrate lint checks into CI to prevent regressions.
- Fix all existing violations so the codebase is clean from the start.

**Non-Goals:**

- Type-aware ESLint rules (slower, recommended tier is sufficient for this codebase size).
- Husky/lint-staged pre-commit hooks (can be added later if needed).
- EditorConfig (out of scope — separate concern).
- Linting MDX content files (content is authored by humans, not generated code).

## Decisions

### D1: ESLint v9 flat config (`eslint.config.mjs`)

**Choice**: ESLint v9 with flat config in `.mjs` format.

**Alternatives considered**:
- Legacy `.eslintrc.json` — still works but deprecated in ESLint v9, will be removed in v10.
- `eslint.config.ts` — requires extra tooling (`jiti`), not yet stable.

**Rationale**: Flat config is the default and future-proof format.
Using `.mjs` matches the project's `next.config.mjs` convention and avoids module format ambiguity.

### D2: `@typescript-eslint` recommended (no type-aware)

**Choice**: `typescript-eslint` recommended preset without type-checking rules.

**Alternatives considered**:
- `strict` preset — catches more issues but is opinionated and produces more noise.
- `strict-type-checked` — requires `parserOptions.project`, adds ~2-3x lint time.

**Rationale**: The recommended preset provides a good balance for a small blog codebase.
Type-aware rules can be added later if the codebase grows.

### D3: `eslint-config-next` for React/Next.js rules

**Choice**: Use the official `eslint-config-next` package which bundles React, React Hooks, and JSX a11y plugins.

**Alternatives considered**:
- Manual plugin composition — more control but more maintenance and risk of misconfiguration.

**Rationale**: `eslint-config-next` is maintained by Vercel, covers Next.js-specific patterns, and is the standard choice.

### D4: `eslint-config-prettier` for conflict prevention

**Choice**: Use `eslint-config-prettier` as the last config layer to disable conflicting ESLint style rules.

**Alternatives considered**:
- `eslint-plugin-prettier` (runs Prettier as an ESLint rule) — produces noisy output, slower, discouraged by Prettier team.

**Rationale**: The config-only approach is simpler and the recommended integration pattern.

### D5: `eslint-plugin-import` for import ordering

**Choice**: Use `eslint-plugin-import` with `eslint-import-resolver-typescript` for sorted import groups.

**Alternatives considered**:
- `eslint-plugin-simple-import-sort` — simpler but less configurable group ordering.
- No import sorting — leaves imports inconsistent across files.

**Rationale**: `eslint-plugin-import` is mature, supports custom group ordering (builtin → external → internal → relative), and handles the `@/*` path alias via the TypeScript resolver.

### D6: Prettier config format

**Choice**: `.prettierrc.json` with minimal overrides from Prettier defaults.

**Alternatives considered**:
- `.prettierrc.mjs` — allows comments but JSON is simpler for a small config.
- Config in `package.json` — mixes concerns.

**Rationale**: JSON is the simplest format for a small configuration.
Defer to Prettier defaults where possible (printWidth: 80, semi: true, singleQuote: false, etc.).

### D7: CI integration approach

**Choice**: Add `npm run lint` as a step before `npm run build` in the existing `deploy.yml` workflow.

**Alternatives considered**:
- Separate lint workflow — more isolation but adds another workflow file.
- `format:check` in CI too — adds value but lint is the higher priority gate.

**Rationale**: Adding a step to the existing workflow is the simplest approach.
Lint failure blocks the build, providing a quality gate without a separate workflow.

## Risks / Trade-offs

- **[Large initial diff]** Reformatting all files in one commit creates a noisy diff.
  Mitigation: Use a dedicated formatting commit separate from the config commit so `git blame` can skip it.
- **[eslint-config-next version coupling]** The package may lag behind ESLint v9 flat config support.
  Mitigation: Check compatibility before installing; use the compat utility from `@eslint/compat` if needed.
- **[Import plugin ESLint v9 compat]** `eslint-plugin-import` may need the `eslint-plugin-import/flatConfigs` export for flat config.
  Mitigation: Verify during implementation; fall back to `eslint-plugin-simple-import-sort` if compatibility is poor.

## Open Questions

- Should `format:check` also run in CI alongside `lint`?
  Decision deferred — can be added to the CI step if desired.

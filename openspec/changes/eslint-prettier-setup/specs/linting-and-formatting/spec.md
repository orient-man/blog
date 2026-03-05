## ADDED Requirements

### Requirement: FR-001 ESLint flat config
The project MUST use ESLint v9 with flat config format (`eslint.config.mjs`).
The configuration MUST compose rules from Next.js, TypeScript, and import-ordering plugins.

#### Scenario: ESLint config loads successfully
- **WHEN** a developer runs `npx eslint --print-config src/app/page.tsx`
- **THEN** the resolved config includes TypeScript, React, and Next.js rules

#### Scenario: ESLint ignores non-source directories
- **WHEN** ESLint runs against the project root
- **THEN** files in `out/`, `.next/`, `content/`, and `node_modules/` MUST NOT be linted

### Requirement: FR-002 Prettier formatting config
The project MUST have a `.prettierrc.json` configuration file at the project root.
The configuration MUST define consistent formatting rules for all source files.

#### Scenario: Prettier config is recognized
- **WHEN** a developer runs `npx prettier --check src/app/page.tsx`
- **THEN** Prettier uses the settings from `.prettierrc.json`

### Requirement: FR-003 No ESLint/Prettier conflicts
ESLint and Prettier MUST NOT have conflicting rules.
The project MUST use `eslint-config-prettier` to disable ESLint style rules that conflict with Prettier.

#### Scenario: No conflicting rules
- **WHEN** a file is formatted by Prettier and then linted by ESLint
- **THEN** ESLint MUST NOT report style errors on Prettier-formatted code

### Requirement: FR-004 TypeScript linting
TypeScript files (`.ts`, `.tsx`) MUST be linted with `@typescript-eslint` recommended rules.
Type-aware rules are NOT required (recommended tier only).

#### Scenario: TypeScript errors detected
- **WHEN** a `.ts` file contains an unused variable
- **THEN** ESLint reports a warning or error for the unused variable

#### Scenario: TSX files linted
- **WHEN** a `.tsx` React component file is linted
- **THEN** both TypeScript and React rules are applied

### Requirement: FR-005 Next.js linting
React and Next.js files MUST be linted with `eslint-config-next` rules.
This MUST include `eslint-plugin-react`, `eslint-plugin-react-hooks`, and `eslint-plugin-jsx-a11y`.

#### Scenario: Next.js-specific rules applied
- **WHEN** a page component uses `<img>` instead of `next/image`
- **THEN** ESLint reports the appropriate Next.js lint warning

### Requirement: FR-006 Import ordering
Import statements MUST be sorted into consistent groups automatically.
The grouping order MUST be: built-in modules, external packages, internal aliases (`@/*`), relative imports.

#### Scenario: Unsorted imports detected
- **WHEN** a file has a relative import before an external package import
- **THEN** ESLint reports an import ordering violation

#### Scenario: Auto-fix sorts imports
- **WHEN** a developer runs `npm run lint:fix`
- **THEN** import statements are reordered into the correct groups

### Requirement: FR-007 npm scripts
The project MUST provide the following npm scripts in `package.json`:
- `lint` — run ESLint on all source files
- `lint:fix` — run ESLint with auto-fix
- `format` — run Prettier to format all source files
- `format:check` — run Prettier in check mode (no writes, exit non-zero on violations)

#### Scenario: Lint script runs
- **WHEN** a developer runs `npm run lint`
- **THEN** ESLint checks all `.ts`, `.tsx`, `.mjs`, `.cjs` files and reports violations

#### Scenario: Format check script detects unformatted code
- **WHEN** a developer runs `npm run format:check` on unformatted code
- **THEN** the command exits with a non-zero code and lists unformatted files

### Requirement: FR-008 CI lint step
The GitHub Actions deploy workflow MUST run `npm run lint` before the build step.
A lint failure MUST prevent the build from running.

#### Scenario: CI fails on lint errors
- **WHEN** a commit introduces an ESLint error and CI runs
- **THEN** the workflow fails at the lint step before reaching the build step

#### Scenario: CI passes clean code
- **WHEN** all source files pass lint checks
- **THEN** the workflow proceeds to the build step

### Requirement: FR-009 Ignore patterns
Non-source directories and generated files MUST be excluded from both ESLint and Prettier.
Excluded paths MUST include: `out/`, `.next/`, `content/`, `node_modules/`, `public/`.

#### Scenario: Prettier ignore file exists
- **WHEN** a developer runs `npx prettier --check .`
- **THEN** files in `out/`, `.next/`, `content/`, and `node_modules/` are skipped

### Requirement: FR-010 Clean codebase
All existing source files MUST pass both `npm run lint` and `npm run format:check` after setup.
No pre-existing violations SHALL remain.

#### Scenario: Zero violations after setup
- **WHEN** a developer clones the repository and runs `npm run lint && npm run format:check`
- **THEN** both commands exit with code 0

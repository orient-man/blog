## 1. Install Dependencies (P1)

- [x] 1.1 Install ESLint v9, `@eslint/js`, and `globals` as devDependencies
- [x] 1.2 Install `typescript-eslint` (parser + plugin) as devDependency
- [x] 1.3 Install `eslint-config-next` as devDependency
- [x] 1.4 Install `eslint-config-prettier` as devDependency
- [x] 1.5 Install `eslint-plugin-import` and `eslint-import-resolver-typescript` as devDependencies
- [x] 1.6 Install `prettier` as devDependency

## 2. Configuration Files (P1)

- [x] 2.1 Create `eslint.config.mjs` with flat config composing: `@eslint/js` recommended, `typescript-eslint` recommended, `eslint-config-next`, import ordering rules, and `eslint-config-prettier` (last)
- [x] 2.2 Configure ESLint ignore patterns for `out/`, `.next/`, `content/`, `node_modules/`, `public/`
- [x] 2.3 Create `.prettierrc.json` with project formatting preferences
- [x] 2.4 Create `.prettierignore` excluding `out/`, `.next/`, `content/`, `node_modules/`, `public/`, `*.mdx`, `pnpm-lock.yaml`, `package-lock.json`

## 3. npm Scripts (P1)

- [x] 3.1 Add `lint` script to `package.json`: `eslint .`
- [x] 3.2 Add `lint:fix` script to `package.json`: `eslint . --fix`
- [x] 3.3 Add `format` script to `package.json`: `prettier --write .`
- [x] 3.4 Add `format:check` script to `package.json`: `prettier --check .`

## 4. Fix Existing Violations (P2)

- [x] 4.1 Run `npm run format` to auto-format all source files
- [x] 4.2 Run `npm run lint:fix` to auto-fix lintable violations
- [x] 4.3 Manually fix any remaining ESLint errors that cannot be auto-fixed
- [x] 4.4 Verify `npm run lint` exits with code 0
- [x] 4.5 Verify `npm run format:check` exits with code 0

## 5. CI Integration (P2)

- [x] 5.1 Add `npm run lint` step to `.github/workflows/deploy.yml` before the build step

## 6. Verification (P1)

- [x] 6.1 Run `npm run lint && npm run format:check` and confirm zero violations
- [x] 6.2 Run `npm run build` and confirm the build still succeeds

# AGENTS.md

Instructions for AI coding agents operating in this repository.

## Project Overview

WordPress-to-static-site blog migration project, currently in the
**specification/planning phase**. No application source code exists yet —
the static site generator has not been chosen. The repository contains only
the Spec-Driven Development framework, opencode agent commands, feature
specifications, and supporting shell scripts.

## Repository Layout

```
.opencode/command/       9 slash-command definitions (speckit.*)
.specify/
  memory/                constitution.md — project constitution
  scripts/bash/          5 Bash scripts (common.sh, check-prerequisites.sh, …)
  templates/             6 Markdown templates (spec, plan, tasks, checklist, …)
specs/
  001-wordpress-blog-migration/
    spec.md              feature specification
    checklists/          requirements checklist
AGENTS.md                this file
```

## Workflow

The project follows a linear Spec-Driven Development pipeline. Each stage
is triggered by an opencode slash command and must complete before the next:

```
constitution -> specify -> clarify -> plan -> tasks -> analyze -> implement
```

Commands live in `.opencode/command/speckit.*.md`. Each file has YAML
frontmatter (`description:`, `handoffs:`) and uses `$ARGUMENTS` as
placeholder. Follow numbered execution steps exactly as written.

Before starting work, run `check-prerequisites.sh` to validate the feature
directory and required files exist:

```bash
.specify/scripts/bash/check-prerequisites.sh --json
```

## Shell Scripts

All scripts are in `.specify/scripts/bash/`. To run any script:

```bash
bash .specify/scripts/bash/<script-name>.sh [OPTIONS]
```

| Script                    | Purpose                                     |
|---------------------------|---------------------------------------------|
| `common.sh`              | Shared functions — sourced by all others     |
| `check-prerequisites.sh` | Validate feature dir, branch, required files |
| `create-new-feature.sh`  | Create feature branch + spec scaffold        |
| `setup-plan.sh`          | Initialize plan.md from template             |
| `update-agent-context.sh`| Auto-generate agent context files            |

## Build / Lint / Test

No build system, linter, or test framework exists yet. The only executable
artifacts are the 5 Bash scripts above.

**Validate scripts parse correctly:**

```bash
bash -n .specify/scripts/bash/common.sh
```

**Run prerequisite check (quick smoke test):**

```bash
bash .specify/scripts/bash/check-prerequisites.sh --paths-only
```

**Run a single script with debug output:**

```bash
bash -x .specify/scripts/bash/<script-name>.sh [OPTIONS]
```

When application code is added later, update this section with the actual
build, lint, and test commands.

## Code Style: Shell Scripts

**Shebang and safety flags:**

```bash
#!/usr/bin/env bash
set -e                  # always required
set -u                  # required for complex scripts
set -o pipefail         # required for complex scripts
```

**Sourcing shared code** — every script must source `common.sh`:

```bash
SCRIPT_DIR="$(CDPATH="" cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/common.sh"
```

**Naming:**

- Functions: `snake_case` (e.g., `get_repo_root`, `check_feature_branch`)
- Local variables: `snake_case`, declared with `local`
- Constants / env vars: `UPPER_SNAKE_CASE`
- Script filenames: `kebab-case.sh`

**Logging** — use helpers from `common.sh`, never raw `echo` for user messages:

- `log_info`, `log_success`, `log_error`, `log_warning`
- Errors go to stderr: `echo "ERROR: ..." >&2`

**Cleanup** — register traps for temp files:

```bash
trap cleanup EXIT INT TERM
```

**CLI conventions:**

- Support `--json` flag for machine-readable JSON output
- Support `--help` / `-h` with a heredoc usage block
- Parse options with a `for arg in "$@"` / `case` loop
- Use `exit 1` on validation failure after printing an actionable message

## Code Style: Markdown / Specs

**Filenames:** `kebab-case.md` (e.g., `spec.md`, `data-model.md`)

**Spec structure conventions:**

- Requirement IDs: `FR-NNN` (functional), numbered sequentially
- Success criteria IDs: `SC-NNN`
- Task IDs: `TNNN`
- Priority levels: P1 (highest) through P6 (lowest)

**Language:**

- Use RFC 2119 keywords: MUST, SHOULD, MAY, SHALL, MUST NOT, SHOULD NOT
- Keep specifications technology-agnostic — no framework-specific details
- Write acceptance criteria in Given/When/Then format

**Formatting:**

- One sentence per line where practical (easier diffs)
- Use fenced code blocks with language tags
- Tables for structured data (requirements, tasks, comparisons)

**Templates** live in `.specify/templates/`. Always start new documents
from the matching template rather than writing from scratch.

## Git Conventions

**Commit messages** follow Conventional Commits:

```
type(scope): description
```

Common types: `feat`, `fix`, `docs`, `chore`, `refactor`, `test`

**Branch naming:** `NNN-kebab-case` where NNN is a zero-padded 3-digit
feature number matching the spec directory (e.g., `001-wordpress-blog-migration`).

**Branch validation** is enforced by `check_feature_branch()` in `common.sh` —
branches must match the pattern `^[0-9]{3}-`.

No remote is currently configured. No CI/CD pipeline exists.

## Important Constraints

- Do not create application source code until the workflow reaches the
  `implement` phase.
- The `update-agent-context.sh` script is designed to regenerate this file
  automatically once the project reaches the planning phase. Manual edits
  may be overwritten.
- There is no `.gitignore`, `.editorconfig`, or CI configuration yet.

## Active Technologies
- TypeScript 5.x, Node.js 20 LTS + Next.js 14 (`output: 'export'`), `@next/mdx`, `gray-matter`, `rehype-pretty-code` (Shiki), Tailwind CSS, `@tailwindcss/typography`, Pagefind (001-wordpress-blog-migration)
- Filesystem only — MDX files in `content/posts/`, images in `public/images/` (001-wordpress-blog-migration)
- YAML (GitHub Actions workflow); TypeScript 5.x / Node.js 20 LTS (build runtime) + `actions/checkout@v4`, `actions/setup-node@v4`, `actions/configure-pages@v5`, `actions/upload-pages-artifact@v4`, `actions/deploy-pages@v4`, `actions/cache@v4` (002-gh-pages-deploy)
- N/A — no new data storage; workflow builds `out/` directory and uploads as GitHub Pages artifac (002-gh-pages-deploy)
- TypeScript 5.x / Node.js 20 LTS (build runtime); Markdown (content) + Next.js 14 (`output: 'export'`), `@mdx-js/mdx`, `rehype-pretty-code` (Shiki) (003-fix-gist-embeds)
- TypeScript 5.x / Node.js 20 LTS + Next.js 14.2.35 (`output: 'export'`), `@mdx-js/mdx` 3.x, `rehype-pretty-code` 0.14, `shiki` 1.29 (004-fix-gfm-strikethrough)
- Filesystem -- MDX files in `content/posts/`, images in `public/images/` (004-fix-gfm-strikethrough)
- TypeScript 5.x, Node.js 20 LTS, React 18 + Next.js 14.2.35 (`output: 'export'`), `@mdx-js/mdx` 3.x, (005-syntax-highlighting)
- Filesystem — MDX files in `content/posts/`, static output in `out/` (005-syntax-highlighting)
- TypeScript 5.x, Node.js 20 LTS + Next.js 14.2.35 (`output: 'export'`), `@mdx-js/mdx` 3.x, `rehype-pretty-code` 0.14, `shiki` 1.29, `remark-gfm` 4.x (005-syntax-highlighting)

## Recent Changes
- 001-wordpress-blog-migration: Added TypeScript 5.x, Node.js 20 LTS + Next.js 14 (`output: 'export'`), `@next/mdx`, `gray-matter`, `rehype-pretty-code` (Shiki), Tailwind CSS, `@tailwindcss/typography`, Pagefind

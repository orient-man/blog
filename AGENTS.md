# AGENTS.md

Instructions for AI coding agents operating in this repository.

## Project Overview

WordPress-to-static-site blog migration project using Next.js 14 with
static export. The repository contains application source code, the
OpenSpec development workflow, historical feature specifications, and
OpenSpec change management.

## Repository Layout

```
.opencode/
  command/
    opsx-propose.md      propose a new change (all artifacts in one step)
    opsx-explore.md      explore ideas / investigate problems
    opsx-apply.md        implement tasks from a change
    opsx-archive.md      archive a completed change
  skills/
    openspec-propose/    skill: propose a new change
    openspec-apply-change/   skill: implement tasks
    openspec-archive-change/ skill: archive a change
    openspec-explore/    skill: explore mode
openspec/
  config.yaml            schema + project context + artifact rules
  constitution.md        project constitution (core principles)
  changes/               active change proposals
    archive/             archived (completed) changes
  specs/                 main specifications
specs/                   historical specs (001-006, read-only archive)
AGENTS.md                this file
```

## Workflow

The project uses **OpenSpec** for spec-driven development. The workflow
is fluid, not strictly linear. Four actions operate on changes:

```
explore  -->  propose  -->  apply  -->  archive
   ^             |            |
   +-------------+------------+   (can interleave freely)
```

| Action | Command | Skill | Purpose |
|--------|---------|-------|---------|
| Explore | `/opsx-explore` | `openspec-explore` | Think through ideas, investigate problems, clarify requirements. Read-only — no implementation. |
| Propose | `/opsx-propose` | `openspec-propose` | Create a change with all artifacts (proposal, specs, design, tasks) in one step. |
| Apply | `/opsx-apply` | `openspec-apply-change` | Implement tasks from a change, marking them complete as you go. |
| Archive | `/opsx-archive` | `openspec-archive-change` | Archive a completed change, optionally syncing delta specs. |

### OpenSpec CLI

The `openspec` CLI manages changes and artifacts:

```bash
openspec list --json              # list active changes
openspec status --change "<name>" --json   # artifact completion status
openspec new change "<name>"      # scaffold a new change
openspec instructions <artifact> --change "<name>" --json  # get artifact instructions
openspec instructions apply --change "<name>" --json       # get apply instructions
```

### Schema

The project uses the `spec-driven` schema, which produces these artifacts
per change: `proposal` -> `specs` -> `design` -> `tasks`.

Project context and per-artifact rules are configured in
`openspec/config.yaml`. The project constitution lives at
`openspec/constitution.md`.

## Build / Lint / Test

No build system, linter, or test framework exists yet. When application
code is added, update this section with the actual build, lint, and test
commands.

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

## Git Conventions

**Commit messages** follow Conventional Commits:

```
type(scope): description
```

Common types: `feat`, `fix`, `docs`, `chore`, `refactor`, `test`

**Branch naming:** `feature/kebab-case` (e.g., `feature/add-gravatar-avatar`).
Historical branches used `NNN-kebab-case` (001 through 006) but new work uses the `feature/` prefix.

No remote is currently configured. No CI/CD pipeline exists.

## Important Constraints

- The project constitution (`openspec/constitution.md`) is the authoritative
  reference for project decisions. All changes MUST comply with its
  Simplicity and Content-First principles.
- Historical specs in `specs/` (001 through 006) are a read-only archive
  from the previous spec-kit workflow. New features use `openspec/changes/`.
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
- TypeScript 5.x, Node.js 20 LTS + Next.js 14.2.35 (`output: 'export'`), `@mdx-js/mdx` 3.x, `gray-matter` 4.x (006-fix-comments-undefined-nan)
- ESLint v9 (flat config), `@eslint/js`, `typescript-eslint`, `eslint-config-next`, `eslint-config-prettier`, `eslint-plugin-import`, Prettier (eslint-prettier-setup)

## Recent Changes
- eslint-prettier-setup: Added ESLint v9 flat config, Prettier, import ordering, CI lint step in deploy workflow
- 001-wordpress-blog-migration: Added TypeScript 5.x, Node.js 20 LTS + Next.js 14 (`output: 'export'`), `@next/mdx`, `gray-matter`, `rehype-pretty-code` (Shiki), Tailwind CSS, `@tailwindcss/typography`, Pagefind

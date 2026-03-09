## Why

The blog post "Blog Migration from WordPress to GitHub Pages" frames the "56% of sessions produced no code" statistic as SDD framework overhead.
The real insight is that session splitting is deliberate context engineering — curating what the agent sees when it starts coding.
The post already contains supporting evidence (spec-kit context exhaustion, AGENTS.md rules) but never names the unifying concept.
Three surgical text edits can thread "context engineering" through the post without a rewrite.

## What Changes

- Rewrite the "56% of sessions produced no code" paragraph to introduce "context engineering" as a named concept and explain the session-splitting mechanism.
- Add a connecting clause to the spec-kit context exhaustion note (line 79) linking it to session splitting as the solution.
- Extend the closing lesson (line 105) with one sentence generalizing from prompt engineering to context engineering.

## Capabilities

### New Capabilities

(none — content-only edit, no new site capabilities)

### Modified Capabilities

(none — no spec-level behavior changes)

## Impact

- Single file: `content/posts/agentic-coding-wordpress-to-github-pages.mdx`
- No code changes, no dependency changes, no API changes.
- No changelog or version bump required (content-only edit per AGENTS.md conventions).

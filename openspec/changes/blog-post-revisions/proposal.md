## Why

The blog post (`agentic-coding-wordpress-to-github-pages.mdx`) is the human-authored summary of the project.
Cross-checking it against the agent-generated analysis page reveals several gaps: SDD is used without introduction, key taxonomy terms are unexplained jargon, the agent's failure modes are not surfaced, and the relationship between the two documents (human voice vs agent self-review) is not made explicit.
Readers who don't click through to the analysis miss the most interesting findings.

## What Changes

- Add a short "What is Spec-Driven Development?" section before the spec-kit vs OpenSpec comparison, introducing SDD, explaining why it matters for agentic coding, and defining "spec-first" / "spec-anchored" from Boeckeler's taxonomy.
- Move the Boeckeler taxonomy reference from the spec-kit vs OpenSpec section into the new SDD section.
- Add a "Where the agent stumbles" section with the human's curated take on agent failure modes (visual judgment, partial fixes, self-verification gap) -- distinct from the agent's own 7-category taxonomy.
- Reframe the "One more thing" ending to make explicit that the analysis page is agent-generated self-review, with a note on where the human's judgment differs.
- Incorporate the human's correction: the 56% exploration stat is largely SDD overhead, not a deep insight about agents-as-thinking-partners.
- Incorporate the human's correction: only the favicon saga was genuinely over-engineered; the pagination fix actually required the more complex solution.
- Add a caveat in "How did it go?" that blog migration is close to an ideal task for agentic coding (repetitive, well-structured, widely-known tech stack) and results may not generalize to more complex domains.

## Capabilities

### New Capabilities

(none -- this is a content revision, not a new feature)

### Modified Capabilities

(none -- no spec-level behavior changes)

## Impact

- `content/posts/agentic-coding-wordpress-to-github-pages.mdx` -- structural additions and rewrites
- No code changes, no dependency changes, no build impact

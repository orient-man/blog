## 1. Add SDD Introduction Section (D1)

- [x] 1.1 Insert new `## What is Spec-Driven Development?` section between "How did it go?" and "Spec-kit vs OpenSpec"
- [x] 1.2 Write 2-3 sentences introducing SDD: why specs matter when agents generate code fast, what SDD gives the human-agent pair
- [x] 1.3 Define "spec-first" and "spec-anchored" with brief parenthetical explanations
- [x] 1.4 Move the Boeckeler taxonomy reference from the spec-kit vs OpenSpec section into this new section
- [x] 1.5 Add the human's take on the 56% exploration stat: SDD overhead for small changes, worthwhile investment for complex ones (D4)
- [x] 1.6 Add caveat sentence in "How did it go?" that blog migration is close to an ideal task for agentic coding (repetitive, well-structured, widely-known tech stack) and results may not generalize

## 2. Add "Where the Agent Stumbles" Section (D2)

- [x] 2.1 Insert new `## Where the agent stumbles` section between "Spec-kit vs OpenSpec" and "Tools used"
- [x] 2.2 Write an intro line: the analysis page is agent-generated, its self-assessment is mostly accurate, but over-counts over-engineering (only favicon was genuine)
- [x] 2.3 Write "Visual judgment is absent" paragraph (6 instances, screenshot-and-iterate pattern)
- [x] 2.4 Write "Fixes tend to be partial" paragraph (symptom vs root cause, follow-up nudge usually enough)
- [x] 2.5 Write "Self-verification isn't automatic" paragraph (lint, deploy checks, AGENTS.md mitigation, generalizable lesson)

## 3. Reframe "One More Thing" Ending (D3)

- [x] 3.1 Rewrite the "One more thing" section to explicitly disclose the analysis is agent-generated self-review
- [x] 3.2 Add the irony note: the 513-line, 7-category self-analysis is itself a mild case of the over-engineering the agent identifies as its signature failure

## 4. Cleanup

- [x] 4.1 Remove the Boeckeler reference from the "Spec-kit vs OpenSpec" section (moved to SDD section in 1.4)
- [x] 4.2 Review the full post for flow and consistency after all insertions
- [x] 4.3 Run `npm run lint` and fix any issues

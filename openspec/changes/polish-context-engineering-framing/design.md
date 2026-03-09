## Context

The blog post `content/posts/agentic-coding-wordpress-to-github-pages.mdx` contains three passages that individually discuss aspects of context management (session splitting, context window exhaustion, writing rules in AGENTS.md) but never name the unifying concept.
The "56% of sessions produced no code" paragraph actively frames spec work as overhead, which contradicts the author's evolved understanding.

## Goals / Non-Goals

**Goals:**
- Introduce "context engineering" as a named concept in the 56% paragraph.
- Connect the spec-kit context exhaustion observation to session splitting as its solution.
- Generalize the AGENTS.md lesson into a context engineering takeaway.
- Keep total diff under ~10 lines changed.

**Non-Goals:**
- Rewriting other sections of the post.
- Adding new sections or headings.
- Changing any code, styles, or site behaviour.

## Decisions

**D1: Thread the concept through three existing paragraphs rather than adding a new section.**
A dedicated "Context Engineering" heading would break the post's flow and overweight the concept.
Three small edits let the reader connect the dots without being lectured.

**D2: Lead the 56% paragraph with the reframe, not the stat.**
The stat stays as the bold opener, but the second sentence pivots immediately to "context engineering" rather than defending the number.
This avoids a defensive tone.

**D3: Keep the "ceremony for small fixes" qualifier.**
Honesty about when the approach is overkill strengthens the credibility of when it works.

## Risks / Trade-offs

- [Risk] "Context engineering" is a term still gaining traction; some readers may not know it. → The paragraph explains the mechanism (fresh session, clean context window) immediately after naming the term, so the meaning is self-contained.
- [Risk] Three edits in separate paragraphs could feel disconnected. → The closing sentence (Edit 3) explicitly bridges from "put it in the instructions" to the named concept, creating a satisfying callback.

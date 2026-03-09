## Context

The blog post is 83 lines (~700 words) with 5 sections.
The analysis page is 513 lines (~3,500 words) with 9 sections.
The blog post links to the analysis but carries almost none of its findings.
A reader who doesn't click through misses the interesting content.

Current blog post structure:

```
1. Non-technical goals
2. Technical goals
3. How did it go?
4. Spec-kit vs OpenSpec
5. Tools used
6. One more thing (link to analysis)
```

## Goals / Non-Goals

**Goals:**

- Add an SDD introduction so the spec-kit vs OpenSpec section has context
- Surface the human's curated failure mode observations (not the agent's full taxonomy)
- Make explicit that the analysis page is agent-generated, with human commentary on disagreements
- Correct two specific misframing from the explore session: (a) over-engineering count, (b) 56% exploration cause

**Non-Goals:**

- Rewrite the analysis page (it stands as the agent's self-review)
- Add all 7 failure categories to the blog post (pick the 3 most useful)
- Change the blog post's tone or voice

## Decisions

### D1: Insert new section "What is Spec-Driven Development?" between "How did it go?" and "Spec-kit vs OpenSpec"

Rationale: SDD is the framing concept for the entire comparison.
Without it, the reader is dropped into spec-kit vs OpenSpec without knowing why either exists.
The Boeckeler taxonomy reference currently in the comparison section moves here.

### D2: Insert new section "Where the agent stumbles" between "Spec-kit vs OpenSpec" and "Tools used"

Rationale: The blog post currently has no findings -- just stats and a link.
Three failure modes are worth highlighting in the human's voice:
1. Visual judgment is absent (most frequent, 6 instances)
2. Fixes tend to be partial (most actionable for other practitioners)
3. Self-verification isn't automatic (most generalizable lesson)

Over-engineering is mentioned but scoped to the favicon saga only (per human's correction).

### D3: Reframe "One more thing" to disclose the analysis is agent-generated

Rationale: The current framing ("I let OpenCode review its own work") is there but understated.
Adding a line about the irony -- the agent's self-review is itself a mild case of over-engineering (513 lines, 7 failure categories for a 12-day project) -- makes it both honest and memorable.

### D4: In the SDD section, attribute the 56% exploration stat to SDD overhead

Rationale: The agent frames this as "thinking partner value."
The human's judgment is that it's mostly SDD framework ceremony.
The honest framing: some exploration was genuinely valuable (complex migration), some was the framework's overhead tax.

## Risks / Trade-offs

- **Risk:** New sections make the post longer (~700 -> ~1,100 words).
  Mitigation: the additions are high-value content; the post is currently too thin.
- **Risk:** The "agent stumbles" section could read as a complaint list.
  Mitigation: frame as practical observations, not criticism.
  Each point should be useful to someone considering agentic coding.

# Blog migration from WordPress to GitHub Pages

## Non-technical goals

Create my internet archive of all my posts published in different places (WordPress, LinkedIn, Facebook, Goodreads/LibraryThing, etc.) that's under my own jurisdiction — not owned by a social media platform. GitHub Pages is also another platform, but given it's just a repo, I can easily host it from my own NAS server or another place.

## Technical goals

- Fully embrace Agentic Coding in OpenCode with Claude Opus 4.6
- Assess the usefulness of Spec-Driven Development and test two popular frameworks: Spec-kit and OpenSpec

I chose the blog migration task not as a completely new idea, but because I wanted something that would be "easy" for me to specify or do myself (given enough time), so I could focus solely on interactions with the AI agent (verifying its work) and learning new tools.

## How did it go?

Surprisingly smooth, and yet it wasn't boring at all! A very different feel than coding on your own. Some takeaways:

- It's either lots of waiting or lots of multitasking. I ended up with multiple (up to 6) git worktrees across separate terminal tabs with OpenCode sessions, waiting for a notification to switch to the one that needed my attention (answering an agent question, reviewing a spec or code, etc.)

## Spec-kit vs OpenSpec vs simple Plan-Build

Specification-Driven Development frameworks give both human and agent a structure without which both can get lost. Yet for many tasks they are overkill.

- Both are simple to set up and work OOTB.
- Spec-kit automatically creates git branches for you, which could be a problem if you use worktrees or want to wait with branch creation until the specification is fully baked.
- Both frameworks support a "constitution" file that contains key assumptions which are always in play. This overlaps with the AGENTS.md file that OpenCode supports.
- Spec-kit feels heavier of the two. From time to time, the specify phase exhausted the context window, causing its compaction.
- OpenSpec with its default (configurable) simple workflow generates fewer files (3 vs 6) and more condensed artifacts (proposal → design → tasks).
- Using the terminology proposed in [this article from Martin Fowler's site][link], both frameworks are spec-first, but OpenSpec tries to be spec-anchored. After implementation, it retains short feature specifications/requirements that can be updated by future changes. I find it useful for both myself and the model because it drives future changes quite well (e.g. it keeps assumptions and requirements that are not deducible from code).

## Tools used

- OpenCode + Claude Opus 4.6
- OpenCode plugins:
  - [Worktrees][link] — simple yet useful wrapper over `git worktree`. Managing worktrees by hand is possible but it's simpler this way.
  - [Notify][link] — *(description missing — you may want to add what this plugin does)*

## One more thing

I let OpenCode review its own work, pointing out that it keeps all the session history and could tell me how the human–AI cooperation went. Here are the results: [agentic-coding-analysis.md]

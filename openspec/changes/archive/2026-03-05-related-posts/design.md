## Context

Individual post pages currently provide only chronological Older/Newer navigation via adjacent posts in the `getAllPosts()` sorted array.
The blog has 33 posts with tags as the primary topical signal (31 of 33 posts have at least one tag).
Two categories exist (`posts-in-english`, `wpisy-po-polsku`) but serve only as a language split, not topical grouping.

The content library (`src/lib/content.ts`) already provides `getAllPosts()`, `getPostsByTag()`, and caches all posts in memory.
The post page template (`src/app/[year]/[month]/[day]/[slug]/page.tsx`) renders article content, comments, and a prev/next navigation bar.
`PostCard` (`src/components/PostCard.tsx`) is the existing reusable card component for listing pages.

## Goals / Non-Goals

**Goals:**

- Surface topically related posts to improve reader discovery and engagement.
- Compute relatedness at build time with zero runtime cost.
- Reuse existing patterns and components where possible.
- Keep the implementation simple — no new dependencies.

**Non-Goals:**

- Full-text or semantic similarity (NLP, embeddings) — overkill for 33 posts.
- Manual "related posts" frontmatter curation — adds authoring friction.
- Clickthrough analytics or A/B testing of related posts.
- Infinite scrolling or "load more" related posts beyond the initial 3.

## Decisions

### D1: Tag-overlap scoring over TF-IDF or content similarity

**Decision:** Score relatedness as the count of shared tags between two posts, with a +0.5 bonus for same category and recency as the final tiebreaker.

**Rationale:** Tags are explicitly curated by the author and directly express topical intent.
Content-based similarity (TF-IDF, cosine similarity) would require text processing dependencies, violating Principle I (Simplicity).
With only 33 posts, tag overlap produces meaningful results — most tags appear on 2–7 posts.

**Alternatives considered:**

- TF-IDF on post content: Adds complexity and a dependency; overkill for the corpus size.
- Manual `relatedPosts` frontmatter field: High authoring friction; easy to forget updating.
- Category-only grouping: Too coarse — only 2 categories, both language-based.

### D2: Lightweight card variant over full PostCard reuse

**Decision:** Create a `RelatedPosts` component that renders compact entries (title link, date, tag pills) without excerpts, rather than reusing the full `PostCard` component.

**Rationale:** The related posts section is a secondary navigation aid, not a primary listing.
A compact format avoids visual competition with the main article content (Principle II: Content-First).
`PostCard` includes excerpts and more visual weight than appropriate for this context.

**Alternatives considered:**

- Reuse `PostCard` as-is: Too visually heavy; excerpts add noise in a "see also" context.
- Title-only links: Too minimal; date and tags help readers judge relevance at a glance.

### D3: Placement between comments and chronological navigation

**Decision:** Render the related posts section after `<CommentList>` and before the Older/Newer navigation bar.

**Rationale:** This positions topical suggestions after the reader finishes the article and comments, right before they would otherwise leave via chronological links.
It gives related posts natural visibility without interrupting the article flow.

### D4: Minimum 2 results threshold

**Decision:** Hide the section entirely if fewer than 2 related posts are found.

**Rationale:** A single related post looks sparse and awkward.
Posts with no tags (2 of 33) or extremely niche tags naturally produce no results, and the section gracefully disappears rather than showing a stub.

## Risks / Trade-offs

- **[Popular tags dominate]** Posts with common tags like `dotnet` or `tdd` may always recommend each other, creating clusters. → Acceptable at current corpus size; could add tag-rarity weighting later if needed.
- **[Stale results as corpus grows]** With hundreds of posts, O(n) scoring per post could slow builds. → Negligible risk at current scale; if needed, precompute a tag→posts index.
- **[Cross-language recommendations]** A Polish post could appear as related to an English post if they share tags. → Mitigated by the same-category bonus (+0.5), which favors same-language matches.

## Open Questions

(none — the scope is small and well-defined)

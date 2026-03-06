## 1. Schema Extension (P1)

- [x] 1.1 Add optional `linkedinUrl?: string` field to `Post` interface in `src/lib/types.ts` (FR-007)
- [x] 1.2 Update `loadPosts()` in `src/lib/content.ts` to pass through `linkedinUrl` from frontmatter (FR-007)

## 2. Content Migration — Articles (P1)

- [x] 2.1 Create `content/posts/prophet-who-might-be-right.mdx` with full article content, frontmatter (`date: 2026-02-17`, `category: posts-in-english`, `linkedinUrl`, tags), and unwrapped external links (FR-001, FR-003, FR-004, FR-005, FR-006, FR-008)
- [x] 2.2 Create `content/posts/czekajac-na-agi-docenmy-ludzka-entropie.mdx` with full article content, frontmatter (`date: 2026-02-28`, `category: wpisy-po-polsku`, `linkedinUrl`, tags), and unwrapped external links (FR-001, FR-003, FR-004, FR-005, FR-006, FR-008)

## 3. Content Migration — Short Post (P1)

- [x] 3.1 Confirm exact publication date for "OpenCode, terminal i era ai-adminów" with author
- [x] 3.2 Create `content/posts/opencode-terminal-i-era-ai-adminow.mdx` with post content, frontmatter (`category: wpisy-po-polsku`, `linkedinUrl`, tags), one-sentence-per-line formatting (FR-002, FR-003, FR-004, FR-005, FR-006, FR-008)

## 4. Verification (P2)

- [x] 4.1 Run `npm run build` and verify all 3 new posts generate without errors
- [x] 4.2 Verify date-based URLs resolve correctly for each post (FR-006)
- [x] 4.3 Verify new tags appear in the tag cloud at `/tags/` (FR-008)
- [x] 4.4 Verify posts appear in correct category pages (FR-004)
- [x] 4.5 Verify existing posts still load correctly (regression — FR-007 backward compatibility)
- [x] 4.6 Run lint (`npm run lint`) and fix any issues

## Context

The site currently has a single static page: a Polish-language CV last updated in 2015.
The existing content pipeline already supports static pages via MDX files in `content/pages/`, rendered by `src/app/page/[slug]/page.tsx`.
Adding a new page requires only a new `.mdx` file — no routing or rendering code changes.

The CV content comes from three sources:
1. **Existing site** (`content/pages/curriculum-vitae-pl.mdx`) — Polish, detailed but stale (2015)
2. **PDF CV** (`CV_2019.pdf`) — English, compact, adds FinAi and mBank descriptions (2019)
3. **LinkedIn** — confirms Allegro roles and dates (Feb 2020 – Present)

## Goals / Non-Goals

**Goals:**

- Provide a current, English-language CV page at `/page/curriculum-vitae/`
- Merge information from all three sources into a single authoritative document
- Maintain the rich, narrative style of the existing Polish CV
- Keep the old Polish CV accessible at its original URL for backward compatibility

**Non-Goals:**

- Redesigning the static page layout or adding CV-specific components
- Adding a downloadable PDF export
- Creating a bilingual toggle or language switcher
- Adding structured data / JSON-LD markup for the CV

## Decisions

### D1: Single English page replaces Polish in navigation

**Decision**: Create a new file `content/pages/curriculum-vitae.mdx` with slug `curriculum-vitae`.
Update all 4 navigation links to point to `/page/curriculum-vitae/`.
Keep the old file untouched.

**Rationale**: The site's UI language is English (`<html lang="en">`), and the blog has an international audience.
A clean English slug is simpler than `/curriculum-vitae-en/`.
Keeping the old file costs nothing and avoids breaking external links.

**Alternatives considered**:
- *Edit the existing file in-place*: Would lose the Polish version and break bookmarks to the PL slug.
- *Bilingual page with tabs*: Adds component complexity for marginal benefit. Violates Simplicity principle.

### D2: Allegro entry lists roles only

**Decision**: The Allegro experience entry shows only role titles and date ranges, with no project descriptions.

**Rationale**: Per user request. Allegro details can be added later if desired.

### D3: Content format matches existing pipeline

**Decision**: Use `.mdx` extension with standard frontmatter (`title`, `date`, `author`, `slug`).
Content authored in plain Markdown (no JSX components needed).
Processed by the same `evaluate()` pipeline with `format: 'md'`.

**Rationale**: Zero infrastructure changes. Consistent with existing static pages.

### D4: Translate talks section including audience quotes

**Decision**: All talk entries and audience quotes from the Polish CV are translated to English.
The original links to slides, videos, and external sites are preserved unchanged.

**Rationale**: Rich content (quotes, links, images) is part of the CV's narrative style.
Links work regardless of language since they point to external resources.

## Risks / Trade-offs

- **[Stale Allegro info]** The CV will show role titles only for Allegro with no descriptions.
  This is intentional per user request but may appear thin for the most recent 6+ years.
  Mitigation: Can be enriched later in a follow-up change.

- **[Broken external links]** Some links in the Polish CV (conference sites, Dropbox thesis PDF, MindMeister map) may be dead after 10+ years.
  Mitigation: Translate as-is; link rot is a content maintenance concern, not a blocker for this change.

- **[Translation quality]** Machine-translated audience quotes may lose nuance.
  Mitigation: Keep translations natural rather than literal; the author can review.

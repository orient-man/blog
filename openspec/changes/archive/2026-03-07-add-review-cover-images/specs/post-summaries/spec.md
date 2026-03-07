## MODIFIED Requirements

### Requirement: FR-004 PostCard display

The PostCard component MUST display the HTML excerpt when available, falling back to the plain-text excerpt.
The CSS `line-clamp` MUST allow enough visible lines to accommodate the rendered excerpt at the displayed font size.
When a `coverImage` is present, the PostCard MUST include `"coverImage"` in the props it receives from the `Post` object and pass it to the thumbnail rendering area.

#### Scenario: Excerpt visible on listing page

- **WHEN** a listing page renders a PostCard with an HTML excerpt
- **THEN** the excerpt is rendered with Markdown formatting intact and visible without broken markup from CSS truncation

#### Scenario: PostCard with coverImage prop

- **WHEN** a listing page renders a PostCard for a post that has `coverImage` set
- **THEN** PostCard receives the `coverImage` value in its props and renders a thumbnail

## ADDED Requirements

### Requirement: FR-001 Search result title displays post title

The search result title for each blog post MUST display the post's own title, without any site name suffix or template decoration.
Pagefind MUST extract the title from an explicit `data-pagefind-meta="title"` attribute on the post heading, overriding the default HTML `<title>` extraction.

#### Scenario: User searches for a post by keyword

- **WHEN** a user searches for a term that matches a blog post
- **THEN** the search result title displays only the post title (e.g. "Domain-Driven Design in Practice"), not the templated HTML title (e.g. "Domain-Driven Design in Practice | Just A Programmer")

#### Scenario: Every indexed post has an explicit Pagefind title

- **WHEN** the site is built and Pagefind indexes the static output
- **THEN** every blog post page contains a `data-pagefind-meta="title"` attribute on its `<h1>` heading element

### Requirement: FR-002 Non-content sections excluded from search index

Navigation chrome, related posts, and comment sections within the blog post page MUST be excluded from the Pagefind search index.
These sections MUST be marked with `data-pagefind-ignore` so they do not appear in search excerpts or influence result ranking.

#### Scenario: Search excerpt does not contain navigation text

- **WHEN** a user searches for a term that appears in a post's body content
- **THEN** the search excerpt shows text from the post body, not from "Older post" / "Newer post" navigation links

#### Scenario: Related posts section is not indexed

- **WHEN** a user searches for a term that only appears in the related posts sidebar of a given page
- **THEN** that page does not appear in search results for that term

#### Scenario: Comments section is not indexed

- **WHEN** a user searches for a term that only appears in the comments section of a given page
- **THEN** that page does not appear in search results for that term

### Requirement: FR-003 Post body content remains fully searchable

The post body content, header metadata (title, date, author, category, tags), and cover image alt text MUST remain within the Pagefind index scope.
The `data-pagefind-body` attribute MUST continue to wrap the article element.

#### Scenario: Post body content is searchable

- **WHEN** a user searches for a term that appears in the body text of a blog post
- **THEN** that post appears in search results with a relevant excerpt

#### Scenario: Post tags are searchable

- **WHEN** a user searches for a tag name that is displayed in a post's tag list
- **THEN** that post appears in search results

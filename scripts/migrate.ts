#!/usr/bin/env tsx
/**
 * scripts/migrate.ts
 *
 * Converts a WordPress WXR export (XML) to MDX files.
 *
 * Usage:
 *   tsx scripts/migrate.ts <path-to-wxr.xml>
 *
 * Output:
 *   content/posts/{slug}.mdx   — one file per published post
 *   content/pages/{slug}.mdx   — one file per published page
 */

import fs from 'fs';
import path from 'path';
import { XMLParser } from 'fast-xml-parser';
import TurndownService from 'turndown';

// ── Paths ─────────────────────────────────────────────────────────────────────

const POSTS_OUT = path.join(process.cwd(), 'content', 'posts');
const PAGES_OUT = path.join(process.cwd(), 'content', 'pages');

// ── Argument ──────────────────────────────────────────────────────────────────

const wxrPath = process.argv[2];
if (!wxrPath) {
  console.error('Usage: tsx scripts/migrate.ts <path-to-export.xml>');
  process.exit(1);
}
if (!fs.existsSync(wxrPath)) {
  console.error(`File not found: ${wxrPath}`);
  process.exit(1);
}

// ── Turndown setup ────────────────────────────────────────────────────────────

const td = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
  bulletListMarker: '-',
});

// Preserve <pre><code> blocks with language detection
td.addRule('fenced-code-blocks', {
  filter: (node) =>
    node.nodeName === 'PRE' &&
    node.firstChild !== null &&
    (node.firstChild as Element).nodeName === 'CODE',
  replacement: (_content, node) => {
    const code = node.firstChild as Element;
    const cls = code.getAttribute?.('class') ?? '';
    // WordPress code blocks often use class="language-csharp" etc.
    const langMatch = cls.match(/language-(\w+)/);
    const lang = langMatch ? langMatch[1] : '';
    const text = code.textContent ?? '';
    return `\n\`\`\`${lang}\n${text}\n\`\`\`\n`;
  },
});

// WordPress [caption] shortcode → alt text under image
td.addRule('wp-caption', {
  filter: (node) =>
    node.nodeName === 'DIV' &&
    typeof (node as Element).getAttribute === 'function' &&
    ((node as Element).getAttribute('class') ?? '').includes('wp-caption'),
  replacement: (content) => content,
});

// ── Tag slug helpers ──────────────────────────────────────────────────────────

function toTagSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

// ── WXR parse ─────────────────────────────────────────────────────────────────

const xmlRaw = fs.readFileSync(wxrPath, 'utf8');

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  textNodeName: '#text',
  // Preserve CDATA sections as text
  cdataPropName: '#cdata',
  allowBooleanAttributes: true,
  parseAttributeValue: false,
  isArray: (tagName) =>
    ['item', 'category', 'wp:comment', 'wp:term'].includes(tagName),
});

const xml = parser.parse(xmlRaw);
const channel = xml?.rss?.channel;

if (!channel) {
  console.error('Could not find <channel> in WXR. Is this a valid WordPress export?');
  process.exit(1);
}

const items: unknown[] = Array.isArray(channel.item) ? channel.item : (channel.item ? [channel.item] : []);

console.log(`Found ${items.length} items in WXR`);

// ── Helpers ───────────────────────────────────────────────────────────────────

function getText(val: unknown): string {
  if (typeof val === 'string') return val;
  if (val && typeof val === 'object') {
    const v = val as Record<string, unknown>;
    if (typeof v['#cdata'] === 'string') return v['#cdata'];
    if (typeof v['#text'] === 'string') return v['#text'];
  }
  return '';
}

function safeFilename(slug: string): string {
  return slug.replace(/[^a-z0-9-]/gi, '-').toLowerCase();
}

function htmlToMarkdown(html: string): string {
  if (!html) return '';
  // Expand WordPress [caption] shortcodes to plain HTML before conversion
  const expanded = html
    .replace(/\[caption[^\]]*\]([\s\S]*?)\[\/caption\]/g, '$1')
    .replace(/\[gallery[^\]]*\]/g, '')
    .replace(/\[embed\](.*?)\[\/embed\]/g, '$1')
    // WordPress [code lang="X"] shortcodes
    .replace(/\[code(?:\s+lang(?:uage)?="([^"]*)")?\]([\s\S]*?)\[\/code\]/g,
      (_, lang, code) => `<pre><code class="language-${lang ?? ''}">${code}</code></pre>`)
    // Remaining unknown shortcodes — strip
    .replace(/\[[^\]]+\]/g, '');

  return td.turndown(expanded);
}

// ── YAML front-matter serialiser (no external dep) ───────────────────────────

function toYaml(value: unknown, indent = 0): string {
  const pad = '  '.repeat(indent);
  if (value === null || value === undefined) return 'null';
  if (typeof value === 'boolean') return String(value);
  if (typeof value === 'number') return String(value);
  if (typeof value === 'string') {
    // Multi-line strings → block scalar
    if (value.includes('\n')) return `|-\n${value.split('\n').map(l => pad + '  ' + l).join('\n')}`;
    // Strings needing quoting
    if (/[:#\[\]{}|>&*!,'"%@`]|^\s|\s$/.test(value) || value === '') {
      return JSON.stringify(value);
    }
    return value;
  }
  if (Array.isArray(value)) {
    if (value.length === 0) return '[]';
    return '\n' + value.map(v => `${pad}- ${toYaml(v, indent + 1)}`).join('\n');
  }
  if (typeof value === 'object') {
    const obj = value as Record<string, unknown>;
    const lines = Object.entries(obj).map(
      ([k, v]) => `${pad}  ${k}: ${toYaml(v, indent + 1)}`
    );
    return '\n' + lines.join('\n');
  }
  return String(value);
}

function buildFrontmatter(fields: Record<string, unknown>): string {
  const lines = Object.entries(fields).map(([k, v]) => {
    const serialized = toYaml(v);
    if (serialized.startsWith('\n')) return `${k}:${serialized}`;
    return `${k}: ${serialized}`;
  });
  return `---\n${lines.join('\n')}\n---\n`;
}

// ── Process items ─────────────────────────────────────────────────────────────

let postCount = 0;
let pageCount = 0;
let skipped = 0;

fs.mkdirSync(POSTS_OUT, { recursive: true });
fs.mkdirSync(PAGES_OUT, { recursive: true });

for (const rawItem of items) {
  const item = rawItem as Record<string, unknown>;

  const postType = getText(item['wp:post_type']);
  const status = getText(item['wp:status']);

  // Only process published posts and pages
  if (status !== 'publish') { skipped++; continue; }
  if (postType !== 'post' && postType !== 'page') { skipped++; continue; }

  const title = getText(item['title']);
  const slug = getText(item['wp:post_name']) || safeFilename(title);
  const dateRaw = getText(item['wp:post_date'] ?? item['pubDate']);
  // Normalise date to ISO YYYY-MM-DD
  const date = dateRaw ? dateRaw.slice(0, 10) : '1970-01-01';
  const author = getText(item['dc:creator'] ?? item['author']);
  const link = getText(item['link']);

  // Extract WordPress URL path
  const wordpressUrl = (() => {
    try { return new URL(link).pathname; } catch { return link; }
  })();

  // Content
  const contentHtml = getText(item['content:encoded'] ?? item['content']);
  const excerptHtml = getText(item['excerpt:encoded'] ?? item['excerpt']);
  const contentMd = htmlToMarkdown(contentHtml);
  const excerptText = excerptHtml
    ? td.turndown(excerptHtml).replace(/\s+/g, ' ').trim().slice(0, 200)
    : undefined;

  // Categories and tags
  const categoryNodes: unknown[] = Array.isArray(item['category'])
    ? item['category']
    : item['category'] ? [item['category']] : [];

  let categorySlug = 'posts-in-english';
  const tags: string[] = [];

  for (const cat of categoryNodes) {
    const c = cat as Record<string, unknown>;
    const domain = String(c['@_domain'] ?? '');
    const nicename = String(c['@_nicename'] ?? '');
    const displayName = getText(c);

    if (domain === 'category') {
      // Map WP category nicename to our slugs
      if (nicename.includes('polsku') || nicename.includes('polish')) {
        categorySlug = 'wpisy-po-polsku';
      } else {
        categorySlug = 'posts-in-english';
      }
    } else if (domain === 'post_tag') {
      tags.push(toTagSlug(displayName || nicename));
    }
  }

  // Post format (standard | quote)
  const postFormat = (() => {
    const terms = Array.isArray(item['wp:term'])
      ? item['wp:term']
      : item['wp:term'] ? [item['wp:term']] : [];
    for (const t of terms) {
      const term = t as Record<string, unknown>;
      if (getText(term['wp:term_taxonomy']) === 'post_format') {
        const slug = getText(term['wp:term_slug']);
        if (slug === 'post-format-quote' || slug === 'quote') return 'quote';
      }
    }
    // Also check category nodes for post_format domain
    for (const cat of categoryNodes) {
      const c = cat as Record<string, unknown>;
      if (String(c['@_domain'] ?? '') === 'post_format') {
        const n = String(c['@_nicename'] ?? '');
        if (n.includes('quote')) return 'quote';
      }
    }
    return 'standard';
  })();

  // Comments
  const commentNodes: unknown[] = Array.isArray(item['wp:comment'])
    ? item['wp:comment']
    : item['wp:comment'] ? [item['wp:comment']] : [];

  const comments = commentNodes
    .filter((c) => {
      const comment = c as Record<string, unknown>;
      return getText(comment['wp:comment_approved']) === '1';
    })
    .map((c) => {
      const comment = c as Record<string, unknown>;
      return {
        author: getText(comment['wp:comment_author']),
        date: getText(comment['wp:comment_date']).replace(' ', 'T'),
        content: getText(comment['wp:comment_content']).trim(),
      };
    });

  // Build frontmatter
  const fm: Record<string, unknown> = {
    title,
    date,
    author: author || 'Marcin Malinowski',
    slug,
    wordpressUrl,
  };

  if (postType === 'post') {
    fm.category = categorySlug;
    fm.tags = tags;
    fm.format = postFormat;
    if (excerptText) fm.excerpt = excerptText;
    if (comments.length > 0) fm.comments = comments;
  }

  const mdxContent = buildFrontmatter(fm) + '\n' + contentMd + '\n';
  const filename = safeFilename(slug) + '.mdx';

  if (postType === 'post') {
    fs.writeFileSync(path.join(POSTS_OUT, filename), mdxContent, 'utf8');
    postCount++;
  } else {
    fs.writeFileSync(path.join(PAGES_OUT, filename), mdxContent, 'utf8');
    pageCount++;
  }
}

console.log(`\nMigration complete:`);
console.log(`  Posts:   ${postCount}  → content/posts/`);
console.log(`  Pages:   ${pageCount}  → content/pages/`);
console.log(`  Skipped: ${skipped} (drafts, attachments, etc.)`);

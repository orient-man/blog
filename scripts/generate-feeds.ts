/**
 * generate-feeds.ts
 *
 * Generates public/sitemap.xml and public/feed.xml from content.
 * Run this as a prebuild step: "prebuild": "tsx scripts/generate-feeds.ts"
 *
 * Note: Does NOT import from src/ (Next.js path aliases) — uses raw fs/matter
 * directly for portability.
 */
import fs from "fs";
import path from "path";

import matter from "gray-matter";

// ── Config ────────────────────────────────────────────────────────────────────

const SITE_URL = "https://blog.orientman.com";
const POSTS_DIR = path.join(process.cwd(), "content", "posts");
const PAGES_DIR = path.join(process.cwd(), "content", "pages");
const PUBLIC_DIR = path.join(process.cwd(), "public");

// ── Helpers ───────────────────────────────────────────────────────────────────

interface PostMeta {
  slug: string;
  date: string;
  title: string;
  excerpt: string;
  url: string;
}

function loadPosts(): PostMeta[] {
  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith(".mdx"));
  return files
    .map((f) => {
      const raw = fs.readFileSync(path.join(POSTS_DIR, f), "utf8");
      const { data, content } = matter(raw);

      const dateRaw =
        data.date instanceof Date
          ? data.date.toISOString().slice(0, 10)
          : String(data.date ?? "");
      const slug = data.slug ?? path.basename(f, ".mdx");
      const d = new Date(dateRaw + "T00:00:00Z");
      const y = d.getUTCFullYear();
      const m = String(d.getUTCMonth() + 1).padStart(2, "0");
      const day = String(d.getUTCDate()).padStart(2, "0");
      const url = `${SITE_URL}/${y}/${m}/${day}/${slug}/`;

      const plain = content
        .replace(/^---[\s\S]*?---\n?/, "")
        .replace(/<[^>]+>/g, "")
        .replace(/[#*`]/g, "")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 200);
      const excerpt = plain.length < content.length ? plain + "…" : plain;

      return {
        slug,
        date: dateRaw,
        title: String(data.title ?? slug),
        excerpt,
        url,
      };
    })
    .sort((a, b) => b.date.localeCompare(a.date));
}

function loadPages(): { slug: string; url: string }[] {
  if (!fs.existsSync(PAGES_DIR)) return [];
  return fs
    .readdirSync(PAGES_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => {
      const raw = fs.readFileSync(path.join(PAGES_DIR, f), "utf8");
      const { data } = matter(raw);
      const slug = data.slug ?? path.basename(f, ".mdx");
      return { slug, url: `${SITE_URL}/page/${slug}/` };
    });
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

// ── Sitemap ───────────────────────────────────────────────────────────────────

function buildSitemap(
  posts: PostMeta[],
  pages: { slug: string; url: string }[],
): string {
  const postUrls = posts.map(
    (p) =>
      `  <url>\n    <loc>${escapeXml(p.url)}</loc>\n    <lastmod>${p.date}</lastmod>\n    <changefreq>monthly</changefreq>\n  </url>`,
  );

  const staticUrls = [
    `  <url>\n    <loc>${SITE_URL}/</loc>\n    <changefreq>daily</changefreq>\n  </url>`,
    `  <url>\n    <loc>${SITE_URL}/search/</loc>\n    <changefreq>monthly</changefreq>\n  </url>`,
    ...pages.map(
      (p) =>
        `  <url>\n    <loc>${escapeXml(p.url)}</loc>\n    <changefreq>monthly</changefreq>\n  </url>`,
    ),
  ];

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${[...staticUrls, ...postUrls].join("\n")}\n</urlset>\n`;
}

// ── RSS Feed ──────────────────────────────────────────────────────────────────

function buildRss(posts: PostMeta[]): string {
  const items = posts
    .slice(0, 20)
    .map(
      (p) =>
        `    <item>\n      <title>${escapeXml(p.title)}</title>\n      <link>${escapeXml(p.url)}</link>\n      <guid>${escapeXml(p.url)}</guid>\n      <pubDate>${new Date(p.date + "T00:00:00Z").toUTCString()}</pubDate>\n      <description>${escapeXml(p.excerpt)}</description>\n    </item>`,
    )
    .join("\n");

  const now = new Date().toUTCString();
  return `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0">\n  <channel>\n    <title>Just A Programmer</title>\n    <link>${SITE_URL}/</link>\n    <description>Don Quixote fighting entropy — a programming blog by Marcin Malinowski</description>\n    <language>en</language>\n    <lastBuildDate>${now}</lastBuildDate>\n${items}\n  </channel>\n</rss>\n`;
}

// ── Main ──────────────────────────────────────────────────────────────────────

const posts = loadPosts();
const pages = loadPages();

const sitemap = buildSitemap(posts, pages);
const rss = buildRss(posts);

fs.writeFileSync(path.join(PUBLIC_DIR, "sitemap.xml"), sitemap, "utf8");
fs.writeFileSync(path.join(PUBLIC_DIR, "feed.xml"), rss, "utf8");

console.log(`✓ sitemap.xml: ${posts.length} posts + ${pages.length} pages`);
console.log(`✓ feed.xml: ${Math.min(posts.length, 20)} items`);

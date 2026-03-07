import Link from "next/link";
import type { ReactNode } from "react";

import { siteConfig } from "@/lib/siteConfig";
import type {
  Tag,
  ArchiveMonth,
  BlogrollEntry,
  Post,
  CurrentlyReadingData,
} from "@/lib/types";
import { CATEGORIES } from "@/lib/types";
import { formatMonthYear, postUrlPath, pad2 } from "@/lib/utils";

import CurrentlyReading from "./CurrentlyReading";
import TagCloud from "./TagCloud";

// ── Social icon SVGs ──────────────────────────────────────────────────────────

const socialIcons: Record<string, ReactNode> = {
  x: (
    <svg
      className="w-5 h-5"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
  facebook: (
    <svg
      className="w-5 h-5"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
    </svg>
  ),
  linkedin: (
    <svg
      className="w-5 h-5"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  ),
  github: (
    <svg
      className="w-5 h-5"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  ),
  rss: (
    <svg
      className="w-5 h-5"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M19.199 24C19.199 13.467 10.533 4.8 0 4.8V0c13.165 0 24 10.835 24 24h-4.801zM3.291 17.415a3.3 3.3 0 0 1 3.293 3.295A3.303 3.303 0 0 1 3.283 24C1.47 24 0 22.526 0 20.71a3.286 3.286 0 0 1 3.291-3.295zM15.909 24h-4.665c0-6.169-5.075-11.245-11.244-11.245V8.09c8.727 0 15.909 7.184 15.909 15.91z" />
    </svg>
  ),
};

interface SidebarProps {
  allTags: Tag[];
  archiveMonths: ArchiveMonth[];
  blogroll: BlogrollEntry[];
  recentPosts: Post[];
  currentlyReading: CurrentlyReadingData;
}

export default function Sidebar({
  allTags,
  archiveMonths,
  blogroll,
  recentPosts,
  currentlyReading,
}: SidebarProps) {
  return (
    <aside className="space-y-8 text-sm">
      {/* ── About ─────────────────────────────────────────────── */}
      <section>
        <h2 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 uppercase tracking-wide text-xs">
          About
        </h2>
        {/* eslint-disable-next-line @next/next/no-img-element -- static export, next/image optimisation unavailable */}
        <img
          src={`https://gravatar.com/avatar/${siteConfig.gravatarHash}?s=128&d=mp`}
          alt={siteConfig.author}
          width={128}
          height={128}
          className="rounded-full w-32 h-32 mx-auto mb-4 ring-2 ring-gray-200 dark:ring-gray-700"
        />
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
          Father², husband, bookworm, stubborn, programmer, conference addict.
          Don Quixote fighting entropy. Delights in contradictions & humor.
          Believes in chance. Beer philosopher. Occasionally goalkeeper.
        </p>
        <p className="mt-2 text-gray-600 dark:text-gray-400 leading-relaxed">
          A programming blog by{" "}
          <Link
            href="/page/curriculum-vitae-pl/"
            className="text-brand-600 dark:text-brand-400 hover:underline"
          >
            {siteConfig.author}
          </Link>
          .
        </p>

        {/* Social links */}
        <nav
          aria-label="Social media links"
          className="mt-4 flex gap-3 justify-center"
        >
          {siteConfig.socialLinks.map((link) => (
            <a
              key={link.platform}
              href={link.url}
              aria-label={link.label}
              className="text-gray-400 dark:text-gray-500 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
              {...(link.platform === "rss"
                ? {}
                : { target: "_blank", rel: "noopener noreferrer" })}
            >
              {socialIcons[link.platform]}
            </a>
          ))}
        </nav>
      </section>

      {/* ── Recent Posts ─────────────────────────────────────── */}
      {recentPosts.length > 0 && (
        <section>
          <h2 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 uppercase tracking-wide text-xs">
            Recent Posts
          </h2>
          <ul className="space-y-2">
            {recentPosts.map((post) => (
              <li key={post.slug}>
                <Link
                  href={postUrlPath(post.date, post.slug)}
                  className="text-gray-700 dark:text-gray-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors line-clamp-2"
                >
                  {post.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ── Categories ───────────────────────────────────────── */}
      <section>
        <h2 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 uppercase tracking-wide text-xs">
          Categories
        </h2>
        <ul className="space-y-1">
          {CATEGORIES.map((cat) => (
            <li key={cat.slug}>
              <Link
                href={`/category/${cat.slug}/`}
                className="text-gray-700 dark:text-gray-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
              >
                {cat.name}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* ── Tag Cloud ─────────────────────────────────────────── */}
      {allTags.length > 0 && (
        <section>
          <h2 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 uppercase tracking-wide text-xs">
            Tags
          </h2>
          <TagCloud tags={allTags} maxTags={20} />
        </section>
      )}

      {/* ── Currently Reading ─────────────────────────────────── */}
      {currentlyReading.books.length > 0 && (
        <section>
          <h2 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 uppercase tracking-wide text-xs">
            Currently Reading
          </h2>
          <CurrentlyReading
            books={currentlyReading.books}
            shelfUrl={currentlyReading.shelfUrl}
          />
        </section>
      )}

      {/* ── Archive ───────────────────────────────────────────── */}
      {archiveMonths.length > 0 && (
        <section>
          <h2 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 uppercase tracking-wide text-xs">
            Archive
          </h2>
          <ul className="space-y-1">
            {archiveMonths.map(({ year, month, count }) => (
              <li key={`${year}-${month}`}>
                <Link
                  href={`/archive/${year}/${pad2(month)}/`}
                  className="text-gray-700 dark:text-gray-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                >
                  {formatMonthYear(year, month)}{" "}
                  <span className="text-gray-400 dark:text-gray-500">
                    ({count})
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ── Blogroll ─────────────────────────────────────────── */}
      {blogroll.length > 0 && (
        <section>
          <h2 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 uppercase tracking-wide text-xs">
            Blogs I Follow
          </h2>
          <ul className="space-y-1">
            {blogroll.map((entry) => (
              <li key={entry.url}>
                <a
                  href={entry.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-700 dark:text-gray-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                >
                  {entry.name}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ── Search ───────────────────────────────────────────── */}
      <section>
        <h2 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 uppercase tracking-wide text-xs">
          Search
        </h2>
        <Link
          href="/search/"
          className="inline-block w-full text-center px-3 py-1.5 rounded border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-brand-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
        >
          Search posts
        </Link>
      </section>
    </aside>
  );
}

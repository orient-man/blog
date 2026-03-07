import Link from "next/link";

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
          src="https://gravatar.com/avatar/78d50dc34ae3edcfa5449ff9ad47f0a2?s=128&d=mp"
          alt="Marcin Malinowski"
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
            Marcin Malinowski
          </Link>
          .
        </p>
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

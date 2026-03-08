import Link from "next/link";

import type { Post } from "@/lib/types";
import { postUrlPath, slugify } from "@/lib/utils";

import { StarRating } from "./StarRating";

interface PostCardProps {
  post: Pick<
    Post,
    | "title"
    | "date"
    | "slug"
    | "excerpt"
    | "htmlExcerpt"
    | "category"
    | "tags"
    | "format"
    | "wordpressUrl"
    | "rating"
    | "coverImage"
  >;
}

const MAX_TAGS = 5;

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;
const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

export function PostCard({ post }: PostCardProps) {
  const {
    title,
    date,
    slug,
    excerpt,
    htmlExcerpt,
    category,
    tags,
    format,
    rating,
    coverImage,
  } = post;
  const url = postUrlPath(date, slug);
  const visibleTags = tags.slice(0, MAX_TAGS);
  const extraTags = tags.length - MAX_TAGS;

  // Parse date for the editorial date block
  const d = new Date(date + "T00:00:00Z");
  const day = d.getUTCDate();
  const weekday = WEEKDAYS[d.getUTCDay()];
  const month = MONTHS[d.getUTCMonth()];
  const year = d.getUTCFullYear();

  return (
    <article
      className={`bevel-panel rounded-lg bg-white dark:bg-gray-800 p-5 transition-shadow hover:shadow-md ${
        format === "quote"
          ? "border-l-4 border-l-brand-500 dark:border-l-brand-400"
          : ""
      }`}
    >
      <div className="flex gap-4">
        {/* ── Date block ────────────────────────────────────────── */}
        <div className="hidden sm:flex flex-col items-center justify-start w-16 shrink-0 pt-1 font-pixel">
          <span className="text-2xl font-bold text-brand-600 dark:text-brand-400 leading-none">
            {day}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide mt-0.5">
            {weekday}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {month} {year}
          </span>
        </div>

        {/* ── Card content ──────────────────────────────────────── */}
        <div className="flex-1 min-w-0">
          {format === "quote" && (
            <span
              className="text-brand-500 dark:text-brand-400 text-2xl font-serif leading-none select-none"
              aria-hidden="true"
            >
              &ldquo;
            </span>
          )}

          <h2 className="text-xl font-semibold font-serif mt-1 mb-2">
            <Link
              href={url}
              className="text-gray-900 dark:text-gray-100 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
            >
              {title}
            </Link>
          </h2>

          {/* Mobile-only inline date */}
          <time
            dateTime={date}
            className="sm:hidden text-sm font-pixel text-gray-500 dark:text-gray-400"
          >
            {weekday}, {month} {day}, {year}
          </time>

          {htmlExcerpt ? (
            <div
              className="mt-3 prose prose-sm dark:prose-invert line-clamp-10"
              dangerouslySetInnerHTML={{ __html: htmlExcerpt }}
            />
          ) : (
            excerpt && (
              <p className="mt-3 text-gray-600 dark:text-gray-300 text-sm leading-relaxed line-clamp-10">
                {excerpt}
              </p>
            )
          )}

          <div className="mt-3 flex flex-wrap items-center gap-2">
            {/* Category badge */}
            <Link
              href={`/category/${category}/`}
              className="inline-block rounded bg-brand-100 dark:bg-brand-900 px-2 py-0.5 text-xs font-medium text-brand-800 dark:text-brand-200 hover:bg-brand-200 dark:hover:bg-brand-800 transition-colors"
            >
              {category === "posts-in-english" ? "English" : "Polish"}
            </Link>

            {/* Star rating (book reviews only) */}
            {rating != null && <StarRating rating={rating} size="sm" />}

            {/* Tag pills */}
            {visibleTags.map((tag) => (
              <Link
                key={tag}
                href={`/tag/${slugify(tag)}/`}
                className="inline-block rounded-full bg-gray-100 dark:bg-gray-700 px-2 py-0.5 text-xs text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                {tag}
              </Link>
            ))}

            {extraTags > 0 && (
              <span className="text-xs text-gray-400 dark:text-gray-500">
                +{extraTags} more
              </span>
            )}
          </div>
        </div>

        {/* ── Cover thumbnail (review posts only) ──────────────────── */}
        {coverImage && (
          <Link
            href={url}
            className="shrink-0 self-start"
            aria-hidden="true"
            tabIndex={-1}
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- static export, next/image optimisation unavailable */}
            <img
              src={coverImage}
              alt=""
              loading="lazy"
              className="w-12 sm:w-16 md:w-20 rounded object-cover"
            />
          </Link>
        )}
      </div>
    </article>
  );
}

import type { CurrentlyReadingBook } from "@/lib/types";

interface CurrentlyReadingProps {
  books: CurrentlyReadingBook[];
  maxCount?: number;
  shelfUrl: string;
}

/**
 * Extract author initials for the styled placeholder.
 * Uses first letter of first name + first letter of last name.
 * Falls back to first two letters if only one name part.
 */
function getAuthorInitials(author: string): string {
  const parts = author.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return author.slice(0, 2).toUpperCase();
}

export default function CurrentlyReading({
  books,
  maxCount = 5,
  shelfUrl,
}: CurrentlyReadingProps) {
  const displayBooks = books.slice(0, maxCount);

  return (
    <div>
      <ul className="space-y-3">
        {displayBooks.map((book) => (
          <li key={book.url} className="flex gap-3 items-start">
            {/* Cover image or styled placeholder */}
            {book.coverUrl ? (
              /* eslint-disable-next-line @next/next/no-img-element -- static export, next/image optimisation unavailable */
              <img
                src={book.coverUrl}
                alt={book.title}
                width={48}
                height={70}
                className="w-12 h-[70px] object-cover rounded-sm shrink-0"
              />
            ) : (
              <div className="w-12 h-[70px] rounded-sm shrink-0 bg-brand-100 dark:bg-brand-900 flex items-center justify-center">
                <span className="text-sm font-semibold text-brand-700 dark:text-brand-300">
                  {getAuthorInitials(book.author)}
                </span>
              </div>
            )}

            {/* Book info */}
            <div className="min-w-0">
              <a
                href={book.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-700 dark:text-gray-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors line-clamp-2 leading-tight text-sm"
              >
                {book.title}
              </a>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                {book.author}
              </p>
            </div>
          </li>
        ))}
      </ul>

      {/* Footer link to full shelf */}
      <a
        href={shelfUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block mt-3 text-xs text-brand-600 dark:text-brand-400 hover:underline"
      >
        View on Goodreads
      </a>
    </div>
  );
}

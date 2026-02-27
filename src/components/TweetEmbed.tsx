interface TweetEmbedProps {
  /** Full tweet URL (e.g., "https://twitter.com/user/status/12345") */
  url: string;
  /** Static snapshot of the tweet text */
  content?: string;
  /** Tweet author (e.g., "@username" or "Display Name") */
  author?: string;
}

/**
 * TweetEmbed — static server component.
 *
 * Renders a styled blockquote with the captured tweet text and a link
 * to the original URL. No external Twitter/X JavaScript required.
 */
export default function TweetEmbed({ url, content, author }: TweetEmbedProps) {
  return (
    <blockquote className="my-6 pl-4 border-l-4 border-blue-400 dark:border-blue-500 bg-blue-50 dark:bg-blue-950/30 rounded-r p-4 not-italic">
      {content && (
        <p className="text-base text-gray-800 dark:text-gray-200 leading-relaxed mb-3">
          {content}
        </p>
      )}
      <footer className="flex items-center justify-between gap-4 text-sm text-gray-500 dark:text-gray-400">
        {author && <cite className="not-italic font-medium">{author}</cite>}
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 dark:text-blue-400 hover:underline ml-auto"
          aria-label="View original tweet"
        >
          View on Twitter/X &rarr;
        </a>
      </footer>
    </blockquote>
  );
}

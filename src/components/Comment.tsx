import { formatDate } from '@/lib/utils';
import type { Comment } from '@/lib/types';

interface CommentProps {
  comment: Comment;
}

/**
 * Safely format a comment date string for display.
 * Returns "Unknown date" if the value is empty, undefined, or not a valid
 * YYYY-MM-DD string — providing a graceful fallback (SC-002).
 */
function safeDateDisplay(date: string | undefined | null): string {
  if (!date || typeof date !== 'string') return 'Unknown date';
  // Must match YYYY-MM-DD
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return 'Unknown date';
  const d = new Date(date + 'T00:00:00Z');
  if (isNaN(d.getTime())) return 'Unknown date';
  return formatDate(date);
}

/**
 * Renders a single historical WordPress comment.
 */
export default function CommentComponent({ comment }: CommentProps) {
  // Generate initials avatar from author name
  const initials = comment.author
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');

  // Sanitise content: strip HTML tags except simple formatting
  const plainText = comment.content
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '');

  const displayDate = safeDateDisplay(comment.date);
  // Only set dateTime attribute when the date is a valid ISO 8601 value
  const dateTimeAttr = /^\d{4}-\d{2}-\d{2}$/.test(comment.date ?? '')
    ? comment.date
    : undefined;

  return (
    <div className="flex gap-3">
      {/* Avatar */}
      <div className="shrink-0 w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-semibold text-gray-600 dark:text-gray-300 select-none">
        {initials || '?'}
      </div>

      {/* Body */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-baseline gap-2 mb-1">
          <span className="font-medium text-sm text-gray-900 dark:text-gray-100">
            {comment.author}
          </span>
          <time
            dateTime={dateTimeAttr}
            className="text-xs text-gray-400 dark:text-gray-500"
          >
            {displayDate}
          </time>
        </div>
        <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-words">
          {plainText}
        </p>
      </div>
    </div>
  );
}

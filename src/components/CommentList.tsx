import type { Comment } from '@/lib/types';
import CommentComponent from './Comment';

interface CommentListProps {
  comments: Comment[];
}

/**
 * Renders the list of historical WordPress comments for a post.
 */
export default function CommentList({ comments }: CommentListProps) {
  if (!comments || comments.length === 0) return null;

  return (
    <section className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
      <h2 className="text-lg font-semibold mb-1">
        Comments ({comments.length})
      </h2>
      <p className="text-xs text-gray-400 dark:text-gray-500 mb-6">
        Comments are from the original WordPress blog. New comments are not supported.
      </p>

      <div className="space-y-6">
        {comments.map((comment, i) => (
          <CommentComponent key={i} comment={comment} />
        ))}
      </div>
    </section>
  );
}

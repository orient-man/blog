interface QuotePostProps {
  /** The quote content (MDX body or any React children) */
  children: React.ReactNode;
}

/**
 * QuotePost — visual wrapper for posts with `format: "quote"`.
 *
 * Renders content in a large, styled blockquote with decorative
 * quotation marks and a distinct background/border treatment.
 */
export default function QuotePost({ children }: QuotePostProps) {
  return (
    <div className="relative my-6">
      {/* Decorative opening quotation mark */}
      <span
        aria-hidden="true"
        className="absolute -top-4 -left-2 text-7xl font-serif text-blue-200 dark:text-blue-900 select-none leading-none pointer-events-none"
      >
        &ldquo;
      </span>

      <blockquote className="relative pl-6 pr-4 py-4 border-l-4 border-blue-400 dark:border-blue-500 bg-blue-50 dark:bg-blue-950/30 rounded-r italic text-lg leading-relaxed text-gray-800 dark:text-gray-200">
        {children}
      </blockquote>

      {/* Decorative closing quotation mark */}
      <span
        aria-hidden="true"
        className="absolute -bottom-6 right-0 text-7xl font-serif text-blue-200 dark:text-blue-900 select-none leading-none pointer-events-none"
      >
        &rdquo;
      </span>
    </div>
  );
}

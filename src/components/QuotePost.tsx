interface QuotePostProps {
  /** The quote content (MDX body or any React children) */
  children: React.ReactNode;
}

/**
 * QuotePost — visual wrapper for posts with `format: "quote"`.
 *
 * Adds decorative quotation marks around the content.
 * Inner Markdown blockquotes provide their own visual treatment
 * via Tailwind Typography prose styles.
 */
export default function QuotePost({ children }: QuotePostProps) {
  return (
    <div className="relative my-6">
      {/* Decorative opening quotation mark */}
      <span
        aria-hidden="true"
        className="absolute -top-4 -left-2 text-7xl font-serif text-brand-200 dark:text-brand-900 select-none leading-none pointer-events-none"
      >
        &ldquo;
      </span>

      <div className="relative pl-8 pr-4">{children}</div>

      {/* Decorative closing quotation mark */}
      <span
        aria-hidden="true"
        className="absolute -bottom-6 right-0 text-7xl font-serif text-brand-200 dark:text-brand-900 select-none leading-none pointer-events-none"
      >
        &rdquo;
      </span>
    </div>
  );
}

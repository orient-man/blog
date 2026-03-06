interface StarRatingProps {
  rating: number;
  size?: "sm" | "md";
}

const SIZES = {
  sm: { star: "w-3.5 h-3.5", text: "text-xs" },
  md: { star: "w-5 h-5", text: "text-sm" },
} as const;

const STAR_PATH =
  "M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z";

function Star({
  variant,
  className,
}: {
  variant: "filled" | "half" | "empty";
  className: string;
}) {
  if (variant === "half") {
    // Overlay approach: empty star behind, half-filled star on top
    return (
      <span className={`relative inline-block ${className}`} aria-hidden="true">
        {/* Empty star (background) */}
        <svg
          className="w-full h-full text-gray-300 dark:text-gray-600"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d={STAR_PATH} />
        </svg>
        {/* Filled half (foreground, clipped to left 50%) */}
        <svg
          className="absolute inset-0 w-full h-full text-amber-400"
          viewBox="0 0 20 20"
          fill="currentColor"
          style={{ clipPath: "inset(0 50% 0 0)" }}
        >
          <path d={STAR_PATH} />
        </svg>
      </span>
    );
  }

  return (
    <svg
      className={`${className} ${
        variant === "filled"
          ? "text-amber-400"
          : "text-gray-300 dark:text-gray-600"
      }`}
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d={STAR_PATH} />
    </svg>
  );
}

/** Format the rating number: show "4" instead of "4.0", but keep "3.5". */
function formatRating(rating: number): string {
  return Number.isInteger(rating) ? String(rating) : rating.toFixed(1);
}

export function StarRating({ rating, size = "md" }: StarRatingProps) {
  const { star, text } = SIZES[size];
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

  return (
    <div className="inline-flex items-center gap-0.5">
      {/* Visually-hidden accessible label */}
      <span className="sr-only">Rating: {formatRating(rating)} out of 5</span>

      {/* Star icons */}
      {Array.from({ length: fullStars }, (_, i) => (
        <Star key={`full-${i}`} variant="filled" className={star} />
      ))}
      {hasHalf && <Star key="half" variant="half" className={star} />}
      {Array.from({ length: emptyStars }, (_, i) => (
        <Star key={`empty-${i}`} variant="empty" className={star} />
      ))}

      {/* Numeric label */}
      <span
        className={`${text} font-medium text-gray-600 dark:text-gray-400 ml-1`}
        aria-hidden="true"
      >
        {formatRating(rating)}
      </span>
    </div>
  );
}

/* eslint-disable @next/next/no-img-element -- static export, next/image optimisation unavailable */
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto py-12 px-4 text-center">
      {/* Scene — pixel art adventure game landscape */}
      <div
        className="relative mx-auto mb-8 h-48 sm:h-64 max-w-lg select-none"
        aria-hidden="true"
      >
        {/* Moon — top right */}
        <img
          src="/images/404/moon.png"
          alt=""
          width={64}
          height={64}
          className="absolute top-0 right-4 sm:right-8 w-12 sm:w-16 h-12 sm:h-16 image-pixelated"
        />
        {/* Tree — left side */}
        <img
          src="/images/404/tree.png"
          alt=""
          width={96}
          height={128}
          className="absolute bottom-0 left-0 sm:left-4 w-16 sm:w-24 h-auto image-pixelated"
        />
        {/* Adventurer — center */}
        <img
          src="/images/404/adventurer.png"
          alt=""
          width={64}
          height={64}
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-14 sm:w-16 h-14 sm:h-16 image-pixelated"
        />
        {/* Signpost — right side */}
        <img
          src="/images/404/signpost.png"
          alt=""
          width={64}
          height={80}
          className="absolute bottom-0 right-2 sm:right-8 w-12 sm:w-16 h-auto image-pixelated"
        />
        {/* Ground line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-current opacity-20" />
      </div>

      {/* Heading */}
      <h1 className="font-pixel text-5xl sm:text-6xl tracking-wide mb-2 text-[var(--accent)]">
        404
      </h1>

      {/* Adventure flavor text */}
      <p className="font-pixel text-lg sm:text-xl mb-6 leading-relaxed max-w-md mx-auto">
        You are in a dark forest. The path you followed has ended.
        <br />A weathered signpost points in every direction at once.
      </p>

      {/* Functional message */}
      <p className="text-sm text-[var(--muted)] mb-8">
        The page you are looking for does not exist or may have been moved.
      </p>

      {/* Navigation */}
      <nav className="flex flex-col sm:flex-row justify-center gap-4 text-sm">
        <Link
          href="/"
          className="inline-block font-pixel bevel-panel bevel-panel-interactive px-6 py-2 bg-[var(--accent)] text-[var(--bg)] hover:opacity-90 transition-opacity"
        >
          Return to camp
        </Link>
        <Link
          href="/search/"
          className="inline-block font-pixel bevel-panel bevel-panel-interactive px-6 py-2 bg-white dark:bg-gray-900 transition-opacity"
        >
          Search the archives
        </Link>
      </nav>
    </div>
  );
}

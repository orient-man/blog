import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="max-w-prose mx-auto text-center py-16">
      <h1 className="text-6xl font-bold text-gray-200 dark:text-gray-800 mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-4">Page not found</h2>
      <p className="text-gray-500 dark:text-gray-400 mb-8">
        The page you are looking for does not exist or may have been moved.
      </p>
      <nav className="flex justify-center gap-6 text-sm">
        <Link
          href="/"
          className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
        >
          Go home
        </Link>
        <Link
          href="/search/"
          className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 hover:border-blue-400 transition-colors"
        >
          Search posts
        </Link>
      </nav>
    </div>
  );
}

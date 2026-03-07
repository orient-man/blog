import type { Metadata } from "next";
import { Lora } from "next/font/google";
import Link from "next/link";

import "@/styles/globals.css";
import DarkModeToggle from "@/components/DarkModeToggle";
import Sidebar from "@/components/Sidebar";
import {
  getAllTags,
  getArchiveMonths,
  getBlogroll,
  getAllPosts,
  getCurrentlyReading,
} from "@/lib/content";

const lora = Lora({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-lora",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Just A Programmer",
    template: "%s | Just A Programmer",
  },
  description:
    "Don Quixote fighting entropy — a programming blog by Marcin Malinowski",
  openGraph: {
    siteName: "Just A Programmer",
    type: "website",
  },
  alternates: {
    types: {
      "application/rss+xml": "/feed.xml",
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const allTags = getAllTags();
  const archiveMonths = getArchiveMonths();
  const blogroll = getBlogroll();
  const recentPosts = getAllPosts().slice(0, 5);
  const currentlyReading = getCurrentlyReading();

  return (
    <html lang="en" className={lora.variable} suppressHydrationWarning>
      <head />
      <body className="bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100 antialiased">
        {/* Dark-mode init script — runs before paint to avoid flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var p=localStorage.getItem('theme');if(p==='dark'||(p==null&&window.matchMedia('(prefers-color-scheme:dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}})()`,
          }}
        />
        {/* Copy-button clipboard handler — event delegation, no external deps */}
        <script
          dangerouslySetInnerHTML={{
            __html: `document.addEventListener('click',function(e){var btn=e.target.closest('[data-copy-btn]');if(!btn)return;var pre=btn.closest('[data-rehype-pretty-code-figure]').querySelector('pre');navigator.clipboard&&navigator.clipboard.writeText(pre.innerText).then(function(){btn.setAttribute('data-copied','');setTimeout(function(){btn.removeAttribute('data-copied');},2000);});});`,
          }}
        />

        <div className="min-h-screen flex flex-col">
          {/* ── Top accent border ──────────────────────────────────────── */}
          <div className="h-1 w-full bg-brand-500" />

          {/* ── Header ─────────────────────────────────────────────────── */}
          <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
            <div className="max-w-5xl mx-auto px-4 py-6 flex items-center justify-between">
              <Link href="/" className="group block">
                <h1 className="text-2xl font-serif italic font-bold tracking-tight group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                  Just A Programmer
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                  ~ Don Quixote fighting entropy
                </p>
              </Link>
              <nav className="hidden sm:flex items-center gap-4 text-sm">
                <Link
                  href="/"
                  className="text-gray-600 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                >
                  Home
                </Link>
                <Link
                  href="/page/curriculum-vitae-pl/"
                  className="text-gray-600 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                >
                  CV
                </Link>
                <Link
                  href="/search/"
                  className="text-gray-600 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                >
                  Search
                </Link>
                <DarkModeToggle />
              </nav>
              <div className="sm:hidden flex items-center gap-4 text-sm">
                <Link
                  href="/"
                  className="text-gray-600 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                >
                  Home
                </Link>
                <Link
                  href="/page/curriculum-vitae-pl/"
                  className="text-gray-600 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                >
                  CV
                </Link>
                <Link
                  href="/search/"
                  className="text-gray-600 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                >
                  Search
                </Link>
                <DarkModeToggle />
              </div>
            </div>
          </header>

          {/* ── Main content + sidebar ──────────────────────────────────── */}
          <div className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
              {/* Main content */}
              <main className="flex-1 min-w-0">{children}</main>

              {/* Sidebar — hidden on mobile, shown on lg+ */}
              <div className="lg:w-64 xl:w-72 shrink-0">
                <Sidebar
                  allTags={allTags}
                  archiveMonths={archiveMonths}
                  blogroll={blogroll}
                  recentPosts={recentPosts}
                  currentlyReading={currentlyReading}
                />
              </div>
            </div>
          </div>

          {/* ── Footer ─────────────────────────────────────────────────── */}
          <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
            <div className="max-w-5xl mx-auto px-4 py-6 text-sm text-gray-500 dark:text-gray-400 flex flex-col sm:flex-row justify-between gap-2">
              <span>
                &copy; {new Date().getFullYear()} Marcin Malinowski. Migrated
                from WordPress.
              </span>
              <nav className="flex gap-4">
                <Link
                  href="/"
                  className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                >
                  Home
                </Link>
                <Link
                  href="/page/curriculum-vitae-pl/"
                  className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                >
                  CV
                </Link>
                <Link
                  href="/search/"
                  className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                >
                  Search
                </Link>
              </nav>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}

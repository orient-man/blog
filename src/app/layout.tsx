import type { Metadata } from "next";
import { IBM_Plex_Mono, Pixelify_Sans, VT323 } from "next/font/google";
import Link from "next/link";
import Script from "next/script";

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
import { siteConfig } from "@/lib/siteConfig";

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "700"],
  style: ["normal", "italic"],
  variable: "--font-ibm-plex-mono",
  display: "swap",
});

const pixelifySans = Pixelify_Sans({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-pixel",
  display: "swap",
});

const vt323 = VT323({
  subsets: ["latin", "latin-ext"],
  weight: "400",
  variable: "--font-terminal",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.title,
    template: siteConfig.titleTemplate,
  },
  description: siteConfig.description,
  icons: {
    icon: [
      {
        url: `https://www.gravatar.com/avatar/${siteConfig.gravatarHash}?s=16`,
        sizes: "16x16",
        type: "image/png",
      },
      {
        url: `https://www.gravatar.com/avatar/${siteConfig.gravatarHash}?s=32`,
        sizes: "32x32",
        type: "image/png",
      },
      {
        url: `https://www.gravatar.com/avatar/${siteConfig.gravatarHash}?s=192`,
        sizes: "192x192",
        type: "image/png",
      },
    ],
    shortcut: `https://www.gravatar.com/avatar/${siteConfig.gravatarHash}?s=32`,
    apple: `https://www.gravatar.com/avatar/${siteConfig.gravatarHash}?s=180`,
  },
  openGraph: {
    siteName: siteConfig.title,
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
    <html
      lang="en"
      className={`${ibmPlexMono.variable} ${pixelifySans.variable} ${vt323.variable}`}
      suppressHydrationWarning
    >
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

        {/* GoatCounter analytics — privacy-first, cookieless, GDPR-compliant */}
        <Script
          src="//gc.zgo.at/count.js"
          data-goatcounter={`https://${siteConfig.goatcounterId}.goatcounter.com/count`}
          strategy="afterInteractive"
        />

        <div className="min-h-screen flex flex-col">
          {/* ── Top accent border ──────────────────────────────────────── */}
          <div className="w-full dithered-accent-bar" />

          {/* ── Header ─────────────────────────────────────────────────── */}
          <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
            <div className="max-w-5xl mx-auto px-4 py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <Link href="/" className="group block">
                <h1 className="text-2xl font-pixel font-bold tracking-tight group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                  Just A
                  <span className="text-red-600 dark:text-red-400 font-normal">
                    I
                  </span>{" "}
                  Programmer
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                  {siteConfig.tagline}
                </p>
              </Link>
              <nav className="flex self-end mt-3 sm:mt-0 items-center gap-4 text-sm">
                <Link
                  href="/"
                  className="font-pixel bevel-panel bevel-panel-interactive px-3 py-1 text-gray-600 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors bg-white dark:bg-gray-900"
                >
                  Home
                </Link>
                <Link
                  href="/page/curriculum-vitae/"
                  className="font-pixel bevel-panel bevel-panel-interactive px-3 py-1 text-gray-600 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors bg-white dark:bg-gray-900"
                >
                  CV
                </Link>
                <Link
                  href="/search/"
                  className="font-pixel bevel-panel bevel-panel-interactive px-3 py-1 text-gray-600 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors bg-white dark:bg-gray-900"
                >
                  Search
                </Link>
                <DarkModeToggle />
              </nav>
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
            <div className="max-w-5xl mx-auto px-4 py-6 text-sm text-gray-500 dark:text-gray-400 flex flex-col gap-2">
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element -- static export, next/image optimisation unavailable */}
                <img
                  src="/images/decorations/footer-lantern.png"
                  alt=""
                  aria-hidden="true"
                  width={32}
                  height={32}
                  className="image-pixelated hidden sm:block"
                />
                <span className="font-terminal text-base text-[var(--accent)] opacity-70">
                  visitor@blog.orientman.com:~${" "}
                  <span className="animate-pulse">_</span>
                </span>
                {/* eslint-disable-next-line @next/next/no-img-element -- static export, next/image optimisation unavailable */}
                <img
                  src="/images/decorations/footer-potion.png"
                  alt=""
                  aria-hidden="true"
                  width={32}
                  height={32}
                  className="image-pixelated hidden sm:block"
                />
              </div>
              <div className="flex flex-col sm:flex-row justify-between gap-2">
                <span>
                  &copy; 2011&ndash;{new Date().getFullYear()}{" "}
                  {siteConfig.author}
                </span>
                <nav className="flex gap-4">
                  <Link
                    href="/"
                    className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                  >
                    Home
                  </Link>
                  <Link
                    href="/page/curriculum-vitae/"
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
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}

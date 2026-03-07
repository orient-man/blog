"use client";

import Giscus from "@giscus/react";
import { useEffect, useRef, useState } from "react";

import { siteConfig } from "@/lib/siteConfig";

/**
 * Lazy-loaded Giscus comment widget with dark mode synchronisation.
 *
 * - Uses IntersectionObserver (200px rootMargin) to defer loading until the
 *   reader scrolls near the comment section.
 * - Uses MutationObserver on `<html>` to track the `dark` class and keep the
 *   Giscus theme in sync with the site's dark mode toggle.
 */
export default function GiscusComments() {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  // Lazy loading via IntersectionObserver
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  // Dark mode sync via MutationObserver on <html> class
  useEffect(() => {
    const html = document.documentElement;

    const syncTheme = () => {
      setTheme(html.classList.contains("dark") ? "dark" : "light");
    };

    // Set initial theme
    syncTheme();

    const observer = new MutationObserver(syncTheme);
    observer.observe(html, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const { giscus } = siteConfig;

  return (
    <section className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
      <h2 className="text-xl font-bold font-serif mb-6">Comments</h2>
      <div ref={sentinelRef}>
        {isVisible && (
          <Giscus
            repo={giscus.repo as `${string}/${string}`}
            repoId={giscus.repoId}
            category={giscus.category}
            categoryId={giscus.categoryId}
            mapping="pathname"
            reactionsEnabled="1"
            inputPosition="top"
            theme={theme}
            loading="lazy"
            lang="en"
          />
        )}
      </div>
    </section>
  );
}

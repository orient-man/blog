"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect, useCallback } from "react";

/**
 * Reads the 1-based `?page=N` URL search parameter and returns a 0-based
 * `[page, setPage]` tuple — a drop-in replacement for `useState(0)`.
 *
 * - Reacts to URL changes via Next.js `useSearchParams`, so client-side
 *   navigations (e.g. clicking the site title `<Link href="/">`) correctly
 *   reset to the first page.
 * - On `setPage`, updates internal state **and** writes the URL via
 *   `history.replaceState` (no new history entry).
 * - Removes the `?page` param entirely when the page is 0 (first page)
 *   so the default URL stays clean.
 */
export function usePageParam(
  totalPages: number,
): [page: number, setPage: (page: number) => void] {
  const searchParams = useSearchParams();
  const [page, setPageInternal] = useState(0);

  // --- T1.2  Sync from URL ?page=N (reactive to navigation) -----------------
  useEffect(() => {
    const raw = searchParams.get("page");

    if (raw === null) {
      // no param → first page
      // eslint-disable-next-line react-hooks/set-state-in-effect -- sync from URL params
      setPageInternal(0);
      return;
    }

    const parsed = Number(raw);

    // --- T1.3  Clamp invalid values ------------------------------------------
    if (Number.isNaN(parsed) || !Number.isFinite(parsed) || parsed < 1) {
      // non-numeric, zero, negative → first page
      setPageInternal(0);
      return;
    }

    // Convert 1-based URL value to 0-based internal, clamped to valid range
    const clamped = Math.min(Math.round(parsed) - 1, totalPages - 1);

    setPageInternal(Math.max(0, clamped));
  }, [searchParams, totalPages]);

  // --- T1.4  Write URL via history.replaceState ------------------------------
  const setPage = useCallback(
    (next: number) => {
      // Clamp to valid range
      const clamped = Math.max(0, Math.min(next, totalPages - 1));
      setPageInternal(clamped);

      const url = new URL(window.location.href);

      if (clamped === 0) {
        // Page 1 → remove param for clean URL
        url.searchParams.delete("page");
      } else {
        // 0-based → 1-based for URL
        url.searchParams.set("page", String(clamped + 1));
      }

      window.history.replaceState(null, "", url.toString());
    },
    [totalPages],
  );

  return [page, setPage];
}

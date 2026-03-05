"use client";

import { useState, useEffect, useCallback } from "react";

/**
 * Reads the 1-based `?page=N` URL search parameter and returns a 0-based
 * `[page, setPage]` tuple — a drop-in replacement for `useState(0)`.
 *
 * - On mount, reads `window.location.search` and clamps the value to
 *   `[0, totalPages - 1]`.
 * - On `setPage`, updates internal state **and** writes the URL via
 *   `history.replaceState` (no new history entry).
 * - Removes the `?page` param entirely when the page is 0 (first page)
 *   so the default URL stays clean.
 */
export function usePageParam(
  totalPages: number,
): [page: number, setPage: (page: number) => void] {
  const [page, setPageInternal] = useState(0);

  // --- T1.2  Read ?page=N on mount -------------------------------------------
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const raw = params.get("page");

    if (raw === null) return; // no param → stay on page 0

    const parsed = Number(raw);

    // --- T1.3  Clamp invalid values ------------------------------------------
    if (Number.isNaN(parsed) || !Number.isFinite(parsed) || parsed < 1) {
      // non-numeric, zero, negative → first page
      // eslint-disable-next-line react-hooks/set-state-in-effect -- initialisation from URL params
      setPageInternal(0);
      return;
    }

    // Convert 1-based URL value to 0-based internal, clamped to valid range
    const clamped = Math.min(Math.round(parsed) - 1, totalPages - 1);

    setPageInternal(Math.max(0, clamped));
  }, [totalPages]);

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

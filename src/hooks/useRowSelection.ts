import { useState, useCallback, useRef } from 'react';
import type { Artwork } from '../types/artwork';

export function useRowSelection() {
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  // Tracks how many more rows still need to be auto-selected on future pages.
  // Using a ref so it doesn't cause extra renders but persists across navigations.
  const pendingCountRef = useRef<number>(0);

  const isSelected = useCallback(
    (id: number): boolean => selectedIds.has(id),
    [selectedIds]
  );

  const toggleRow = useCallback((id: number): void => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const togglePageRows = useCallback(
    (pageRows: Artwork[], selectAll: boolean): void => {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        for (const row of pageRows) {
          if (selectAll) {
            next.add(row.id);
          } else {
            next.delete(row.id);
          }
        }
        return next;
      });
    },
    []
  );

  /**
   * Select n rows starting from the current page.
   * - If n <= currentPageRows.length → select the first n rows on this page.
   * - If n > currentPageRows.length  → select ALL rows on this page and store
   *   the remainder in pendingCountRef so future pages auto-select rows.
   * NO API calls. NO pre-fetching.
   */
  const selectNRows = useCallback(
    (n: number, currentPageRows: Artwork[]): void => {
      const toSelect = Math.min(n, currentPageRows.length);
      const remaining = Math.max(0, n - currentPageRows.length);

      pendingCountRef.current = remaining;

      setSelectedIds((prev) => {
        const next = new Set(prev);
        for (let i = 0; i < toSelect; i++) {
          next.add(currentPageRows[i].id);
        }
        return next;
      });
    },
    []
  );

  /**
   * Called after new page data loads.
   * If there are pending selections, auto-select rows on this page and
   * decrement the counter. No API calls involved.
   */
  const applyPendingSelections = useCallback(
    (pageRows: Artwork[]): void => {
      if (pendingCountRef.current <= 0) return;

      const toSelect = Math.min(pendingCountRef.current, pageRows.length);
      pendingCountRef.current -= toSelect;

      setSelectedIds((prev) => {
        const next = new Set(prev);
        for (let i = 0; i < toSelect; i++) {
          next.add(pageRows[i].id);
        }
        return next;
      });
    },
    []
  );

  const clearAll = useCallback((): void => {
    pendingCountRef.current = 0;
    setSelectedIds(new Set());
  }, []);

  const getSelectionForPage = useCallback(
    (pageRows: Artwork[]): Artwork[] => {
      return pageRows.filter((row) => selectedIds.has(row.id));
    },
    [selectedIds]
  );

  return {
    selectedIds,
    isSelected,
    toggleRow,
    togglePageRows,
    selectNRows,
    applyPendingSelections,
    clearAll,
    getSelectionForPage,
  };
}

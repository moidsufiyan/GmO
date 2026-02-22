import { useState, useCallback, useRef } from 'react';
import type { Artwork } from '../types/artwork';

export function useRowSelection() {
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
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

  const selectNRows = useCallback(
    (n: number, currentPageRows: Artwork[]): void => {
      const count = Math.min(n, currentPageRows.length);
      const leftover = n - currentPageRows.length;
      pendingCountRef.current = leftover > 0 ? leftover : 0;

      setSelectedIds((prev) => {
        const next = new Set(prev);
        for (let i = 0; i < count; i++) {
          next.add(currentPageRows[i].id);
        }
        return next;
      });
    },
    []
  );

  // TODO: maybe show a toast when pending selections finish
  const applyPendingSelections = useCallback(
    (pageRows: Artwork[]): void => {
      if (pendingCountRef.current <= 0) return;

      const count = Math.min(pendingCountRef.current, pageRows.length);
      pendingCountRef.current -= count;

      setSelectedIds((prev) => {
        const next = new Set(prev);
        for (let i = 0; i < count; i++) {
          next.add(pageRows[i].id);
        }
        return next;
      });
    },
    []
  );

  function clearAll(): void {
    pendingCountRef.current = 0;
    setSelectedIds(new Set());
  }

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

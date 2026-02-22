import { useState, useCallback } from 'react';
import type { Artwork } from '../types/artwork';

export function useRowSelection() {
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

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
    (
      n: number,
      currentPageRows: Artwork[],
      currentPage: number,
      _totalRows: number
    ): void => {
      void _totalRows;
      setSelectedIds((prev) => {
        const next = new Set(prev);
        const rowsPerPage = currentPageRows.length;

        if (n <= rowsPerPage) {
          for (let i = 0; i < n; i++) {
            next.add(currentPageRows[i].id);
          }
        } else {
          // Select all rows on the current page
          for (const row of currentPageRows) {
            next.add(row.id);
          }

          // Add placeholder IDs for rows on future pages
          const remaining = n - rowsPerPage;
          for (let i = 0; i < remaining; i++) {
            const page = currentPage + 1 + Math.floor(i / rowsPerPage);
            const rowIndex = i % rowsPerPage;
            const placeholderId = page * rowsPerPage + rowIndex;
            next.add(placeholderId);
          }
        }

        return next;
      });
    },
    []
  );

  const clearAll = useCallback((): void => {
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
    clearAll,
    getSelectionForPage,
  };
}

import { useState, useEffect, useCallback } from 'react';
import { fetchArtworks } from './services/artworkService';
import { useRowSelection } from './hooks/useRowSelection';
import type { Artwork } from './types/artwork';
import ArtworkTable from './components/ArtworkTable';
import CustomSelectionPanel from './components/CustomSelectionPanel';
import ArtworkPaginator from './components/ArtworkPaginator';
import './App.css';

const PAGE_SIZE = 12;

function App() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const { selectedIds, toggleRow, togglePageRows, selectNRows, applyPendingSelections } =
    useRowSelection();

  const loadPage = useCallback(async (p: number) => {
    setLoading(true);
    try {
      const res = await fetchArtworks(p);
      setArtworks(res.data);
      setTotal(res.pagination.total);
      applyPendingSelections(res.data);
    } catch (err) {
      console.error('fetch failed', err);
    } finally {
      setLoading(false);
    }
  }, [applyPendingSelections]);

  useEffect(() => { loadPage(page); }, [page, loadPage]);

  return (
    <div className="app-container">
      <h1 className="app-title">Artwork Data Table</h1>

      <div className="selection-banner">
        Selected: <span className="selection-count">{selectedIds.size}</span> row{selectedIds.size !== 1 ? 's' : ''}
      </div>

      <div className="table-wrapper">
        <ArtworkTable
          artworks={artworks}
          loading={loading}
          selectedIds={selectedIds}
          onRowToggle={toggleRow}
          onSelectAll={togglePageRows}
          headerControl={
            <CustomSelectionPanel onSubmit={(n) => selectNRows(n, artworks)} />
          }
        />
      </div>

      <ArtworkPaginator
        currentPage={page - 1}
        totalRecords={total}
        rowsPerPage={PAGE_SIZE}
        onPageChange={setPage}
      />
    </div>
  );
}

export default App;

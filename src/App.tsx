import { useEffect, useState, useCallback } from 'react';
import type { Artwork } from './types/artwork';
import { fetchArtworks } from './services/artworkService';
import { useRowSelection } from './hooks/useRowSelection';
import ArtworkTable from './components/ArtworkTable';
import ArtworkPaginator from './components/ArtworkPaginator';
import CustomSelectionPanel from './components/CustomSelectionPanel';
import './App.css';

const ROWS_PER_PAGE = 12;

function App() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  const {
    selectedIds,
    toggleRow,
    togglePageRows,
    selectNRows,
  } = useRowSelection();

  const loadPage = useCallback(async (page: number) => {
    setLoading(true);
    try {
      const response = await fetchArtworks(page);
      setArtworks(response.data);
      setTotalRecords(response.pagination.total);
    } catch (err) {
      console.error('Failed to fetch artworks:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPage(currentPage);
  }, [currentPage, loadPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSelectN = (n: number) => {
    selectNRows(n, artworks, currentPage, totalRecords);
  };

  return (
    <div className="app-container">
      <h1 className="app-title">Artwork Data Table</h1>

      <div className="table-wrapper">
        <ArtworkTable
          artworks={artworks}
          loading={loading}
          selectedIds={selectedIds}
          onRowToggle={toggleRow}
          onSelectAll={togglePageRows}
          headerControl={<CustomSelectionPanel onSubmit={handleSelectN} />}
        />
      </div>

      <ArtworkPaginator
        currentPage={currentPage - 1}
        totalRecords={totalRecords}
        rowsPerPage={ROWS_PER_PAGE}
        onPageChange={handlePageChange}
      />
    </div>
  );
}

export default App;

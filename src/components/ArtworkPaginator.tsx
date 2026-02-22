import { Paginator, type PaginatorPageChangeEvent } from 'primereact/paginator';

interface ArtworkPaginatorProps {
  currentPage: number;
  totalRecords: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
}

export default function ArtworkPaginator({
  currentPage,
  totalRecords,
  rowsPerPage,
  onPageChange,
}: ArtworkPaginatorProps) {
  const first = currentPage * rowsPerPage;

  const handlePageChange = (e: PaginatorPageChangeEvent) => {
    const newPage = e.page + 1; // convert 0-indexed to 1-indexed
    onPageChange(newPage);
  };

  return (
    <Paginator
      first={first}
      rows={rowsPerPage}
      totalRecords={totalRecords}
      onPageChange={handlePageChange}
    />
  );
}

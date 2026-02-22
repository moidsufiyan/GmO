import { Paginator, type PaginatorPageChangeEvent } from 'primereact/paginator';

interface Props {
  currentPage: number;
  totalRecords: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
}

export default function ArtworkPaginator({ currentPage, totalRecords, rowsPerPage, onPageChange }: Props) {
  const first = currentPage * rowsPerPage;

  return (
    <Paginator
      first={first}
      rows={rowsPerPage}
      totalRecords={totalRecords}
      pageLinkSize={7}
      onPageChange={(e: PaginatorPageChangeEvent) => onPageChange(e.page + 1)}
    />
  );
}

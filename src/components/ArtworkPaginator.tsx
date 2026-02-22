import { Paginator, type PaginatorPageChangeEvent } from 'primereact/paginator';

interface Props {
  currentPage: number;
  totalRecords: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
}

export default function ArtworkPaginator({ currentPage, totalRecords, rowsPerPage, onPageChange }: Props) {
  const first = currentPage * rowsPerPage;
  const from = first + 1;
  const to = Math.min(first + rowsPerPage, totalRecords);

  return (
    <div className="paginator-bar">
      <span className="paginator-info">
        Showing <b>{from}</b> to <b>{to}</b> of <b>{totalRecords.toLocaleString()}</b> entries
      </span>
      <Paginator
        first={first}
        rows={rowsPerPage}
        totalRecords={totalRecords}
        pageLinkSize={5}
        prevPageLinkIcon={<span>Previous</span>}
        nextPageLinkIcon={<span>Next</span>}
        firstPageLinkIcon={null}
        lastPageLinkIcon={null}
        onPageChange={(e: PaginatorPageChangeEvent) => onPageChange(e.page + 1)}
      />
    </div>
  );
}

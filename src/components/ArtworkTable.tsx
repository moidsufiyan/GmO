import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import type { Artwork } from '../types/artwork';

interface ArtworkTableProps {
  artworks: Artwork[];
  loading: boolean;
  selectedIds: Set<number>;
  onRowToggle: (id: number) => void;
  onSelectAll: (rows: Artwork[], checked: boolean) => void;
}

const ellipsisStyle: React.CSSProperties = {
  maxWidth: '200px',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
};

export default function ArtworkTable({
  artworks,
  loading,
  selectedIds,
  onRowToggle,
  onSelectAll,
}: ArtworkTableProps) {
  const selectedRows = artworks.filter((row) => selectedIds.has(row.id));

  return (
    <DataTable
      value={artworks}
      loading={loading}
      selectionMode="checkbox"
      selection={selectedRows}
      onSelectionChange={(e) => {
        const incoming = e.value as Artwork[];
        // Determine if a single row was toggled or the header checkbox was used
        if (incoming.length === artworks.length) {
          // Header "select all" was checked
          onSelectAll(artworks, true);
        } else if (incoming.length === 0) {
          // Header "deselect all" was clicked
          onSelectAll(artworks, false);
        } else {
          // Single row toggle — find the diff
          const incomingIds = new Set(incoming.map((r) => r.id));
          for (const row of artworks) {
            const wasSelected = selectedIds.has(row.id);
            const isNowSelected = incomingIds.has(row.id);
            if (wasSelected !== isNowSelected) {
              onRowToggle(row.id);
              return;
            }
          }
        }
      }}
      dataKey="id"
      tableStyle={{ minWidth: '60rem' }}
    >
      <Column
        selectionMode="multiple"
        headerStyle={{ width: '3rem' }}
      />
      <Column field="title" header="Title" style={ellipsisStyle} />
      <Column
        field="place_of_origin"
        header="Place of Origin"
        style={ellipsisStyle}
      />
      <Column
        field="artist_display"
        header="Artist Display"
        style={ellipsisStyle}
      />
      <Column
        field="inscriptions"
        header="Inscriptions"
        style={ellipsisStyle}
      />
      <Column field="date_start" header="Date Start" />
      <Column field="date_end" header="Date End" />
    </DataTable>
  );
}

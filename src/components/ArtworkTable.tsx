import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import type { ReactNode } from 'react';
import type { Artwork } from '../types/artwork';

interface ArtworkTableProps {
  artworks: Artwork[];
  loading: boolean;
  selectedIds: Set<number>;
  onRowToggle: (id: number) => void;
  onSelectAll: (rows: Artwork[], checked: boolean) => void;
  headerControl?: ReactNode;
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
  headerControl,
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
        const incomingIds = new Set(incoming.map((r) => r.id));

        // Header checkbox: select all or deselect all
        if (incoming.length === artworks.length && !artworks.every((r) => selectedIds.has(r.id))) {
          onSelectAll(artworks, true);
          return;
        }
        if (incoming.length === 0 && artworks.some((r) => selectedIds.has(r.id))) {
          onSelectAll(artworks, false);
          return;
        }

        // Single row toggle — find the changed row
        for (const row of artworks) {
          const wasSelected = selectedIds.has(row.id);
          const isNowSelected = incomingIds.has(row.id);
          if (wasSelected !== isNowSelected) {
            onRowToggle(row.id);
            return;
          }
        }
      }}
      dataKey="id"
      tableStyle={{ minWidth: '60rem' }}
    >
      <Column
        selectionMode="multiple"
        headerStyle={{ width: '5.5rem' }}
        headerClassName="selection-column-header"
        header={
          headerControl ? (
            <div className="selection-header-content">{headerControl}</div>
          ) : undefined
        }
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

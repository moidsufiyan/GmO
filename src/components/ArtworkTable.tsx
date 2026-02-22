import { DataTable } from 'primereact/datatable';
import type { Artwork } from '../types/artwork';
import { Column } from 'primereact/column';
import type { ReactNode } from 'react';

interface ArtworkTableProps {
  artworks: Artwork[];
  loading: boolean;
  selectedIds: Set<number>;
  onRowToggle: (id: number) => void;
  onSelectAll: (rows: Artwork[], checked: boolean) => void;
  headerControl?: ReactNode;
}

const truncate: React.CSSProperties = {
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
  const selected = artworks.filter((a) => selectedIds.has(a.id));

  return (
    <DataTable
      value={artworks}
      loading={loading}
      selectionMode="checkbox"
      selection={selected}
      onSelectionChange={(e) => {
        const incoming = e.value as Artwork[];
        const incomingIds = new Set(incoming.map((r) => r.id));

        if (incoming.length === artworks.length && !artworks.every((r) => selectedIds.has(r.id))) {
          onSelectAll(artworks, true);
          return;
        }
        if (incoming.length === 0 && artworks.some((r) => selectedIds.has(r.id))) {
          onSelectAll(artworks, false);
          return;
        }

        for (let i = 0; i < artworks.length; i++) {
          const row = artworks[i];
          if (selectedIds.has(row.id) !== incomingIds.has(row.id)) {
            onRowToggle(row.id);
            break;
          }
        }
      }}
      dataKey="id"
      tableStyle={{ minWidth: '60rem' }}
    >
      <Column
        selectionMode="multiple"
        headerClassName="selection-column-header"
        bodyClassName="selection-column-body"
        style={{ width: '50px' }}
        header={
          headerControl ? (
            <div className="selection-header-content">{headerControl}</div>
          ) : undefined
        }
      />
      <Column field="title" header="Title" style={truncate} />
      <Column field="place_of_origin" header="Place of Origin" style={truncate} />
      <Column field="artist_display" header="Artist Display" style={truncate} />
      <Column field="inscriptions" header="Inscriptions" style={truncate} />
      <Column field="date_start" header="Date Start" />
      <Column field="date_end" header="Date End" />
    </DataTable>
  );
}

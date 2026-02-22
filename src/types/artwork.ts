export interface Artwork {
  id: number;
  title: string;
  place_of_origin: string;
  artist_display: string;
  inscriptions: string;
  date_start: number;
  date_end: number;
}

export interface Pagination {
  total: number;
  limit: number;
  offset: number;
  total_pages: number;
  current_page: number;
}

// could probably just inline this but keeping it here for now
export interface ApiResponse {
  data: Artwork[];
  pagination: Pagination;
}

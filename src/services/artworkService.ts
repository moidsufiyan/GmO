import type { ApiResponse } from '../types/artwork';

export async function fetchArtworks(page: number): Promise<ApiResponse> {
  const res = await fetch(`https://api.artic.edu/api/v1/artworks?page=${page}&limit=12`);
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  const data: ApiResponse = await res.json();
  return data;
}

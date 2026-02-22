import type { ApiResponse } from '../types/artwork';

export async function fetchArtworks(page: number): Promise<ApiResponse> {
  const response = await fetch(
    `https://api.artic.edu/api/v1/artworks?page=${page}&limit=12`
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data: ApiResponse = await response.json();
  return data;
}

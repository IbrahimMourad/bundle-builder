import type { CatalogResponse } from '@/types/catalog'

export async function fetchCatalog(): Promise<CatalogResponse> {
  const response = await fetch('/api/catalog')

  if (!response.ok) {
    throw new Error(`Failed to fetch catalog: ${response.status}`)
  }

  return response.json() as Promise<CatalogResponse>
}

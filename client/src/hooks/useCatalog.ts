import { useQuery } from '@tanstack/react-query'
import { fetchCatalog } from '@/api/catalog'

export function useCatalog() {
  return useQuery({
    queryKey: ['catalog'],
    queryFn: fetchCatalog,
    staleTime: 5 * 60 * 1000,
  })
}

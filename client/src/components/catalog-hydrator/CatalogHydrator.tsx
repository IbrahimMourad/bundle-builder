import { useEffect } from 'react'
import { useCatalog } from '@/hooks/useCatalog'
import { useBundleStore } from '@/stores/useBundleStore'

export function CatalogHydrator() {
  const { data, isSuccess } = useCatalog()
  const hasHydrated = useBundleStore((state) => state.hasHydrated)
  const hydrateFromCatalog = useBundleStore((state) => state.hydrateFromCatalog)

  useEffect(() => {
    if (isSuccess && data && !hasHydrated) {
      hydrateFromCatalog(data)
    }
  }, [isSuccess, data, hasHydrated, hydrateFromCatalog])

  return null
}

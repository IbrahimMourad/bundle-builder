import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, type RenderOptions } from '@testing-library/react'
import type { ReactElement, ReactNode } from 'react'
import { useBundleStore } from '@/stores/useBundleStore'
import { mockCatalog } from '@/test/fixtures/mockCatalog'
import type { CatalogResponse } from '@/types/catalog'

export interface RenderWithProvidersOptions extends Omit<RenderOptions, 'wrapper'> {
  catalog?: CatalogResponse
  hydrate?: boolean
}

export function createTestQueryClient(catalog: CatalogResponse) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, staleTime: Infinity },
    },
  })
  queryClient.setQueryData(['catalog'], catalog)
  return queryClient
}

export function renderWithProviders(
  ui: ReactElement,
  {
    catalog = mockCatalog,
    hydrate = true,
    ...renderOptions
  }: RenderWithProvidersOptions = {},
) {
  useBundleStore.getState().reset()

  if (hydrate) {
    useBundleStore.getState().hydrateFromCatalog(catalog)
  }

  const queryClient = createTestQueryClient(catalog)

  function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  }

  return {
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
    queryClient,
  }
}

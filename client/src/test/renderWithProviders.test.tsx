import { describe, expect, it } from 'vitest'
import { mockCatalog } from '@/test/fixtures/mockCatalog'
import { createTestQueryClient, renderWithProviders } from '@/test/renderWithProviders'
import { useBundleStore } from '@/stores/useBundleStore'
import { Accordion } from '@/components/builder/accordion/Accordion'

describe('renderWithProviders', () => {
  it('seeds the catalog query and hydrates the bundle store by default', () => {
    const { queryClient } = renderWithProviders(<Accordion />)

    expect(queryClient.getQueryData(['catalog'])).toEqual(mockCatalog)
    expect(useBundleStore.getState().hasHydrated).toBe(true)
    expect(useBundleStore.getState().quantities['prod-cam-v4:var-white']).toBe(1)
  })

  it('can skip hydration when testing pre-hydrated state', () => {
    renderWithProviders(<Accordion />, { hydrate: false })

    expect(useBundleStore.getState().hasHydrated).toBe(false)
  })

  it('creates an isolated query client with catalog data', () => {
    const queryClient = createTestQueryClient(mockCatalog)

    expect(queryClient.getQueryData(['catalog'])).toEqual(mockCatalog)
  })
})

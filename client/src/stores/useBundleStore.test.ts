import { beforeEach, describe, expect, it } from 'vitest'
import { mockCatalog } from '@/test/fixtures/mockCatalog'
import { useBundleStore } from './useBundleStore'

describe('useBundleStore', () => {
  beforeEach(() => {
    useBundleStore.getState().reset()
  })

  it('hydrates from catalog initial selections', () => {
    useBundleStore.getState().hydrateFromCatalog(mockCatalog)

    const state = useBundleStore.getState()
    expect(state.hasHydrated).toBe(true)
    expect(state.activeStep).toBe(1)
    expect(state.quantities['prod-cam-v4:var-white']).toBe(1)
    expect(state.selectedVariantByProduct['prod-cam-v4']).toBe('var-white')
  })

  it('does not re-hydrate after the first catalog load', () => {
    useBundleStore.getState().hydrateFromCatalog(mockCatalog)
    useBundleStore.getState().setActiveStep(2)
    useBundleStore.getState().hydrateFromCatalog(mockCatalog)

    expect(useBundleStore.getState().activeStep).toBe(2)
  })

  it('isolates quantity per variant key', () => {
    useBundleStore.getState().hydrateFromCatalog(mockCatalog)

    useBundleStore.getState().setQuantity('prod-cam-v4:var-white', 2)
    useBundleStore.getState().setSelectedVariant('prod-cam-v4', 'var-black')
    useBundleStore.getState().setQuantity('prod-cam-v4:var-black', 1)

    expect(useBundleStore.getState().quantities['prod-cam-v4:var-white']).toBe(2)
    expect(useBundleStore.getState().quantities['prod-cam-v4:var-black']).toBe(1)
  })

  it('removes selection keys when quantity is zero', () => {
    useBundleStore.getState().hydrateFromCatalog(mockCatalog)
    useBundleStore.getState().setQuantity('prod-cam-v4:var-white', 0)

    expect(useBundleStore.getState().quantities['prod-cam-v4:var-white']).toBeUndefined()
  })

  it('updates active step', () => {
    useBundleStore.getState().setActiveStep(3)
    expect(useBundleStore.getState().activeStep).toBe(3)
  })
})

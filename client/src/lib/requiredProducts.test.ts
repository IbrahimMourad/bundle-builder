import { describe, expect, it } from 'vitest'
import seedCatalogJson from '@/test/fixtures/seedCatalog.json'
import type { CatalogResponse } from '@/types/catalog'
import {
  buildRequiredSelectionKeys,
  enforceRequiredQuantities,
  getRequiredSelectionKey,
} from './requiredProducts'

const seedCatalog = seedCatalogJson as CatalogResponse

describe('requiredProducts', () => {
  it('uses default selection key for required products without variants', () => {
    const hub = seedCatalog.products.find((product) => product.slug === 'sense-hub')
    expect(hub).toBeDefined()
    expect(getRequiredSelectionKey(hub!)).toBe(
      'b0000001-0001-4000-8000-000000000008:default',
    )
  })

  it('builds required selection keys from catalog', () => {
    const keys = buildRequiredSelectionKeys(seedCatalog)
    expect(keys.has('b0000001-0001-4000-8000-000000000008:default')).toBe(true)
  })

  it('forces required products to quantity 1', () => {
    const quantities = enforceRequiredQuantities({}, seedCatalog)
    expect(quantities['b0000001-0001-4000-8000-000000000008:default']).toBe(1)
  })
})

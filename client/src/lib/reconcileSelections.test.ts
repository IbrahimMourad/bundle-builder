import { describe, expect, it } from 'vitest'
import { reconcileSelections } from './reconcileSelections'
import { mockCatalog } from '@/test/fixtures/mockCatalog'
import seedCatalogJson from '@/test/fixtures/seedCatalog.json'
import type { CatalogResponse } from '@/types/catalog'

describe('reconcileSelections', () => {
  it('keeps valid selection keys', () => {
    const result = reconcileSelections(
      {
        quantities: {
          'prod-cam-v4:var-white': 1,
          'prod-pan:default': 2,
        },
        selectedVariantByProduct: { 'prod-cam-v4': 'var-white' },
      },
      mockCatalog,
    )

    expect(result.quantities['prod-cam-v4:var-white']).toBe(1)
    expect(result.quantities['prod-pan:default']).toBe(2)
    expect(result.selectedVariantByProduct['prod-cam-v4']).toBe('var-white')
  })

  it('drops stale product keys', () => {
    const result = reconcileSelections(
      {
        quantities: {
          'ghost-prod:default': 1,
          'prod-cam-v4:var-white': 1,
        },
        selectedVariantByProduct: {},
      },
      mockCatalog,
    )

    expect(result.quantities['ghost-prod:default']).toBeUndefined()
    expect(result.quantities['prod-cam-v4:var-white']).toBe(1)
  })

  it('drops stale variant keys', () => {
    const result = reconcileSelections(
      {
        quantities: {
          'prod-cam-v4:var-ghost': 2,
        },
        selectedVariantByProduct: { 'prod-cam-v4': 'var-ghost' },
      },
      mockCatalog,
    )

    expect(result.quantities['prod-cam-v4:var-ghost']).toBeUndefined()
    expect(result.selectedVariantByProduct['prod-cam-v4']).toBe('var-white')
  })

  it('repairs stale active variant pointers to first variant', () => {
    const result = reconcileSelections(
      {
        quantities: { 'prod-cam-v4:var-white': 1 },
        selectedVariantByProduct: { 'prod-cam-v4': 'var-ghost' },
      },
      mockCatalog,
    )

    expect(result.selectedVariantByProduct['prod-cam-v4']).toBe('var-white')
  })

  it('restores required products at quantity 1', () => {
    const result = reconcileSelections(
      {
        quantities: {},
        selectedVariantByProduct: {},
      },
      seedCatalogJson as CatalogResponse,
    )

    expect(result.quantities['b0000001-0001-4000-8000-000000000008:default']).toBe(1)
  })

  it('migrates legacy default variant keys to the white variant', () => {
    const result = reconcileSelections(
      {
        quantities: {
          'b0000001-0001-4000-8000-000000000002:default': 2,
        },
        selectedVariantByProduct: {},
      },
      seedCatalogJson as CatalogResponse,
    )

    expect(result.quantities['b0000001-0001-4000-8000-000000000002:default']).toBeUndefined()
    expect(
      result.quantities['b0000001-0001-4000-8000-000000000002:c0000001-0001-4000-8000-000000000004'],
    ).toBe(2)
  })
})

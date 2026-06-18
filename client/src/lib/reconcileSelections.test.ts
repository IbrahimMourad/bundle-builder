import { describe, expect, it } from 'vitest'
import { reconcileSelections } from './reconcileSelections'
import { mockCatalog } from '@/test/fixtures/mockCatalog'

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
})

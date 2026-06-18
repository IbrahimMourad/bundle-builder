import { describe, expect, it } from 'vitest'
import { getDistinctSelectedCountPerStep, getReviewLineItems, getTotals } from './pricing'
import seedCatalogJson from '@/test/fixtures/seedCatalog.json'
import type { CatalogResponse } from '@/types/catalog'

const seedCatalog = seedCatalogJson as CatalogResponse

describe('getReviewLineItems', () => {
  it('returns line items for selections with quantity above zero', () => {
    const items = getReviewLineItems(seedCatalog.initialSelections, seedCatalog)
    expect(items.length).toBeGreaterThan(0)
    expect(items.every((item) => item.quantity > 0)).toBe(true)
  })
})

describe('getDistinctSelectedCountPerStep', () => {
  it('counts distinct products per step', () => {
    const counts = getDistinctSelectedCountPerStep(
      seedCatalog.initialSelections,
      seedCatalog,
    )
    expect(counts['a0000001-0001-4000-8000-000000000001']).toBe(2)
  })
})

describe('getTotals', () => {
  it('matches seed bundle totals', () => {
    const totals = getTotals(seedCatalog.initialSelections, seedCatalog)

    expect(totals.total).toBeCloseTo(187.89, 2)
    expect(totals.compareAt).toBeCloseTo(238.81, 2)
    expect(totals.savings).toBeCloseTo(50.92, 2)
    expect(totals.financingMonthly).toBe(19.19)
  })

  it('treats free items as zero line total', () => {
    const totals = getTotals(seedCatalog.initialSelections, seedCatalog)
    const hubLine = getReviewLineItems(seedCatalog.initialSelections, seedCatalog).find(
      (item) => item.product.slug === 'sense-hub',
    )
    expect(hubLine?.lineTotal).toBe(0)
    expect(totals.total).toBeGreaterThan(0)
  })
})

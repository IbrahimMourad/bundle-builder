import { describe, expect, it } from 'vitest'
import seedCatalogJson from '@/test/fixtures/seedCatalog.json'
import type { CatalogResponse } from '@/types/catalog'
import {
  formatReviewProductLabel,
  getDefaultVariant,
  normalizeVariantSelections,
} from './variants'

const seedCatalog = seedCatalogJson as CatalogResponse

describe('variants', () => {
  it('prefers the white variant as default', () => {
    const pan = seedCatalog.products.find((product) => product.slug === 'cam-pan-v3')
    expect(getDefaultVariant(pan!)?.slug).toBe('cam-pan-v3-white')
  })

  it('migrates legacy default keys to the default variant', () => {
    const normalized = normalizeVariantSelections(
      {
        'b0000001-0001-4000-8000-000000000002:default': 2,
      },
      seedCatalog,
    )

    expect(normalized['b0000001-0001-4000-8000-000000000002:default']).toBeUndefined()
    expect(
      normalized['b0000001-0001-4000-8000-000000000002:c0000001-0001-4000-8000-000000000004'],
    ).toBe(2)
  })

  it('omits white variant labels in review', () => {
    const cam = seedCatalog.products.find((product) => product.slug === 'cam-v4')
    const white = cam!.variants.find((variant) => variant.slug === 'cam-v4-white')

    expect(formatReviewProductLabel(cam!, white!)).toBe('Wyze Cam v4')
    expect(formatReviewProductLabel(cam!, cam!.variants[2])).toBe('Wyze Cam v4 (Black)')
  })
})

import { beforeEach, describe, expect, it } from 'vitest'
import { BUNDLE_STORAGE_KEY, clearBundle, loadBundle, saveBundle } from './storage'

describe('storage', () => {
  beforeEach(() => {
    clearBundle()
  })

  it('round-trips bundle state under the versioned key', () => {
    saveBundle({
      activeStep: 2,
      quantities: { 'prod-a:default': 1 },
      selectedVariantByProduct: { 'prod-a': 'var-b' },
    })

    expect(localStorage.getItem(BUNDLE_STORAGE_KEY)).not.toBeNull()
    expect(loadBundle()).toEqual({
      version: 1,
      activeStep: 2,
      quantities: { 'prod-a:default': 1 },
      selectedVariantByProduct: { 'prod-a': 'var-b' },
    })
  })

  it('returns null for corrupt data', () => {
    localStorage.setItem(BUNDLE_STORAGE_KEY, '{not-json')
    expect(loadBundle()).toBeNull()
  })

  it('returns null for unsupported versions', () => {
    localStorage.setItem(BUNDLE_STORAGE_KEY, JSON.stringify({ version: 2 }))
    expect(loadBundle()).toBeNull()
  })
})

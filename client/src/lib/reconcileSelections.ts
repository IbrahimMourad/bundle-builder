import type { CatalogProduct, CatalogResponse, SelectionKey } from '@/types/catalog'
import { enforceRequiredQuantities } from '@/lib/requiredProducts'
import { normalizeVariantSelections } from '@/lib/variants'

export interface SavedSelectionState {
  quantities: Record<SelectionKey, number>
  selectedVariantByProduct: Record<string, string>
}

export interface ReconciledSelectionState {
  quantities: Record<SelectionKey, number>
  selectedVariantByProduct: Record<string, string>
}

function isValidSelectionKey(key: SelectionKey, product: CatalogProduct): boolean {
  const colonIndex = key.indexOf(':')
  if (colonIndex === -1) return false

  const variantPart = key.slice(colonIndex + 1)
  if (variantPart === 'default') {
    return product.variants.length === 0
  }

  return product.variants.some((variant) => variant.id === variantPart)
}

export function reconcileSelections(
  saved: SavedSelectionState,
  catalog: CatalogResponse,
): ReconciledSelectionState {
  const productById = new Map(catalog.products.map((product) => [product.id, product]))
  const quantities: Record<SelectionKey, number> = {}
  const normalizedSavedQuantities = normalizeVariantSelections(saved.quantities, catalog)

  for (const [key, qty] of Object.entries(normalizedSavedQuantities)) {
    if (qty <= 0) continue

    const productId = key.split(':')[0]
    const product = productById.get(productId)
    if (!product || !isValidSelectionKey(key as SelectionKey, product)) continue

    quantities[key as SelectionKey] = qty
  }

  const selectedVariantByProduct: Record<string, string> = {}

  for (const product of catalog.products) {
    if (product.variants.length === 0) continue

    const savedVariant = saved.selectedVariantByProduct[product.id]
    const variantStillValid =
      savedVariant && product.variants.some((variant) => variant.id === savedVariant)

    if (variantStillValid) {
      selectedVariantByProduct[product.id] = savedVariant
      continue
    }

    const variantWithQty = product.variants.find(
      (variant) => (quantities[`${product.id}:${variant.id}` as SelectionKey] ?? 0) > 0,
    )

    selectedVariantByProduct[product.id] =
      variantWithQty?.id ?? product.variants[0]?.id ?? savedVariant ?? ''
  }

  return {
    quantities: enforceRequiredQuantities(quantities, catalog),
    selectedVariantByProduct,
  }
}

import { getSelectionKey } from '@/lib/selectionKey'
import type { CatalogProduct, CatalogResponse, CatalogVariant, SelectionKey } from '@/types/catalog'

function parseSelectionKey(key: SelectionKey): { productId: string; variantId: string } {
  const colonIndex = key.indexOf(':')
  return {
    productId: key.slice(0, colonIndex),
    variantId: key.slice(colonIndex + 1),
  }
}

export function isWhiteVariant(variant: CatalogVariant): boolean {
  return variant.slug.endsWith('-white') || variant.label.toLowerCase() === 'white'
}

export function getDefaultVariant(product: CatalogProduct): CatalogVariant | null {
  if (product.variants.length === 0) return null

  return (
    product.variants.find(isWhiteVariant) ??
    product.variants.find((variant) => variant.sortOrder === 1) ??
    product.variants[0]
  )
}

export function getDefaultVariantId(product: CatalogProduct): string | 'default' {
  return getDefaultVariant(product)?.id ?? 'default'
}

export function normalizeVariantSelections(
  quantities: Record<SelectionKey, number>,
  catalog: CatalogResponse,
): Record<SelectionKey, number> {
  const productById = new Map(catalog.products.map((product) => [product.id, product]))
  const normalized = { ...quantities }

  for (const [key, quantity] of Object.entries(quantities)) {
    if (quantity <= 0) continue

    const { productId, variantId } = parseSelectionKey(key as SelectionKey)
    if (variantId !== 'default') continue

    const product = productById.get(productId)
    if (!product || product.variants.length === 0) continue

    const defaultVariant = getDefaultVariant(product)
    if (!defaultVariant) continue

    delete normalized[key as SelectionKey]
    const variantKey = getSelectionKey(product.id, defaultVariant.id)
    normalized[variantKey] = (normalized[variantKey] ?? 0) + quantity
  }

  return normalized
}

export function formatReviewProductLabel(
  product: CatalogProduct,
  variant: CatalogVariant | null,
): string {
  if (!variant || isWhiteVariant(variant)) {
    return product.name
  }

  return `${product.name} (${variant.label})`
}

import type { CatalogProduct, SelectionKey } from '@/types/catalog'
import { getDefaultVariantId } from '@/lib/variants'

export function getSelectionKey(
  productId: string,
  variantId: string | 'default',
): SelectionKey {
  return `${productId}:${variantId}`
}

export function getActiveVariantId(
  product: CatalogProduct,
  selectedVariantByProduct: Record<string, string>,
): string | 'default' {
  if (product.variants.length === 0) return 'default'
  return selectedVariantByProduct[product.id] ?? getDefaultVariantId(product)
}

export function getProductTotalQuantity(
  product: CatalogProduct,
  quantities: Record<SelectionKey, number>,
): number {
  if (product.variants.length === 0) {
    return quantities[getSelectionKey(product.id, 'default')] ?? 0
  }

  return product.variants.reduce(
    (total, variant) => total + (quantities[getSelectionKey(product.id, variant.id)] ?? 0),
    0,
  )
}

export function isProductSelected(
  product: CatalogProduct,
  quantities: Record<SelectionKey, number>,
): boolean {
  return getProductTotalQuantity(product, quantities) > 0
}

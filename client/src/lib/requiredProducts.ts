import { getSelectionKey } from '@/lib/selectionKey'
import type { CatalogProduct, CatalogResponse, SelectionKey } from '@/types/catalog'

export function getRequiredSelectionKey(
  product: CatalogProduct,
  quantities?: Record<SelectionKey, number>,
): SelectionKey {
  if (product.variants.length === 0) {
    return getSelectionKey(product.id, 'default')
  }

  const variantWithQty = product.variants.find(
    (variant) => (quantities?.[getSelectionKey(product.id, variant.id)] ?? 0) > 0,
  )

  return getSelectionKey(product.id, variantWithQty?.id ?? product.variants[0].id)
}

export function buildRequiredSelectionKeys(
  catalog: CatalogResponse,
): ReadonlySet<SelectionKey> {
  return new Set(
    catalog.products
      .filter((product) => product.isRequired)
      .map((product) => getRequiredSelectionKey(product)),
  )
}

export function enforceRequiredQuantities(
  quantities: Record<SelectionKey, number>,
  catalog: CatalogResponse,
): Record<SelectionKey, number> {
  const result = { ...quantities }

  for (const product of catalog.products) {
    if (!product.isRequired) continue
    result[getRequiredSelectionKey(product, result)] = 1
  }

  return result
}

export function isRequiredSelectionKey(
  key: SelectionKey,
  requiredSelectionKeys: ReadonlySet<SelectionKey>,
): boolean {
  return requiredSelectionKeys.has(key)
}

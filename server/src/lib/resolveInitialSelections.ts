import type { CatalogProduct, SelectionKey } from '../types/catalog.js'

export function resolveInitialSelections(
  products: CatalogProduct[],
  slugSelections: Record<string, number>,
): Record<SelectionKey, number> {
  const productBySlug = new Map(products.map((product) => [product.slug, product]))
  const resolved: Record<SelectionKey, number> = {}

  for (const [key, quantity] of Object.entries(slugSelections)) {
    const [productSlug, variantSlug] = key.split(':')
    const product = productBySlug.get(productSlug)
    if (!product) continue

    let variantId = 'default'
    if (variantSlug !== 'default') {
      const variant = product.variants.find((item) => item.slug === variantSlug)
      if (!variant) continue
      variantId = variant.id
    }

    resolved[`${product.id}:${variantId}` as SelectionKey] = quantity
  }

  return resolved
}

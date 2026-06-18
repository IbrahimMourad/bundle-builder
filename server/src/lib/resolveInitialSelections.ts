import type { CatalogProduct, SelectionKey } from '../types/catalog.js'

function getDefaultVariant(product: CatalogProduct) {
  if (product.variants.length === 0) return null

  return (
    product.variants.find(
      (variant) => variant.slug.endsWith('-white') || variant.label.toLowerCase() === 'white',
    ) ??
    product.variants.find((variant) => variant.sortOrder === 1) ??
    product.variants[0]
  )
}

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
    } else {
      const defaultVariant = getDefaultVariant(product)
      if (defaultVariant) {
        variantId = defaultVariant.id
      }
    }

    resolved[`${product.id}:${variantId}` as SelectionKey] = quantity
  }

  return resolved
}

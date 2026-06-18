import type {
  CatalogProduct,
  CatalogResponse,
  CatalogVariant,
  ProductCategory,
  SelectionKey,
} from '@/types/catalog'

export interface ReviewLineItem {
  key: SelectionKey
  product: CatalogProduct
  variant: CatalogVariant | null
  quantity: number
  unitPrice: number
  unitCompareAt: number | null
  lineTotal: number
  lineCompareAt: number | null
  category: ProductCategory
}

export interface BundleTotals {
  subtotal: number
  compareAt: number
  total: number
  savings: number
  financingMonthly: number
}

function parseSelectionKey(key: SelectionKey): { productId: string; variantId: string } {
  const colonIndex = key.indexOf(':')
  return {
    productId: key.slice(0, colonIndex),
    variantId: key.slice(colonIndex + 1),
  }
}

function findProduct(catalog: CatalogResponse, productId: string): CatalogProduct | undefined {
  return catalog.products.find((product) => product.id === productId)
}

export function getReviewLineItems(
  quantities: Record<SelectionKey, number>,
  catalog: CatalogResponse,
): ReviewLineItem[] {
  const items: ReviewLineItem[] = []

  for (const [key, quantity] of Object.entries(quantities)) {
    if (quantity <= 0) continue

    const { productId, variantId } = parseSelectionKey(key as SelectionKey)
    const product = findProduct(catalog, productId)
    if (!product) continue

    const variant =
      variantId === 'default'
        ? null
        : (product.variants.find((entry) => entry.id === variantId) ?? null)

    if (variantId !== 'default' && !variant) continue

    const unitPrice = product.price
    const unitCompareAt = product.compareAtPrice

    items.push({
      key: key as SelectionKey,
      product,
      variant,
      quantity,
      unitPrice,
      unitCompareAt,
      lineTotal: unitPrice * quantity,
      lineCompareAt: unitCompareAt != null ? unitCompareAt * quantity : null,
      category: product.category,
    })
  }

  return items.sort((a, b) => {
    const categoryOrder = ['cameras', 'sensors', 'accessories', 'plan'] as const
    const categoryDiff =
      categoryOrder.indexOf(a.category) - categoryOrder.indexOf(b.category)
    if (categoryDiff !== 0) return categoryDiff
    return a.product.sortOrder - b.product.sortOrder
  })
}

export function getDistinctSelectedCountPerStep(
  quantities: Record<SelectionKey, number>,
  catalog: CatalogResponse,
): Record<string, number> {
  const counts: Record<string, number> = {}

  for (const step of catalog.steps) {
    counts[step.id] = 0
  }

  const selectedProductIds = new Set<string>()

  for (const [key, quantity] of Object.entries(quantities)) {
    if (quantity <= 0) continue
    selectedProductIds.add(parseSelectionKey(key as SelectionKey).productId)
  }

  for (const productId of selectedProductIds) {
    const product = findProduct(catalog, productId)
    if (!product) continue
    counts[product.stepId] = (counts[product.stepId] ?? 0) + 1
  }

  return counts
}

export function getTotals(
  quantities: Record<SelectionKey, number>,
  catalog: CatalogResponse,
): BundleTotals {
  const lineItems = getReviewLineItems(quantities, catalog)

  const subtotal = lineItems.reduce((sum, item) => sum + item.lineTotal, 0)
  const productCompareAt = lineItems.reduce(
    (sum, item) => sum + (item.lineCompareAt ?? item.lineTotal),
    0,
  )

  const compareAt = productCompareAt
  const total = subtotal + catalog.shipping.price
  const savings = Math.max(0, compareAt - total)

  return {
    subtotal,
    compareAt,
    total,
    savings,
    financingMonthly: catalog.financing.monthlyLow,
  }
}

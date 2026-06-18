import { memo, useCallback } from 'react'
import { Badge } from '@/components/ui/Badge'
import { Price } from '@/components/ui/Price'
import { QuantityStepper } from '@/components/ui/QuantityStepper'
import {
  getActiveVariantId,
  getProductTotalQuantity,
  getSelectionKey,
  isProductSelected,
} from '@/lib/selectionKey'
import { useBundleStore } from '@/stores/useBundleStore'
import type { CatalogProduct, SelectionKey } from '@/types/catalog'
import { VariantSelector } from './VariantSelector'
import styles from './ProductCard.module.css'

interface ProductCardProps {
  product: CatalogProduct
}

export const ProductCard = memo(function ProductCard({ product }: ProductCardProps) {
  const selectedVariantByProduct = useBundleStore((state) => state.selectedVariantByProduct)
  const setSelectedVariant = useBundleStore((state) => state.setSelectedVariant)
  const setQuantity = useBundleStore((state) => state.setQuantity)

  const activeVariantId = getActiveVariantId(product, selectedVariantByProduct)
  const selectionKey = getSelectionKey(product.id, activeVariantId)

  const quantity = useBundleStore((state) => state.quantities[selectionKey] ?? 0)
  const selected = useBundleStore((state) => isProductSelected(product, state.quantities))

  const handleQuantityChange = useCallback(
    (nextQuantity: number) => {
      setQuantity(selectionKey, nextQuantity)
    },
    [selectionKey, setQuantity],
  )

  const handleVariantSelect = useCallback(
    (variantId: string) => {
      setSelectedVariant(product.id, variantId)
    },
    [product.id, setSelectedVariant],
  )

  const isPlan = product.category === 'plan'

  return (
    <article className={selected ? styles.cardSelected : styles.card}>
      {product.badge ? (
        <div className={styles.badgeWrap}>
          <Badge>{product.badge}</Badge>
        </div>
      ) : null}

      <div className={styles.layout}>
        <img
          className={styles.image}
          src={product.imageUrl}
          alt={product.name}
          width={101}
        />

        <div className={styles.content}>
          <h3 className={styles.name}>{product.name}</h3>
          <p className={styles.description}>
            {product.description}{' '}
            <a className={styles.learnMore} href={product.learnMoreUrl}>
              Learn More
            </a>
          </p>

          {product.variants.length > 0 ? (
            <VariantSelector
              variants={product.variants}
              selectedVariantId={activeVariantId as string}
              onSelect={handleVariantSelect}
              name={product.name}
            />
          ) : null}

          <div className={isPlan ? `${styles.actions} ${styles.actionsPlan}` : styles.actions}>
            {!isPlan ? (
              <QuantityStepper
                value={quantity}
                onChange={handleQuantityChange}
                label={`${product.name} quantity`}
                variant="card"
                disabled={product.isRequired}
                min={product.isRequired ? 1 : 0}
              />
            ) : null}
            <Price
              price={product.price}
              compareAt={product.compareAtPrice}
              suffix={product.priceLabel}
              size="sm"
              variant="card"
            />
          </div>
        </div>
      </div>
    </article>
  )
})

export function getProductCardSelectionKey(
  product: CatalogProduct,
  selectedVariantByProduct: Record<string, string>,
): SelectionKey {
  return getSelectionKey(product.id, getActiveVariantId(product, selectedVariantByProduct))
}

export function getProductCardQuantity(
  product: CatalogProduct,
  quantities: Record<SelectionKey, number>,
  selectedVariantByProduct: Record<string, string>,
): number {
  const key = getProductCardSelectionKey(product, selectedVariantByProduct)
  return quantities[key] ?? 0
}

export function getProductCardSelected(
  product: CatalogProduct,
  quantities: Record<SelectionKey, number>,
): boolean {
  return getProductTotalQuantity(product, quantities) > 0
}

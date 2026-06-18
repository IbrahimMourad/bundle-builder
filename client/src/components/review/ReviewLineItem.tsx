import { memo, useCallback } from 'react'
import { Price } from '@/components/ui/Price'
import { QuantityStepper } from '@/components/ui/QuantityStepper'
import type { ReviewLineItem as ReviewLineItemData } from '@/lib/pricing'
import { formatReviewProductLabel } from '@/lib/variants'
import { useBundleStore } from '@/stores/useBundleStore'
import styles from './ReviewLineItem.module.css'

interface ReviewLineItemProps {
  item: ReviewLineItemData
}

export const ReviewLineItem = memo(function ReviewLineItem({ item }: ReviewLineItemProps) {
  const quantity = useBundleStore((state) => state.quantities[item.key] ?? 0)
  const setQuantity = useBundleStore((state) => state.setQuantity)

  const handleQuantityChange = useCallback(
    (nextQuantity: number) => {
      setQuantity(item.key, nextQuantity)
    },
    [item.key, setQuantity],
  )

  const lineTotal = item.unitPrice * quantity
  const lineCompareAt =
    item.unitCompareAt != null ? item.unitCompareAt * quantity : null
  const isFree = item.unitPrice === 0
  const isPlan = item.category === 'plan'
  const imageUrl = item.variant?.imageUrl ?? item.product.imageUrl
  const label = formatReviewProductLabel(item.product, item.variant)

  const thumb = (
    <img
      className={isPlan ? styles.thumbPlan : styles.thumb}
      src={imageUrl}
      alt=""
      width={41}
      height={41}
    />
  )

  return (
    <li className={styles.item}>
      {isPlan ? thumb : <span className={styles.thumbBox}>{thumb}</span>}
      <span className={styles.name}>{label}</span>
      <QuantityStepper
        value={quantity}
        onChange={handleQuantityChange}
        label={`${label} quantity`}
        variant="review"
        disabled={item.product.isRequired}
        min={item.product.isRequired ? 1 : 0}
      />
      <div className={styles.price}>
        <Price
          price={lineTotal}
          compareAt={lineCompareAt}
          suffix={item.product.priceLabel}
          size="sm"
          variant="review"
          free={isFree}
        />
      </div>
    </li>
  )
})

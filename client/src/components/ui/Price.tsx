import { formatCurrency } from '@/lib/formatCurrency'
import styles from './Price.module.css'

type PriceSize = 'sm' | 'md' | 'lg'
type PriceVariant = 'default' | 'card' | 'review'

interface PriceProps {
  price: number
  compareAt?: number | null
  suffix?: string | null
  size?: PriceSize
  variant?: PriceVariant
  free?: boolean
}

export function Price({
  price,
  compareAt,
  suffix,
  size = 'md',
  variant = 'default',
  free = false,
}: PriceProps) {
  const showCompareAt = compareAt != null && compareAt > price

  const variantClass =
    variant === 'card' ? styles.card : variant === 'review' ? styles.review : ''

  return (
    <span className={`${styles.price} ${styles[size]} ${variantClass}`}>
      {showCompareAt ? (
        <span className={styles.compareAt}>{formatCurrency(compareAt)}</span>
      ) : null}
      <span className={free ? styles.free : styles.current}>
        {free ? 'FREE' : formatCurrency(price)}
        {suffix && !free ? suffix : null}
      </span>
    </span>
  )
}

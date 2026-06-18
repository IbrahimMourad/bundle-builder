import { formatCurrency } from '@/lib/formatCurrency'
import styles from './Price.module.css'

type PriceSize = 'sm' | 'md' | 'lg'

interface PriceProps {
  price: number
  compareAt?: number | null
  suffix?: string | null
  size?: PriceSize
  free?: boolean
}

export function Price({
  price,
  compareAt,
  suffix,
  size = 'md',
  free = false,
}: PriceProps) {
  const showCompareAt = compareAt != null && compareAt > price

  return (
    <span className={`${styles.price} ${styles[size]}`}>
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

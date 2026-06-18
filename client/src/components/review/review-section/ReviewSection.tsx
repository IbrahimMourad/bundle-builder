import type { ReviewLineItem as ReviewLineItemData } from '@/lib/pricing'
import { ReviewDivider } from '../review-divider/ReviewDivider'
import { ReviewLineItem } from '../review-line-item/ReviewLineItem'
import styles from './ReviewSection.module.css'

interface ReviewSectionProps {
  heading: string
  items: ReviewLineItemData[]
}

export function ReviewSection({ heading, items }: ReviewSectionProps) {
  return (
    <section className={styles.section}>
      <ReviewDivider />
      <h3 className={styles.heading}>{heading}</h3>
      <ul className={styles.list}>
        {items.map((item) => (
          <ReviewLineItem key={item.key} item={item} />
        ))}
      </ul>
    </section>
  )
}

import { Shimmer } from '@/components/ui/shimmer/Shimmer'
import styles from './ReviewPanelShimmer.module.css'

function ReviewLineItemShimmer() {
  return (
    <div className={styles.lineItem}>
      <Shimmer className={styles.thumb} />
      <Shimmer className={styles.name} />
      <Shimmer className={styles.stepper} />
      <Shimmer className={styles.price} />
    </div>
  )
}

function ReviewSectionShimmer({ lines }: { lines: number }) {
  return (
    <div className={styles.section}>
      <Shimmer className={styles.sectionHeading} />
      {Array.from({ length: lines }, (_, index) => (
        <ReviewLineItemShimmer key={index} />
      ))}
    </div>
  )
}

export function ReviewPanelShimmer() {
  return (
    <div className={styles.panel} aria-busy="true" aria-label="Loading review panel">
      <div className={styles.header}>
        <Shimmer className={styles.eyebrow} />
        <Shimmer className={styles.title} />
        <Shimmer className={styles.subtitle} />
        <Shimmer className={styles.subtitleShort} />
      </div>

      <ReviewSectionShimmer lines={2} />
      <ReviewSectionShimmer lines={2} />
      <ReviewSectionShimmer lines={1} />

      <div className={styles.checkout}>
        <div className={styles.divider} aria-hidden="true" />
        <div className={styles.checkoutHero}>
          <Shimmer className={styles.badge} />
          <div className={styles.totals}>
            <Shimmer className={styles.totalPill} />
            <Shimmer className={styles.totalLg} />
          </div>
        </div>
        <Shimmer className={styles.checkoutButton} />
        <Shimmer className={styles.saveLink} />
      </div>
    </div>
  )
}

import { Shimmer } from '@/components/ui/Shimmer'
import styles from './AccordionShimmer.module.css'

const STEP_COUNT = 4

export function AccordionShimmer() {
  return (
    <div className={styles.root} aria-busy="true" aria-label="Loading bundle builder">
      {Array.from({ length: STEP_COUNT }, (_, index) => {
        const isFirst = index === 0
        const isExpanded = index === 0

        return (
          <div
            key={index}
            className={isExpanded ? `${styles.step} ${styles.stepExpanded}` : styles.step}
          >
            <div
              className={
                isFirst ? styles.labelRow : `${styles.labelRow} ${styles.labelRowNotFirst}`
              }
            >
              <Shimmer className={styles.label} />
            </div>

            <div className={styles.titleRow}>
              <Shimmer className={styles.icon} />
              <Shimmer className={styles.title} />
              <Shimmer className={styles.trailing} />
            </div>

            {isExpanded ? (
              <div className={styles.panel}>
                <div className={styles.card}>
                  <Shimmer className={styles.cardImage} />
                  <div className={styles.cardBody}>
                    <Shimmer className={styles.cardLineLg} />
                    <Shimmer className={styles.cardLineMd} />
                    <Shimmer className={styles.cardLineSm} />
                    <div className={styles.cardActions}>
                      <Shimmer className={styles.cardStepper} />
                      <Shimmer className={styles.cardPrice} />
                    </div>
                  </div>
                </div>
                <div className={styles.card}>
                  <Shimmer className={styles.cardImage} />
                  <div className={styles.cardBody}>
                    <Shimmer className={styles.cardLineLg} />
                    <Shimmer className={styles.cardLineMd} />
                    <div className={styles.cardActions}>
                      <Shimmer className={styles.cardStepper} />
                      <Shimmer className={styles.cardPrice} />
                    </div>
                  </div>
                </div>
                <Shimmer className={styles.button} />
              </div>
            ) : null}
          </div>
        )
      })}
    </div>
  )
}

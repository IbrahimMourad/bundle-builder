import { useCatalog } from '@/hooks/useCatalog'
import { useBundleStore } from '@/stores/useBundleStore'
import { selectReviewLineItems, selectTotals } from '@/stores/bundleSelectors'
import { CATEGORY_HEADINGS, CATEGORY_ORDER } from './reviewCategories'
import { CheckoutSummary } from './CheckoutSummary'
import { ReviewPanelShimmer } from './ReviewPanelShimmer'
import { ReviewSection } from './ReviewSection'
import styles from './ReviewPanel.module.css'

export function ReviewPanel() {
  const { data: catalog, isPending, isError } = useCatalog()
  const hasHydrated = useBundleStore((state) => state.hasHydrated)
  const quantities = useBundleStore((state) => state.quantities)

  if (isPending || !hasHydrated) {
    return <ReviewPanelShimmer />
  }

  if (isError || !catalog) {
    return <p className={styles.status}>Could not load review.</p>
  }

  const lineItems = selectReviewLineItems({ quantities }, catalog)
  const totals = selectTotals({ quantities }, catalog)

  const sections = CATEGORY_ORDER.map((category) => ({
    heading: CATEGORY_HEADINGS[category],
    items: lineItems.filter((item) => item.category === category),
  })).filter((section) => section.items.length > 0)

  return (
    <div className={styles.panel}>
      <header className={styles.header}>
        <p className={styles.eyebrow}>Review</p>
        <div className={styles.intro}>
          <h2 className={styles.title}>Your security system</h2>
          <p className={styles.subtitle}>
            Review your personalized protection system designed to keep what matters most safe.
          </p>
        </div>
      </header>

      <div className={styles.sections}>
        {sections.map((section) => (
          <ReviewSection
            key={section.heading}
            heading={section.heading}
            items={section.items}
          />
        ))}
      </div>

      <CheckoutSummary catalog={catalog} totals={totals} />
    </div>
  )
}

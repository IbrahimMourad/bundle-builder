import { useCatalog } from '@/hooks/useCatalog'
import { Button } from '@/components/ui/Button'
import { Price } from '@/components/ui/Price'
import { formatCurrency } from '@/lib/formatCurrency'
import { useBundleStore } from '@/stores/useBundleStore'
import { selectReviewLineItems, selectTotals } from '@/stores/bundleSelectors'
import type { ProductCategory } from '@/types/catalog'
import styles from './ReviewShell.module.css'

const CATEGORY_HEADINGS: Record<ProductCategory, string> = {
  cameras: 'Cameras',
  sensors: 'Sensors',
  accessories: 'Accessories',
  plan: 'Plan',
}

const CATEGORY_ORDER: ProductCategory[] = [
  'cameras',
  'sensors',
  'accessories',
  'plan',
]

export function ReviewShell() {
  const { data: catalog, isPending, isError } = useCatalog()
  const hasHydrated = useBundleStore((state) => state.hasHydrated)
  const quantities = useBundleStore((state) => state.quantities)
  const saveToStorage = useBundleStore((state) => state.saveToStorage)
  const openCheckout = useBundleStore((state) => state.openCheckout)

  if (isPending || !hasHydrated) {
    return <p className={styles.status}>Loading review…</p>
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
        <h2 className={styles.title}>Your security system</h2>
      </header>

      <div className={styles.sections}>
        {sections.map((section) => (
          <section key={section.heading} className={styles.section}>
            <h3 className={styles.sectionHeading}>{section.heading}</h3>
            <ul className={styles.itemList}>
              {section.items.map((item) => (
                <li key={item.key} className={styles.item}>
                  <img
                    className={styles.itemThumb}
                    src={item.product.imageUrl}
                    alt=""
                    width={40}
                    height={40}
                  />
                  <span className={styles.itemName}>
                    {item.product.name}
                    {item.variant ? ` (${item.variant.label})` : ''}
                    {item.quantity > 1 ? ` ×${item.quantity}` : ''}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <div className={styles.summary}>
        <div className={styles.shippingRow}>
          <span className={styles.shippingLabel}>{catalog.shipping.label}</span>
          <span className={styles.freeLabel}>FREE</span>
        </div>

        <div className={styles.totals} aria-live="polite">
          <p className={styles.financing}>
            as low as {formatCurrency(totals.financingMonthly)}/mo
          </p>
          <p className={styles.totalRow}>
            <Price price={totals.total} compareAt={totals.compareAt} size="lg" />
          </p>
          {totals.savings > 0 ? (
            <p className={styles.savings}>
              Congrats! You&apos;re saving {formatCurrency(totals.savings)} on your security
              bundle!
            </p>
          ) : null}
        </div>

        <Button variant="primary" fullWidth onClick={openCheckout}>
          Checkout
        </Button>
        <button type="button" className={styles.saveLink} onClick={saveToStorage}>
          Save my system for later
        </button>
      </div>
    </div>
  )
}

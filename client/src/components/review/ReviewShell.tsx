import { useCatalog } from '@/hooks/useCatalog'
import type { ProductCategory, SelectionKey } from '@/types/catalog'
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

  if (isPending) {
    return <p className={styles.status}>Loading review…</p>
  }

  if (isError || !catalog) {
    return <p className={styles.status}>Could not load review.</p>
  }

  const reviewProducts = catalog.products.filter((product) => {
    const keys = Object.keys(catalog.initialSelections) as SelectionKey[]
    return keys.some(
      (key) => key.startsWith(`${product.id}:`) && (catalog.initialSelections[key] ?? 0) > 0,
    )
  })

  const sections = CATEGORY_ORDER.map((category) => ({
    heading: CATEGORY_HEADINGS[category],
    items: reviewProducts.filter((product) => product.category === category),
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
                <li key={item.id} className={styles.item}>
                  <img
                    className={styles.itemThumb}
                    src={item.imageUrl}
                    alt=""
                    width={40}
                    height={40}
                  />
                  <span className={styles.itemName}>{item.name}</span>
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
            as low as ${catalog.financing.monthlyLow.toFixed(2)}/mo
          </p>
          <p className={styles.totalRow}>
            <span className={styles.compareAt}>$238.81</span>
            <span className={styles.total}>$187.89</span>
          </p>
          <p className={styles.savings}>
            Congrats! You&apos;re saving $50.92 on your security bundle!
          </p>
        </div>

        <button type="button" className={styles.checkoutButton}>
          Checkout
        </button>
        <button type="button" className={styles.saveLink}>
          Save my system for later
        </button>
      </div>
    </div>
  )
}

import { Button } from '@/components/ui/Button'
import { Price } from '@/components/ui/Price'
import { formatCurrency } from '@/lib/formatCurrency'
import type { BundleTotals } from '@/lib/pricing'
import { useBundleStore } from '@/stores/useBundleStore'
import type { CatalogResponse } from '@/types/catalog'
import { ReviewDivider } from './ReviewDivider'
import styles from './CheckoutSummary.module.css'

interface CheckoutSummaryProps {
  catalog: CatalogResponse
  totals: BundleTotals
}

export function CheckoutSummary({ catalog, totals }: CheckoutSummaryProps) {
  const saveToStorage = useBundleStore((state) => state.saveToStorage)
  const openCheckout = useBundleStore((state) => state.openCheckout)
  const shippingIsFree = catalog.shipping.price === 0

  return (
    <div className={styles.summary}>
      <ReviewDivider />

      <div className={styles.shippingRow}>
        <span className={styles.shippingLabel}>
          <span className={styles.shippingIconBox}>
            <img
              className={styles.shippingIcon}
              src="/assets/fast-shipping-icon.svg"
              alt=""
              width={29}
              height={29}
            />
          </span>
          {catalog.shipping.label}
        </span>
        <Price
          price={catalog.shipping.price}
          compareAt={catalog.shipping.compareAt}
          free={shippingIsFree}
          size="sm"
          variant="review"
        />
      </div>

      <div className={styles.summaryHero}>
        <img
          className={styles.guaranteeBadge}
          src="/assets/satisfaction-badge.png"
          alt="100% satisfaction guaranteed"
          width={78}
          height={78}
        />

        <div className={styles.totals} aria-live="polite">
          <p className={styles.financing}>
            as low as {formatCurrency(totals.financingMonthly)}/mo
          </p>
          <p className={styles.totalRow}>
            <Price
              price={totals.total}
              compareAt={totals.compareAt}
              size="lg"
              variant="review"
            />
          </p>
        </div>
      </div>

      {totals.savings > 0 ? (
        <p className={styles.savings}>
          Congrats! You&apos;re saving {formatCurrency(totals.savings)} on your security
          bundle!
        </p>
      ) : null}

      <Button
        variant="primary"
        fullWidth
        className={styles.checkoutButton}
        onClick={openCheckout}
      >
        Checkout
      </Button>
      <button type="button" className={styles.saveLink} onClick={saveToStorage}>
        Save my system for later
      </button>
    </div>
  )
}

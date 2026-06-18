import { useCatalog } from '@/hooks/useCatalog'
import { Button } from '@/components/ui/Button'
import { useBundleStore } from '@/stores/useBundleStore'
import { selectDistinctSelectedCountPerStep } from '@/stores/bundleSelectors'
import styles from './BuilderShell.module.css'

export function BuilderShell() {
  const { data: catalog, isPending, isError } = useCatalog()
  const hasHydrated = useBundleStore((state) => state.hasHydrated)
  const activeStep = useBundleStore((state) => state.activeStep)
  const quantities = useBundleStore((state) => state.quantities)
  const setActiveStep = useBundleStore((state) => state.setActiveStep)

  if (isPending || !hasHydrated) {
    return <p className={styles.status}>Loading catalog…</p>
  }

  if (isError || !catalog) {
    return <p className={styles.status}>Could not load catalog.</p>
  }

  const selectedCountByStep = selectDistinctSelectedCountPerStep({ quantities }, catalog)
  const expandedStep = catalog.steps.find((step) => step.order === activeStep)

  return (
    <div className={styles.shell}>
      {catalog.steps.map((step) => {
        const isExpanded = step.order === activeStep
        const stepProducts = catalog.products.filter(
          (product) => product.stepId === step.id && product.showInBuilder,
        )
        const selectedCount = selectedCountByStep[step.id] ?? 0

        return (
          <article
            key={step.id}
            className={isExpanded ? styles.stepExpanded : styles.stepCollapsed}
          >
            <header className={styles.stepHeader}>
              <img
                className={styles.stepIcon}
                src={step.icon}
                alt=""
                width={32}
                height={32}
              />
              <div className={styles.stepMeta}>
                <span className={styles.stepLabel}>STEP {step.order} OF 4</span>
                <h2 className={styles.stepTitle}>{step.title}</h2>
              </div>
              {isExpanded && selectedCount > 0 ? (
                <span className={styles.selectedCount}>{selectedCount} selected</span>
              ) : !isExpanded ? (
                <span className={styles.chevron} aria-hidden="true">
                  ▾
                </span>
              ) : null}
            </header>

            {isExpanded ? (
              <div className={styles.stepBody}>
                <div className={styles.productGrid}>
                  {stepProducts.map((product) => (
                    <figure key={product.id} className={styles.productCard}>
                      <img
                        className={styles.productImage}
                        src={product.imageUrl}
                        alt={product.name}
                        width={160}
                        height={160}
                      />
                      <figcaption className={styles.productName}>{product.name}</figcaption>
                    </figure>
                  ))}
                </div>
                {expandedStep ? (
                  <Button
                    variant="outline"
                    className={styles.nextButton}
                    onClick={() => {
                      const nextStep = catalog.steps.find(
                        (entry) => entry.order === activeStep + 1,
                      )
                      if (nextStep) setActiveStep(nextStep.order)
                    }}
                  >
                    {expandedStep.nextLabel}
                  </Button>
                ) : null}
              </div>
            ) : null}
          </article>
        )
      })}
    </div>
  )
}

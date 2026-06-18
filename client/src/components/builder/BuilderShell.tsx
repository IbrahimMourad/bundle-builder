import { useCatalog } from '@/hooks/useCatalog'
import styles from './BuilderShell.module.css'

export function BuilderShell() {
  const { data: catalog, isPending, isError } = useCatalog()

  if (isPending) {
    return <p className={styles.status}>Loading catalog…</p>
  }

  if (isError || !catalog) {
    return <p className={styles.status}>Could not load catalog.</p>
  }

  const activeStep = catalog.steps.find((step) => step.order === catalog.activeStep)

  return (
    <div className={styles.shell}>
      {catalog.steps.map((step) => {
        const isExpanded = step.order === catalog.activeStep
        const stepProducts = catalog.products.filter(
          (product) => product.stepId === step.id && product.showInBuilder,
        )

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
              {isExpanded ? (
                <span className={styles.selectedCount}>
                  {stepProducts.length > 0 ? `${stepProducts.length} shown` : ''}
                </span>
              ) : (
                <span className={styles.chevron} aria-hidden="true">
                  ▾
                </span>
              )}
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
                {activeStep ? (
                  <button type="button" className={styles.nextButton}>
                    {activeStep.nextLabel}
                  </button>
                ) : null}
              </div>
            ) : null}
          </article>
        )
      })}
    </div>
  )
}

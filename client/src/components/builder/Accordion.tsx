import { useCatalog } from '@/hooks/useCatalog'
import { useBundleStore } from '@/stores/useBundleStore'
import { selectDistinctSelectedCountPerStep } from '@/stores/bundleSelectors'
import { NextStepButton } from './NextStepButton'
import { ProductGrid } from './ProductGrid'
import { StepHeader } from './StepHeader'
import styles from './Accordion.module.css'

export function Accordion() {
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

  function goToNextStep(currentOrder: number) {
    const nextStep = catalog!.steps.find((step) => step.order === currentOrder + 1)
    if (nextStep) setActiveStep(nextStep.order)
  }

  return (
    <div className={styles.accordion}>
      {catalog.steps.map((step) => {
        const isExpanded = step.order === activeStep
        const panelId = `step-panel-${step.slug}`
        const stepProducts = catalog.products.filter(
          (product) => product.stepId === step.id && product.showInBuilder,
        )

        return (
          <section
            key={step.id}
            className={isExpanded ? styles.stepExpanded : styles.stepCollapsed}
          >
            <StepHeader
              step={step}
              totalSteps={catalog.steps.length}
              isExpanded={isExpanded}
              selectedCount={selectedCountByStep[step.id] ?? 0}
              panelId={panelId}
              onToggle={() => setActiveStep(step.order)}
            />

            {isExpanded ? (
              <div id={panelId} className={styles.panel}>
                <ProductGrid products={stepProducts} />
                <NextStepButton label={step.nextLabel} onClick={() => goToNextStep(step.order)} />
              </div>
            ) : null}
          </section>
        )
      })}
    </div>
  )
}

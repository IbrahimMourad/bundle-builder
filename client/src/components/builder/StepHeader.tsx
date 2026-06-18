import type { CatalogStep } from '@/types/catalog'
import styles from './StepHeader.module.css'

interface StepHeaderProps {
  step: CatalogStep
  isExpanded: boolean
  selectedCount: number
  onToggle: () => void
  panelId: string
}

export function StepHeader({
  step,
  isExpanded,
  selectedCount,
  onToggle,
  panelId,
}: StepHeaderProps) {
  return (
    <button
      type="button"
      className={styles.header}
      aria-expanded={isExpanded}
      aria-controls={panelId}
      onClick={onToggle}
    >
      <img className={styles.icon} src={step.icon} alt="" width={32} height={32} />
      <div className={styles.meta}>
        <span className={styles.label}>STEP {step.order} OF 4</span>
        <span className={styles.title}>{step.title}</span>
      </div>
      <span className={styles.trailing}>
        {isExpanded && selectedCount > 0 ? (
          <span className={styles.selectedCount}>{selectedCount} selected</span>
        ) : null}
        <span className={styles.chevron} aria-hidden="true">
          {isExpanded ? '▴' : '▾'}
        </span>
      </span>
    </button>
  )
}

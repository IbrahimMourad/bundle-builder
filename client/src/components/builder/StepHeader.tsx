import type { CatalogStep } from '@/types/catalog'
import { StepHeaderChevronIcon } from './StepHeaderChevronIcon'
import styles from './StepHeader.module.css'

interface StepHeaderProps {
  step: CatalogStep
  totalSteps: number
  isExpanded: boolean
  selectedCount: number
  onToggle: () => void
  panelId: string
}

export function StepHeader({
  step,
  totalSteps,
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
      <div className={styles.stepLabelRow}>
        <span className={styles.label}>
          STEP {step.order} OF {totalSteps}
        </span>
      </div>

      <div className={styles.titleRow}>
        <img className={styles.icon} src={step.icon} alt="" width={32} height={32} />
        <span className={styles.title}>{step.title}</span>
        <span className={styles.trailing}>
          {isExpanded && selectedCount > 0 ? (
            <span className={styles.selectedCount}>{selectedCount} selected</span>
          ) : null}
          <span
            className={`${styles.chevron} ${isExpanded ? '' : styles.chevronCollapsed}`}
            aria-hidden="true"
          >
            <StepHeaderChevronIcon />
          </span>
        </span>
      </div>
    </button>
  )
}

import type { KeyboardEvent } from 'react'
import { StepperMinusIcon, StepperPlusIcon } from './QuantityStepperIcons'
import styles from './QuantityStepper.module.css'

type QuantityStepperVariant = 'card' | 'review'

interface QuantityStepperProps {
  value: number
  onChange: (value: number) => void
  min?: number
  label?: string
  variant?: QuantityStepperVariant
  disabled?: boolean
}

export function QuantityStepper({
  value,
  onChange,
  min = 0,
  label = 'Quantity',
  variant = 'card',
  disabled = false,
}: QuantityStepperProps) {
  const decrementDisabled = disabled || value <= min
  const incrementDisabled = disabled

  function decrement() {
    if (!decrementDisabled) onChange(value - 1)
  }

  function increment() {
    if (!incrementDisabled) onChange(value + 1)
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (disabled) return
    if (event.key === 'ArrowDown' || event.key === '-') {
      event.preventDefault()
      decrement()
    }

    if (event.key === 'ArrowUp' || event.key === '+') {
      event.preventDefault()
      increment()
    }
  }

  return (
    <div
      className={`${styles.stepper} ${styles[variant]} ${disabled ? styles.disabled : ''}`}
      role="group"
      aria-label={label}
      aria-disabled={disabled || undefined}
      tabIndex={disabled ? -1 : 0}
      onKeyDown={handleKeyDown}
    >
      <button
        type="button"
        className={styles.button}
        aria-label="Decrease quantity"
        disabled={decrementDisabled}
        onClick={decrement}
      >
        <span className={styles.icon}>
          <StepperMinusIcon />
        </span>
      </button>
      <span className={styles.value} aria-live="polite" aria-atomic="true">
        {value}
      </span>
      <button
        type="button"
        className={styles.button}
        aria-label="Increase quantity"
        disabled={incrementDisabled}
        onClick={increment}
      >
        <span className={styles.icon}>
          <StepperPlusIcon />
        </span>
      </button>
    </div>
  )
}

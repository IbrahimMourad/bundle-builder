import type { KeyboardEvent } from 'react'
import styles from './QuantityStepper.module.css'

interface QuantityStepperProps {
  value: number
  onChange: (value: number) => void
  min?: number
  label?: string
}

export function QuantityStepper({
  value,
  onChange,
  min = 0,
  label = 'Quantity',
}: QuantityStepperProps) {
  const decrementDisabled = value <= min

  function decrement() {
    if (!decrementDisabled) onChange(value - 1)
  }

  function increment() {
    onChange(value + 1)
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
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
      className={styles.stepper}
      role="group"
      aria-label={label}
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <button
        type="button"
        className={styles.button}
        aria-label="Decrease quantity"
        disabled={decrementDisabled}
        onClick={decrement}
      >
        −
      </button>
      <span className={styles.value} aria-live="polite" aria-atomic="true">
        {value}
      </span>
      <button
        type="button"
        className={styles.button}
        aria-label="Increase quantity"
        onClick={increment}
      >
        +
      </button>
    </div>
  )
}

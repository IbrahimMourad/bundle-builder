import { useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button/Button'
import { useBundleStore } from '@/stores/useBundleStore'
import styles from './CheckoutModal.module.css'

export function CheckoutModal() {
  const isOpen = useBundleStore((state) => state.isCheckoutOpen)
  const closeCheckout = useBundleStore((state) => state.closeCheckout)
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') closeCheckout()
    }

    document.addEventListener('keydown', handleKeyDown)
    dialogRef.current?.focus()

    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [closeCheckout, isOpen])

  if (!isOpen) return null

  return (
    <div className={styles.backdrop} onClick={closeCheckout}>
      <div
        ref={dialogRef}
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="checkout-modal-title"
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="checkout-modal-title" className={styles.title}>
          Ready to checkout?
        </h2>
        <p className={styles.body}>
          This is a prototype — there is no payment flow. Your bundle configuration is saved
          in this session.
        </p>
        <Button variant="primary" fullWidth onClick={closeCheckout}>
          Got it
        </Button>
      </div>
    </div>
  )
}

import { useEffect } from 'react'
import { useBundleStore } from '@/stores/useBundleStore'
import styles from './SaveToast.module.css'

const AUTO_DISMISS_MS = 3000

export function SaveToast() {
  const visible = useBundleStore((state) => state.saveToastVisible)
  const dismissSaveToast = useBundleStore((state) => state.dismissSaveToast)

  useEffect(() => {
    if (!visible) return

    const timeoutId = window.setTimeout(dismissSaveToast, AUTO_DISMISS_MS)
    return () => window.clearTimeout(timeoutId)
  }, [visible, dismissSaveToast])

  if (!visible) return null

  return (
    <div className={styles.toast} role="status" aria-live="polite">
      System saved
    </div>
  )
}

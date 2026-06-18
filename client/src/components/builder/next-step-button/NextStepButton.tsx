import { Button } from '@/components/ui/button/Button'
import styles from './NextStepButton.module.css'

interface NextStepButtonProps {
  label: string
  onClick: () => void
  hideOnDesktop?: boolean
}

export function NextStepButton({ label, onClick, hideOnDesktop = false }: NextStepButtonProps) {
  return (
    <Button
      variant="outline"
      className={`${styles.button}${hideOnDesktop ? ` ${styles.hideOnDesktop}` : ''}`}
      onClick={onClick}
    >
      {label}
    </Button>
  )
}

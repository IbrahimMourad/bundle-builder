import { Button } from '@/components/ui/Button'
import styles from './NextStepButton.module.css'

interface NextStepButtonProps {
  label: string
  onClick: () => void
}

export function NextStepButton({ label, onClick }: NextStepButtonProps) {
  return (
    <Button variant="outline" className={styles.button} onClick={onClick}>
      {label}
    </Button>
  )
}

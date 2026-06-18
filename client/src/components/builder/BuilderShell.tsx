import { Accordion } from './Accordion'
import styles from './BuilderShell.module.css'

export function BuilderShell() {
  return (
    <div className={styles.shell}>
      <Accordion />
    </div>
  )
}

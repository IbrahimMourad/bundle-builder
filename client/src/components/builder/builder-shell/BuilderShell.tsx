import { Accordion } from '../accordion/Accordion'
import styles from './BuilderShell.module.css'

export function BuilderShell() {
  return (
    <div className={styles.shell}>
      <h1 className={styles.title}>Let&apos;s get started!</h1>
      <Accordion />
    </div>
  )
}

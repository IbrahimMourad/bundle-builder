import type { ReactNode } from 'react'
import styles from './PageLayout.module.css'

interface PageLayoutProps {
  builder: ReactNode
  review: ReactNode
}

export function PageLayout({ builder, review }: PageLayoutProps) {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <section className={styles.builder} aria-label="Bundle builder">
          {builder}
        </section>
        <aside className={styles.review} aria-label="Review panel">
          {review}
        </aside>
      </div>
    </div>
  )
}

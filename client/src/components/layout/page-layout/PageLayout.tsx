import type { ReactNode } from 'react'
import { REVIEW_PANEL_ID } from '@/lib/layout'
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
        <aside id={REVIEW_PANEL_ID} className={styles.review} aria-label="Review panel">
          {review}
        </aside>
      </div>
    </div>
  )
}

import { useBundleStore } from '@/stores/useBundleStore'
import styles from './App.module.css'

function App() {
  const activeStep = useBundleStore((state) => state.activeStep)

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Bundle Builder</h1>
      <p className={styles.subtitle}>
        Monorepo scaffold ready — step {activeStep} of 4
      </p>
    </main>
  )
}

export default App

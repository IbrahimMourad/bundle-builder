import { lazy, Suspense } from 'react'
import { CatalogHydrator } from '@/components/CatalogHydrator'
import { BuilderShell } from '@/components/builder/BuilderShell'
import { PageLayout } from '@/components/layout/PageLayout'
import { ReviewPanel } from '@/components/review/ReviewPanel'
import { SaveToast } from '@/components/ui/SaveToast'

const CheckoutModal = lazy(() =>
  import('@/components/review/CheckoutModal').then((module) => ({
    default: module.CheckoutModal,
  })),
)

function App() {
  return (
    <>
      <CatalogHydrator />
      <PageLayout builder={<BuilderShell />} review={<ReviewPanel />} />
      <Suspense fallback={null}>
        <CheckoutModal />
      </Suspense>
      <SaveToast />
    </>
  )
}

export default App

import { lazy, Suspense } from 'react'
import { CatalogHydrator } from '@/components/catalog-hydrator/CatalogHydrator'
import { BuilderShell } from '@/components/builder/builder-shell/BuilderShell'
import { PageLayout } from '@/components/layout/page-layout/PageLayout'
import { ReviewPanel } from '@/components/review/review-panel/ReviewPanel'
import { SaveToast } from '@/components/ui/save-toast/SaveToast'

const CheckoutModal = lazy(() =>
  import('@/components/review/checkout-modal/CheckoutModal').then((module) => ({
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

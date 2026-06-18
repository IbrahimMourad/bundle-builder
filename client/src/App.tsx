import { BuilderShell } from '@/components/builder/BuilderShell'
import { PageLayout } from '@/components/layout/PageLayout'
import { ReviewShell } from '@/components/review/ReviewShell'

function App() {
  return (
    <PageLayout builder={<BuilderShell />} review={<ReviewShell />} />
  )
}

export default App

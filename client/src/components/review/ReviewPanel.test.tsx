import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useCatalog } from '@/hooks/useCatalog'
import { mockCatalog } from '@/test/fixtures/mockCatalog'
import { useBundleStore } from '@/stores/useBundleStore'
import { CheckoutModal } from './CheckoutModal'
import { ReviewPanel } from './ReviewPanel'

vi.mock('@/hooks/useCatalog')

describe('ReviewPanel', () => {
  const user = userEvent.setup()

  beforeEach(() => {
    useBundleStore.getState().reset()
    useBundleStore.getState().hydrateFromCatalog(mockCatalog)

    vi.mocked(useCatalog).mockReturnValue({
      data: mockCatalog,
      isPending: false,
      isError: false,
    } as ReturnType<typeof useCatalog>)
  })

  it('renders grouped line items from store selections', () => {
    render(<ReviewPanel />)

    expect(screen.getByRole('heading', { name: 'Your security system' })).toBeInTheDocument()
    expect(
      screen.getByText(
        'Review your personalized protection system designed to keep what matters most safe.',
      ),
    ).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Cameras' })).toBeInTheDocument()
    expect(screen.getByText('Wyze Cam v4')).toBeInTheDocument()
    expect(screen.getByText('Wyze Cam Pan v3')).toBeInTheDocument()
  })

  it('updates totals when review stepper changes quantity', async () => {
    render(<ReviewPanel />)

    const steppers = screen.getAllByRole('button', { name: 'Increase quantity' })
    await user.click(steppers[0])

    expect(useBundleStore.getState().quantities['prod-cam-v4:var-white']).toBe(2)
    expect(screen.getByText('$55.96')).toBeInTheDocument()
  })

  it('syncs review stepper changes back to the shared store', async () => {
    render(<ReviewPanel />)

    await user.click(screen.getAllByRole('button', { name: 'Decrease quantity' })[0])
    expect(useBundleStore.getState().quantities['prod-cam-v4:var-white']).toBeUndefined()
  })

  it('opens checkout modal when Checkout is clicked', async () => {
    render(
      <>
        <ReviewPanel />
        <CheckoutModal />
      </>,
    )

    await user.click(screen.getByRole('button', { name: 'Checkout' }))
    expect(useBundleStore.getState().isCheckoutOpen).toBe(true)
    expect(screen.getByRole('dialog', { name: /ready to checkout/i })).toBeInTheDocument()
  })
})

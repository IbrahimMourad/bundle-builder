import { beforeEach, describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SaveToast } from '@/components/ui/save-toast/SaveToast'
import { useBundleStore } from '@/stores/useBundleStore'
import { renderWithProviders } from '@/test/renderWithProviders'
import { CheckoutModal } from '../checkout-modal/CheckoutModal'
import { ReviewPanel } from './ReviewPanel'

describe('ReviewPanel', () => {
  const user = userEvent.setup()

  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('renders grouped line items from store selections', () => {
    renderWithProviders(<ReviewPanel />)

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
    renderWithProviders(<ReviewPanel />)

    const steppers = screen.getAllByRole('button', { name: 'Increase quantity' })
    await user.click(steppers[0])

    expect(useBundleStore.getState().quantities['prod-cam-v4:var-white']).toBe(2)
    expect(screen.getByText('$55.96')).toBeInTheDocument()
  })

  it('syncs review stepper changes back to the shared store', async () => {
    renderWithProviders(<ReviewPanel />)

    await user.click(screen.getAllByRole('button', { name: 'Decrease quantity' })[0])
    expect(useBundleStore.getState().quantities['prod-cam-v4:var-white']).toBeUndefined()
  })

  it('opens checkout modal when Checkout is clicked', async () => {
    renderWithProviders(
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

describe('ReviewPanel save flow', () => {
  const user = userEvent.setup()

  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('shows system saved toast when save link is clicked', async () => {
    renderWithProviders(
      <>
        <ReviewPanel />
        <SaveToast />
      </>,
    )

    await user.click(screen.getByRole('button', { name: 'Save my system for later' }))
    expect(screen.getByRole('status')).toHaveTextContent('System saved')
  })
})

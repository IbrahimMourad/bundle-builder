import { beforeEach, describe, expect, it, vi } from 'vitest'
import { act, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '@/test/renderWithProviders'
import { useBundleStore } from '@/stores/useBundleStore'
import { Accordion } from './Accordion'

describe('Accordion', () => {
  const user = userEvent.setup()

  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('renders only the active step panel', () => {
    renderWithProviders(<Accordion />)

    expect(screen.getByRole('heading', { name: 'Wyze Cam v4' })).toBeInTheDocument()
    expect(screen.queryByText('Removed product')).not.toBeInTheDocument()
  })

  it('shows selected count on the expanded step header', () => {
    renderWithProviders(<Accordion />)

    expect(screen.getByText('2 selected')).toBeInTheDocument()
  })

  it('advances to the next step when Next is clicked', async () => {
    renderWithProviders(<Accordion />)

    await user.click(screen.getByRole('button', { name: 'Next: Choose your plan' }))
    expect(useBundleStore.getState().activeStep).toBe(2)
    expect(screen.getByText('Removed product')).toBeInTheDocument()
  })

  it('expands a collapsed step when its header is clicked', async () => {
    renderWithProviders(<Accordion />)

    act(() => {
      useBundleStore.getState().setActiveStep(2)
    })

    await user.click(screen.getByRole('button', { name: /Choose your cameras/i }))
    expect(useBundleStore.getState().activeStep).toBe(1)
    expect(screen.getByRole('heading', { name: 'Wyze Cam v4' })).toBeInTheDocument()
  })
})

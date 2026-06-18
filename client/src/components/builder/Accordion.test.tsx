import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useCatalog } from '@/hooks/useCatalog'
import { mockCatalog } from '@/test/fixtures/mockCatalog'
import { useBundleStore } from '@/stores/useBundleStore'
import { Accordion } from './Accordion'

vi.mock('@/hooks/useCatalog')

describe('Accordion', () => {
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

  it('renders only the active step panel', () => {
    render(<Accordion />)

    expect(screen.getByRole('heading', { name: 'Wyze Cam v4' })).toBeInTheDocument()
    expect(screen.queryByText('Removed product')).not.toBeInTheDocument()
  })

  it('shows selected count on the expanded step header', () => {
    render(<Accordion />)

    expect(screen.getByText('2 selected')).toBeInTheDocument()
  })

  it('advances to the next step when Next is clicked', async () => {
    render(<Accordion />)

    await user.click(screen.getByRole('button', { name: 'Next: Choose your plan' }))
    expect(useBundleStore.getState().activeStep).toBe(2)
    expect(screen.getByText('Removed product')).toBeInTheDocument()
  })

  it('expands a collapsed step when its header is clicked', async () => {
    useBundleStore.getState().setActiveStep(2)
    render(<Accordion />)

    await user.click(screen.getByRole('button', { name: /Choose your cameras/i }))
    expect(useBundleStore.getState().activeStep).toBe(1)
    expect(screen.getByRole('heading', { name: 'Wyze Cam v4' })).toBeInTheDocument()
  })
})

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, render, screen } from '@testing-library/react'
import { useBundleStore } from '@/stores/useBundleStore'
import { SaveToast } from './SaveToast'

describe('SaveToast', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    useBundleStore.getState().reset()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders when save toast is visible', () => {
    useBundleStore.setState({ saveToastVisible: true })
    render(<SaveToast />)

    expect(screen.getByRole('status')).toHaveTextContent('System saved')
  })

  it('auto-dismisses after three seconds', () => {
    useBundleStore.setState({ saveToastVisible: true })
    render(<SaveToast />)

    act(() => {
      vi.advanceTimersByTime(3000)
    })

    expect(useBundleStore.getState().saveToastVisible).toBe(false)
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })
})

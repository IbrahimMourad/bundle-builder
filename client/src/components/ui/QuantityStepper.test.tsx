import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QuantityStepper } from './QuantityStepper'

describe('QuantityStepper', () => {
  const user = userEvent.setup()

  it('renders the current value', () => {
    render(<QuantityStepper value={2} onChange={vi.fn()} />)
    expect(screen.getByText('2')).toBeInTheDocument()
  })

  it('calls onChange when increment is clicked', async () => {
    const onChange = vi.fn()
    render(<QuantityStepper value={1} onChange={onChange} />)

    await user.click(screen.getByRole('button', { name: 'Increase quantity' }))
    expect(onChange).toHaveBeenCalledWith(2)
  })

  it('calls onChange when decrement is clicked', async () => {
    const onChange = vi.fn()
    render(<QuantityStepper value={2} onChange={onChange} />)

    await user.click(screen.getByRole('button', { name: 'Decrease quantity' }))
    expect(onChange).toHaveBeenCalledWith(1)
  })

  it('disables minus at minimum quantity', () => {
    render(<QuantityStepper value={0} onChange={vi.fn()} />)
    expect(screen.getByRole('button', { name: 'Decrease quantity' })).toBeDisabled()
  })

  it('does not decrement below min', async () => {
    const onChange = vi.fn()
    render(<QuantityStepper value={0} onChange={onChange} min={0} />)

    await user.click(screen.getByRole('button', { name: 'Decrease quantity' }))
    expect(onChange).not.toHaveBeenCalled()
  })

  it('supports keyboard increment and decrement', async () => {
    const onChange = vi.fn()
    render(<QuantityStepper value={1} onChange={onChange} label="Cam quantity" />)

    const group = screen.getByRole('group', { name: 'Cam quantity' })
    group.focus()
    await user.keyboard('{ArrowUp}')
    expect(onChange).toHaveBeenCalledWith(2)

    await user.keyboard('{ArrowDown}')
    expect(onChange).toHaveBeenCalledWith(0)
  })

  it('exposes accessible labels', () => {
    render(<QuantityStepper value={1} onChange={vi.fn()} label="Pan quantity" />)

    expect(screen.getByRole('group', { name: 'Pan quantity' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Decrease quantity' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Increase quantity' })).toBeInTheDocument()
  })
})

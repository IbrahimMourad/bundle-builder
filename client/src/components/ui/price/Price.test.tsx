import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Price } from './Price'

describe('Price', () => {
  it('formats the active price with Intl.NumberFormat', () => {
    render(<Price price={27.98} />)
    expect(screen.getByText('$27.98')).toBeInTheDocument()
  })

  it('shows struck-through compare-at when higher than price', () => {
    render(<Price price={27.98} compareAt={35.98} />)
    expect(screen.getByText('$35.98')).toHaveClass(/compareAt/)
    expect(screen.getByText('$27.98')).toBeInTheDocument()
  })

  it('hides compare-at when not greater than price', () => {
    render(<Price price={27.98} compareAt={27.98} />)
    expect(screen.getAllByText('$27.98')).toHaveLength(1)
  })

  it('renders FREE label when free', () => {
    render(<Price price={0} free />)
    expect(screen.getByText('FREE')).toBeInTheDocument()
  })

  it('appends suffix for recurring prices', () => {
    render(<Price price={9.99} suffix="/mo" />)
    expect(screen.getByText('$9.99/mo')).toBeInTheDocument()
  })
})

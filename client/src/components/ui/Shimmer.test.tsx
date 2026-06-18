import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import { Shimmer } from './Shimmer'

describe('Shimmer', () => {
  it('renders a hidden decorative placeholder', () => {
    const { container } = render(<Shimmer className="custom" />)

    const shimmer = container.querySelector('span')
    expect(shimmer).toHaveAttribute('aria-hidden', 'true')
    expect(shimmer).toHaveClass('custom')
  })
})
